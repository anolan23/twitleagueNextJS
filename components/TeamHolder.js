import React from 'react';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Avatar from './Avatar';
import {connect} from "react-redux";

import {
  watchTeamAndFetchUser, 
  unwatchTeamAndFetchUser, 
  toggleAddEventModal, 
  toggleAvatarModal,
  toggleScheduleModal,
  toggleRosterModal,
  sendJoinTeamRequest
} from "../actions";

import "../styles/TeamHolder.css";
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function TeamHolder(props) {

  const renderButton = () => {
    if(props.userId === props.team.owner){
      return (
      <DropdownButton size="sm" id="manageTeam" title="Manage Team">
        <Dropdown.Item as="button" onClick={props.toggleAddEventModal}>Schedule Event</Dropdown.Item>
        <Dropdown.Item as="button">Edit Roster</Dropdown.Item>
        <Dropdown.Item as="button" onClick={props.toggleAvatarModal}>Edit Team Image</Dropdown.Item>
      </DropdownButton>);
    }
    else{
      if(!props.watchList.includes(props.team._id))
      {
        return <Button onClick={() => props.watchTeamAndFetchUser()} className="watch-button">Watch</Button>
      }
      else
      {
        return (
          <div style={{display:"flex"}}>
            <Button onClick={() => props.unwatchTeamAndFetchUser()} className="watch-button">Unwatch</Button>

            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle className="watch-button twit-drop-button" id="dropdown-custom-1"></Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={props.sendJoinTeamRequest} eventKey="1">Join team</Dropdown.Item>
                <Dropdown.Item eventKey="2">Direct Message</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          
        );
      }
    }
    
  }

  const renderWatchers = () => {
    if(props.team.watchers){
      return (
        <div className="watchers-div">
          <span>{props.team.watchers.length}</span>
          <i className="twit-icon fas fa-users"></i>
        </div>
      );
    }
    else{
      return (
        <div className="watchers-div">
          <span>0</span>
          <i className="twit-icon fas fa-users"></i>
        </div>
      );
    }
  }

  return (
    <React.Fragment>
      <div className="twit-flex-column" style={{flexDirection:"row" , justifyContent:"space-between"}}>
        <div className="twit-flex-column">
          <h3>{props.team.league}</h3>
          <div className="teamname">
            <Avatar onClick={props.toggleAvatarModal} rounded className="team-image" src={props.team.image?props.team.image:""} alt="team profile image"/>
            <h1 className="teamname-title">{props.team.teamName}</h1>
          </div>
          <h1>4-1</h1>
          <h3>Head Coach: {`@${props.team.headCoach}`}</h3>
          <div className="team-attributes">
            <div className="team-attribute">
            <i className="fas fa-map-marker-alt twit-icon"></i>
            <span>Baton Rouge, LA</span>
            </div>
            <div className="team-attribute">
            <i className="fas fa-calendar-alt twit-icon"></i>
            <span>Joined Oct 2020</span>
            </div>
          </div>
          <div className="view-buttons">
          <Button onClick={props.toggleScheduleModal} variant="outline-secondary" size="sm" className="twit-button">View Schedule</Button>
          <Button onClick={props.toggleRosterModal} variant="outline-secondary" size="sm" className="twit-button"> View Roster</Button>
          </div>
          
        </div>
        <div className="watch-div">
          {renderWatchers()}
          {renderButton()}
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    team: state.team,
    watchList: state.user.watchList ? state.user.watchList : [],
    userId: state.user._id
  }
}

export default connect(mapStateToProps,{
  watchTeamAndFetchUser, 
  unwatchTeamAndFetchUser, 
  toggleAddEventModal, 
  toggleAvatarModal,
  toggleScheduleModal,
  toggleRosterModal,
  sendJoinTeamRequest
})(TeamHolder);
