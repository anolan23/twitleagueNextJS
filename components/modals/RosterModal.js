import React from "react";

import TwitModal from "./TwitModal";
import TwitItem from "../TwitItem";

function RosterModal({ show, onHide, roster }) {
  const renderBody = () => {
    return roster.map((player, index) => {
      return (
        <TwitItem
          key={index}
          title={player.username}
          subtitle={player.username}
          image={player.image}
        />
      );
    });
  };

  return (
    <TwitModal
      show={show}
      onHide={onHide}
      title="Roster"
      body={renderBody()}
      footer={null}
    />
  );
}

export default RosterModal;
