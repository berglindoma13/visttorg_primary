import 'styled-components'

import { ThemeType } from './src/styles/theme' // Import type from above file

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends ThemeType {}
}