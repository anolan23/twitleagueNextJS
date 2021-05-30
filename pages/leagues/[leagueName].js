import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import useSWR from "swr";

import leagueStyle from "../../sass/components/League.module.scss";
import {
  fetchLeague,
  fetchLeaguePosts,
  clearPosts,
  setLeague,
  toggleEditDivisionsPopup,
} from "../../actions";
import useUser from "../../lib/useUser";
import TopBar from "../../components/TopBar";
import backend from "../../lib/backend";
import TwitStat from "../../components/TwitStat";
import TwitDropdownButton from "../../components/TwitDropdownButton";
import TwitDropdownItem from "../../components/TwitDropdownItem";
import TwitButton from "../../components/TwitButton";
import Division from "../../components/Division";
import Divide from "../../components/Divide";
import Empty from "../../components/Empty";
import LeagueProfile from "../../components/LeagueProfile";
import TwitTab from "../../components/TwitTab";
import TwitTabs from "../../components/TwitTabs";
import Post from "../../components/Post";
import LeftColumn from "../../components/LeftColumn";
import RightColumn from "../../components/RightColumn";
import StandingsCard from "../../components/StandingsCard";
import { groupBy } from "../../lib/twit-helpers";
import StandingsDivision from "../../components/StandingsDivision";
import Prompt from "../../components/modals/Prompt";
import EditLeaguePopup from "../../components/modals/EditLeaguePopup";

function League(props) {
  const router = useRouter();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("mentions");
  const [divisions, setDivisions] = useState([]);
  const [division, setDivision] = useState({});
  const [showStartSeasonPrompt, setShowStartSeasonPrompt] = useState(false);
  const [showEndSeasonPrompt, setShowEndSeasonPrompt] = useState(false);
  const [showEditLeaguePopup, setShowEditLeaguePopup] = useState(false);
  const [mode, setMode] = useState("default");

  const getLeague = async (url) => {
    const league = await backend.get(url);
    return league.data;
  };

  const { data: league, mutate: mutateLeague } = useSWR(
    props.league && user ? `/api/leagues/${props.league.league_name}` : null,
    getLeague,
    { initialData: props.league, revalidateOnMount: true }
  );

  useEffect(() => {
    if (!props.league) {
      return;
    }
    props.setLeague(props.league);
    setActiveTab("mentions");
    props.fetchLeaguePosts(props.league.id);
    getStandings();

    return () => {
      props.clearPosts();
    };
  }, [props.league]);

  useEffect(() => {
    if (!league) {
      return;
    }
    props.setLeague(league);
  }, [league]);

  const getStandings = async () => {
    const response = await backend.get(
      `/api/leagues/${props.league.league_name}/standings`
    );
    setDivisions(response.data);
  };

  const newSeason = async () => {
    const season = await backend.post("/api/seasons", {
      leagueId: league.id,
    });
    mutateLeague();
    setShowStartSeasonPrompt(false);
  };

  const endSeason = async () => {
    const season = await backend.patch("/api/seasons", {
      leagueId: league.id,
    });
    mutateLeague();
    setShowEndSeasonPrompt(false);
  };

  const addTeams = (division) => {
    setDivision(division);
    setMode("addTeams");
  };

  const removeTeams = (division) => {
    setDivision(division);
    setMode("removeTeams");
  };

  const editName = (division) => {
    setDivision(division);
    setMode("editDivisionName");
  };

  const updateDivisions = (newDivision) => {
    const divisionIndex = divisions.findIndex(
      (_division) => _division.id === division.id
    );
    let newDivisions = [...divisions];
    newDivisions[divisionIndex] = newDivision;
    setDivision(newDivision);
    setDivisions(newDivisions);
  };

  const onMentionsSelect = (k) => {
    setActiveTab(k.target.id);
    // props.fetchLeaguePosts(league.id);
  };

  const onStandingSelect = (k) => {
    setActiveTab(k.target.id);
  };

  const onMediaSelect = (k) => {
    setActiveTab(k.target.id);
  };

  const renderDivisions = () => {
    if (!divisions) {
      return null;
    } else if (divisions.length === 0) {
      return null;
    } else {
      return divisions.map((division, index) => {
        return <StandingsDivision key={index} division={division.division} />;
      });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "mentions":
        if (props.posts === null) {
          return;
        } else if (props.posts.length === 0) {
          return (
            <Empty
              main="No team mentions yet"
              sub="Be the first to make a post mentioning a team within this league"
              actionText="Post now"
            />
          );
        } else {
          return props.posts.map((post, index) => {
            return <Post key={index} post={post} />;
          });
        }
      case "standings":
        return (
          <React.Fragment>
            <Divide />
            {renderDivisions()}
          </React.Fragment>
        );
      case "media":
        return null;
      default:
        return null;
    }
  };

  const renderManageLeagueButon = () => {
    if (!user) {
      return null;
    }
    if (user.id === league.owner_id) {
      return (
        <TwitDropdownButton actionText="Manage league" color="primary">
          <TwitDropdownItem onClick={() => setShowEditLeaguePopup(true)}>
            Edit profile
          </TwitDropdownItem>
          <TwitDropdownItem onClick={props.toggleEditDivisionsPopup}>
            Edit divisions
          </TwitDropdownItem>
          <TwitDropdownItem
            onClick={() => setShowStartSeasonPrompt(true)}
            disabled={league.season_id ? true : false}
          >
            Start new season
          </TwitDropdownItem>
          <TwitDropdownItem
            onClick={() => setShowEndSeasonPrompt(true)}
            disabled={league.season_id ? false : true}
          >
            End current season
          </TwitDropdownItem>
        </TwitDropdownButton>
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
          main="New season"
          sub="This will start a new season for your league"
          secondaryActionText="Cancel"
          primaryActionText="Continue"
          onSecondaryActionClick={() => setShowStartSeasonPrompt(false)}
          onPrimaryActionClick={newSeason}
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
          onPrimaryActionClick={endSeason}
        />
      );
    }
  };

  if (router.isFallback) {
    return <div>Loading League...</div>;
  }

  return (
    <React.Fragment>
      <div className="twit-container">
        <header className="header">
          <LeftColumn />
        </header>
        <main className="main">
          <div className={leagueStyle["league"]}>
            <TopBar main={league.league_name}>
              {renderManageLeagueButon()}
            </TopBar>
            <LeagueProfile
              league={league}
              onAvatarClick={() => setShowEditLeaguePopup(!showEditLeaguePopup)}
            />
            <TwitTabs>
              <TwitTab
                onClick={onMentionsSelect}
                id={"mentions"}
                active={activeTab === "mentions" ? true : false}
                title="Mentions"
              />
              <TwitTab
                onClick={onStandingSelect}
                id={"standings"}
                active={activeTab === "standings" ? true : false}
                title="Standings"
              />
              <TwitTab
                onClick={onMediaSelect}
                id={"media"}
                active={activeTab === "media" ? true : false}
                title="Media"
              />
            </TwitTabs>
            {renderContent()}
          </div>
        </main>
        <div className="right-bar">
          <RightColumn>
            <StandingsCard league={league} />
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
  const leagueName = context.params.leagueName;
  const league = await fetchLeague(leagueName);

  return {
    revalidate: 1,
    props: {
      league,
    }, // will be passed to the page component as props
  };
}

const mapStateToProps = (state) => {
  return {
    posts: state.posts,
  };
};

export default connect(mapStateToProps, {
  setLeague,
  fetchLeaguePosts,
  clearPosts,
  toggleEditDivisionsPopup,
})(League);
