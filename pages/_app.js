import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/css/all.css";
import '../styles/globals.css'
import "../sass/_main.scss";
import { Provider } from 'react-redux'

import { useStore } from '../redux/store'
import AddEventModal from "../components/modals/AddEventModal";
import GifPopup from "../components/modals/GifPopup";
import EditProfilePopup from "../components/modals/EditProfilePopup";
import PopupCompose from '../components/modals/PopupCompose';
import PopupReply from '../components/modals/PopupReply';
import SignupPopup from '../components/modals/SignupPopup';
import EditTeamPopup from '../components/modals/EditTeamPopup';
import EditRoster from '../components/modals/EditRoster';
import TwitPanel from '../components/TwitPanel';

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)
  return (
    <Provider store={store}>
      <SignupPopup/>
      <GifPopup/>
      <AddEventModal/>
      <EditProfilePopup/>
      <EditRoster/>
      <EditTeamPopup/>
      <PopupCompose/>
      <PopupReply/>
      <TwitPanel/>
      <Component {...pageProps}/>
    </Provider>
  );
}

export default MyApp
