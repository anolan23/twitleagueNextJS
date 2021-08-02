import React, { useState, useRef, useEffect } from "react";
import divisionStyle from "../sass/components/Division.module.scss";
import TwitStat from "./TwitStat";
import Empty from "./Empty";
import TwitIcon from "./TwitIcon";
import TwitDropdown from "./TwitDropdown";
import TwitDropdownItem from "./TwitDropdownItem";
import backend from "../lib/backend";
import TwitSpinner from "./TwitSpinner";
import DivisionNamePopup from "./modals/DivisionNamePopup";

function Division({
  division,
  team,
  teams,
  onDelete,
  onTeamClick,
  editable,
  onDivisionClick,
  league,
}) {
  const ref = useRef();
  const [show, setShow] = useState(false);
  const [showDivisionNamePopup, setShowDivisionNamePopup] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const { division_name } = division;

  useEffect(() => {
    document.body.addEventListener("click", clickOutsideDropdown);
    return () => {
      document.body.removeEventListener("click", clickOutsideDropdown);
    };
  }, []);

  function clickOutsideDropdown(event) {
    if (!ref.current) {
      return;
    }

    setShow(false);
  }

  const disabled = (_team) => {
    if (team) {
      return team.id !== _team.id;
    } else {
      return false;
    }
  };

  const renderTeams = () => {
    if (!teams) {
      return <TwitSpinner size={30} />;
    } else if (teams.length === 0) {
      return null;
    } else {
      return teams.map((team, index) => {
        return (
          <TwitStat
            key={index}
            team={team}
            leader={null}
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
        <div className={divisionStyle["division__icon-holder"]} ref={ref}>
          <TwitIcon
            onClick={(e) => {
              e.stopPropagation();
              setShow(!show);
            }}
            className={divisionStyle["division__icon-holder__icon"]}
            icon="/sprites.svg#icon-more-horizontal"
          />
          <div className={divisionStyle["division__icon-holder__dropdown"]}>
            <TwitDropdown show={show}>
              <TwitDropdownItem onClick={() => setShowDivisionNamePopup(true)}>
                Edit division
              </TwitDropdownItem>
              <TwitDropdownItem onClick={onDelete}>
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
    if (!division_name) {
      return null;
    }
    return (
      <caption
        onClick={onDivisionClick}
        className={divisionStyle["division__caption"]}
      >
        <div className={divisionStyle["division__caption__caption-box"]}>
          <span
            className={divisionStyle["division__caption__caption-box__text"]}
          >
            {division_name}
          </span>
          {renderEditIcon()}
        </div>
      </caption>
    );
  };

  const renderHead = () => {
    if (!division_name && teams.length === 0) {
      return null;
    }
    return (
      <thead className={divisionStyle["division__head"]}>
        <tr className={divisionStyle["division__head__row"]}>
          <th
            className={divisionStyle["division__head__row__item"]}
            colSpan={2}
          >
            Team
          </th>
          <th className={divisionStyle["division__head__row__item"]}>W</th>
          <th className={divisionStyle["division__head__row__item"]}>L</th>
          <th className={divisionStyle["division__head__row__item"]}>T</th>
          <th className={divisionStyle["division__head__row__item"]}>PCT</th>
          <th className={divisionStyle["division__head__row__item"]}>GB</th>
        </tr>
      </thead>
    );
  };

  return (
    <React.Fragment>
      <table className={divisionStyle["division"]}>
        {renderCaption()}
        {renderHead()}
        <tbody className={divisionStyle["division__table__body"]}>
          {renderTeams()}
        </tbody>
      </table>
      <DivisionNamePopup
        show={showDivisionNamePopup}
        onHide={() => setShowDivisionNamePopup(false)}
        division={division}
        league={league}
      />
    </React.Fragment>
  );
}
export default Division;
