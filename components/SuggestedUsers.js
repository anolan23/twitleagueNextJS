import React, { useState, useEffect } from "react";

import Link from "next/link";

import useUser from "../lib/useUser";
import { getSuggestedUsers } from "../actions";
import suggestedTeams from "../sass/components/SuggestedTeams.module.scss";
import TwitCard from "./TwitCard";
import backend from "../lib/backend";
import Empty from "./Empty";
import TwitSpinner from "./TwitSpinner";
import TwitItem from "./TwitItem";
import ScoutButton from "./ScoutButton";

function SuggestedUsers() {
  const { user } = useUser();
  const [users, setUsers] = useState(null);

  useEffect(async () => {
    if (!user) {
      return;
    }
    const users = await getSuggestedUsers({
      userId: user.id,
      startIndex: 0,
      stopIndex: 3,
    });
    setUsers(users);
  }, [user]);

  function updateUsers(user) {
    let newUsers = [...users];
    let index = newUsers.findIndex((newUser) => newUser.id === user.id);
    newUsers[index] = user;
    setUsers(newUsers);
  }

  const renderFooter = () => {
    return (
      <Link href="/suggested/users">
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
        const { avatar, name, username } = user;
        return (
          <TwitItem
            key={index}
            avatar={avatar}
            title={name}
            subtitle={username}
          >
            <ScoutButton player={user} update={updateUsers} />
          </TwitItem>
        );
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
