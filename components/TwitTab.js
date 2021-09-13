import React from "react";
import twitTabs from "../sass/components/TwitTabs.module.scss";

function TwitTab({ active, onClick, id, title }) {
  function handleClick(event) {
    event.preventDefault();
    onClick(event);
  }

  function renderBar() {
    if (!active) return null;
    else {
      return <div className={twitTabs["twit-tabs__tab__bar"]}></div>;
    }
  }

  return (
    <div
      id={id}
      onClick={handleClick}
      className={`${twitTabs["twit-tabs__tab"]} ${
        active ? twitTabs["twit-tabs__tab--active"] : null
      }`}
    >
      {title}
      {renderBar()}
    </div>
  );
}

export default TwitTab;
