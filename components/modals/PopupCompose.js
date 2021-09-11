import React, { useEffect, useRef, useCallback } from "react";

import popupCompose from "../../sass/components/PopupCompose.module.scss";
import Popup from "./Popup";
import MainInput from "../MainInput";
import TwitButton from "../TwitButton";
import Post from "../Post";
import Matchup from "../Matchup";

function PopupCompose({
  show,
  onHide,
  initialValue,
  onSubmit,
  post,
  event,
  user,
}) {
  const buttonRef = useRef(null);
  const inputRef = useCallback((ref) => {
    if (!ref) {
      return;
    }
    ref.focus();
  }, []);

  const setButtonRef = useCallback((ref) => {
    if (!ref) {
      return;
    }
    console.log(ref);
    buttonRef.current = ref;
  }, []);

  if (!show) {
    return null;
  }

  async function onComposeSubmit(newPost) {
    try {
      const post = await onSubmit(newPost);
      return post;
    } catch (error) {
      console.log(error);
    } finally {
      onHide();
    }
  }

  async function onHeadingButtonClick(event) {
    buttonRef.current.click();
  }

  const renderReply = () => {
    if (post) {
      return <Post post={post} history />;
    } else if (event) {
      return <Matchup event={event} />;
    } else return null;
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
          buttonText={post || event ? "Reply" : "Post"}
          onSubmit={onComposeSubmit}
          inputRef={inputRef}
          buttonRef={setButtonRef}
          focusOnMount
          user={user}
        />
      </React.Fragment>
    );
  };

  const renderHeading = () => {
    return (
      <div className={popupCompose["popup-compose"]}>
        <TwitButton color="primary" onClick={onHeadingButtonClick}>
          {post || event ? "Reply" : "Post"}
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
