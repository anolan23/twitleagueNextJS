import React, { useState, useEffect } from "react";

import Link from "next/link";

import useUser from "../lib/useUser";
import suggestedTeams from "../sass/components/SuggestedTeams.module.scss";
import TwitCard from "./TwitCard";
import backend from "../lib/backend";
import Empty from "./Empty";
import ScoutItem from "./ScoutItem";
import TwitSpinner from "./TwitSpinner";

function SuggestedUsers() {
  const { user } = useUser();
  const [users, setUsers] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }
    fetchSuggestedUsers(3);
  }, [user]);

  const fetchSuggestedUsers = async (num) => {
    const users = await backend.get("/api/users/suggested", {
      params: {
        num,
        userId: user.id,
      },
    });
    setUsers(users.data);
  };

  const renderFooter = () => {
    return (
      <Link href="/suggested">
        <div className={suggestedTeams["suggested-teams__footer"]}>
          <span className={suggestedTeams["suggested-teams__footer__text"]}>
            Show more
          </span>
        </div>
      </Link>
    );
  };

  const renderSuggestedUsers = () => {
    if (!users) {
      return <TwitSpinner size={30} />;
    } else if (users.length === 0) {
      return (
        <Empty
          main="No suggested teams"
          sub="Try again once more teams are created"
        />
      );
    } else {
      return users.map((user, index) => {
        return <ScoutItem key={index} user={user} />;
      });
    }
  };

  return (
    <TwitCard title="Players to scout" footer={renderFooter()}>
      {renderSuggestedUsers()}
    </TwitCard>
  );
}

export default SuggestedUsers;
