import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

import useUser from "../../../../lib/useUser";
import { getLeagueTeams } from "../../../../actions";
import TopBar from "../../../../components/TopBar";
import LeftColumn from "../../../../components/LeftColumn";
import RightColumn from "../../../../components/RightColumn";
import TwitTabs from "../../../../components/TwitTabs";
import TwitTab from "../../../../components/TwitTab";
import Leagues from "../../../../db/repos/Leagues";
import TwitSpinner from "../../../../components/TwitSpinner";
import TwitItem from "../../../../components/TwitItem";
import InfiniteList from "../../../../components/InfiniteList";
import ScoutButton from "../../../../components/ScoutButton";
import FollowButton from "../../../../components/FollowButton";
import Empty from "../../../../components/Empty";

function LeagueResources({ leagueData }) {
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

  const { league_name, sport } = leagueData;

  function onTabSelect(event) {
    const { id } = event.target;
    router.replace(`/leagues/${league_name}/${id}`, undefined, {
      shallow: true,
      scroll: false,
    });
  }

  function getData(startIndex, stopIndex) {
    switch (resource) {
      case "followers":
        return () => [];
      case "teams":
        return getLeagueTeams({
          leagueName: league_name,
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
        empty={renderEmpty()}
      />
    );
  }

  function itemRenderer(item) {
    if (!item) return null;
    switch (resource) {
      case "followers": {
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
        return (
          <Empty main="No teams" sub="There aren't any teams in this league" />
        );
      case "followers":
        return (
          <Empty main="No followers" sub="No one is following this league" />
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
        <TopBar main={league_name} sub={sport}></TopBar>
        <TwitTabs>
          <TwitTab
            onClick={onTabSelect}
            id={"teams"}
            active={tab === "teams"}
            title="Teams"
          />
          <TwitTab
            onClick={onTabSelect}
            id="followers"
            active={tab === "followers"}
            title="Followers"
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
  const { leagueName } = context.params;
  let leagueData = await Leagues.findOne(leagueName);

  leagueData = JSON.parse(JSON.stringify(leagueData));

  return {
    revalidate: 1,
    props: {
      leagueData,
    },
  };
}

export default LeagueResources;
