import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import useSWR from "swr";

import backend from "../../../lib/backend";
import InfiniteList from "../../../components/InfiniteList";
import AuthBanner from "../../../components/AuthBanner";
import useUser from "../../../lib/useUser";
import TeamProfile from "../../../components/TeamProfile";
import Post from "../../../components/Post";
import TwitTab from "../../../components/TwitTab";
import TwitTabs from "../../../components/TwitTabs";
import Empty from "../../../components/Empty";
import { createPost, getTeamPosts } from "../../../actions";
import { getSeasonString } from "../../../lib/twit-helpers";
import TopBar from "../../../components/TopBar";
import teamStyle from "../../../sass/pages/Team.module.scss";
import LeftColumn from "../../../components/LeftColumn";
import RightColumn from "../../../components/RightColumn";
import StandingsCard from "../../../components/StandingsCard";
import Teams from "../../../db/repos/Teams";
import Leagues from "../../../db/repos/Leagues";
import EditTeamPopup from "../../../components/modals/EditTeamPopup";
import TwitSpinner from "../../../components/TwitSpinner";
import PopupCompose from "../../../components/modals/PopupCompose";
import EditEventsPopup from "../../../components/modals/EditEventsPopup";
import ScoutPopup from "../../../components/modals/ScoutPopup";
import ScoresCard from "../../../components/ScoresCard";
import Menu from "../../../components/Menu";
import MenuItem from "../../../components/MenuItem";

function Team({ teamData, standings }) {
  const router = useRouter();
  const { isFallback, isReady } = router;

  const { user } = useUser();
  const [tab, setTab] = useState("mentions");
  const [events, setEvents] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [posts, setPosts] = useState(null);
  const [showEditTeamPopup, setShowEditTeamPopup] = useState(false);
  const [showScoutPopup, setShowScoutPopup] = useState(false);
  const [showEditEventsPopup, setShowEditEventsPopup] = useState(false);
  const [showPopupCompose, setShowPopupCompose] = useState(false);
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
        userId: user.id,
      },
    });

    return response.data;
  };

  const { data: team } = useSWR(
    teamData && user ? `/api/teams/${teamData.abbrev.substring(1)}` : null,
    fetcher,
    { initialData: teamData, revalidateOnMount: true, revalidateOnFocus: false }
  );

  function getData(startIndex, stopIndex) {
    return getTeamPosts({
      abbrev: team.abbrev.substring(1),
      filter: tab,
      userId: user.id,
      startIndex,
      stopIndex,
    });
  }

  function updatePosts(post) {
    let newPosts = [...posts];
    let index = newPosts.findIndex((newPost) => newPost.id === post.id);
    newPosts[index] = post;
    setPosts(newPosts);
  }

  async function onPostSubmit(values) {
    try {
      const post = await createPost(values, user.id);
      setPosts((prevArray) => [post, ...prevArray]);
      return post;
    } catch (error) {
      console.log(error);
    }
  }

  function renderEmpty() {
    switch (tab) {
      case "mentions":
        return (
          <Empty
            main="No mentions"
            sub="No posts mentioning this team"
            onActionClick={() => setShowPopupCompose(true)}
            actionText="Be the first"
          />
        );
      case "media":
        return (
          <Empty
            main="No media"
            sub="Nothing showcasing this team"
            onActionClick={() => setShowPopupCompose(true)}
            actionText="Be the first"
          />
        );

      default:
        return null;
    }
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

  function renderMenu() {
    if (!user) {
      return null;
    }
    if (user.id === team.owner_id) {
      return (
        <Menu>
          <MenuItem onClick={() => setShowEditTeamPopup(true)}>
            Profile
          </MenuItem>
          <MenuItem onClick={editRoster}>Add players</MenuItem>
          <MenuItem onClick={editEvents}>Schedule event</MenuItem>
        </Menu>
      );
    } else {
      return null;
    }
  }

  function onTabSelect(event) {
    const { id } = event.target;
    setTab(id);
  }

  function editRoster() {
    if (user.id === team.owner_id) {
      setShowScoutPopup(true);
    }
  }

  function editEvents() {
    if (user.id === team.owner_id) {
      setShowEditEventsPopup(true);
    }
  }

  if (isFallback) {
    return <TwitSpinner size={50} />;
  }

  return (
    <React.Fragment>
      <div className="twit-container">
        <header className="header">
          <LeftColumn
            setShowPopupCompose={setShowPopupCompose}
            initialValue={team.abbrev}
            onSubmit={onPostSubmit}
          />
        </header>
        <main className="main">
          <TopBar
            main={`${team.abbrev}`}
            sub="Team"
            menu={renderMenu()}
          ></TopBar>
          <TeamProfile
            team={team}
            onAvatarClick={() => setShowEditTeamPopup(true)}
            standings={standings}
          />
          <TwitTabs>
            <TwitTab
              onClick={onTabSelect}
              id={"mentions"}
              active={tab === "mentions"}
              title="Mentions"
            />
            <TwitTab
              onClick={onTabSelect}
              id={"media"}
              active={tab === "media"}
              title="Media"
            />
          </TwitTabs>
          {renderPosts()}
        </main>
        <div className="right-bar">
          <RightColumn>
            <ScoresCard
              seasonId={team.current_season ? team.current_season.id : null}
            />
            <StandingsCard
              standings={standings}
              league={team.league}
              title="Standings"
            />
          </RightColumn>
        </div>
      </div>
      <AuthBanner />
      <PopupCompose
        show={showPopupCompose}
        onHide={() => setShowPopupCompose(false)}
        initialValue={team.abbrev}
        onSubmit={onPostSubmit}
        user={user}
      />
      <EditTeamPopup
        show={showEditTeamPopup}
        onHide={() => setShowEditTeamPopup(false)}
        team={team}
      />
      <ScoutPopup
        show={showScoutPopup}
        team={team}
        onHide={() => setShowScoutPopup(false)}
      />
      <EditEventsPopup
        show={showEditEventsPopup}
        homeTeam={team}
        awayTeam={null}
        league={team.league}
        onHide={() => setShowEditEventsPopup(false)}
      />
    </React.Fragment>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  const { abbrev } = context.params;

  let teamData;
  let standings = null;

  teamData = await Teams.findOne(`$${abbrev}`, null);
  teamData = JSON.parse(JSON.stringify(teamData));

  if (teamData.league) {
    standings = await Leagues.currentSeasonStandings(
      teamData.league.league_name,
      null
    );
    standings = JSON.parse(JSON.stringify(standings));
  }
  return {
    revalidate: 1,
    props: {
      teamData,
      standings,
    },
  };
}

export default Team;
