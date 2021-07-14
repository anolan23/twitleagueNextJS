import slotStyle from "../sass/components/Slot.module.scss";
import Avatar from "./Avatar";
import Checkbox from "./Checkbox";

function Slot({ slot, checked, onClick, value }) {
  const onSlotClick = (event) => {
    const { id } = event.currentTarget;
    onClick(id, slot.team);
  };

  function renderTeam() {
    if (!slot) {
      return <div className={slotStyle["slot__empty"]}>Empty slot</div>;
    }

    const { team, seed } = slot;

    return (
      <div className={slotStyle["slot__team"]}>
        <div className={slotStyle["slot__team__seed"]}>{seed + 1}</div>
        <Avatar src={team.avatar} className={slotStyle["slot__team__avatar"]} />
        <div className={slotStyle["slot__team__teamname"]}>
          {team.team_name}
        </div>
      </div>
    );
  }

  return (
    <div className={slotStyle["slot"]} onClick={onSlotClick} id={value}>
      {renderTeam()}
      <Checkbox checked={checked} type="radio" onChange={onSlotClick} />
    </div>
  );
}

export default Slot;
