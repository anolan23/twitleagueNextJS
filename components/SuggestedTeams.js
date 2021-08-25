import React, { useState, useEffect } from "react";

import Link from "next/link";

import useUser from "../lib/useUser";
import suggestedTeams from "../sass/components/SuggestedTeams.module.scss";
import { getSuggestedTeams } from "../actions";
import TwitCard from "../components/TwitCard";
import backend from "../lib/backend";
import { followTeam, unFollow } from "../actions";
import Empty from "./Empty";
import FollowItem from "./FollowItem";
import TwitSpinner from "./TwitSpinner";

function SuggestedTeams() {
  const { user } = useUser();
  const [teams, setTeams] = useState(null);

  useEffect(async () => {
    if (!user) {
      return;
    }
    const teams = await getSuggestedTeams({
      userId: user.id,
      startIndex: 0,
      stopIndex: 3,
    });
    setTeams(teams);
  }, [user]);

  const renderFooter = () => {
    return (
      <Link href="/suggested/teams">
        <div className={suggestedTeams["suggested-teams__footer"]}>
          <span className={suggestedTeams["suggested-teams__footer__text"]}>
            Show more
          </span>
        </div>
      </Link>
    );
  };

  const renderSuggestedTeams = () => {
    if (!teams) {
      return <TwitSpinner size={30} />;
    } else if (teams.length === 0) {
      return (
        <Empty
          main="No suggested teams"
          sub="Try again once more teams are created"
        />
      );
    } else {
      return teams.map((team, index) => {
        return <FollowItem key={index} team={team} />;
      });
    }
  };

  return (
    <TwitCard title="Teams to follow" footer={renderFooter()}>
      {renderSuggestedTeams()}
    </TwitCard>
  );
}

export default SuggestedTeams;
