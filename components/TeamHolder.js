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

import styles from "../styles/TeamHolder.module.css";
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function TeamHolder(props) {

  const renderButton = () => {
    if(props.userId === props.teamData.owner){
      return (
      <DropdownButton size="sm" id="manageTeam" title="Manage Team">
        <Dropdown.Item as="button" onClick={props.toggleAddEventModal}>Schedule Event</Dropdown.Item>
        <Dropdown.Item as="button">Edit Roster</Dropdown.Item>
        <Dropdown.Item as="button" onClick={props.toggleAvatarModal}>Edit Team Image</Dropdown.Item>
      </DropdownButton>);
    }
    else{
      if(!props.watchList.includes(props.teamData._id))
      {
        return <Button onClick={() => props.watchTeamAndFetchUser()} className={styles["watch-button"]}>Watch</Button>
      }
      else
      {
        return (
          <div style={{display:"flex"}}>
            <Button onClick={() => props.unwatchTeamAndFetchUser()} className={styles["watch-button"]}>Unwatch</Button>

            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle className={`${styles["watch-button"]} ${styles["twit-drop-button"]}`} id="dropdown-custom-1"></Dropdown.Toggle>
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
    if(props.teamData.watchers){
      return (
        <div className={styles["watchers-div"]}>
          <span>{props.teamData.watchers.length}</span>
          <i className={styles["twit-icon"] + " fas fa-users"}></i>
        </div>
      );
    }
    else{
      return (
        <div className="watchers-div">
          <span>0</span>
          <i className={styles["twit-icon"] + " fas fa-users"}></i>
        </div>
      );
    }
  }

  return (
    <React.Fragment>
      <div className="twit-flex-column" style={{flexDirection:"row" , justifyContent:"space-between"}}>
        <div className="twit-flex-column">
          <h3>{props.teamData.league}</h3>
          <div className={styles["teamname"]}>
            <Avatar onClick={props.toggleAvatarModal} rounded className={styles["team-image"]} src={props.teamData.image?props.teamData.image:""} alt="team profile image"/>
            <h1 className={styles["teamname-title"]}>{props.teamData.teamName}</h1>
          </div>
          <h1>4-1</h1>
          <h3>Head Coach: {`@${props.teamData.headCoach}`}</h3>
          <div className={styles["team-attributes"]}>
            <div className="team-attribute">
            <i className={"fas fa-map-marker-alt " + styles["twit-icon"]}></i>
            <span>Baton Rouge, LA</span>
            </div>
            <div className={styles["team-attributes"]}>
            <i className={"fas fa-calendar-alt twit-icon " + styles["twit-icon"]}></i>
            <span>Joined Oct 2020</span>
            </div>
          </div>
          <div className={styles["view-buttons"]}>
          <Button onClick={props.toggleScheduleModal} variant="outline-secondary" size="sm" className="twit-button">View Schedule</Button>
          <Button onClick={props.toggleRosterModal} variant="outline-secondary" size="sm" className="twit-button"> View Roster</Button>
          </div>
          
        </div>
        <div className={styles["watch-div"]}>
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
