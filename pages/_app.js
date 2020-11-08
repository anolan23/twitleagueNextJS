import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/css/all.css";
import { Provider } from 'react-redux'
import Figure from "react-bootstrap/Figure"

import { useStore } from '../redux/store'
import Heading from "../components/Heading"
import SignUp from "../components/modals/SignUp";
import Login from "../components/modals/Login";
import CreateTeamModal from "../components/modals/CreateTeamModal";
import CreateLeagueModal from "../components/modals/CreateLeagueModal";
import TwitPostModal from "../components/modals/TwitPostModal";
import AddEventModal from "../components/modals/AddEventModal";
import GifModal from "../components/modals/GifModal";
import AvatarModal from "../components/modals/AvatarModal";
import ScheduleModal from "../components/modals/ScheduleModal";
import RosterModal from '../components/modals/RosterModal';

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)
  return (
    <Provider store={store}>
      <Heading/>
      <SignUp/>
      <Login/>
      <CreateTeamModal/>
      <CreateLeagueModal/>
      <GifModal/>
      <TwitPostModal/>
      <AddEventModal/>
      <AvatarModal/>
      <ScheduleModal/>
      <RosterModal/>
      <Component {...pageProps}/>
    </Provider>
  );
}

export default MyApp
