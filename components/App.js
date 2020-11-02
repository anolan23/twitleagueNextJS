import React from 'react';
import {connect} from "react-redux";
import {BrowserRouter} from "react-router-dom";

import {fetchUser, fetchLeague} from "../actions"
import Heading from "./Heading";
import MainBody from "./MainBody";
import SignUp from "./modals/SignUp";
import Login from "./modals/Login";
import CreateTeamModal from "./modals/CreateTeamModal";
import CreateLeagueModal from "./modals/CreateLeagueModal";
import TwitPostModal from "./modals/TwitPostModal";
import AddEventModal from "./modals/AddEventModal";
import GifModal from "./modals/GifModal";
import AvatarModal from "./modals/AvatarModal";
import ScheduleModal from "./modals/ScheduleModal";
import RosterModal from './modals/RosterModal';


class App extends React.Component {

  componentDidMount(){
    this.props.fetchUser();

  }

render(){
  return (
    <BrowserRouter>
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
      <Heading showSignUp={this.handleShowSignUp} showLogin={this.handleShowLogin}/>
      <MainBody/>
    </BrowserRouter>
  );
}

}

export default connect(null,{fetchUser, fetchLeague})(App);
