import React from "react";
import { useRouter } from "next/router";

import FollowButton from "./FollowButton";
import TwitItem from "./TwitItem";

function FollowItem({ team }) {
  const router = useRouter();
  return (
    <TwitItem
      onClick={() => router.push(`/teams/${team.abbrev.substring(1)}`)}
      avatar={team.avatar}
      title={team.team_name}
      subtitle={`${team.abbrev} · ${team.league_name}`}
    >
      <FollowButton team={team} />
    </TwitItem>
  );
}
export default FollowItem;
