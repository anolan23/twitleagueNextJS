import React from 'react';

import Avatar from './Avatar';
import Banner from "./Banner";
import profileStyle from "../sass/components/Profile.module.scss";


function Profile(props) {

  return (
    <div className={profileStyle["profile"]}>
      <Banner src={props.banner}/>
      <div className={profileStyle["profile__action-box"]}>
        <div className={profileStyle["profile__avatar-holder"]}>
          <Avatar onClick={props.onAvatarClick} className={profileStyle["profile__avatar-holder__avatar"]} src={props.avatar} alt="profile avatar"/>
        </div>
        <div className={profileStyle["profile__action-box__action"]}>
          {props.action}
        </div>
      </div> 
      <div className={profileStyle["profile__info"]}>
          {props.children}
      </div>
    </div>
  );
}

export default Profile;
