import React from "react";
import { useStore } from "../context/Store";

import bracketStyle from "../sass/components/Bracket.module.scss";
import BracketGame from "./BracketGame";

function Bracket({ advanceTeam, offset, scale }) {
  const [state, dispatch] = useStore();
  const empty = [...Array(32)];
  const seeds = state.playoffs
    ? state.playoffs.seeds
      ? state.playoffs.seeds
      : []
    : [];
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
        <BracketGame id={15} advanceTeam={advanceTeam} />
        <BracketGame id={16} advanceTeam={advanceTeam} />
        <BracketGame id={17} advanceTeam={advanceTeam} />
        <BracketGame id={18} advanceTeam={advanceTeam} />
        <BracketGame id={19} advanceTeam={advanceTeam} />
        <BracketGame id={20} advanceTeam={advanceTeam} />
        <BracketGame id={21} advanceTeam={advanceTeam} />
        <BracketGame id={22} advanceTeam={advanceTeam} />
        <BracketGame id={23} advanceTeam={advanceTeam} />
        <BracketGame id={24} advanceTeam={advanceTeam} />
        <BracketGame id={25} advanceTeam={advanceTeam} />
        <BracketGame id={26} advanceTeam={advanceTeam} />
        <BracketGame id={27} advanceTeam={advanceTeam} />
        <BracketGame id={28} advanceTeam={advanceTeam} />
        <BracketGame id={29} advanceTeam={advanceTeam} />
        <BracketGame id={30} advanceTeam={advanceTeam} />
      </div>
      <div
        className={`${bracketStyle["bracket__round"]} ${bracketStyle["bracket__round--16"]}`}
      >
        <BracketGame id={7} advanceTeam={advanceTeam} />
        <BracketGame id={8} advanceTeam={advanceTeam} />
        <BracketGame id={9} advanceTeam={advanceTeam} />
        <BracketGame id={10} advanceTeam={advanceTeam} />
        <BracketGame id={11} advanceTeam={advanceTeam} />
        <BracketGame id={12} advanceTeam={advanceTeam} />
        <BracketGame id={13} advanceTeam={advanceTeam} />
        <BracketGame id={14} advanceTeam={advanceTeam} />
      </div>
      <div
        className={`${bracketStyle["bracket__round"]} ${bracketStyle["bracket__round--8"]}`}
      >
        <BracketGame id={3} advanceTeam={advanceTeam} />
        <BracketGame id={4} advanceTeam={advanceTeam} />
        <BracketGame id={5} advanceTeam={advanceTeam} />
        <BracketGame id={6} advanceTeam={advanceTeam} />
      </div>
      <div
        className={`${bracketStyle["bracket__round"]} ${bracketStyle["bracket__round--4"]}`}
      >
        <BracketGame id={1} advanceTeam={advanceTeam} />
        <BracketGame id={2} advanceTeam={advanceTeam} />
      </div>
      <div
        className={`${bracketStyle["bracket__round"]} ${bracketStyle["bracket__round--2"]}`}
      >
        <BracketGame id={0} advanceTeam={advanceTeam} />
      </div>
    </div>
  );
}

export default Bracket;
