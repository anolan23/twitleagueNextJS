import React, { useState, useCallback, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import useUser from "../../../lib/useUser";
import suggestedStyle from "../../../sass/pages/Suggested.module.scss";
import { getSuggestedTeams, getSuggestedUsers } from "../../../actions";
import TopBar from "../../../components/TopBar";
import TwitTabs from "../../../components/TwitTabs";
import TwitTab from "../../../components/TwitTab";
import Empty from "../../../components/Empty";
import TwitItem from "../../../components/TwitItem";
import ScoutButton from "../../../components/ScoutButton";
import FollowButton from "../../../components/FollowButton";
import LeftColumn from "../../../components/LeftColumn";
import RightColumn from "../../../components/RightColumn";
import InfiniteList from "../../../components/InfiniteList";

function Suggested() {
  const { user } = useUser();
  const router = useRouter();
  const { isReady, query } = router;
  const { resource } = query;
  const [tab, setTab] = useState("teams");
  const [list, setList] = useState(null);
  const infiniteLoaderRef = useCallback(
    (ref) => {
      if (!ref) {
        return;
      }

      setList(null);
      ref.resetLoadMoreRowsCache();
    },
    [resource]
  );

  useEffect(() => {
    setTab(resource);
  }, [resource]);

  function updateItem(item) {
    let newList = [...list];
    let index = newList.findIndex((newItem) => newItem.id === item.id);
    newList[index] = item;
    setList(newList);
  }

  function getData(startIndex, stopIndex) {
    switch (resource) {
      case "teams":
        return getSuggestedTeams({ userId: user.id, startIndex, stopIndex });
      case "users":
        return getSuggestedUsers({ userId: user.id, startIndex, stopIndex });
      default:
        return;
    }
  }

  const renderList = () => {
    if (!user || !isReady) {
      return null;
    }
    return (
      <InfiniteList
        getData={getData}
        list={list}
        item={itemRenderer}
        updateList={(list) => setList(list)}
        infiniteLoaderRef={infiniteLoaderRef}
        empty={renderEmpty()}
      />
    );
  };

  function itemRenderer(item) {
    if (!item) return null;
    switch (resource) {
      case "users": {
        const { avatar, name, username } = item;
        return (
          <TwitItem
            avatar={avatar}
            title={name}
            subtitle={`@${username}`}
            onClick={() => router.push(`/users/${username}`)}
          >
            <ScoutButton player={item} update={updateItem} />
          </TwitItem>
        );
      }

      case "teams": {
        const { avatar, team_name, abbrev } = item;
        return (
          <TwitItem
            avatar={avatar}
            title={team_name}
            subtitle={abbrev}
            onClick={() => router.push(`/teams/${abbrev.substring(1)}`)}
          >
            <FollowButton team={item} update={updateItem} />
          </TwitItem>
        );
      }

      default:
        return null;
    }
  }

  function renderEmpty() {
    switch (resource) {
      case "teams":
        return <Empty main="No teams" sub="There aren't any suggested teams" />;
      case "users":
        return <Empty main="No users" sub="There aren't any suggested users" />;

      default:
        return null;
    }
  }

  function onTabClick(event) {
    const { id } = event.target;
    router.replace(`/suggested/${id}`, undefined, {
      shallow: true,
      scroll: false,
    });
  }

  return (
    <div className="twit-container">
      <header className="header">
        <LeftColumn />
      </header>
      <main className="main">
        <div className={suggestedStyle["suggested"]}>
          <TopBar main="Suggested for you" />
          <TwitTabs>
            <TwitTab
              onClick={onTabClick}
              id={"teams"}
              title="Teams"
              active={tab === "teams" ? true : false}
            />
            <TwitTab
              onClick={onTabClick}
              id={"users"}
              title="Users"
              active={tab === "users" ? true : false}
            />
          </TwitTabs>
          {renderList()}
        </div>
      </main>
      <div className="right-bar">
        <RightColumn></RightColumn>
      </div>
    </div>
  );
}

export default Suggested;
