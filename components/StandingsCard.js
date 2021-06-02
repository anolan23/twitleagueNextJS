import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import standingsCard from "../sass/components/StandingsCard.module.scss";
import TwitCard from "./TwitCard";
import backend from "../lib/backend";
import StandingsDivision from "./StandingsDivision";
import Empty from "./Empty";

function StandingsCard({ standings }) {
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
    if (!standings) {
      return <Empty main="No standings" sub="The league has no divisions" />;
    } else if (standings.length === 0) {
      return null;
    } else {
      return standings.map((division, index) => {
        return (
          <StandingsDivision
            key={index}
            division={division.division}
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
