import { AppProps } from "next/app";
import { GlobalStyle, theme } from '../styles'
import { ThemeProvider } from 'styled-components'
import store from '../app/store'
import { Provider } from 'react-redux'
import '../styles/globals.css'
import { saveState } from "../app/browser-storage";

store.subscribe(() => {
  saveState(store.getState())
})

const Wrapper: React.FC<AppProps> = (props) => {
  return(
    <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Provider store={store}>
          <MyApp {...props} />
        </Provider>
    </ThemeProvider>
  )
}

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Component {...pageProps} />
  );
};

export default Wrapper
