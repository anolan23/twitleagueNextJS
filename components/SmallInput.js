import React from "react";

import useUser from "../lib/useUser";
import smallInput from "../sass/components/SmallInput.module.scss";
import Avatar from "./Avatar";
import TwitIcon from "./TwitIcon";
import Divide from "./Divide";
function SmallInput({ onClick }) {
  const { user } = useUser();
  return (
    <React.Fragment>
      <Divide />
      <div className={smallInput["small-input"]} onClick={onClick}>
        <Avatar
          className={smallInput["small-input__avatar"]}
          src={user ? user.avatar : null}
        />
        <div className={smallInput["small-input__input"]}>
          <div className={smallInput["small-input__input__text"]}>
            Share your thoughts
          </div>
        </div>
        <div className={smallInput["small-input__actions"]}>
          <TwitIcon
            className={smallInput["small-input__actions__icon"]}
            icon="/sprites.svg#icon-image"
          />
          <TwitIcon
            className={smallInput["small-input__actions__icon"]}
            icon="/sprites.svg#icon-image"
          />
        </div>
      </div>
      <Divide />
    </React.Fragment>
  );
}

export default SmallInput;
