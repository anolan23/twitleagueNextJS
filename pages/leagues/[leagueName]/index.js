import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import useSWR from "swr";

import leagueStyle from "../../../sass/components/League.module.scss";
import Leagues from "../../../db/repos/Leagues";
import useUser from "../../../lib/useUser";
import { startSeason, endSeason, getLeaguePosts } from "../../../actions";
import TopBar from "../../../components/TopBar";
import backend from "../../../lib/backend";
import Empty from "../../../components/Empty";
import LeagueProfile from "../../../components/LeagueProfile";
import TwitTab from "../../../components/TwitTab";
import TwitTabs from "../../../components/TwitTabs";
import Post from "../../../components/Post";
import LeftColumn from "../../../components/LeftColumn";
import RightColumn from "../../../components/RightColumn";
import StandingsCard from "../../../components/StandingsCard";
import { getSeasonString, groupBy } from "../../../lib/twit-helpers";
import Prompt from "../../../components/modals/Prompt";
import EditLeaguePopup from "../../../components/modals/EditLeaguePopup";
import ScoresCard from "../../../components/ScoresCard";
import Menu from "../../../components/Menu";
import MenuItem from "../../../components/MenuItem";
import InfiniteList from "../../../components/InfiniteList";
import TwitSpinner from "../../../components/TwitSpinner";

