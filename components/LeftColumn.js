import React from 'react';
import TwitNav from "./TwitNav";
import UserToggle from "./UserToggle";

function LeftColumn() {
  return(
      <div className="header__left-column">
        <TwitNav/>
        <UserToggle/>
      </div>
  )
}

export default LeftColumn;
