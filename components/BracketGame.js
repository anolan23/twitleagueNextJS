import React, { useEffect, useState } from "react";

import bracketStyle from "../sass/components/Bracket.module.scss";
import BracketGamePopup from "./modals/BracketGamePopup";

function BracketGame({ id, bracket, advanceTeam }) {
  const game = bracket[id];
  const { topSlot, bottomSlot } = { ...game };

  const [showBracketGamePopup, setShowBracketGamePopup] = useState(false);

  function onClick() {
    setShowBracketGamePopup(true);
  }

  return (
    <React.Fragment>
      <div
        onClick={onClick}
        className={bracketStyle["bracket__round__game"]}
        id={id}
      >
        <div
          className={`${bracketStyle["bracket__round__game__slot"]} ${bracketStyle["bracket__round__game__slot--top"]}`}
        >
          <div className={bracketStyle["bracket__round__game__slot__seed"]}>
            {topSlot ? (topSlot.seed >= 0 ? topSlot.seed + 1 : null) : null}
          </div>
          <div className={bracketStyle["bracket__round__game__slot__team"]}>
            {topSlot ? (topSlot.team ? topSlot.team.team_name : null) : null}
          </div>
          <div className={bracketStyle["bracket__round__game__slot__score"]}>
            {topSlot ? (topSlot.score ? topSlot.score : null) : null}
          </div>
        </div>
        <div
          className={`${bracketStyle["bracket__round__game__slot"]} ${bracketStyle["bracket__round__game__slot--bottom"]}`}
        >
          <div className={bracketStyle["bracket__round__game__slot__seed"]}>
            {bottomSlot
              ? bottomSlot.seed >= 0
                ? bottomSlot.seed + 1
                : null
              : null}
          </div>
          <div className={bracketStyle["bracket__round__game__slot__team"]}>
            {bottomSlot
              ? bottomSlot.team
                ? bottomSlot.team.team_name
                : null
              : null}
          </div>
          <div className={bracketStyle["bracket__round__game__slot__score"]}>
            {bottomSlot ? (bottomSlot.score ? bottomSlot.score : null) : null}
          </div>
        </div>
      </div>
      <BracketGamePopup
        show={showBracketGamePopup}
        onHide={() => setShowBracketGamePopup(false)}
        game={game}
        advanceTeam={(advancingSlot) => advanceTeam(id, advancingSlot)}
      />
    </React.Fragment>
  );
}
export default BracketGame;
