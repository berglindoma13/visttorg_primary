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
import ReactGA from 'react-ga';
import CookieConsent from "react-cookie-consent";

import TagManager from 'react-gtm-module'
 
const tagManagerArgs = {
    gtmId: 'GT-KVHJ6D8'
}


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
          <CookieConsent
            location="bottom"
            buttonText="Samþykkja"
            cookieName="generalwebsitecookie"
            style={{ background: "#ABC5A1", fontFamily: "GT" }}
            buttonStyle={{ backgroundColor: "#A399FA" , color: "#fff", fontSize: "13px", fontFamily: "GT" }}
            expires={150}
          >
            Þessi vefsíða notar kökur til að bæta upplifunina.{" "}
            {/* <span style={{ fontSize: "10px" }}>This bit of text is smaller :O</span> */}
          </CookieConsent>
        </Provider>
    </ThemeProvider>
  )
}

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    ReactGA.initialize('G-R7PM04TMX6');
    ReactGA.pageview(window.location.pathname + window.location.search);

    TagManager.initialize(tagManagerArgs)
  }, [])

  return (
    <Component {...pageProps} />
  );
};

export default Wrapper
