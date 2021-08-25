import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

import useUser from "../../../../lib/useUser";
import { getScouts, getScouting, getFollowing } from "../../../../actions";
import TopBar from "../../../../components/TopBar";
import LeftColumn from "../../../../components/LeftColumn";
import RightColumn from "../../../../components/RightColumn";
import TwitTabs from "../../../../components/TwitTabs";
import TwitTab from "../../../../components/TwitTab";
import Users from "../../../../db/repos/Users";
import TwitSpinner from "../../../../components/TwitSpinner";
import TwitItem from "../../../../components/TwitItem";
import InfiniteList from "../../../../components/InfiniteList";
import ScoutButton from "../../../../components/ScoutButton";
import FollowButton from "../../../../components/FollowButton";

function UserCounts({ userData }) {
  const { user } = useUser();
  const router = useRouter();
  const { isFallback, query, isReady } = router;
  const { resource } = query;
  const [tab, setTab] = useState(null);
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

  if (isFallback) {
    return <TwitSpinner size={50} />;
  }

  const { name, username } = userData;

  function onTabSelect(event) {
    const { id } = event.target;
    router.replace(`/users/${username}/${id}`, undefined, {
      shallow: true,
      scroll: false,
    });
  }

  function getData(startIndex, stopIndex) {
    switch (resource) {
      case "scouts":
        return getScouts({
          username,
          userId: user.id,
          startIndex,
          stopIndex,
        });
      case "scouting":
        return getScouting({
          username,
          userId: user.id,
          startIndex,
          stopIndex,
        });

      case "following":
        return getFollowing({
          username,
          userId: user.id,
          startIndex,
          stopIndex,
        });

      default:
        return;
    }
  }

  function updateItem(item) {
    let newList = [...list];
    let index = newList.findIndex((newItem) => newItem.id === item.id);
    newList[index] = item;
    setList(newList);
  }

  function renderList() {
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
      />
    );
  }

  function itemRenderer(item) {
    if (!item) return null;
    switch (resource) {
      case "scouts":
      case "scouting": {
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

      case "following": {
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

  return (
    <div className="twit-container">
      <header className="header">
        <LeftColumn setShowPopupCompose={null} />
      </header>
      <main className="main">
        <TopBar main={name} sub={`@${username}`}></TopBar>
        <TwitTabs>
          <TwitTab
            onClick={onTabSelect}
            id={"scouts"}
            active={tab === "scouts"}
            title="Scouts"
          />
          <TwitTab
            onClick={onTabSelect}
            id={"scouting"}
            active={tab === "scouting"}
            title="Scouting"
          />
          <TwitTab
            onClick={onTabSelect}
            id={"following"}
            active={tab === "following"}
            title="Following"
          />
        </TwitTabs>
        {renderList()}
      </main>
      <div className="right-bar">
        <RightColumn></RightColumn>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  const { username } = context.params;
  let userData = await Users.findOne(username, null);
  userData = JSON.parse(JSON.stringify(userData));

  return {
    revalidate: 1,
    props: {
      userData,
    },
  };
}

export default UserCounts;
