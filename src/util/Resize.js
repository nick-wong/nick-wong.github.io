export const getZoom = (width, height, min = 0) => {
  // Fit to screen
  return Math.max(
    min,
    Math.min(window.innerWidth / width, window.innerHeight / height)
  );
};

export const FontSizes = {
  SMALL: 0,
  MEDIUM: 1,
  LARGE: 2,
};

export const getFontSize = (fontSize) => {
  if (window.innerWidth < 768) {
    if (fontSize === FontSizes.SMALL) {
      return "16px";
    } else if (fontSize === FontSizes.MEDIUM) {
      return "24px";
    } else {
      return "32px";
    }
  } else {
    if (fontSize === FontSizes.SMALL) {
      return "24px";
    } else if (fontSize === FontSizes.MEDIUM) {
      return "36px";
    } else {
      return "48px";
    }
  }
};
