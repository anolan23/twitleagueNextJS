import React, { useState } from "react";

import useUser from "../lib/useUser";
import {follow, unFollow} from "../actions";
import TwitButton from "../components/TwitButton";

function FollowButton(props){
    const { user } = useUser();
    const [following, setFollowing] = useState(props.team.following)

    const onFollowClick = async () => {
        if(!user || !user.isSignedIn){
          return
        }
        else{
          if(!following){
            await follow(props.team.id, user.id);
            setFollowing(true);
          }
          else{
            await unFollow(props.team.id, user.id);
            setFollowing(false);
          }
        }
    }

    return (
        <TwitButton onClick={onFollowClick} color="twit-button--primary">
          {following ? "Unfollow" : "Follow"}
        </TwitButton>
    )
}
export default FollowButton;