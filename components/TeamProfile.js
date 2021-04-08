import React from 'react';
import {connect} from "react-redux";
import Link from 'next/link';

import {
  follow,
  unFollow,  
  toggleEditTeamPopup,
  toggleScheduleModal,
  toggleEditRosterPopup,
  toggleEditEventsPopup,
  sendJoinTeamInvite
} from "../actions";
import Profile from "./Profile";
import teamProfile from "../sass/components/TeamProfile.module.scss";
import TwitButton from "./TwitButton";
import Attribute from "./Attribute";
import Count from "./Count";

function TeamProfile(props) {

  const team = props.team;

  const onFollowClick = () => {
    const teams = suggestions.map(suggestion => {
        if(suggestion.id === team.id){
            return team
        }
        return suggestion
    })
    setSuggestions(teams);

    if(team.following){
        follow(props.userId, team.id);
    }
    else if(!team.following){
        unFollow(props.userId, team.id);
    }
  }

  const editTeam = () => {
    if(props.userId === team.owner_id){
      props.toggleEditTeamPopup();
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
        return <TwitButton onClick={null} color="twit-button--primary">Follow</TwitButton>
      }
      else
      {
        return (
          <div className={teamProfile["team-profile__follow"]}>
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

  const renderRecord = () => {
    const {current_season_wins, current_season_losses} = team;
    if(current_season_wins !== null && current_season_losses !== null)
      return <span className={teamProfile["team-profile__info__record"]}>{`${team.current_season_wins} - ${team.current_season_losses}`}</span>
      else{
        return <span className={teamProfile["team-profile__info__record"]}>{"0 - 0"}</span>
      }
    }

  return (
    <React.Fragment>
      <Profile 
        banner={team.banner}
        avatar={team.avatar}
        onAvatarClick={editTeam}
        action={renderButton()}
      >
        <div className={teamProfile["team-profile__info"]}>
            <div className={`${teamProfile["team-profile__teamname-box"]} u-margin-top-tiny`}>
              <h1 className="heading-1">{team.team_name}</h1>
              {team.verifiedTeam ? <i style={{color: "var(--color-primary)", marginLeft: "5px"}} className="fas fa-check-circle"></i> : null}
            </div>
            {renderRecord()}
            <div className={teamProfile["team-profile__info__name"]}>
              <h3 className={teamProfile["team-profile__info__name__league"]}>{`${team.abbrev} · `}</h3>
              &nbsp;
              {renderLeagueName()}
            </div>
            {team.bio ? <p className={teamProfile["team-profile__info__bio"] + " muted"}>{team.bio}</p> : null}
            <div className={teamProfile["team-profile__info__name"]}>
              <span className={teamProfile["team-profile__info__name__league"]}>Team manager: </span>
              &nbsp;
              {renderHeadCoach()}
            </div>
            <div className={teamProfile["team-profile__attributes"]}>
              <Attribute icon={"/sprites.svg#icon-map-pin"} text={`${team.city}, ${team.state}`}/>
              <Attribute icon={"/sprites.svg#icon-home"} text={`Joined ${team.joined}`}/>
            </div>
            <div className={teamProfile["team-profile__counts"]}>
              <Count href="/" value={10} text="Following"/>
              <Count href="/" value={19} text="Followers"/>
            </div>
        </div>
      </Profile>
    </React.Fragment>
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
  follow,  
  toggleEditTeamPopup,
  toggleScheduleModal,
  toggleEditRosterPopup,
  toggleEditEventsPopup,
  sendJoinTeamInvite 
})(TeamProfile);
