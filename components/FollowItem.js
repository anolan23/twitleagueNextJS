import React from "react";
import FollowButton from "./FollowButton";
import TwitItem from "./TwitItem";

function FollowItem({ team }) {
  return (
    <TwitItem
      href={`/teams/${team.abbrev.substring(1)}`}
      avatar={team.avatar}
      title={team.team_name}
      subtitle={`${team.abbrev} · ${team.league_name}`}
    >
      <FollowButton team={team} />
    </TwitItem>
  );
}
export default FollowItem;
