import React from "react";

import bracketStyle from "../sass/components/Bracket.module.scss";
import BracketGame from "./BracketGame";

function Bracket({ seeds }) {
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
    >
      <div
        className={`${bracketStyle["bracket__round"]} ${bracketStyle["bracket__round--32"]}`}
      >
        <BracketGame id={15} seeds={seeds} />
        <BracketGame id={16} seeds={seeds} />
        <BracketGame id={17} seeds={seeds} />
        <BracketGame id={18} seeds={seeds} />
        <BracketGame id={19} seeds={seeds} />
        <BracketGame id={20} seeds={seeds} />
        <BracketGame id={21} seeds={seeds} />
        <BracketGame id={22} seeds={seeds} />
        <BracketGame id={23} seeds={seeds} />
        <BracketGame id={24} seeds={seeds} />
        <BracketGame id={25} seeds={seeds} />
        <BracketGame id={26} seeds={seeds} />
        <BracketGame id={27} seeds={seeds} />
        <BracketGame id={28} seeds={seeds} />
        <BracketGame id={29} seeds={seeds} />
        <BracketGame id={30} seeds={seeds} />
      </div>
      <div
        className={`${bracketStyle["bracket__round"]} ${bracketStyle["bracket__round--16"]}`}
      >
        <BracketGame id={7} seeds={seeds} />
        <BracketGame id={8} seeds={seeds} />
        <BracketGame id={9} seeds={seeds} />
        <BracketGame id={10} seeds={seeds} />
        <BracketGame id={11} seeds={seeds} />
        <BracketGame id={12} seeds={seeds} />
        <BracketGame id={13} seeds={seeds} />
        <BracketGame id={14} seeds={seeds} />
      </div>
      <div
        className={`${bracketStyle["bracket__round"]} ${bracketStyle["bracket__round--8"]}`}
      >
        <BracketGame id={3} seeds={seeds} />
        <BracketGame id={4} seeds={seeds} />
        <BracketGame id={5} seeds={seeds} />
        <BracketGame id={6} seeds={seeds} />
      </div>
      <div
        className={`${bracketStyle["bracket__round"]} ${bracketStyle["bracket__round--4"]}`}
      >
        <BracketGame id={1} seeds={seeds} />
        <BracketGame id={2} seeds={seeds} />
      </div>
      <div
        className={`${bracketStyle["bracket__round"]} ${bracketStyle["bracket__round--2"]}`}
      >
        <BracketGame id={0} seeds={seeds} />
      </div>
    </div>
  );
}

export default Bracket;
