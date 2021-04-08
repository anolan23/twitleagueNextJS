import React from 'react';
import {connect} from "react-redux";

import useUser from "../lib/useUser";
import {
  scout,
  unScout,  
  toggleEditProfilePopup
} from "../actions";
import Profile from "./Profile";
import userProfile from "../sass/components/UserProfile.module.scss";
import TwitButton from "./TwitButton";
import Attribute from "./Attribute";

function UserProfile(props) {
  console.log(props.user)
  const { user } = useUser();
  
  const onScoutClick = () => {

  }

  const editUser = () => {
    if(user.id === props.user.id){
      props.toggleEditProfilePopup();
    }
  }

  const renderButton = () => {
    if(!user){
      return null;
    }
    if(user.username === props.user.username){
      return (
           <TwitButton disabled color="twit-button--primary">Follow</TwitButton>
      )
    }
    else{
      <div className={userProfile["user-profile__follow"]}>
            <TwitButton color="twit-button--primary" outline="twit-button--primary--outline">Unfollow</TwitButton>
      </div>
    }
    
  }

  return (
    <React.Fragment>
      <Profile 
        banner={props.user.banner}
        avatar={props.user.avatar}
        onAvatarClick={editUser}
        action={renderButton()}
      >
        <div className={userProfile["user-profile__info"]}>
            <div className={`${userProfile["user-profile__name"]} u-margin-top-tiny`}>
              <h1 className="heading-1">{props.user.name}</h1>
            </div>
            <div className={userProfile["user-profile__info__username-box"]}>
              <h3 className={userProfile["user-profile__info__username-box__username"]}>{`@${props.user.username}`}</h3>
            </div>
            {props.user.bio ? <p className={userProfile["user-profile__info__bio"] + " muted"}>{props.user.bio}</p> : null}
            <div className={userProfile["user-profile__attributes"]}>
              <Attribute icon={"/sprites.svg#icon-map-pin"} text="Chicago, IL"/>
              <Attribute icon={"/sprites.svg#icon-trending-up"} text="mywebsite.com"/>
              <Attribute icon={"/sprites.svg#icon-home"} text="Joined December 2010"/>
            </div>
            <div style={{width: "100%"}}>
              <div>
                <span style={{fontWeight:900, marginRight:"3px"}}>{props.user.num_followers}</span>
                <span className={userProfile["user-profile__info__bio"] + " muted"}>Followers</span>
              </div>
            </div>
        </div>
      </Profile>
    </React.Fragment>
  );
}

export default connect(null,{
  scout,
  unScout,
  toggleEditProfilePopup
})(UserProfile);
