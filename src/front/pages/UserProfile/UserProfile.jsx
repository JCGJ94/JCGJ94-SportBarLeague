import React, { useEffect, useMemo, useState } from "react";
import userServices from "../../Services/userServices";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import styles from "./UserProfile.module.css";
import FormGroup from "../../components/Groups/FormGroup";
import Avatar from "../../components/Avatar";
import AvatarModal from "../../components/AvatarModal";
import EventForm from "../../components/EventForm";
import {
  DEFAULT_AVATAR_THEME,
  SPORT_AVATAR_THEMES,
  createDicebearAvatarUrl,
  findThemeByUrl,
  getInitials,
  isDicebearInitialsUrl,
} from "../../utils/avatarThemes";


const Profile = () => {
  const { store, dispatch } = useGlobalReducer();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    user_name: store?.user?.user_name || "",
    email: store?.user?.email || "",
    avatar: store?.user?.avatar || "",
  });
  const [selectedThemeId, setSelectedThemeId] = useState(DEFAULT_AVATAR_THEME.id);
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [tab, setTab] = useState("events");
  const [loading, setLoading] = useState(true);
  const [okMsg, setOkMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);


  useEffect(() => {
    setLoading(true);

    userServices
      .getProfile(token)
      .then((resp) => {
        if (!resp?.success) {
          setErrorMsg("Error loading profile");
          return;
        }

        const { user, groups = [], events = [] } = resp;
        const userName = user?.user_name || "";
        const initials = getInitials(userName);

        let avatarUrl = user?.avatar;
        let theme = findThemeByUrl(avatarUrl) || DEFAULT_AVATAR_THEME;

        if (!isDicebearInitialsUrl(avatarUrl)) {
          avatarUrl = createDicebearAvatarUrl(theme, initials);
        }

        setForm({
          user_name: userName,
          email: user?.email || "",
          avatar: avatarUrl,
        });
        setSelectedThemeId(theme.id);

        setEvents(events);
        setGroups(groups);

        dispatch({ type: "setUserEvents", payload: events });
        dispatch({ type: "setUserGroups", payload: groups });
        dispatch({ type: "auth", payload: { user } });
        localStorage.setItem("user", JSON.stringify(user));
      })
      .catch(() => setErrorMsg("Error loading profile"))
      .finally(() => setLoading(false));
  }, [dispatch, token]);

  const handleSave = () => {
    setOkMsg("");
    setErrorMsg("");

    const payload = {
      user_name: form.user_name,
      avatar: form.avatar,
    };

    userServices
      .updateProfile(payload, token)
      .then((resp) => {
        if (resp.success) {
          const user = resp.data;

          const updatedName = user.user_name || "";
          const initials = getInitials(updatedName);
          const theme = findThemeByUrl(user.avatar) || DEFAULT_AVATAR_THEME;
          const avatarUrl = isDicebearInitialsUrl(user.avatar)
            ? user.avatar
            : createDicebearAvatarUrl(theme, initials);

          setForm({
            user_name: updatedName,
            email: user.email || "",
            avatar: avatarUrl,
          });
          setSelectedThemeId(theme.id);

          dispatch({ type: "auth", payload: { user } });
          localStorage.setItem("user", JSON.stringify(user));

          setOkMsg("Profile updated successfully ✅");
          setTimeout(() => setOkMsg(""), 3000);
        } else {
          setErrorMsg("Error updating profile");
        }
      })
      .catch(() => setErrorMsg("Error updating profile"));
  };

  const selectedTheme = useMemo(
    () =>
      SPORT_AVATAR_THEMES.find((theme) => theme.id === selectedThemeId) ||
      DEFAULT_AVATAR_THEME,
    [selectedThemeId]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "user_name" && isDicebearInitialsUrl(prev.avatar)) {
        updated.avatar = createDicebearAvatarUrl(selectedTheme, getInitials(value));
      }
      return updated;
    });
  };

  const handleAvatarSelect = (theme) => {
    setSelectedThemeId(theme.id);
    setForm((prev) => ({
      ...prev,
      avatar: createDicebearAvatarUrl(theme, getInitials(prev.user_name)),
    }));
    setShowAvatarModal(false);
  };

  const toggleEventForm = () => {
    setShowCreateEvent((prev) => {
      const next = !prev;
      if (next) {
        setShowCreateGroup(false);
      }
      return next;
    });
  };

  const toggleGroupForm = () => {
    setShowCreateGroup((prev) => {
      const next = !prev;
      if (next) {
        setShowCreateEvent(false);
      }
      return next;
    });
  };


  return (
    <>
      <div className={`container ${styles.shell}`}>
        <div className={styles.card}>
          {/* HEADER */}
          <div className="row g-5 align-items-center ">
            <div className="col-12 col-md-4 text-center">
              <div className={styles.avatarWrap}>
                <Avatar
                  src={form.avatar}
                  name={form.user_name}
                  size={180}
                  className={styles.avatar}
                />
              </div>
              <div className="mt-3">
                <span className="form-label fw-bold">Avatar deportivo</span>
                <div className="d-flex flex-column gap-2 align-items-center">
                  <button
                    type="button"
                    className={`btn btn-outline-primary ${styles.avatarBtn}`}
                    onClick={() => setShowAvatarModal(true)}
                  >
                    Elegir avatar
                  </button>
                  {isDicebearInitialsUrl(form.avatar) && (
                    <span className="badge bg-light text-dark fw-semibold">
                      {selectedTheme.label}
                    </span>
                  )}
                  <p className="text-muted small mb-0">
                    Generamos tu imagen con tus iniciales y colores inspirados en deportes.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-8">

              {okMsg && <p className="alert alert-success">{okMsg}</p>}
              {errorMsg && <p className="alert alert-danger">{errorMsg}</p>}

              <div className="d-flex justify-content-between">
                <h2 className={styles.title}>Edit Profile</h2>
                <button className={`btn p-2 mt-2 ${styles.cta}`} onClick={handleSave}>
                  Save Changes
                </button>
              </div>
              <div className="row g-3 mt-1">
                <div className="col-12">
                  <label className="form-label fw-bold">User Name</label>
                  <input
                    type="text"
                    name="user_name"
                    className={`form-control ${styles.input}`}
                    value={form.user_name || store?.user_name}
                    onChange={handleChange}
                    placeholder="user name"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold">Email</label>
                  <input
                    type="email"
                    className={`form-control ${styles.input}`}
                    value={form.email}
                    disabled
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className={`d-flex align-items-center justify-content-center gap-2 mt-3 ${styles.tabs}`}>
                <button
                  className={`${styles.tabBtn} ${tab === "events" ? styles.active : ""}`}
                  onClick={() => setTab("events")}
                >
                  Events
                </button>
                <button
                  className={`${styles.tabBtn} ${tab === "groups" ? styles.active : ""}`}
                  onClick={() => setTab("groups")}
                >
                  Teams
                </button>
              </div>
            </div>
          </div>

          <div className="container mt-4">
            {tab === "events" && (
              <div className={styles.panel}>
                <h6 className="fw-bold mb-2">Your Events</h6>

                {events.length ? (
                  <ul className={styles.list}>
                    {events.map((ev) => (
                      <li key={ev.id} className={styles.item}>
                        <i className="fa-solid fa-calendar-day me-2" />
                        <span className="me-auto">{ev.name}</span>
                        {ev.start_time && (
                          <span className={styles.date}>
                            {new Date(ev.start_time).toLocaleDateString()}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.empty}>No events yet.</p>
                )}
                <div className="text-center my-3">
                  <button
                    className={`btn w-75 ${styles.cta}`}
                    onClick={toggleEventForm}
                  >
                    {showCreateEvent ? "Close Event" : "Create Event"}
                  </button>
                </div>
              </div>
            )}

            {tab === "groups" && (
              <div className={styles.panel}>
                <h6 className="fw-bold mb-2">Your Groups</h6>

                {groups.length ? (
                  <ul className={styles.list}>
                    {groups.map((g, idx) => (
                      <li key={g.id ?? idx} className={styles.item}>
                        <i className="fa-solid fa-users me-2" />
                        <span className="me-auto">{g.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.empty}>No groups yet.</p>
                )}
                <div className="text-center my-3">
                  <button
                    className={`btn w-75  ${styles.cta}`}
                    onClick={toggleGroupForm}
                  >
                    {showCreateGroup ? "Close Form" : "Create Group"}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      <div className="container">
        {showCreateGroup && <FormGroup />}
        {showCreateEvent && <EventForm />}
      </div>

      <AvatarModal
        show={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onSelect={handleAvatarSelect}
        userName={form.user_name}
        selectedThemeId={selectedThemeId}
      />

    </>
  );
};

export default Profile;
