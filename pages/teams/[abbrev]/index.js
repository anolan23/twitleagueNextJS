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
import Event from "../../../components/Event";
import TwitSelect from "../../../components/TwitSelect";
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
    const post = await createPost(values, user.id);
    return post;
  }

  async function fetchEventsBySeasonId(seasonId) {
    const events = await backend.get(
      `api/teams/${team.abbrev.substring(1)}/events`,
      {
        params: {
          seasonId: seasonId,
          userId: user.id,
        },
      }
    );
    setEvents(events.data);
  }

  function renderEmpty() {
    switch (tab) {
      case "mentions":
      case "media":
        return (
          <Empty
            main="Empty"
            sub={`${team.abbrev} hasn't been mentioned in a post yet`}
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

  function renderContent() {
    if (tab === "mentions") {
      return null;
    } else if (tab === "schedule") {
      if (!events) {
        return <TwitSpinner size={50} />;
      } else if (events.length === 0) {
        if (user.id === team.owner_id) {
          return (
            <React.Fragment>
              {renderTwitSelect()}
              <Empty
                main="No events"
                sub="Nothing scheduled for the current season"
                actionText="Schedule event"
                onActionClick={() => setShowEditEventsPopup(true)}
              />
            </React.Fragment>
          );
        } else {
          return (
            <React.Fragment>
              {renderTwitSelect()}
              <Empty
                main="No events"
                sub="Nothing scheduled for the current season"
              />
            </React.Fragment>
          );
        }
      } else {
        return (
          <React.Fragment>
            {renderTwitSelect()}
            {renderEvents()}
          </React.Fragment>
        );
      }
    }
  }

  function renderEvents() {
    return events.map((event, index) => {
      return <Event key={index} event={event} teamId={team.id} />;
    });
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
          <MenuItem onClick={() => {}}>Coaches</MenuItem>
          <MenuItem onClick={editEvents}>Schedule event</MenuItem>
        </Menu>
      );
    } else {
      return null;
    }
  }

  function renderTwitSelect() {
    if (!team.seasons) {
      return null;
    } else {
      const options = team.seasons.map((_season) => {
        return {
          ..._season,
          text: getSeasonString(_season, team.seasons),
        };
      });
      return (
        <TwitSelect
          onSelect={fetchEventsBySeasonId}
          options={options}
          defaultValue={getSeasonString(team.current_season, team.seasons)}
        />
      );
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
          <LeftColumn setShowPopupCompose={setShowPopupCompose} />
        </header>
        <main className="main">
          <TopBar
            main={team.team_name}
            sub={`${team.num_posts} Posts`}
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
              id={"schedule"}
              active={tab === "schedule"}
              title="Schedule"
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
        homeTeam={null}
        awayTeam={null}
        league={team.league}
        onHide={() => setShowEditEventsPopup(false)}
      />
      <PopupCompose
        show={showPopupCompose}
        onHide={() => setShowPopupCompose(false)}
        initialValue={team.abbrev}
        onSubmit={onPostSubmit}
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
