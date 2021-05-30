import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import useUser from "../lib/useUser";
import standingsCard from "../sass/components/StandingsCard.module.scss";
import TwitCard from "./TwitCard";
import backend from "../lib/backend";
import StandingsDivision from "./StandingsDivision";
import Empty from "./Empty";

function StandingsCard(props) {
  const { user } = useUser();
  const router = useRouter();
  const [divisions, setDivisions] = useState(null);

  useEffect(() => {
    if (user) {
      getStandings();
    }
  }, [user, props.league]);

  const getStandings = async () => {
    const response = await backend.get(
      `/api/leagues/${props.league.league_name}/standings`
    );
    setDivisions(response.data);
  };

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
    if (!divisions) {
      return null;
    } else if (divisions.length === 0) {
      return null;
    } else {
      return divisions.map((division, index) => {
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
