import React from "react";
import { connect } from "react-redux";

import useUser from "../lib/useUser";
import { scout, unScout, toggleEditProfilePopup } from "../actions";
import Profile from "./Profile";
import userProfile from "../sass/components/UserProfile.module.scss";
import Attribute from "./Attribute";
import Count from "./Count";
import ScoutButton from "./ScoutButton";
import Linkify from "./Linkify";

function UserProfile(props) {
  const { user } = useUser();
  const editUser = () => {
    if (user.id === props.user.id) {
      props.toggleEditProfilePopup();
    }
  };

  const renderButton = () => {
    if (!user) {
      return null;
    }
    if (user.id === props.user.id) {
      return null;
    } else {
      return <ScoutButton user={props.user} />;
    }
  };

  return (
    <React.Fragment>
      <Profile
        banner={props.user.banner}
        avatar={props.user.avatar}
        onAvatarClick={editUser}
        action={renderButton()}
      >
        <div className={userProfile["user-profile__info"]}>
          <div
            className={`${userProfile["user-profile__name"]} u-margin-top-tiny`}
          >
            <h1 className="heading-1">{props.user.name}</h1>
          </div>
          <div className={userProfile["user-profile__info__username-box"]}>
            <h3
              className={
                userProfile["user-profile__info__username-box__username"]
              }
            >{`@${props.user.username}`}</h3>
          </div>
          {props.user.bio ? (
            <p className={userProfile["user-profile__info__bio"] + " muted"}>
              <Linkify string={props.user.bio} user={user} hasTwitLinks />
            </p>
          ) : null}
          <div className={userProfile["user-profile__attributes"]}>
            <Attribute icon={"/sprites.svg#icon-map-pin"} text="Chicago, IL" />
            <Attribute
              icon={"/sprites.svg#icon-trending-up"}
              text="mywebsite.com"
            />
            <Attribute
              icon={"/sprites.svg#icon-home"}
              text="Joined December 2010"
            />
          </div>
          <div className={userProfile["user-profile__counts"]}>
            <Count
              href="/"
              value={props.user.scouts}
              text={props.user.scouts == 1 ? "Scout" : "Scouts"}
            />
            <Count href="/" value={props.user.scouting} text="Scouting" />
            <Count href="/" value={props.user.following} text="Following" />
          </div>
        </div>
      </Profile>
    </React.Fragment>
  );
}

export default connect(null, {
  scout,
  unScout,
  toggleEditProfilePopup,
})(UserProfile);
