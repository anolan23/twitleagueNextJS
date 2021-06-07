import React, { useEffect, useRef } from "react";

import popupCompose from "../../sass/components/PopupCompose.module.scss";
import Popup from "./Popup";
import MainInput from "../MainInput";
import TwitButton from "../TwitButton";

function PopupCompose({ show, onHide, initialValue, onSubmit }) {
  if (!show) {
    return null;
  }
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const renderBody = () => {
    return (
      <MainInput
        expanded
        compose
        placeHolder="$Team or @Username"
        initialValue={initialValue}
        buttonText="Post"
        onSubmit={onSubmit}
        inputRef={inputRef}
        focusOnMount
      />
    );
  };

  const renderHeading = () => {
    return (
      <div className={popupCompose["popup-compose"]}>
        <TwitButton form="main-input-form" color="primary">
          Post
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
