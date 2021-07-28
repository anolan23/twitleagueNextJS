import React from "react";
import { useRouter } from "next/router";

import standingsCard from "../sass/components/StandingsCard.module.scss";
import TwitCard from "./TwitCard";
import StandingsDivision from "./StandingsDivision";
import Empty from "./Empty";
import TwitSpinner from "./TwitSpinner";

function StandingsCard({ standings, league, title }) {
  const router = useRouter();

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
    if (!league) {
      return <Empty main="Empty" sub="No league affiliation" />;
    }
    if (!standings) {
      return <TwitSpinner size={30} />;
    } else if (standings.length === 0) {
      return (
        <Empty
          main="Empty"
          sub={`${league.league_name} must have teams assigned to divisions`}
        />
      );
    } else {
      return standings.map((division, index) => {
        return (
          <StandingsDivision
            key={index}
            division={division}
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
