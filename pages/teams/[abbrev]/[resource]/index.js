import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

import useUser from "../../../../lib/useUser";
import { getRoster, getFollowers } from "../../../../actions";
import TopBar from "../../../../components/TopBar";
import ScoresCard from "../../../../components/ScoresCard";
import LeftColumn from "../../../../components/LeftColumn";
import RightColumn from "../../../../components/RightColumn";
import TwitTabs from "../../../../components/TwitTabs";
import TwitTab from "../../../../components/TwitTab";
import Teams from "../../../../db/repos/Teams";
import TwitSpinner from "../../../../components/TwitSpinner";
import TwitItem from "../../../../components/TwitItem";
import InfiniteList from "../../../../components/InfiniteList";
import ScoutButton from "../../../../components/ScoutButton";
import Empty from "../../../../components/Empty";

function CountPages({ team }) {
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

  const { id: teamId, abbrev, team_name } = team;

  function onTabSelect(event) {
    const { id } = event.target;
    router.replace(`/teams/${abbrev.substring(1)}/${id}`, undefined, {
      shallow: true,
      scroll: false,
    });
  }

  function getData(startIndex, stopIndex) {
    switch (resource) {
      case "players":
        return getRoster({
          abbrev,
          userId: user.id,
          startIndex,
          stopIndex,
        });
      case "coaches":
        return getRoster({
          abbrev,
          userId: user.id,
          startIndex,
          stopIndex,
        });
      case "followers":
        return getFollowers({
          teamId,
          userId: user.id,
          startIndex,
          stopIndex,
        });

      default:
        break;
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
        empty={renderEmpty()}
      />
    );
  }

  function itemRenderer(item) {
    if (!item) return null;
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

  function renderEmpty() {
    switch (resource) {
      case "players":
        return <Empty main="No players" sub="Roster is empty" />;
      case "coaches":
        return (
          <Empty
            main="No coaches"
            sub="There aren't any coaches on this team"
          />
        );

      case "followers":
        return (
          <Empty main="No followers" sub="No one is following this team" />
        );

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
        <TopBar main={team_name} sub={`${abbrev}`}></TopBar>
        <TwitTabs>
          <TwitTab
            onClick={onTabSelect}
            id={"players"}
            active={tab === "players"}
            title="Players"
          />
          <TwitTab
            onClick={onTabSelect}
            id={"coaches"}
            active={tab === "coaches"}
            title="Coaches"
          />
          <TwitTab
            onClick={onTabSelect}
            id={"followers"}
            active={tab === "followers"}
            title="Followers"
          />
        </TwitTabs>
        {renderList()}
      </main>
      <div className="right-bar">
        <RightColumn>
          <ScoresCard
            seasonId={team.current_season ? team.current_season.id : null}
          />
        </RightColumn>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  const { abbrev } = context.params;
  let team;

  team = await Teams.findOne(`$${abbrev}`, null);
  team = JSON.parse(JSON.stringify(team));
  return {
    revalidate: 1,
    props: {
      team,
    },
  };
}

export default CountPages;
