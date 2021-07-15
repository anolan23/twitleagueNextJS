import React from "react";

import useUser from "../lib/useUser";
import Avatar from "../components/Avatar";
import { togglePanel } from "../actions";

function TopBar({ main, sub, children }) {
  const { user } = useUser();

  const goBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const renderBackArrow = () => {
    if (main === "Home") {
      return null;
    } else {
      return (
        <svg className="top-bar__icon" onClick={goBack}>
          <use xlinkHref="/sprites.svg#icon-arrow-left" />
        </svg>
      );
    }
  };

  const renderAvatar = () => {
    if (main !== "Home") {
      return null;
    } else {
      return (
        <Avatar
          onClick={togglePanel}
          className="top-bar__avatar"
          src={user.avatar}
        />
      );
    }
  };

  const renderAction = () => {
    if (!children) {
      return null;
    } else {
      return <div className="top-bar__box__action">{children}</div>;
    }
  };

  return (
    <div className="top-bar">
      <div className="top-bar__box">
        {renderAvatar()}
        {renderBackArrow()}
        <div className="top-bar__text">
          <div className="top-bar__text--main">{main}</div>
          <div className="top-bar__text--sub muted">{sub}</div>
        </div>
        {renderAction()}
      </div>
    </div>
  );
}

export default TopBar;
