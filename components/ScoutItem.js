import React, { useState } from "react";

import useUser from "../lib/useUser";
import {scout, unScout} from "../actions";
import TwitItem from "./TwitItem";

function ScoutItem(props){
    const { user } = useUser();
    const [scouted, setScouted] = useState(props.user.scouted)

    const onScoutClick = async () => {
        if(!user || !user.isSignedIn){
          return
        }
        else{
          if(!scouted){
            await scout(props.user.id, user.id);
            setScouted(true);
          }
          else{
            await unScout(props.user.id, user.id);
            setScouted(false);
          }
        }
    }

    return (
        <TwitItem 
            href={`/users/${props.user.username}`}
            avatar={props.user.avatar}
            title={props.user.name}
            subtitle={`@${props.user.username}`}
            actionText={scouted ? "Unscout" : "Scout"}
            onActionClick={onScoutClick}
        />
    )
}
export default ScoutItem;