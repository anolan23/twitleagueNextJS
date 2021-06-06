import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { togglePopupCompose, createPost } from "../../actions";

import useUser from "../../lib/useUser";
import { setCaret } from "../../lib/twit-helpers";
import popupCompose from "../../sass/components/PopupCompose.module.scss";
import Popup from "./Popup";
import MainInput from "../MainInput";
import TwitButton from "../TwitButton";

function PopupCompose({ show, onHide, initialValue }) {
  if (!show) {
    return null;
  }
  const { user } = useUser();
  const inputRef = useRef(null);

  const onSubmit = (post) => {
    createPost(post, user.id);
  };

  useEffect(() => {
    if (inputRef.current) {
      console.log(inputRef.current);
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

const mapStateToProps = (state) => {
  return {
    showPopupCompose: state.modals.showPopupCompose,
  };
};

export default connect(mapStateToProps, { togglePopupCompose, createPost })(
  PopupCompose
);
