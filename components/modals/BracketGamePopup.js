import React, { useState } from "react";

import bracketGamePopup from "../../sass/components/BracketGamePopup.module.scss";
import Popup from "./Popup";
import Slot from "../Slot";
import TwitButton from "../TwitButton";

function BracketGamePopup({ show, onHide, game, events, advanceTeam }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [team, setTeam] = useState(null);

  function onSlotClick(id, team) {
    setSelectedSlot(id);
    setTeam(team);
  }

  const renderHeading = () => {
    return (
      <div className={bracketGamePopup["bracket-game-popup__heading"]}></div>
    );
  };

  function onAdvanceTeamClick(event) {
    event.preventDefault();
    advanceTeam(
      selectedSlot === "topSlot"
        ? game.topSlot
        : selectedSlot === "bottomSlot"
        ? game.bottomSlot
        : null
    );
    onHide();
  }

  const renderBody = () => {
    return (
      <div className={bracketGamePopup["bracket-game-popup__body"]}>
        <form
          className={bracketGamePopup["bracket-game-popup__body__form"]}
          onSubmit={onAdvanceTeamClick}
        >
          <div className={bracketGamePopup["bracket-game-popup__body__title"]}>
            Advance a team
          </div>
          <div className={bracketGamePopup["bracket-game-popup__body__slots"]}>
            <Slot
              slot={game ? game.topSlot : null}
              onClick={onSlotClick}
              checked={selectedSlot === "topSlot"}
              value="topSlot"
            />
            <Slot
              slot={game ? game.bottomSlot : null}
              onClick={onSlotClick}
              checked={selectedSlot === "bottomSlot"}
              value="bottomSlot"
            />
          </div>
          <div className={bracketGamePopup["bracket-game-popup__body__action"]}>
            <TwitButton size="large" color="primary" type="submit">
              Advance
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
