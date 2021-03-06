import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import useSWR from "swr";

import backend from "../../lib/backend";
import InfiniteList from "../../components/InfiniteList";
import AuthBanner from "../../components/AuthBanner";
import useUser from "../../lib/useUser";
import TeamProfile from "../../components/TeamProfile";
import Post from "../../components/Post";
import TwitTab from "../../components/TwitTab";
import TwitTabs from "../../components/TwitTabs";
import Empty from "../../components/Empty";
import { createPost, getTeamPosts } from "../../actions";
import { getSeasonString } from "../../lib/twit-helpers";
import TopBar from "../../components/TopBar";
import TwitItem from "../../components/TwitItem";
import team from "../../sass/components/Team.module.scss";
import Event from "../../components/Event";
import TwitDropdownButton from "../../components/TwitDropdownButton";
import TwitDropdownItem from "../../components/TwitDropdownItem";
import TwitSelect from "../../components/TwitSelect";
import LeftColumn from "../../components/LeftColumn";
import RightColumn from "../../components/RightColumn";
import StandingsCard from "../../components/StandingsCard";
import Teams from "../../db/repos/Teams";
import Leagues from "../../db/repos/Leagues";
import EditTeamPopup from "../../components/modals/EditTeamPopup";
import TwitSpinner from "../../components/TwitSpinner";
import PopupCompose from "../../components/modals/PopupCompose";
import EditEventsPopup from "../../components/modals/EditEventsPopup";
import EditRosterPopup from "../../components/modals/EditRosterPopup";

function Team({ teamData, standings }) {
  const { query, isFallback } = useRouter();
  const { user } = useUser();
  const [tab, setTab] = useState("team");
  const [events, setEvents] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [posts, setPosts] = useState(null);
  const [showEditTeamPopup, setShowEditTeamPopup] = useState(false);
  const [showEditRosterPopup, setShowEditRosterPopup] = useState(false);
  const [showEditEventsPopup, setShowEditEventsPopup] = useState(false);
  const [showPopupCompose, setShowPopupCompose] = useState(false);
  const postsLoaderRef = useRef(null);

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
    { initialData: teamData, revalidateOnMount: true }
  );

  useEffect(() => {
    setPosts(null);

    setTab("mentions");

    return () => {
      if (postsLoaderRef.current) {
        postsLoaderRef.current.resetLoadMoreRowsCache();
      }
    };
  }, [query.abbrev]);

  async function onPostSubmit(values) {
    const post = await createPost(values, user.id);
    return post;
  }

  const fetchEventsBySeasonId = async (seasonId) => {
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
  };

  const renderEmptyPosts = () => {
    return (
      <Empty
        main="Empty"
        sub={`${team.abbrev} hasn't been mentioned in a post yet`}
        onActionClick={() => setShowPopupCompose(true)}
        actionText="Be the first"
      />
    );
  };

  const renderContent = () => {
    if (tab === "mentions") {
      return (
        <InfiniteList
          id={query.abbrev}
          getDataFromServer={(startIndex, stopIndex) =>
            getTeamPosts({
              userId: user.id,
              teamId: team.id,
              startIndex,
              stopIndex,
            })
          }
          list={posts}
          updateList={(posts) => setPosts(posts)}
          infiniteLoaderRef={postsLoaderRef}
          empty={renderEmptyPosts()}
        >
          <Post user={user} />
        </InfiniteList>
      );
    } else if (tab === "roster") {
      if (!team) {
        return null;
      } else if (!team.roster || roster.length === 0) {
        if (user.id === team.owner_id) {
          return (
            <Empty
              main="Empty"
              sub="There are no players on this team"
              actionText="Edit roster"
              onActionClick={() => setShowEditRosterPopup(true)}
            />
          );
        } else {
          return <Empty main="Empty" sub="There are no players on this team" />;
        }
      } else {
        return team.roster.map((player, index) => {
          return (
            <TwitItem
              onClick={() => router.push(`/users/${player.username}`)}
              key={index}
              avatar={player.avatar}
              title={player.name}
              subtitle={`@${player.username}`}
              actionText="Scout"
            />
          );
        });
      }
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
  };

  const renderEvents = () => {
    return events.map((event, index) => {
      return <Event key={index} event={event} teamId={team.id} />;
    });
  };

  const renderButton = () => {
    if (!user) {
      return null;
    }
    if (user.id === team.owner_id) {
      return (
        <TwitDropdownButton actionText="Manage team" color="primary">
          <TwitDropdownItem onClick={() => setShowEditTeamPopup(true)}>
            Edit team page
          </TwitDropdownItem>
          <TwitDropdownItem onClick={editRoster}>Edit roster</TwitDropdownItem>
          <TwitDropdownItem onClick={editEvents}>
            Schedule event
          </TwitDropdownItem>
        </TwitDropdownButton>
      );
    } else {
      return null;
    }
  };

  const renderTwitSelect = () => {
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
  };

  const onTeamSelect = (k) => {
    setTab(k.target.id);
  };

  const onRosterSelect = async (k) => {
    setTab(k.target.id);
  };

  const onScheduleClick = (k) => {
    setTab(k.target.id);
    if (!team.seasons) {
      setEvents([]);
      return;
    }
    setSelectedSeason(team.seasons[team.seasons.length - 1]);
    fetchEventsBySeasonId(team.current_season.id);
  };

  const editRoster = () => {
    if (user.id === team.owner_id) {
      setShowEditRosterPopup(true);
    }
  };

  const editEvents = () => {
    if (user.id === team.owner_id) {
      setShowEditEventsPopup(true);
    }
  };

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
          <TopBar main={team.team_name} sub={`${team.num_posts} Posts`}>
            {renderButton()}
          </TopBar>
          <TeamProfile
            team={team}
            onAvatarClick={() => setShowEditTeamPopup(true)}
            standings={standings}
          />
          <TwitTabs>
            <TwitTab
              onClick={onTeamSelect}
              id={"mentions"}
              active={tab === "mentions" ? true : false}
              title="Mentions"
            />
            <TwitTab
              onClick={onScheduleClick}
              id={"schedule"}
              active={tab === "schedule" ? true : false}
              title="Schedule"
            />
            <TwitTab
              onClick={onRosterSelect}
              id={"roster"}
              active={tab === "roster" ? true : false}
              title="Roster"
            />
            <TwitTab
              onClick={(k) => setTab(k.target.id)}
              id={"media"}
              active={tab === "media" ? true : false}
              title="Media"
            />
          </TwitTabs>
          {renderContent()}
        </main>
        <div className="right-bar">
          <RightColumn>
            <StandingsCard
              standings={standings}
              league={team.league}
              title={
                team.current_season
                  ? getSeasonString(team.current_season, team.seasons)
                  : "Standings"
              }
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
      <EditRosterPopup
        show={showEditRosterPopup}
        team={team}
        onHide={() => setShowEditRosterPopup(false)}
      />
      <EditEventsPopup
        show={showEditEventsPopup}
        homeTeam={team}
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
  let teamData;
  let standings = null;

  teamData = await Teams.findOne(`$${context.params.abbrev}`, null);
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
