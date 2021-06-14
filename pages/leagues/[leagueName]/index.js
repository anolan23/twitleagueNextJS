import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import useSWR from "swr";

import leagueStyle from "../../../sass/components/League.module.scss";
import {
  fetchLeague,
  fetchLeaguePosts,
  clearPosts,
  setLeague,
  toggleEditDivisionsPopup,
} from "../../../actions";
import Leagues from "../../../db/repos/Leagues";
import useUser from "../../../lib/useUser";
import TopBar from "../../../components/TopBar";
import backend from "../../../lib/backend";
import TwitDropdownButton from "../../../components/TwitDropdownButton";
import TwitDropdownItem from "../../../components/TwitDropdownItem";
import Divide from "../../../components/Divide";
import Empty from "../../../components/Empty";
import LeagueProfile from "../../../components/LeagueProfile";
import TwitTab from "../../../components/TwitTab";
import TwitTabs from "../../../components/TwitTabs";
import Post from "../../../components/Post";
import LeftColumn from "../../../components/LeftColumn";
import RightColumn from "../../../components/RightColumn";
import StandingsCard from "../../../components/StandingsCard";
import { getSeasonString, groupBy } from "../../../lib/twit-helpers";
import StandingsDivision from "../../../components/StandingsDivision";
import Prompt from "../../../components/modals/Prompt";
import EditLeaguePopup from "../../../components/modals/EditLeaguePopup";
import EditDivisionsPopup from "../../../components/modals/EditDivisionsPopup";

function League({ leagueData, standingsData, toggleEditDivisionsPopup }) {
  const router = useRouter();
  const { user } = useUser();
  const [tab, setTab] = useState("mentions");
  const [posts, setPosts] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [showStartSeasonPrompt, setShowStartSeasonPrompt] = useState(false);
  const [showEndSeasonPrompt, setShowEndSeasonPrompt] = useState(false);
  const [showEditLeaguePopup, setShowEditLeaguePopup] = useState(false);
  const [showEditDivisionsPopup, setShowEditDivisionsPopup] = useState(false);

  const fetcher = async (url) => {
    const response = await backend.get(url);
    return response.data;
  };

  const { data: league, mutate: mutateLeague } = useSWR(
    leagueData && user ? `/api/leagues/${leagueData.league_name}` : null,
    fetcher,
    { initialData: leagueData, revalidateOnMount: true }
  );

  const { data: standings } = useSWR(
    leagueData ? `/api/leagues/${leagueData.league_name}/standings` : null,
    fetcher,
    { initialData: standingsData, revalidateOnMount: true }
  );

  useEffect(() => {
    if (!league) {
      return;
    }
    setTab("mentions");
  }, [league]);

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

  const onMentionsSelect = (k) => {
    setTab(k.target.id);
  };

  const onStandingSelect = (k) => {
    setTab(k.target.id);
  };

  const onMediaSelect = (k) => {
    setTab(k.target.id);
  };

  const renderDivisions = () => {
    if (!standings) {
      return null;
    } else if (standings.length === 0) {
      return (
        <Empty
          main="No standings"
          sub={`${league.league_name} must have teams assigned to divisions`}
        />
      );
    } else {
      return standings.map((division, index) => {
        return (
          <StandingsDivision
            key={index}
            division={division}
            onTeamClick={() => {}}
          />
        );
      });
    }
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
          <TwitDropdownItem onClick={() => setShowEditDivisionsPopup(true)}>
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
          onHide={() => setShowStartSeasonPrompt(false)}
          main="New season"
          sub={`This will start a new season for ${league.league_name}`}
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
                active={tab === "mentions" ? true : false}
                title="Mentions"
              />
              <TwitTab
                onClick={onStandingSelect}
                id={"standings"}
                active={tab === "standings" ? true : false}
                title="Standings"
              />
              <TwitTab
                onClick={onMediaSelect}
                id={"media"}
                active={tab === "media" ? true : false}
                title="Media"
              />
            </TwitTabs>
            {renderContent()}
          </div>
        </main>
        <div className="right-bar">
          <RightColumn>
            <StandingsCard
              standings={standings}
              league={league}
              title={
                league.current_season
                  ? getSeasonString(league.current_season, league.seasons)
                  : "Standings"
              }
            />
          </RightColumn>
        </div>
      </div>
      <EditLeaguePopup
        show={showEditLeaguePopup}
        onHide={() => setShowEditLeaguePopup(false)}
        league={league}
      />
      <EditDivisionsPopup
        show={showEditDivisionsPopup}
        onHide={() => setShowEditDivisionsPopup(false)}
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
  let leagueData = await Leagues.findOne(leagueName);
  leagueData = JSON.parse(JSON.stringify(leagueData));

  let standingsData = await Leagues.currentSeasonStandings(leagueName);
  standingsData = JSON.parse(JSON.stringify(standingsData));

  return {
    revalidate: 1,
    props: {
      leagueData,
      standingsData,
    },
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
