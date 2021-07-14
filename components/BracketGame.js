import React, { useEffect, useState } from "react";

import bracketStyle from "../sass/components/Bracket.module.scss";
import BracketGamePopup from "./modals/BracketGamePopup";
import BracketSlot from "./BracketSlot";

function BracketGame({ id, bracket, advanceTeam }) {
  const game = bracket[id];
  const { topSlot, bottomSlot } = { ...game };

  const [showBracketGamePopup, setShowBracketGamePopup] = useState(false);

  function onGameClick() {
    setShowBracketGamePopup(true);
  }

  function renderChampion() {
    if (id !== 0) {
      return null;
    }
    return (
      <div className={bracketStyle["bracket__champion"]}>
        <BracketSlot slot={topSlot} />
      </div>
    );
  }

  return (
    <React.Fragment>
      <div
        onClick={onGameClick}
        className={bracketStyle["bracket__round__game"]}
        id={id}
      >
        <div
          className={`${bracketStyle["bracket__round__game__slot"]} ${bracketStyle["bracket__round__game__slot--top"]}`}
        >
          <BracketSlot slot={topSlot} />
        </div>
        <div
          className={`${bracketStyle["bracket__round__game__slot"]} ${bracketStyle["bracket__round__game__slot--bottom"]}`}
        >
          <BracketSlot slot={bottomSlot} />
        </div>
        {renderChampion()}
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
