import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  createDicebearAvatarUrl,
  DEFAULT_AVATAR_THEME,
  getInitials,
  findThemeByUrl,
} from "../utils/avatarThemes";

const Avatar = ({ src, name, bgClass, size = 36, className = "" }) => {
  const initials = useMemo(() => getInitials(name), [name]);
  const [hasError, setHasError] = useState(false);

  const themeFromSrc = useMemo(() => findThemeByUrl(src), [src]);

  const fallbackUrl = useMemo(() => {
    const theme = themeFromSrc || DEFAULT_AVATAR_THEME;
    return createDicebearAvatarUrl(theme, initials);
  }, [initials, themeFromSrc]);

  const resolvedSrc = !hasError && (src || fallbackUrl);

  if (resolvedSrc) {
    return (
      <img
        src={resolvedSrc}
        alt={name || "User avatar"}
        className={`rounded-circle object-fit-cover border border-light shadow-sm ${className}`.trim()}
        style={{ width: size, height: size }}
        onError={() => setHasError(true)}
        loading="lazy"
      />
    );
  }

  const isLightBg =
    bgClass?.includes("warning") ||
    bgClass?.includes("light") ||
    bgClass?.includes("info") ||
    bgClass?.includes("secondary");

  const textColor = isLightBg ? "text-dark" : "text-white";

  const fallbackInitials = initials || "SB";

  return (
    <div
      className={`rounded-circle d-flex align-items-center justify-content-center ${bgClass || "bg-secondary"} ${textColor} ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {fallbackInitials}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  bgClass: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
};

export default Avatar;
