import React from "react";
import { useRouter } from "next/router";

import TwitItem from "./TwitItem";
import ScoutButton from "./ScoutButton";

function ScoutItem({ user }) {
  const router = useRouter();
  return (
    <TwitItem
      onClick={() => router.push(`/users/${user.username}`)}
      avatar={user.avatar}
      title={user.name}
      subtitle={`@${user.username}`}
    >
      <ScoutButton user={user} />
    </TwitItem>
  );
}
export default ScoutItem;
