export const numberSize = {
  mobileS: 320,
  mobileM: 375,
  mobileL: 550,
  tablet: 768,
  tabletL: 1024,
  laptop: 1280,
  laptopL: 1440,
  desktop: 2400,
}

export const mediaMin = {
  mobileS: `(min-width: ${numberSize.mobileS + 1}px)`,
  mobileM: `(min-width: ${numberSize.mobileM + 1}px)`,
  mobileL: `(min-width: ${numberSize.mobileL + 1}px)`,
  tablet: `(min-width: ${numberSize.tablet + 1}px)`,
  tabletL: `(min-width: ${numberSize.tabletL + 1}px)`,
  laptop: `(min-width: ${numberSize.laptop + 1}px)`,
  laptopL: `(min-width: ${numberSize.laptopL + 1}px)`,
  desktop: `(min-width: ${numberSize.desktop + 1}px)`,
  desktopL: `(min-width: ${numberSize.desktop + 1}px)`,
}
export const mediaMax = {
  mobileS: `(max-width: ${numberSize.mobileS}px)`,
  mobileM: `(max-width: ${numberSize.mobileM}px)`,
  mobileL: `(max-width: ${numberSize.mobileL}px)`,
  tablet: `(max-width: ${numberSize.tablet}px)`,
  tabletL: `(max-width: ${numberSize.tabletL}px)`,
  laptop: `(max-width: ${numberSize.laptop}px)`,
  laptopL: `(max-width: ${numberSize.laptopL}px)`,
  desktop: `(max-width: ${numberSize.desktop}px)`,
  desktopL: `(max-width: ${numberSize.desktop}px)`,
}