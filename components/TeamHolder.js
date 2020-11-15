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
                <Dropdown.Item onClick={props.toggleScheduleModal} eventKey="2">View Schedule</Dropdown.Item>
                <Dropdown.Item onClick={props.toggleRosterModal} eventKey="3">View Roster</Dropdown.Item>
                <Dropdown.Item eventKey="4">Direct Message</Dropdown.Item>
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
        <div className={styles["watchers-div"]}>
          <span>{props.team.watchers.length}</span>
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
      <div className={styles.banner}><img className={styles["banner-image"]} src={props.team.banner? props.team.banner : null}></img></div>
      <div style={{display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap:"wrap"}}>
        <div className="team-image">
          <Avatar roundedCircle onClick={props.toggleAvatarModal} rounded className={styles["team-image"]} src={props.team.image?props.team.image:""} alt="team profile image"/>
        </div>
        {renderButton()}
      </div>
      <div className="twit-flex-column" style={{flexDirection:"row" , justifyContent:"space-between"}}>
        <div className="twit-flex-column">
          <div className={styles["teamname"]}>
            <h1 className={styles["teamname-title"]}>{props.team.teamName}</h1>
            {props.team.verifiedTeam ? <i style={{color: "var(--BLUE_TEXT)", marginLeft: "5px"}} className="fas fa-check-circle"></i> : null}
          </div>
          <h3>{props.team.league}</h3>
          <h3 className="muted">Official TwitLeague account of the Chicago White Sox</h3>
          <h3 className="muted">Head Coach: {`@${props.team.headCoach}`}</h3>
          <h3 className={styles["team-attributes"] + " muted"}>
            <div className={styles["team-attribute"]}>
            <i className={"fas fa-map-marker-alt " + styles["twit-icon"]}></i>
            <span>Baton Rouge, LA</span>
            </div>
            <div className={styles["team-attribute"]}>
            <i className={"fas fa-calendar-alt " + styles["twit-icon"]}></i>
            <span>Joined Oct 2020</span>
            </div>
          </h3>
          <div style={{width: "100%"}}>
            <h3>
              <span style={{fontWeight:900, marginRight:"3px"}}>{props.team.watchers.length}</span>
              <span className="muted">Followers</span>
            </h3>
          </div>
          
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
