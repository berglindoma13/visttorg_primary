import { AppProps } from "next/app";
import { GlobalStyle, theme } from '../styles'
import { ThemeProvider } from 'styled-components'
import store from '../app/store'
import { Provider } from 'react-redux'
import '../styles/globals.css'
import { saveState } from "../app/browser-storage";
import { useEffect } from "react";
import { Router } from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress

store.subscribe(() => {
  saveState(store.getState())
})

const Wrapper: React.FC<AppProps> = (props) => {
  useEffect(() => {
    const handlePageChangeStart = () => { 
      
      NProgress.start()
    }
    const handlePageChangeDone = () => { 
      NProgress.done()
    }

    //Binding events. 
    Router.events.on('routeChangeStart', handlePageChangeStart)
    Router.events.on('routeChangeComplete', handlePageChangeDone)
    Router.events.on('routeChangeError', handlePageChangeDone)

    return () => {
      Router.events.off('routeChangeStart', handlePageChangeStart)
      Router.events.off('routeChangeComplete', handlePageChangeDone)
      Router.events.off('routeChangeError', handlePageChangeDone)
    }
  }, [])
  
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
