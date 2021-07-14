import bracketSlot from "../sass/components/BracketSlot.module.scss";
import Avatar from "./Avatar";

function BracketSlot({ slot }) {
  function renderTeam() {
    if (!slot) {
      return (
        <div className={bracketSlot["bracket-slot__empty"]}>Empty slot</div>
      );
    }
    return (
      <div className={bracketSlot["bracket-slot__team"]}>
        <Avatar
          className={bracketSlot["bracket-slot__team__avatar"]}
          src={slot ? (slot.team ? slot.team.avatar : null) : null}
        />
        <div className={bracketSlot["bracket-slot__team__name"]}>
          {slot ? (slot.team ? slot.team.team_name : null) : null}
        </div>
      </div>
    );
  }
  return (
    <div className={bracketSlot["bracket-slot"]}>
      <div className={bracketSlot["bracket-slot__seed"]}>
        {slot ? (slot.seed >= 0 ? slot.seed + 1 : null) : null}
      </div>
      {renderTeam()}
      <div className={bracketSlot["bracket-slot__score"]}>
        {slot ? (slot.score ? slot.score : null) : null}
      </div>
    </div>
  );
}

export default BracketSlot;
