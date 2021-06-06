import React from "react";

import twitDropdown from "../sass/components/TwitDropdown.module.scss";

function TwitDropdown({ className, children, dropdownRef, show }) {
  if (!show) {
    return null;
  } else {
    return (
      <div
        className={`${twitDropdown["twit-dropdown"]} ${className}`}
        ref={dropdownRef}
      >
        {children}
      </div>
    );
  }
}

export default TwitDropdown;
