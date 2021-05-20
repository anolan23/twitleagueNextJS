import React from "react";
import { connect } from "react-redux";
import { togglePopupCompose, createPost } from "../../actions";

import useUser from "../../lib/useUser";
import popupCompose from "../../sass/components/PopupCompose.module.scss";
import Popup from "./Popup";
import MainInput from "../MainInput";
import TwitButton from "../TwitButton";

function PopupCompose(props) {
  const { user } = useUser();

  const onSubmit = (post) => {
    createPost(post, user.id);
  };

  const renderBody = () => {
    return (
      <MainInput
        expanded
        compose
        placeHolder="$Team or @Username"
        initialValue=""
        buttonText="Post"
        onSubmit={onSubmit}
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
      show={props.showPopupCompose}
      onHide={props.togglePopupCompose}
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
