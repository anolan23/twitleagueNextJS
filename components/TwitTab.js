import React from "react";
import twitTabs from "../sass/components/TwitTabs.module.scss";

function TwitTab({ active, onClick, id, title }) {
  const handleClick = (event) => {
    event.preventDefault();
    onClick(event);
  };

  const calcActive = () => {
    if (active) {
      return `${twitTabs["twit-tabs__tab"]} ${twitTabs["twit-tabs__tab--active"]}`;
    } else {
      return twitTabs["twit-tabs__tab"];
    }
  };
  return (
    <div onClick={handleClick} className={calcActive()} id={id}>
      {title}
    </div>
  );
}

export default TwitTab;
