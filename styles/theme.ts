const theme = {
  colors: {
    black: '#303030',
    white: '#fff',
    warning: '#F03434',
    grayLight: '#f0efeb',

    // TODO: Find a better color.
    success: 'green',

    primary: {
      base: '#3C6F72',
      light: '#638b8e',
      dark: '#2a4d4f',
    },

    secondary: {
      base: '#21333B',
      light: '',
      dark: '',
    },

    highlight: '#FBE35B'
  },

  fonts: {
    // TODO: We need to add some fallback fonts.
    fontFamilyPrimary: 'Roboto',
  },
}

export type ThemeType = typeof theme
export { theme }
