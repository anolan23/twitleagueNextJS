import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/css/all.css";
import '../styles/globals.css'
import "../sass/_main.scss";
import { Provider } from 'react-redux'

import { useStore } from '../redux/store'
import AddEventModal from "../components/modals/AddEventModal";
import GifModal from "../components/modals/GifModal";
import EditProfilePopup from "../components/modals/EditProfilePopup";
import RosterModal from '../components/modals/RosterModal';
import AuthBanner from '../components/AuthBanner';
import PopupCompose from '../components/modals/PopupCompose';
import PopupReply from '../components/modals/PopupReply';
import Login from "../components/modals/Login";
import SignUp from "../components/modals/SignUp";

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)
  return (
    <Provider store={store}>
      <Login/>
      <SignUp/>
      <AuthBanner/>
      <GifModal/>
      <AddEventModal/>
      <EditProfilePopup/>
      <RosterModal/>
      <PopupCompose/>
      <PopupReply/>
      <Component {...pageProps}/>
    </Provider>
  );
}

export default MyApp