function League({ leagueData }) {
  const router = useRouter();
  const { isFallback, isReady } = router;

  const { user } = useUser();
  const [tab, setTab] = useState("mentions");
  const [posts, setPosts] = useState(null);
  const [showStartSeasonPrompt, setShowStartSeasonPrompt] = useState(false);
  const [showEndSeasonPrompt, setShowEndSeasonPrompt] = useState(false);
  const [showEditLeaguePopup, setShowEditLeaguePopup] = useState(false);
  const infiniteLoaderRef = useCallback(
    (ref) => {
      if (!ref) {
        return;
      }

      setPosts(null);
      ref.resetLoadMoreRowsCache();
    },
    [tab]
  );

  const fetcher = async (url) => {
    const response = await backend.get(url, {
      params: {
        seasonId: leagueData.season_id,
      },
    });
    return response.data;
  };

  const { data: league, mutate: mutateLeague } = useSWR(
    leagueData && user ? `/api/leagues/${leagueData.league_name}` : null,
    fetcher,
    {
      initialData: leagueData,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (!league) {
      return;
    }
    setTab("mentions");
  }, [league]);

  if (isFallback) {
    return <TwitSpinner size={50} />;
  }

  const { id, league_name, teams, owner_id, season_id, sport } = league;

  const isReadyToStartSeason = () => {
    if (teams) {
      const assignedToDivisions = teams.every(
        (team) => team.division_id !== null
      );
      return assignedToDivisions;
    } else {
      return false;
    }
  };

  const startNewSeason = async () => {
    const season = await startSeason(id);
    mutateLeague();
    setShowStartSeasonPrompt(false);
  };

  const endCurrentSeason = async () => {
    const season = await endSeason(id);
    mutateLeague();
    setShowEndSeasonPrompt(false);
  };

  const onMentionsSelect = (k) => {
    setTab(k.target.id);
  };

  const onMediaSelect = (k) => {
    setTab(k.target.id);
  };

  const renderContent = () => {
    switch (tab) {
      case "mentions":
        if (posts === null) {
          return;
        } else if (posts.length === 0) {
          return (
            <Empty
              main="No team mentions yet"
              sub="Be the first to make a post mentioning a team within this league"
              actionText="Post now"
            />
          );
        } else {
          return posts.map((post, index) => {
            return <Post key={index} post={post} user={user} />;
          });
        }
      case "media":
        return null;
      default:
        return null;
    }
  };

  function updatePosts(post) {
    let newPosts = [...posts];
    let index = newPosts.findIndex((newPost) => newPost.id === post.id);
    newPosts[index] = post;
    setPosts(newPosts);
  }

  function getData(startIndex, stopIndex) {
    return getLeaguePosts({
      leagueName: league_name,
      filter: tab,
      userId: user.id,
      startIndex,
      stopIndex,
    });
  }

  function renderPosts() {
    if (!user || !isReady) {
      return null;
    }
    return (
      <InfiniteList
        getData={getData}
        list={posts}
        item={itemRenderer}
        updateList={(posts) => setPosts(posts)}
        infiniteLoaderRef={infiniteLoaderRef}
        empty={renderEmpty()}
      />
    );
  }

  function itemRenderer(item) {
    return <Post post={item} update={updatePosts} user={user} />;
  }

  function renderEmpty() {
    switch (tab) {
      case "mentions":
        return (
          <Empty
            main="No mentions"
            sub="Nothing from around the league"
            onActionClick={() => setShowPopupCompose(true)}
            actionText="Be the first"
          />
        );
      case "media":
        return (
          <Empty
            main="No media"
            sub="Nothing from around the league"
            onActionClick={() => setShowPopupCompose(true)}
            actionText="Be the first"
          />
        );

      default:
        return null;
    }
  }

  const renderMenu = () => {
    if (!user) {
      return null;
    }
    if (user.id === owner_id) {
      return (
        <Menu>
          <MenuItem onClick={() => setShowEditLeaguePopup(true)}>
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => router.push(`/leagues/${league_name}/divisions`)}
            disabled={season_id}
          >
            Divisions
          </MenuItem>
          <MenuItem
            onClick={() => setShowStartSeasonPrompt(true)}
            disabled={!isReadyToStartSeason()}
            hide={season_id}
          >
            Start season
          </MenuItem>
          <MenuItem
            onClick={() =>
              router.push({
                pathname: `/leagues/${league_name}/playoffs`,
                query: {
                  seasonId: season_id,
                },
              })
            }
            hide={!season_id}
          >
            Bracket
          </MenuItem>
          <MenuItem
            onClick={() => setShowEndSeasonPrompt(true)}
            disabled={season_id ? false : true}
            hide={season_id ? false : true}
          >
            End season
          </MenuItem>
        </Menu>
      );
    } else {
      return null;
    }
  };

  const renderStartSeasonPrompt = () => {
    if (!showStartSeasonPrompt) {
      return null;
    } else {
      return (
        <Prompt
          show={showStartSeasonPrompt}
          onHide={() => setShowStartSeasonPrompt(false)}
          main="Start season"
          sub={`This will start a new season for ${league_name}`}
          secondaryActionText="Cancel"
          primaryActionText="Continue"
          onSecondaryActionClick={() => setShowStartSeasonPrompt(false)}
          onPrimaryActionClick={startNewSeason}
        />
      );
    }
  };

  const renderEndSeasonPrompt = () => {
    if (!showEndSeasonPrompt) {
      return null;
    } else {
      return (
        <Prompt
          show={showEndSeasonPrompt}
          main="End season"
          sub="Are you sure you want to enter the offseason?"
          secondaryActionText="Cancel"
          primaryActionText="Continue"
          onSecondaryActionClick={() => setShowEndSeasonPrompt(false)}
          onPrimaryActionClick={endCurrentSeason}
        />
      );
    }
  };

  return (
    <React.Fragment>
      <div className="twit-container">
        <header className="header">
          <LeftColumn />
        </header>
        <main className="main">
          <div className={leagueStyle["league"]}>
            <TopBar main={league_name} sub={sport} menu={renderMenu()}></TopBar>
            <LeagueProfile
              league={league}
              onAvatarClick={() => setShowEditLeaguePopup(!showEditLeaguePopup)}
            />
            <TwitTabs>
              <TwitTab
                onClick={onMentionsSelect}
                id={"mentions"}
                active={tab === "mentions" ? true : false}
                title="Mentions"
              />
              <TwitTab
                onClick={onMediaSelect}
                id={"media"}
                active={tab === "media" ? true : false}
                title="Media"
              />
            </TwitTabs>
            {renderPosts()}
          </div>
        </main>
        <div className="right-bar">
          <RightColumn>
            <ScoresCard seasonId={season_id} />
            <StandingsCard league={league} title="Standings" />
          </RightColumn>
        </div>
      </div>
      <EditLeaguePopup
        show={showEditLeaguePopup}
        onHide={() => setShowEditLeaguePopup(false)}
        league={league}
      />
      {renderStartSeasonPrompt()}
      {renderEndSeasonPrompt()}
    </React.Fragment>
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

export default League;
