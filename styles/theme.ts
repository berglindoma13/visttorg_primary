const theme = {
  colors: {
    white: '#fff',
    warning: '#F03434',
    grayLight: '#f0efeb',

    // TODO: Find a better color.
    success: 'green',

    //Vistorg colors
    green: '#ABC5A1',
    black: '#000000',
    grey_one: '#FAFAFA',
    grey_two: '#EEEEEE',
    grey_four: '#757575',
    grey_five: '#424242',
    orange: '#F67147',
    purple: '#A399FA',
    beige: '#F6F3EE',
    lightGreen: "#9ed3b0",

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

    tertiary: {
      base: '#21333b'
    },

    highlight: '#FBE35B'
  },

  fonts: {
    // TODO: We need to add some fallback fonts.
    fontFamilyPrimary: 'Space Mono',
    fontFamilySecondary: 'GT',
  },
}

export type ThemeType = typeof theme
export { theme }
