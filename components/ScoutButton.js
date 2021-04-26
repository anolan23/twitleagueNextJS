import React, { useState, useEffect } from "react";

import useUser from "../lib/useUser";
import {scout, unScout} from "../actions";
import TwitButton from "./TwitButton";

function ScoutButton(props){
    const { user } = useUser();
    const [scouted, setScouted] = useState(props.user.scouted)
    
    useEffect(() => {
      setScouted(props.user.scouted)
    }, [props.user.scouted])

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
    const renderButton = () => {
      if(!scouted){
        return (
          <TwitButton onClick={onScoutClick} color="twit-button--primary">
            Scout
          </TwitButton>   
        )
      }
      else{ 
        return (
          <TwitButton onClick={onScoutClick} color="twit-button--primary" outline="twit-button--primary--outline">
            Unscout
          </TwitButton> 
        )
      }
  }

    return (
        <React.Fragment>
          {renderButton()}
        </React.Fragment>
    )
}
export default ScoutButton;