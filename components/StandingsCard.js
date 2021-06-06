import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import standingsCard from "../sass/components/StandingsCard.module.scss";
import TwitCard from "./TwitCard";
import StandingsDivision from "./StandingsDivision";
import Empty from "./Empty";
import TwitSpinner from "./TwitSpinner";

function StandingsCard({ standings, league }) {
  const router = useRouter();

  const renderFooter = () => {
    return (
      <Link href="/standings">
        <div className={standingsCard["standings-card__footer"]}>
          <span className={standingsCard["standings-card__footer__text"]}>
            Show more
          </span>
        </div>
      </Link>
    );
  };

  const renderDivisions = () => {
    if (!league) {
      return <Empty main="Empty" sub="No league affiliation" />;
    }
    if (!standings) {
      return <TwitSpinner />;
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
    <TwitCard title="Standings" footer={renderFooter()} color="clear">
      {renderDivisions()}
    </TwitCard>
  );
}

export default StandingsCard;
