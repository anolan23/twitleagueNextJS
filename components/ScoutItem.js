import React from "react";

import TwitItem from "./TwitItem";
import ScoutButton from "./ScoutButton";

function ScoutItem(props) {
  return (
    <TwitItem
      href={`/users/${props.user.username}`}
      avatar={props.user.avatar}
      title={props.user.name}
      subtitle={`@${props.user.username}`}
    >
      <ScoutButton user={props.user} />
    </TwitItem>
  );
}
export default ScoutItem;
