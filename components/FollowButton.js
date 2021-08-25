import React from "react";

import useUser from "../lib/useUser";
import { follow, unFollow } from "../actions";
import TwitButton from "./TwitButton";

function FollowButton({ team, update }) {
  const { user } = useUser();
  const { id: teamId, followed } = team;

  async function onFollowClick() {
    if (!user || !user.isSignedIn) {
      return;
    } else {
      if (!followed) {
        try {
          await follow(teamId, user.id);
          update({ ...team, followed: true });
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          await unFollow(teamId, user.id);
          update({ ...team, followed: false });
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  const renderButton = () => {
    if (!followed) {
      return (
        <TwitButton onClick={onFollowClick} color="primary">
          Follow
        </TwitButton>
      );
    } else {
      return (
        <TwitButton onClick={onFollowClick} color="primary" outline="primary">
          Following
        </TwitButton>
      );
    }
  };

  return <React.Fragment>{renderButton()}</React.Fragment>;
}
export default FollowButton;
