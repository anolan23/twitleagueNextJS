import React, { useState, useEffect } from "react";

import useUser from "../lib/useUser";
import suggested from "../sass/components/Suggested.module.scss";
import TopBar from "./TopBar";
import TwitTabs from "./TwitTabs";
import TwitTab from "./TwitTab";
import Empty from "./Empty";
import backend from "../lib/backend";
import FollowItem from "./FollowItem";
import ScoutItem from "./ScoutItem";

function Suggested() {
  const { user } = useUser();
  const [tab, setTab] = useState("teams");
  const [suggestions, setSuggestions] = useState(null);

  useEffect(() => {
    if (user) {
      getSuggestedTeams();
    }
  }, [user]);

  const getSuggestedTeams = async () => {
    const teams = await backend.get("/api/teams/suggested", {
      params: {
        userId: user.id,
        num: 50,
      },
    });
    setSuggestions(teams.data);
  };

  const getSuggestedUsers = async () => {
    const users = await backend.get("/api/users/suggested", {
      params: {
        userId: user.id,
        num: 50,
      },
    });
    setSuggestions(users.data);
  };

  const renderContent = () => {
    if (suggestions === null) {
      return;
    }
    if (suggestions.length > 0) {
      return suggestions.map((suggestion, index) => {
        if (suggestion.team_name) {
          return <FollowItem key={index} team={suggestion} />;
        } else if (suggestion.username) {
          return <ScoutItem key={index} user={suggestion} />;
        }
      });
    } else if (suggestions.length === 0) {
      return (
        <Empty
          main="There are no suggestions for you"
          sub="Come back in a litte bit"
        />
      );
    }
  };

  const onTeamsClick = (event) => {
    setTab(event.target.id);
    getSuggestedTeams();
  };

  const onUsersClick = (event) => {
    setTab(event.target.id);
    getSuggestedUsers();
  };
  return (
    <div className={suggested["suggested"]}>
      <TopBar main="Suggested for you" />
      <TwitTabs>
        <TwitTab
          onClick={onTeamsClick}
          id={"teams"}
          title="Teams"
          active={tab === "teams" ? true : false}
        />
        <TwitTab
          onClick={onUsersClick}
          id={"users"}
          title="Users"
          active={tab === "users" ? true : false}
        />
      </TwitTabs>
      {renderContent()}
    </div>
  );
}

export default Suggested;
