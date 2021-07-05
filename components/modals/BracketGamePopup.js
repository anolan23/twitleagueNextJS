import React, { useState, useEffect } from "react";
import { useFormik } from "formik";

import bracketGamePopup from "../../sass/components/BracketGamePopup.module.scss";
import Popup from "./Popup";
import TwitTabs from "../TwitTabs";
import TwitTab from "../TwitTab";
import Empty from "../Empty";
import Slot from "../Slot";
import TwitButton from "../TwitButton";

function BracketGamePopup({ show, onHide, game, events, advanceTeam }) {
  const [tab, setTab] = useState("select");
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

  function onWinnerSelect(k) {
    setTab(k.target.id);
  }

  function onEventsSelect(k) {
    setTab(k.target.id);
  }

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
        <TwitTabs>
          <TwitTab
            title="Advance"
            active={tab === "select"}
            id="select"
            onClick={onWinnerSelect}
          />
          <TwitTab
            title="Events"
            active={tab === "events"}
            id="events"
            onClick={onEventsSelect}
          />
        </TwitTabs>
        <form onSubmit={onAdvanceTeamClick}>
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
            <TwitButton size="large" expanded color="primary" type="submit">
              Advance team
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
