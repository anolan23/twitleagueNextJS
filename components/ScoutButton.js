import React from "react";

import useUser from "../lib/useUser";
import { scout, unScout } from "../actions";
import TwitButton from "./TwitButton";

function ScoutButton({ player, update }) {
  const { user } = useUser();
  const { id: playerId, scouted } = player;

  async function onScoutClick() {
    if (!user || !user.isSignedIn) {
      return;
    } else {
      if (!scouted) {
        try {
          await scout(playerId, user.id);
          update({ ...player, scouted: true });
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          await unScout(playerId, user.id);
          update({ ...player, scouted: false });
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  const renderButton = () => {
    if (!scouted) {
      return (
        <TwitButton onClick={onScoutClick} color="primary">
          Scout
        </TwitButton>
      );
    } else {
      return (
        <TwitButton onClick={onScoutClick} color="primary" outline="primary">
          Scouting
        </TwitButton>
      );
    }
  };

  return <React.Fragment>{renderButton()}</React.Fragment>;
}
export default ScoutButton;
