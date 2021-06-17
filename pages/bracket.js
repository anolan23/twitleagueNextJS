import React from "react";

import bracket from "../sass/components/Bracket.module.scss";
import BracketGame from "../components/BracketGame";

function Bracket() {
  let count = 10;
  return (
    <div className={bracket["bracket-holder"]}>
      <div
        className={`${bracket["bracket"]} ${bracket["bracket-16"]} ${
          bracket[`count-${count}`]
        }`}
      >
        <div
          className={`${bracket["bracket__round"]} ${bracket["bracket__round--32"]}`}
        >
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
        </div>
        <div
          className={`${bracket["bracket__round"]} ${bracket["bracket__round--16"]}`}
        >
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
        </div>
        <div
          className={`${bracket["bracket__round"]} ${bracket["bracket__round--8"]}`}
        >
          <BracketGame />
          <BracketGame />
          <BracketGame />
          <BracketGame />
        </div>
        <div
          className={`${bracket["bracket__round"]} ${bracket["bracket__round--4"]}`}
        >
          <BracketGame />
          <BracketGame />
        </div>
        <div
          className={`${bracket["bracket__round"]} ${bracket["bracket__round--2"]}`}
        >
          <BracketGame />
        </div>
      </div>
    </div>
  );
}

export default Bracket;
