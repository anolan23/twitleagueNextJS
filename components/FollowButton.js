import React, { useState, useEffect } from "react";

import useUser from "../lib/useUser";
import { follow, unFollow } from "../actions";
import TwitButton from "../components/TwitButton";

function FollowButton(props) {
  const { user } = useUser();
  const [following, setFollowing] = useState(props.team.following);

  useEffect(() => {
    setFollowing(props.team.following);
  }, [props.team.following]);

  const onFollowClick = async () => {
    if (!user || !user.isSignedIn) {
      return;
    } else {
      if (!following) {
        await follow(props.team.id, user.id);
        setFollowing(true);
      } else {
        await unFollow(props.team.id, user.id);
        setFollowing(false);
      }
    }
  };

  const renderButton = () => {
    if (!following) {
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
