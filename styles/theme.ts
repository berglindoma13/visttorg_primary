const theme = {
  colors: {
    black: '#303030',
    white: '#fff',
    warning: '#F03434',
    grayLight: '#f3f3f3',

    // TODO: Find a better color.
    success: 'green',

    primary: {
      base: '#00c3b3',
      light: '#5FCDE3',
      dark: '#209DB6',
    },

    secondary: {
      base: '#553f23',
      light: '#BB23AD',
      dark: '#510F4B',
    },

    third: {
      base: '#A1CF1F',
      light: '#5FCDE3',
      dark: '#6E8D15',
    },

    fourth: {
      base: '#F38901',
      light: '#FE9E1E',
      dark: '#E18101',
    },

    fifth: {
      base: '#30302F',
      light: '#696967',
      dark: '#171717',
    },
  },

  fonts: {
    // TODO: We need to add some fallback fonts.
    fontFamilyPrimary: 'Roboto',
  },
}

export type ThemeType = typeof theme
export { theme }
