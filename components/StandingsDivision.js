import { useState, useRef, useEffect } from "react";
import standingsDivision from "../sass/components/StandingsDivision.module.scss";
import TwitStat from "./TwitStat";
import Empty from "../components/Empty";
import TwitIcon from "../components/TwitIcon";
import TwitDropdown from "../components/TwitDropdown";
import TwitDropdownItem from "../components/TwitDropdownItem";
import backend from "../lib/backend";

function StandingsDivision({
  division,
  team,
  onDelete,
  onTeamClick,
  editable,
  onDivisionClick,
}) {
  const ref = useRef();
  const [show, setShow] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [divisionName, setDivisionName] = useState(division.division_name);

  useEffect(() => {
    document.body.addEventListener("click", clickOutsideDropdownButton);
    return () => {
      document.body.removeEventListener("click", clickOutsideDropdownButton);
    };
  }, []);

  useEffect(() => {
    if (!division) {
      return;
    }
    setDivisionName(division.division_name);
  }, [division]);

  const clickOutsideDropdownButton = (event) => {
    if (!ref.current) {
      return;
    }
    if (ref.current.contains(event.target)) {
      return;
    }
    setShow(false);
  };

  const disabled = (_team) => {
    if (team) {
      return team.id !== _team.id;
    } else {
      return false;
    }
  };

  const onDeleteClick = async () => {
    await backend.delete("/api/leagues/divisions", {
      params: {
        divisionId: division.id,
      },
    });
    onDelete();
  };

  const renderDivision = () => {
    if (!division || !division.teams) {
      return null;
    } else if (division.teams.length === 0) {
      return null;
    } else {
      const leader = division.teams[0];

      return division.teams.map((team, index) => {
        return (
          <TwitStat
            key={index}
            team={team}
            leader={leader}
            onClick={() => onTeamClick(team)}
            disabled={disabled(team)}
          />
        );
      });
    }
  };

  const renderEditIcon = () => {
    if (editable) {
      return (
        <div
          className={standingsDivision["standings-division__icon-holder"]}
          ref={ref}
        >
          <TwitIcon
            onClick={() => setShow(!show)}
            className={
              standingsDivision["standings-division__icon-holder__icon"]
            }
            icon="/sprites.svg#icon-more-horizontal"
          />
          <div
            className={
              standingsDivision["standings-division__icon-holder__dropdown"]
            }
          >
            <TwitDropdown show={show}>
              <TwitDropdownItem onClick={() => setEditingName(true)}>
                Change division name
              </TwitDropdownItem>
              <TwitDropdownItem onClick={onDeleteClick}>
                Delete division
              </TwitDropdownItem>
            </TwitDropdown>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const renderCaption = () => {
    return (
      <caption
        onClick={onDivisionClick}
        className={standingsDivision["standings-division__caption"]}
      >
        <div
          className={
            standingsDivision["standings-division__caption__caption-box"]
          }
        >
          {renderDivisionName()}
          {renderEditIcon()}
        </div>
      </caption>
    );
  };

  const onChange = (event) => {
    setDivisionName(event.target.value);
  };

  const onEditDivisionNameSubmit = async (event) => {
    event.preventDefault();
    await backend.patch("/api/leagues/divisions", {
      divisionId: division.id,
      newDivisionName: divisionName,
    });
    setEditingName(false);
  };

  const renderDivisionName = () => {
    if (!editingName) {
      return (
        <span
          className={
            standingsDivision["standings-division__caption__caption-box__text"]
          }
        >
          {divisionName}
        </span>
      );
    } else {
      return (
        <form
          onSubmit={onEditDivisionNameSubmit}
          className={standingsDivision["standings-division__header__form"]}
        >
          <input
            type="text"
            value={divisionName}
            onChange={onChange}
            className={
              standingsDivision["standings-division__header__form__input"]
            }
            placeholder="Enter division name"
            onBlur={onEditDivisionNameSubmit}
          />
        </form>
      );
    }
  };

  return (
    <table className={standingsDivision["standings-division"]}>
      {renderCaption()}
      <thead className={standingsDivision["standings-division__head"]}>
        <tr className={standingsDivision["standings-division__head__row"]}>
          <th
            className={standingsDivision["standings-division__head__row__item"]}
            colSpan={2}
          >
            Team
          </th>
          <th
            className={standingsDivision["standings-division__head__row__item"]}
          >
            W
          </th>
          <th
            className={standingsDivision["standings-division__head__row__item"]}
          >
            L
          </th>
          <th
            className={standingsDivision["standings-division__head__row__item"]}
          >
            T
          </th>
          <th
            className={standingsDivision["standings-division__head__row__item"]}
          >
            PCT
          </th>
          <th
            className={standingsDivision["standings-division__head__row__item"]}
          >
            GB
          </th>
        </tr>
      </thead>
      <tbody className={standingsDivision["standings__table__body"]}>
        {renderDivision()}
      </tbody>
    </table>
  );
}
export default StandingsDivision;
