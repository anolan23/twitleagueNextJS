import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import style from "../sass/components/ScheduleCard.module.scss";
import { getTeamEvents } from "../actions";
import TwitCard from "./TwitCard";
import Schedule from "./Schedule";
import TwitSpinner from "./TwitSpinner";
import Empty from "./Empty";

function ScheduleCard({ team, seasonTeamId }) {
  const router = useRouter();
  const [events, setEvents] = useState(null);
  const { abbrev, current_season, league, team_name } = team;

  useEffect(async () => {
    if (!current_season) {
      setEvents([]);
      return;
    }
    const events = await getTeamEvents({
      abbrev: abbrev.substring(1),
      seasonId: current_season.id,
    });
    setEvents(events);
  }, [team]);

  if (!current_season) {
    return null;
  }

  const renderFooter = () => {
    return (
      <div
        className={style["schedule-card__footer"]}
        onClick={() =>
          router.push({
            pathname: `/leagues/${league.league_name}/schedules`,
            query: seasonTeamId ? { seasonTeamId } : null,
          })
        }
      >
        <span className={style["schedule-card__footer__text"]}>Show more</span>
      </div>
    );
  };

  const renderBody = () => {
    if (!events) return <TwitSpinner size={30} />;
    else if (!events.length)
      return (
        <Empty
          main="No events"
          sub={`${abbrev} has yet to schedule an event for this season`}
        />
      );
    return <Schedule events={events} seasonTeamId={seasonTeamId} />;
  };

  return (
    <TwitCard title={"Schedule"} footer={renderFooter()}>
      {renderBody()}
    </TwitCard>
  );
}

export default ScheduleCard;
