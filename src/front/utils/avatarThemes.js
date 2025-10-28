export const SPORT_AVATAR_THEMES = [
  {
    id: "soccer",
    label: "Soccer Night",
    seed: "Soccer",
    backgroundColors: ["0b3954", "087e8b"],
    fontColor: "f4d35e",
  },
  {
    id: "basketball",
    label: "Basketball Court",
    seed: "Basketball",
    backgroundColors: ["f77f00", "d62828"],
    fontColor: "ffffff",
  },
  {
    id: "tennis",
    label: "Tennis Court",
    seed: "Tennis",
    backgroundColors: ["2a9134", "9fd356"],
    fontColor: "ffffff",
  },
  {
    id: "baseball",
    label: "Baseball Classic",
    seed: "Baseball",
    backgroundColors: ["14213d", "fca311"],
    fontColor: "ffffff",
  },
  {
    id: "swimming",
    label: "Swimming Pool",
    seed: "Swimming",
    backgroundColors: ["219ebc", "023047"],
    fontColor: "fefae0",
  },
  {
    id: "cycling",
    label: "Cycling Sprint",
    seed: "Cycling",
    backgroundColors: ["ffbe0b", "fb5607"],
    fontColor: "1b1b1e",
  },
  {
    id: "volleyball",
    label: "Beach Volleyball",
    seed: "Volleyball",
    backgroundColors: ["ff9f1c", "2ec4b6"],
    fontColor: "011627",
  },
  {
    id: "running",
    label: "Running Track",
    seed: "Running",
    backgroundColors: ["ef233c", "d90429"],
    fontColor: "edf2f4",
  },
];

export const DEFAULT_AVATAR_THEME = SPORT_AVATAR_THEMES[0];

export const getInitials = (name = "") => {
  if (!name || typeof name !== "string") return "SB";
  const trimmed = name.trim();
  if (!trimmed) return "SB";
  const parts = trimmed.split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || "";
  return `${first}${last || ""}`.toUpperCase();
};

export const createDicebearAvatarUrl = (theme, initials) => {
  const selectedTheme = theme || DEFAULT_AVATAR_THEME;
  const chars = (initials || "SB").slice(0, 2).toUpperCase();
  const params = new URLSearchParams({
    seed: selectedTheme.seed,
    chars,
    fontSize: "48",
    fontWeight: "700",
    radius: "50",
    size: "256",
  });

  const colors = selectedTheme.backgroundColors?.length
    ? selectedTheme.backgroundColors
    : ["b6e3f4"];
  colors.forEach((color) => params.append("backgroundColor", color));

  if (selectedTheme.fontColor) {
    params.set("fontColor", selectedTheme.fontColor);
  }

  params.set("backgroundType", "gradientLinear");
  params.set("backgroundRotation", "130");

  return `https://api.dicebear.com/8.x/initials/svg?${params.toString()}`;
};

export const isDicebearInitialsUrl = (url) =>
  typeof url === "string" && url.includes("api.dicebear.com") && url.includes("/initials/");

export const findThemeByUrl = (url) => {
  if (!isDicebearInitialsUrl(url)) return null;
  return (
    SPORT_AVATAR_THEMES.find((theme) =>
      url.includes(`seed=${encodeURIComponent(theme.seed)}`)
    ) || null
  );
};
