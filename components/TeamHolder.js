import React from 'react';
import Avatar from './Avatar';
import {connect} from "react-redux";

import {
  followTeam,
  unFollowTeam, 
  toggleAddEventModal, 
  toggleEditTeamPopup,
  toggleScheduleModal,
  toggleEditRosterPopup,
  toggleEditEventsPopup,
  sendJoinTeamInvite
} from "../actions";

import teamHolder from "../sass/components/TeamHolder.module.scss";
import TwitButton from "./TwitButton";
import TwitDropdownButton from "./TwitDropdownButton";
import TwitDropdownItem from "./TwitDropdownItem";


function TeamHolder(props) {

  const team = props.team;

  const renderButton = () => {
    if(props.username === team.owner){
      return (
          <TwitDropdownButton actionText="Manage Team">
            <TwitDropdownItem onClick={props.toggleEditTeamPopup} text="Edit team page"/>
            <TwitDropdownItem onClick={props.toggleEditRosterPopup} text="Edit roster"/>
            <TwitDropdownItem onClick={props.toggleEditEventsPopup} text="Edit events"/>
          </TwitDropdownButton>
      )
    }
    else{
      if(!props.following.some(row => row.team_id === team.id))
      {
        return <TwitButton onClick={props.followTeam} color="twit-button--primary">Follow</TwitButton>
      }
      else
      {
        return (
          <div className={teamHolder["team-holder__follow"]}>
            <TwitButton color="twit-button--primary" outline="twit-button--primary--outline">Unfollow</TwitButton>
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
      <div className={teamHolder["team-holder__action-box"]}>
        <div className={teamHolder["team-holder__team-image"]}>
          <Avatar onClick={props.toggleEditTeamPopup} className={teamHolder["team-holder__image"]} src={team.avatar?team.avatar:""} alt="team profile image"/>
          </div>
          <div className={teamHolder["team-holder__action"]}>
            {renderButton()}
          </div>
      </div> 
      <div className={teamHolder["team-holder__info"]}>
          <div className={`${teamHolder["team-holder__teamname-box"]} u-margin-top-tiny`}>
            <h1 className="heading-1">{team.team_name}</h1>
            {team.verifiedTeam ? <i style={{color: "var(--BLUE_TEXT)", marginLeft: "5px"}} className="fas fa-check-circle"></i> : null}
          </div>
          <h3 className={teamHolder["team-holder__info__league"] + " muted"}>{`${team.league_name} · ${team.abbrev}`}</h3>
          <h3 className={teamHolder["team-holder__info__bio"] + " muted"}>Official TwitLeague account of the Chicago White Sox</h3>
          <h3 className={teamHolder["team-holder__info__bio"] + " muted"}>Head Coach: {`@${team.owner}`}</h3>
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
              <span style={{fontWeight:900, marginRight:"3px"}}>{team.followers ? team.followers.length : 0}</span>
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
    following: state.user.following ? state.user.following : [],
    username: state.user.username
  }
}

export default connect(mapStateToProps,{
  followTeam,  
  toggleAddEventModal, 
  toggleEditTeamPopup,
  toggleScheduleModal,
  toggleEditRosterPopup,
  toggleEditEventsPopup,
  sendJoinTeamInvite 
})(TeamHolder);
