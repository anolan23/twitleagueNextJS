import React from "react";

import useUser from "../lib/useUser";
import Profile from "./Profile";
import userProfileStyle from "../sass/components/UserProfile.module.scss";
import Attribute from "./Attribute";
import Count from "./Count";
import ScoutButton from "./ScoutButton";
import Linkify from "./Linkify";

function UserProfile({ userProfile, onAvatarClick }) {
  const { user } = useUser();
  const editUser = () => {
    if (user.id === userProfile.id) {
      onAvatarClick();
    }
  };

  const renderButton = () => {
    if (!user) {
      return null;
    }
    if (user.id === userProfile.id) {
      return null;
    } else {
      return <ScoutButton user={userProfile} />;
    }
  };

  return (
    <React.Fragment>
      <Profile
        banner={userProfile.banner}
        avatar={userProfile.avatar}
        onAvatarClick={editUser}
        action={renderButton()}
      >
        <div className={userProfileStyle["user-profile__info"]}>
          <div
            className={`${userProfileStyle["user-profile__name"]} u-margin-top-tiny`}
          >
            <h1 className="heading-1">{userProfile.name}</h1>
          </div>
          <div className={userProfileStyle["user-profile__info__username-box"]}>
            <h3
              className={
                userProfileStyle["user-profile__info__username-box__username"]
              }
            >{`@${userProfile.username}`}</h3>
          </div>
          {userProfile.bio ? (
            <div
              className={userProfileStyle["user-profile__info__bio"] + " muted"}
            >
              <Linkify string={userProfile.bio} user={user} hasTwitLinks />
            </div>
          ) : null}
          <div className={userProfileStyle["user-profile__attributes"]}>
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
          <div className={userProfileStyle["user-profile__counts"]}>
            <Count
              href="/"
              value={userProfile.scouts}
              text={userProfile.scouts == 1 ? "Scout" : "Scouts"}
            />
            <Count href="/" value={userProfile.scouting} text="Scouting" />
            <Count href="/" value={userProfile.following} text="Following" />
          </div>
        </div>
      </Profile>
    </React.Fragment>
  );
}

export default UserProfile;
