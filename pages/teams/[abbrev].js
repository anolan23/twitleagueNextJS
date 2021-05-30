import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { connect } from "react-redux";
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
import {
  setTeam,
  createPost,
  getTeamPosts,
  fetchLeaguePosts,
  toggleEditRosterPopup,
  toggleEditEventsPopup,
  toggleEditTeamPopup,
  findSeasonsByLeagueName,
  fetchRoster,
} from "../../actions";
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
import EditTeamPopup from "../../components/modals/EditTeamPopup";
import TwitSpinner from "../../components/TwitSpinner";
import TwitDate from "../../lib/twit-date";

function Team(props) {
  const { query, isFallback } = useRouter();

  const { user } = useUser();

  const [tab, setTab] = useState("team");
  const [roster, setRoster] = useState(null);
  const [events, setEvents] = useState(null);
  const [seasons, setSeasons] = useState(null);
  const [season, setSeason] = useState(null);
  const [posts, setPosts] = useState(null);
  const [showEditTeamPopup, setShowEditTeamPopup] = useState(false);

  const postsLoaderRef = useRef(null);

  const getTeam = async (url) => {
    const response = await backend.get(url, {
      params: {
        userId: user.id,
      },
    });

    return response.data;
  };

  const { data: team } = useSWR(
    props.team && user ? `/api/teams/${props.team.abbrev.substring(1)}` : null,
    getTeam,
    { initialData: props.team, revalidateOnMount: true }
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

  useEffect(() => {
    if (!team) {
      return;
    }
    fetchSeasons();
  }, [team]);

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

  const fetchSeasons = async () => {
    let seasons = await findSeasonsByLeagueName(team.league_name);
    setSeasons(seasons);
  };

  const renderEmptyPosts = () => {
    return (
      <Empty
        main="No mentions"
        sub={`${team.abbrev} hasn't been mentioned in a post yet`}
      />
    );
  };

  const renderContent = () => {
    if (tab === "mentions") {
      return (
        <InfiniteList
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
          <Post />
        </InfiniteList>
      );
    } else if (tab === "roster") {
      if (!roster) {
        return null;
      } else if (roster.length === 0) {
        if (user.id === team.owner_id) {
          return (
            <Empty
              main="No players"
              sub="There are no players on this team"
              actionText="Edit Roster"
              onActionClick={props.toggleEditRosterPopup}
            />
          );
        } else {
          return (
            <Empty main="No players" sub="There are no players on this team" />
          );
        }
      } else {
        return roster.map((player, index) => {
          return (
            <TwitItem
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
        return <TwitSpinner />;
      } else if (events.length === 0) {
        if (user.id === team.owner_id) {
          return (
            <React.Fragment>
              {renderTwitSelect()}
              <Empty
                main="No events"
                sub="Nothing scheduled for the current season"
                actionText="Create event"
                onActionClick={props.toggleEditEventsPopup}
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
          <TwitDropdownItem onClick={editEvents}>Create event</TwitDropdownItem>
        </TwitDropdownButton>
      );
    } else {
      return null;
    }
  };

  const renderTwitSelect = () => {
    const options = seasons.map((_season) => {
      return {
        ..._season,
        text: `${TwitDate.getYear(season.created_at)} Season - ${
          _season.season
        }`,
      };
    });
    if (!season) {
      return null;
    } else {
      return (
        <TwitSelect
          onSelect={fetchEventsBySeasonId}
          options={options}
          defaultValue={`${TwitDate.getYear(season.created_at)} Season - ${
            season.season
          }`}
        />
      );
    }
  };

  const onTeamSelect = (k) => {
    setTab(k.target.id);
  };

  const onRosterSelect = async (k) => {
    setTab(k.target.id);
    const roster = await fetchRoster(query.abbrev);
    setRoster(roster);
  };

  const onScheduleClick = (k) => {
    setTab(k.target.id);
    setSeason(seasons[seasons.length - 1]);
    fetchEventsBySeasonId(team.season_id);
  };

  const editTeam = () => {
    if (user.id === team.owner_id) {
      props.toggleEditTeamPopup();
    }
  };

  const editRoster = () => {
    if (user.id === team.owner_id) {
      props.toggleEditRosterPopup();
    }
  };

  const editEvents = () => {
    if (user.id === team.owner_id) {
      props.toggleEditEventsPopup();
    }
  };

  if (isFallback) {
    return <TwitSpinner />;
  }

  return (
    <React.Fragment>
      <div className="twit-container">
        <header className="header">
          <LeftColumn />
        </header>
        <main className="main">
          <TopBar main={team.team_name} sub={`${team.num_posts} Posts`}>
            {renderButton()}
          </TopBar>
          <TeamProfile
            team={team}
            onAvatarClick={() => setShowEditTeamPopup(true)}
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
            <StandingsCard league={{ league_name: team.league_name }} />
          </RightColumn>
        </div>
      </div>
      <AuthBanner />
      <EditTeamPopup
        show={showEditTeamPopup}
        onHide={() => setShowEditTeamPopup(false)}
        team={team}
      />
    </React.Fragment>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  let team = await Teams.findOne(`$${context.params.abbrev}`, null);
  team = JSON.parse(JSON.stringify(team));

  return {
    revalidate: 1,
    props: {
      team,
    },
  };
}

const mapStateToProps = (state) => {
  return {
    posts: state.posts ? state.posts : null,
  };
};

export default connect(mapStateToProps, {
  setTeam,
  createPost,
  fetchLeaguePosts,
  toggleEditRosterPopup,
  toggleEditTeamPopup,
  toggleEditEventsPopup,
})(Team);
