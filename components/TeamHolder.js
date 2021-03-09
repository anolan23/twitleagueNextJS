import React from 'react';
import Avatar from './Avatar';
import {connect} from "react-redux";

import {
  followTeam,
  unFollowTeam,  
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
import Link from 'next/link';


function TeamHolder(props) {

  const team = props.team;

  const onFollowToggleClick = () => {
    const teams = suggestions.map(suggestion => {
        if(suggestion.id === team.id){
            return team
        }
        return suggestion
    })
    setSuggestions(teams);

    if(team.following){
        followTeam(props.userId, team.id);
    }
    else if(!team.following){
        unFollowTeam(props.userId, team.id);
    }
  }

  const editTeam = () => {
    if(props.userId === team.owner_id){
      props.toggleEditTeamPopup();
    }
  }

  const editRoster = () => {
    if(props.userId === team.owner_id){
      props.toggleEditRosterPopup();
    }
  }

  const editEvents = () => {
    if(props.userId === team.owner_id){
      props.toggleEditEventsPopup();
    }
  }

  const renderButton = () => {
    if(props.username === team.owner){
      return (
           <TwitButton disabled color="twit-button--primary">Follow</TwitButton>
      )
    }
    else{
      if(!props.following.some(obj => obj.team_id === team.id))
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

  const renderLeagueName = () => {
    return (
      <Link href={`/leagues/${team.league_name}`} passHref>
        <a className="twit-link">
          {team.league_name}
        </a>
      </Link>
    )
  }

  const renderHeadCoach = () => {
    return (
      <Link href={`/users/${team.owner}`} passHref>
        <a className="twit-link">
          {`@${team.owner}`}
        </a>
      </Link>
    )
  }

  return (
    <div className={teamHolder["team-holder"]}>
      <div className={teamHolder["team-holder__banner"]}>
        <img className={teamHolder["team-holder__banner-image"]} src={team.banner? team.banner : null}></img>
      </div>
      <div className={teamHolder["team-holder__action-box"]}>
        <div className={teamHolder["team-holder__team-image"]}>
          <Avatar onClick={editTeam} className={teamHolder["team-holder__image"]} src={team.avatar?team.avatar:""} alt="team profile image"/>
        </div>
        <div className={teamHolder["team-holder__action"]}>
          {renderButton()}
        </div>
      </div> 
      <div className={teamHolder["team-holder__info"]}>
          <div className={`${teamHolder["team-holder__teamname-box"]} u-margin-top-tiny`}>
            <h1 className="heading-1">{team.team_name}</h1>
            {team.verifiedTeam ? <i style={{color: "var(--color-primary)", marginLeft: "5px"}} className="fas fa-check-circle"></i> : null}
          </div>
          <div className={teamHolder["team-holder__info__name"]}>
            <h3 className={teamHolder["team-holder__info__name__league"]}>{`${team.abbrev} · `}</h3>
            &nbsp;
            {renderLeagueName()}
          </div>
          {team.bio ? <p className={teamHolder["team-holder__info__bio"] + " muted"}>{team.bio}</p> : null}
          <div className={teamHolder["team-holder__info__name"]}>
            <h3 className={teamHolder["team-holder__info__name__league"]}>Head coach: </h3>
            &nbsp;
            {renderHeadCoach()}
          </div>
          <h3 className={teamHolder["team-holder__attributes"] + " muted"}>
            <div className={teamHolder["team-holder__attribute"]}>
            <i className={"fas fa-map-marker-alt " + teamHolder["team-holder__icon"]}></i>
            <span>{`${team.city}, ${team.state}`}</span>
            </div>
            <div className={teamHolder["team-holder__attribute"]}>
            <i className={"fas fa-calendar-alt " + teamHolder["team-holder__icon"]}></i>
            <span>{`Joined ${team.joined}`}</span>
            </div>
          </h3>
          <div style={{width: "100%"}}>
            <div>
              <span style={{fontWeight:900, marginRight:"3px"}}>{team.num_followers}</span>
              <span className={teamHolder["team-holder__info__bio"] + " muted"}>Followers</span>
            </div>
          </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    following: state.user.following ? state.user.following : [],
    userId: state.user.id,
    username: state.user.username
  }
}

export default connect(mapStateToProps,{
  followTeam,  
  toggleEditTeamPopup,
  toggleScheduleModal,
  toggleEditRosterPopup,
  toggleEditEventsPopup,
  sendJoinTeamInvite 
})(TeamHolder);
