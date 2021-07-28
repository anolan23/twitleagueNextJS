import React from "react";

import twitDropdown from "../sass/components/TwitDropdown.module.scss";
import TwitIcon from "./TwitIcon";

function TwitDropdownItem({ disabled, onClick, children, value, id, icon }) {
  function onItemClick(event) {
    onClick(event);
  }

  const renderIcon = () => {
    if (icon) {
      return (
        <TwitIcon
          className={twitDropdown["twit-dropdown__item__icon"]}
          icon={icon}
        />
      );
    } else return null;
  };

  if (disabled) {
    return (
      <div
        className={`${twitDropdown["twit-dropdown__item"]} ${twitDropdown["twit-dropdown__item--disabled"]}`}
        value={value}
        id={id}
      >
        {renderIcon()}
        {children}
      </div>
    );
  } else {
    return (
      <div
        onClick={onItemClick}
        className={twitDropdown["twit-dropdown__item"]}
        value={value}
        id={id}
      >
        {renderIcon()}
        {children}
      </div>
    );
  }
}

export default TwitDropdownItem;
