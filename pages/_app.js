import "@fortawesome/fontawesome-free/css/all.css";
import '../styles/globals.css'
import "../sass/_main.scss";
import { Provider } from 'react-redux'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as gtag from "../lib/gtag";

import { useStore } from '../redux/store'
import GifPopup from "../components/modals/GifPopup";
import EditProfilePopup from "../components/modals/EditProfilePopup";
import PopupCompose from '../components/modals/PopupCompose';
import PopupReply from '../components/modals/PopupReply';
import SignupPopup from '../components/modals/SignupPopup';
import EditTeamPopup from '../components/modals/EditTeamPopup';
import EditRoster from '../components/modals/EditRoster';
import EditEventsPopup from "../components/modals/EditEventsPopup";
import TwitPanel from '../components/TwitPanel';

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events]);

  return (
    <Provider store={store}>
      <SignupPopup/>
      <GifPopup/>
      <EditProfilePopup/>
      <EditRoster/>
      <EditEventsPopup/>
      <EditTeamPopup/>
      <PopupCompose/>
      <PopupReply/>
      <TwitPanel/>
      <Component {...pageProps}/>
    </Provider>
  );
}

export default MyApp

