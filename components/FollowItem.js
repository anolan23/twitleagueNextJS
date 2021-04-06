import React, { useState } from "react";

import useUser from "../lib/useUser";
import {follow, unFollow} from "../actions";
import TwitItem from "./TwitItem";

function FollowItem(props){
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
        <TwitItem 
            key={props.key}
            href={`/teams/${props.team.abbrev.substring(1)}`}
            avatar={props.team.avatar}
            title={props.team.team_name}
            subtitle={`${props.team.abbrev} · ${props.team.league_name}`}
            actionText={following ? "Unfollow" : "Follow"}
            onActionClick={onFollowClick}
        />
    )
}
export default FollowItem;