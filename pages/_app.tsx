import { AppProps } from "next/app";
import { GlobalStyle, theme } from '../styles'
import { ThemeProvider } from 'styled-components'
import '../styles/globals.css'

const Wrapper: React.FC<AppProps> = (props) => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <MyApp {...props} />
  </ThemeProvider>
)

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Component {...pageProps} />
  );
};

export default Wrapper
