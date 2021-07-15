import React from "react";
import { sendEventReply } from "../../actions";
import Popup from "./Popup";
import MainInput from "../MainInput";
import Matchup from "../Matchup";

function PopupEventReply({ show, onHide, event }) {
  const onSubmit = (values) => {
    let reply = { ...values, event_conversation_id: event.id };
    sendEventReply(reply);
  };

  const renderBody = () => {
    return (
      <React.Fragment>
        <Matchup event={event} />
        <MainInput
          onSubmit={onSubmit}
          buttonText="Reply"
          expanded
          placeHolder="Post your reply"
          initialValue=""
        />
      </React.Fragment>
    );
  };

  return <Popup show={show} onHide={onHide} body={renderBody()} />;
}

export default PopupEventReply;
