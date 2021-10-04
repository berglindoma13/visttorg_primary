const theme = {
  colors: {
    black: '#303030',
    white: '#fff',
    warning: '#F03434',
    grayLight: '#f3f3f3',

    // TODO: Find a better color.
    success: 'green',

    primary: {
      base: '#3C6F72',
      light: '',
      dark: '',
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
