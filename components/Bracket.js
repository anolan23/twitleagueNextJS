import React from "react";
import Draggable from "react-draggable";

import bracketStyle from "../sass/components/Bracket.module.scss";

import BracketGame from "./BracketGame";

function Bracket({ seeds, bracket, advanceTeam, offset, scale }) {
  const bracketSize = () => {
    if (seeds.length <= 2) {
      return 2;
    } else if (seeds.length <= 4) {
      return 4;
    } else if (seeds.length <= 8) {
      return 8;
    } else if (seeds.length <= 16) {
      return 16;
    } else if (seeds.length <= 32) {
      return 32;
    } else if (seeds.length <= 64) {
      return 64;
    } else {
      return null;
    }
  };

  return (
    <div
      className={`${bracketStyle["bracket"]} ${
        bracketStyle[`bracket-${bracketSize()}`]
      } ${bracketStyle[`count-${seeds.length}`]}`}
      style={{
        transform: `translate(${-offset.x}px, ${-offset.y}px) scale(${scale})`,
      }}
    >
      <div
        className={`${bracketStyle["bracket__round"]} ${bracketStyle["bracket__round--32"]}`}
      >
        <BracketGame id={15} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={16} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={17} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={18} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={19} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={20} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={21} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={22} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={23} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={24} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={25} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={26} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={27} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={28} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={29} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={30} bracket={bracket} advanceTeam={advanceTeam} />
      </div>
      <div
        className={`${bracketStyle["bracket__round"]} ${bracketStyle["bracket__round--16"]}`}
      >
        <BracketGame id={7} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={8} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={9} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={10} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={11} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={12} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={13} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={14} bracket={bracket} advanceTeam={advanceTeam} />
      </div>
      <div
        className={`${bracketStyle["bracket__round"]} ${bracketStyle["bracket__round--8"]}`}
      >
        <BracketGame id={3} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={4} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={5} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={6} bracket={bracket} advanceTeam={advanceTeam} />
      </div>
      <div
        className={`${bracketStyle["bracket__round"]} ${bracketStyle["bracket__round--4"]}`}
      >
        <BracketGame id={1} bracket={bracket} advanceTeam={advanceTeam} />
        <BracketGame id={2} bracket={bracket} advanceTeam={advanceTeam} />
      </div>
      <div
        className={`${bracketStyle["bracket__round"]} ${bracketStyle["bracket__round--2"]}`}
      >
        <BracketGame id={0} bracket={bracket} advanceTeam={advanceTeam} />
      </div>
    </div>
  );
}

export default Bracket;
