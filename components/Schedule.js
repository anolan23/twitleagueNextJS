import style from "../sass/components/Schedule.module.scss";
import Empty from "./Empty";
import ScheduleEvent from "./ScheduleEvent";
import TwitSpinner from "./TwitSpinner";
function Schedule({ events, seasonTeamId }) {
  const renderHead = () => {
    return (
      <thead>
        <tr>
          <th className={style["schedule__table__column__date"]}>Date</th>
          <th className={style["schedule__table__column__opponent"]}>
            Opponent
          </th>
          <th className={style["schedule__table__column__score"]}>Score</th>
        </tr>
      </thead>
    );
  };

  function renderSchedule() {
    if (!events) return null;
    else {
      return events.map((event, index) => {
        return (
          <ScheduleEvent
            key={index}
            event={event}
            seasonTeamId={seasonTeamId}
          />
        );
      });
    }
  }
  return (
    <table className={style["schedule__table"]}>
      {renderHead()}
      <tbody>{renderSchedule()}</tbody>
    </table>
  );
}

export default Schedule;
