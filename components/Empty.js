import React from "react";

import empty from "../sass/components/Empty.module.scss";
import TwitButton from "./TwitButton";

function Empty({ onActionClick, actionText, actionHref, main, sub }) {
  const renderAction = () => {
    if (onActionClick) {
      return (
        <TwitButton onClick={onActionClick} color="primary">
          {actionText}
        </TwitButton>
      );
    } else if (actionHref) {
      return (
        <TwitButton href={actionHref} color="primary">
          {actionText}
        </TwitButton>
      );
    }
  };

  return (
    <div className={empty["empty"]}>
      <h2 className={empty["empty__main"]}>{main}</h2>
      <p className={empty["empty__sub"]}>{sub}</p>
      <div className={empty["empty__action"]}>{renderAction()}</div>
    </div>
  );
}

export default Empty;
