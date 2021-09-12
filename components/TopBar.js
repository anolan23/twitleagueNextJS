import React, { useState } from "react";

import useUser from "../lib/useUser";
import Avatar from "./Avatar";
import TwitIcon from "./TwitIcon";
import TwitPanel from "./TwitPanel";

function TopBar({ main, sub, menu, children }) {
  const { user } = useUser();
  const [showPanel, setShowPanel] = useState(false);

  function goBack() {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }

  const renderBackArrow = () => {
    if (main === "Home") {
      return null;
    } else {
      return (
        <TwitIcon
          className="top-bar__icon"
          icon="/sprites.svg#icon-arrow-left"
          onClick={goBack}
        />
      );
    }
  };

  const renderPanelIcon = () => {
    if (main !== "Home") {
      return null;
    } else {
      return (
        <TwitIcon
          onClick={() => setShowPanel(true)}
          className="top-bar__panel-icon"
          icon="/sprites.svg#icon-menu"
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
    <React.Fragment>
      <div className="top-bar">
        <div className="top-bar__box">
          {renderPanelIcon()}
          {renderBackArrow()}
          <div className="top-bar__text">
            <div className="top-bar__text--main">{main}</div>
            <div className="top-bar__text--sub muted">{sub}</div>
          </div>
          {renderAction()}
        </div>
        {menu}
      </div>
      <TwitPanel show={showPanel} onHide={() => setShowPanel(false)} />
    </React.Fragment>
  );
}

export default TopBar;
