import React, { useEffect, useRef } from "react";

import popupCompose from "../../sass/components/PopupCompose.module.scss";
import Popup from "./Popup";
import MainInput from "../MainInput";
import TwitButton from "../TwitButton";
import Post from "../Post";

function PopupCompose({ show, onHide, initialValue, onSubmit, reply, user }) {
  if (!show) {
    return null;
  }
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const renderReply = () => {
    if (!reply) {
      return null;
    } else {
      return <Post post={reply} history />;
    }
  };

  const renderBody = () => {
    return (
      <React.Fragment>
        {renderReply()}
        <MainInput
          expanded
          compose
          placeHolder="$Team or @Username"
          initialValue={initialValue}
          buttonText={!reply ? "Post" : "Reply"}
          onSubmit={onSubmit}
          inputRef={inputRef}
          focusOnMount
          user={user}
        />
      </React.Fragment>
    );
  };

  const renderHeading = () => {
    return (
      <div className={popupCompose["popup-compose"]}>
        <TwitButton form="main-input-form" color="primary">
          {!reply ? "Post" : "Reply"}
        </TwitButton>
      </div>
    );
  };

  return (
    <Popup
      show={show}
      onHide={onHide}
      body={renderBody()}
      heading={renderHeading()}
    />
  );
}

export default PopupCompose;
