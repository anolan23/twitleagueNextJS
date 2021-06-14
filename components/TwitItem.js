import React from "react";

import twitItem from "../sass/components/TwitItem.module.scss";
import Avatar from "./Avatar";

function TwitItem({
  active,
  children,
  avatar,
  title,
  subtitle,
  paragraph,
  small,
  onClick,
}) {
  const renderAction = () => {
    return <div className={twitItem["twit-item__action"]}>{children}</div>;
  };

  return (
    <div
      onClick={onClick}
      className={`${twitItem["twit-item"]} ${
        active ? twitItem["twit-item--active"] : ""
      } ${small ? twitItem["twit-item--small"] : null}`}
      draggable="true"
    >
      <Avatar
        roundedCircle
        className={`${twitItem["twit-item__image"]} ${
          small ? twitItem["twit-item__image--small"] : null
        }`}
        src={avatar}
      />
      <div className={twitItem["twit-item__textbox"]}>
        <span className={twitItem["twit-item__title"]}>{title}</span>
        <span className={twitItem["twit-item__subtitle"]}>{subtitle}</span>
        {paragraph ? (
          <p className={twitItem["twit-item__paragraph"]}>{paragraph}</p>
        ) : null}
      </div>
      {renderAction()}
    </div>
  );
}

export default TwitItem;
