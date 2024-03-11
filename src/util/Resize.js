export const getZoom = (width, height, min = 0) => {
  // Fit to screen
  return Math.max(
    min,
    Math.min(window.innerWidth / width, window.innerHeight / height)
  );
};

export const FontSizes = {
  XSMALL: 0,
  XSMALLTOSMALL: 1,
  SMALL: 2,
  MEDIUM: 3,
  LARGE: 4,
};

export const getFontSize = (fontSize) => {
  if (window.innerWidth < 480 || window.innerHeight < 480) {
    if (fontSize === FontSizes.XSMALL || fontSize === FontSizes.XSMALLTOSMALL) {
      return "12px";
    } else if (fontSize === FontSizes.SMALL) {
      return "16px";
    } else if (fontSize === FontSizes.MEDIUM) {
      return "24px";
    } else {
      return "24px";
    }
  }
  if (window.innerWidth < 768 || window.innerHeight < 640) {
    if (fontSize === FontSizes.XSMALL) {
      return "16px";
    } else if (
      fontSize === FontSizes.SMALL ||
      fontSize === FontSizes.XSMALLTOSMALL
    ) {
      return "18px";
    } else if (fontSize === FontSizes.MEDIUM) {
      return "28px";
    } else {
      return "32px";
    }
  } else {
    if (fontSize === FontSizes.XSMALL) {
      return "18px";
    } else if (
      fontSize === FontSizes.SMALL ||
      fontSize === FontSizes.XSMALLTOSMALL
    ) {
      return "24px";
    } else if (fontSize === FontSizes.MEDIUM) {
      return "36px";
    } else {
      return "48px";
    }
  }
};

export const getWidthOffset = (width = 100) => {
  return window.innerWidth / width;
};
