import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Avatar from "./Avatar";
import {
  SPORT_AVATAR_THEMES,
  createDicebearAvatarUrl,
  getInitials,
  DEFAULT_AVATAR_THEME,
} from "../utils/avatarThemes";

const AvatarModal = ({ show, onClose, onSelect, userName, selectedThemeId }) => {
  const initials = useMemo(() => getInitials(userName), [userName]);

  const options = useMemo(
    () =>
      SPORT_AVATAR_THEMES.map((theme) => ({
        ...theme,
        url: createDicebearAvatarUrl(theme, initials),
      })),
    [initials]
  );

  if (!show) {
    return null;
  }

  const labelledBy = "avatar-modal-title";

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable modal-fullscreen-sm-down" role="document">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-dark text-white">
            <h5 id={labelledBy} className="modal-title">
              Elige tu avatar deportivo
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar" />
          </div>
          <div className="modal-body">
            <p className="text-muted small mb-4">
              Tus iniciales se combinan con fondos inspirados en diferentes deportes gracias a la API de DiceBear.
              Selecciona el que mejor encaje con tu estilo.
            </p>
            <div className="row g-3">
              {options.map((option) => {
                const isActive = selectedThemeId
                  ? selectedThemeId === option.id
                  : DEFAULT_AVATAR_THEME.id === option.id;
                return (
                  <div className="col-6 col-sm-4 col-md-3" key={option.id}>
                    <button
                      type="button"
                      className={`btn w-100 h-100 p-3 border border-2 ${
                        isActive ? "border-primary shadow" : "border-light"
                      }`}
                      onClick={() => onSelect(option)}
                    >
                      <div className="d-flex flex-column align-items-center gap-2">
                        <Avatar src={option.url} name={userName} size={80} />
                        <span className="fw-semibold small text-capitalize">{option.label}</span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="modal-footer flex-wrap gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose} role="presentation" />
    </div>
  );
};

AvatarModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  userName: PropTypes.string,
  selectedThemeId: PropTypes.string,
};

export default AvatarModal;
