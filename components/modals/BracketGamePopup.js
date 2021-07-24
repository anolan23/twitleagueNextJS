import React, { useState } from "react";
import { useStore } from "../../context/Store";

import bracketGamePopup from "../../sass/components/BracketGamePopup.module.scss";
import { updatePlayoffs } from "../../actions";
import Popup from "./Popup";
import Slot from "../Slot";
import TwitButton from "../TwitButton";

function BracketGamePopup({ show, onHide, game, gameId, advanceTeam }) {
  const [state, dispatch] = useStore();
  const seasonId = state.playoffs ? state.playoffs.seasonId : null;
  const [slotPosition, setSlotPosition] = useState(null);

  function setChampion(champion) {
    dispatch({ type: "SET_CHAMPION", payload: champion });
  }

  function onSlotClick(id, team) {
    setSlotPosition(id);
  }

  const renderHeading = () => {
    return (
      <div className={bracketGamePopup["bracket-game-popup__heading"]}></div>
    );
  };

  async function onSubmit(event) {
    event.preventDefault();
    const selectedSlot =
      slotPosition === "topSlot"
        ? game.topSlot
        : slotPosition === "bottomSlot"
        ? game.bottomSlot
        : null;
    if (gameId === 0) {
      let champion = selectedSlot;
      champion = JSON.stringify(champion);
      const updated = await updatePlayoffs(seasonId, { champion });
      if (updated) {
        setChampion(selectedSlot);
      }
    } else {
      advanceTeam(selectedSlot);
    }

    onHide();
  }

  const renderBody = () => {
    return (
      <div className={bracketGamePopup["bracket-game-popup__body"]}>
        <form
          className={bracketGamePopup["bracket-game-popup__body__form"]}
          onSubmit={onSubmit}
        >
          <div className={bracketGamePopup["bracket-game-popup__body__slots"]}>
            <Slot
              slot={game ? game.topSlot : null}
              onClick={onSlotClick}
              checked={slotPosition === "topSlot"}
              value="topSlot"
            />
            <Slot
              slot={game ? game.bottomSlot : null}
              onClick={onSlotClick}
              checked={slotPosition === "bottomSlot"}
              value="bottomSlot"
            />
          </div>
          <div className={bracketGamePopup["bracket-game-popup__body__action"]}>
            <TwitButton size="large" color="primary" type="submit">
              {gameId === 0 ? "Champion" : "Advance team"}
            </TwitButton>
          </div>
        </form>
      </div>
    );
  };

  return (
    <Popup
      show={show}
      heading={renderHeading()}
      body={renderBody()}
      onHide={onHide}
    />
  );
}

export default BracketGamePopup;
