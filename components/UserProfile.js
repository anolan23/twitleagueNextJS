import React from 'react';

import useUser from '../lib/useUser';
import Profile from './Profile';
import userProfileStyle from '../sass/components/UserProfile.module.scss';
import Attribute from './Attribute';
import Count from './Count';
import ScoutButton from './ScoutButton';
import Linkify from './Linkify';

function UserProfile({ userProfile, onAvatarClick }) {
  const { user } = useUser();
  const {
    id: userId,
    avatar,
    banner,
    name,
    username,
    bio,
    scouts,
    scouting,
    following,
  } = userProfile || {};

  const editUser = () => {
    if (user.id === userId) {
      onAvatarClick();
    }
  };

  const renderButton = () => {
    if (!user) {
      return null;
    }
    if (user.id === userId) {
      return null;
    } else {
      return <ScoutButton player={userProfile} />;
    }
  };

  return (
    <React.Fragment>
      <Profile
        banner={banner}
        avatar={avatar}
        onAvatarClick={editUser}
        action={renderButton()}
      >
        <div className={userProfileStyle['user-profile__info']}>
          <div
            className={`${userProfileStyle['user-profile__name']} u-margin-top-tiny`}
          >
            <h1 className="heading-1">{name}</h1>
          </div>
          <div className={userProfileStyle['user-profile__info__username-box']}>
            <h3
              className={
                userProfileStyle['user-profile__info__username-box__username']
              }
            >{`@${username}`}</h3>
          </div>
          {bio ? (
            <div
              className={userProfileStyle['user-profile__info__bio'] + ' muted'}
            >
              <Linkify string={bio} user={user} hasTwitLinks />
            </div>
          ) : null}
          <div className={userProfileStyle['user-profile__attributes']}>
            <Attribute icon={'/sprites.svg#icon-map-pin'} text="Chicago, IL" />
            <Attribute
              icon={'/sprites.svg#icon-trending-up'}
              text="mywebsite.com"
            />
            <Attribute
              icon={'/sprites.svg#icon-home'}
              text="Joined December 2010"
            />
          </div>
          <div className={userProfileStyle['user-profile__counts']}>
            <Count
              href={`/users/${username}/scouts`}
              value={scouts}
              text={scouts == 1 ? 'Scout' : 'Scouts'}
            />
            <Count
              href={`/users/${username}/scouting`}
              value={scouting}
              text="Scouting"
            />
            <Count
              href={`/users/${username}/following`}
              value={following}
              text="Following"
            />
          </div>
        </div>
      </Profile>
    </React.Fragment>
  );
}

export default UserProfile;
