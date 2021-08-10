import Link from "next/link";

import matchup from "../sass/components/Matchup.module.scss";
import { dateString } from "../lib/twit-helpers";
import Avatar from "./Avatar";

function Matchup({ event }) {
  const {
    season,
    home_season_team,
    away_season_team,
    type,
    location,
    play_period,
    notes,
    home_team_points,
    away_team_points,
  } = event;

  const { league } = season;

  const renderPlayPeriod = () => {
    if (play_period) {
      return (
        <span className={matchup["matchup__info__status"]}>{play_period}</span>
      );
    } else {
      return <span className={matchup["matchup__info__status"]}>Upcoming</span>;
    }
  };

  const renderScore = () => {
    if (!home_team_points) {
      return (
        <div className={matchup["matchup__matchup__symbol-holder"]}>
          <span className={matchup["matchup__matchup__symbol__symbol"]}>
            {event.is_home_team ? "vs" : "@"}
          </span>
        </div>
      );
    } else {
      return (
        <div className={matchup["matchup__matchup__score"]}>
          <span className={matchup["matchup__matchup__score__points"]}>
            {home_team_points}
          </span>
          <span className={matchup["matchup__matchup__score__dash"]}>-</span>
          <span className={matchup["matchup__matchup__score__points"]}>
            {away_team_points}
          </span>
        </div>
      );
    }
  };
  return (
    <div className={matchup["matchup"]}>
      <div className={matchup["matchup__info"]}>
        <Link href={`/leagues/${league.league_name}`} passHref>
          <a className="twit-link">{league.league_name}</a>
        </Link>
        &nbsp; · &nbsp;
        <span className={matchup["matchup__info__date"]}>
          {dateString(event.date)}
        </span>
        {renderPlayPeriod()}
      </div>
      <div className={matchup["matchup__matchup"]}>
        <div className={matchup["matchup__matchup__team"]}>
          <Avatar
            className={matchup["matchup__matchup__team__avatar"]}
            src={home_season_team.avatar}
          />
          <span className={matchup["matchup__matchup__team__name"]}>
            {home_season_team.team_name}
          </span>
        </div>
        {renderScore()}
        <div className={matchup["matchup__matchup__team"]}>
          <Avatar
            className={matchup["matchup__matchup__team__avatar"]}
            src={away_season_team.avatar}
          />
          <span className={matchup["matchup__matchup__team__name"]}>
            {away_season_team.team_name}
          </span>
        </div>
      </div>
      <div className={matchup["matchup__more-info"]}>
        <span className={matchup["matchup__more-info__info"]}>{type}</span>
        <span className={matchup["matchup__more-info__info"]}>
          {location ? location : "Unknown location"}
        </span>
        <p className={matchup["matchup__more-info__notes"]}>{notes}</p>
      </div>
    </div>
  );
}

export default Matchup;
