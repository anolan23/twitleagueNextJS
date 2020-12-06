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

import teamHolder from "../sass/components/TeamHolder.module.scss";
import button from "../sass/components/Button.module.scss";
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function TeamHolder(props) {

  const team = props.team;

  const renderButton = () => {
    if(props.userId === team.owner){
      return (
      <DropdownButton size="sm" id="manageTeam" title="Manage Team">
        <Dropdown.Item as="button" onClick={props.toggleAddEventModal}>Schedule Event</Dropdown.Item>
        <Dropdown.Item as="button">Edit Roster</Dropdown.Item>
        <Dropdown.Item as="button" onClick={props.toggleAvatarModal}>Edit Team Image</Dropdown.Item>
      </DropdownButton>);
    }
    else{
      if(!props.watchList.includes(team._id))
      {
        return <Button onClick={() => props.watchTeamAndFetchUser()} className={button["button--watch"]}>Watch</Button>
      }
      else
      {
        return (
          <div style={{display:"flex"}}>
            <Button onClick={() => props.unwatchTeamAndFetchUser()} className={button["button--watch"]}>Unwatch</Button>

            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle className={`${button["button--watch"]} ${button["button--dropdown"]}`} id="dropdown-custom-1"></Dropdown.Toggle>
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

  return (
    <div className={teamHolder["team-holder"]}>
      <div className={teamHolder["team-holder__banner"]}>
        <img className={teamHolder["team-holder__banner-image"]} src={team.banner? team.banner : null}></img>
      </div>
      <div style={{display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap:"wrap"}}>
        <div className={teamHolder["team-holder__team-image"]}>
          <Avatar onClick={props.toggleAvatarModal} className={teamHolder["team-holder__image"]} src={team.image?team.image:""} alt="team profile image"/>
        </div>
        {renderButton()}
      </div>
      <div className={teamHolder["team-holder__info"]}>
          <div className={`${teamHolder["team-holder__teamname-box"]} u-margin-top-tiny`}>
            <h1 className="heading-1">{team.teamName}</h1>
            {team.verifiedTeam ? <i style={{color: "var(--BLUE_TEXT)", marginLeft: "5px"}} className="fas fa-check-circle"></i> : null}
          </div>
          <h3 className={teamHolder["team-holder__info__league"] + " muted"}>{team.league}</h3>
          <h3 className={teamHolder["team-holder__info__bio"] + " muted"}>Official TwitLeague account of the Chicago White Sox</h3>
          <h3 className={teamHolder["team-holder__info__bio"] + " muted"}>Head Coach: {`@${team.headCoach}`}</h3>
          <h3 className={teamHolder["team-holder__attributes"] + " muted"}>
            <div className={teamHolder["team-holder__attribute"]}>
            <i className={"fas fa-map-marker-alt " + teamHolder["team-holder__icon"]}></i>
            <span>Baton Rouge, LA</span>
            </div>
            <div className={teamHolder["team-holder__attribute"]}>
            <i className={"fas fa-calendar-alt " + teamHolder["team-holder__icon"]}></i>
            <span>Joined Oct 2020</span>
            </div>
          </h3>
          <div style={{width: "100%"}}>
            <div>
              <span style={{fontWeight:900, marginRight:"3px"}}>{team.watchers ? team.watchers.length : 0}</span>
              <span className={teamHolder["team-holder__info__bio"] + " muted"}>Followers</span>
            </div>
          </div>
      </div>
    </div>
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
