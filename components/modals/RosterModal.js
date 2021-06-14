import React from "react";
import { connect } from "react-redux";

import { toggleRosterModal } from "../../actions";
import TwitModal from "./TwitModal";
import TwitItem from "../TwitItem";

function RosterModal(props) {
  const renderBody = () => {
    return props.roster.map((player, index) => {
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
      show={props.showRosterModal}
      onHide={props.toggleRosterModal}
      title="Roster"
      body={renderBody()}
      footer={null}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    showRosterModal: state.modals.showRosterModal,
    roster: state.team.roster ? state.team.roster : [],
  };
};

export default connect(mapStateToProps, { toggleRosterModal })(RosterModal);
