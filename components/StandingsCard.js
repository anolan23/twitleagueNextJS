import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import standingsCard from "../sass/components/StandingsCard.module.scss";
import { getStandings } from "../actions";
import TwitCard from "./TwitCard";
import Division from "./Division";
import Empty from "./Empty";
import TwitSpinner from "./TwitSpinner";

function StandingsCard({ league, title }) {
  if (!league || !league.season_id) {
    return null;
  }

  const router = useRouter();
  const [standings, setStandings] = useState({});
  const { divisions, teams } = standings;

  useEffect(async () => {
    const standings = await getStandings(league.league_name, league.season_id);
    setStandings(standings);
  }, []);

  function onFooterClick() {
    router.push({
      pathname: `/leagues/${league.league_name}/standings`,
      query: { seasonId: league.season_id },
    });
  }

  const renderFooter = () => {
    return (
      <div
        className={standingsCard["standings-card__footer"]}
        onClick={onFooterClick}
      >
        <span className={standingsCard["standings-card__footer__text"]}>
          Show more
        </span>
      </div>
    );
  };

  const renderDivisions = () => {
    if (!divisions) {
      return null;
    } else {
      return divisions.map((division, index) => {
        let divisionTeams = teams.filter(
          (team) => team.division_id === division.id
        );
        divisionTeams = divisionTeams.sort((a, b) =>
          a.place > b.place ? 1 : b.place > a.place ? -1 : 0
        );
        return (
          <Division
            key={index}
            division={division}
            teams={divisionTeams}
            onTeamClick={(team) =>
              router.push(`/teams/${team.abbrev.substring(1)}`)
            }
          />
        );
      });
    }
  };

  return (
    <TwitCard title={title} footer={renderFooter()}>
      {renderDivisions()}
    </TwitCard>
  );
}

export default StandingsCard;
