import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import useSWR from "swr";

import leagueStyle from "../../../sass/components/League.module.scss";
import Leagues from "../../../db/repos/Leagues";
import useUser from "../../../lib/useUser";
import { startSeason, endSeason } from "../../../actions";
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
import ScoresCard from "../../../components/ScoresCard";
import Menu from "../../../components/Menu";
import MenuItem from "../../../components/MenuItem";

function League({ leagueData, standingsData }) {
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
    const season = await startSeason(league.id);
    mutateLeague();
    setShowStartSeasonPrompt(false);
  };

  const endCurrentSeason = async () => {
    const season = await endSeason(league.id);
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

  const renderMenu = () => {
    if (!user) {
      return null;
    }
    if (user.id === league.owner_id) {
      return (
        <Menu>
          <MenuItem onClick={() => setShowEditLeaguePopup(true)}>
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => setShowEditDivisionsPopup(true)}
            disabled={league.season_id}
          >
            Divisions
          </MenuItem>
          <MenuItem
            onClick={() => setShowStartSeasonPrompt(true)}
            disabled={league.season_id ? true : false}
          >
            Start season
          </MenuItem>
          <MenuItem
            onClick={() =>
              router.push({
                pathname: `/leagues/${league.league_name}/playoffs`,
                query: {
                  seasonId: league.current_season.id,
                },
              })
            }
          >
            Bracket
          </MenuItem>
          <MenuItem
            onClick={() => setShowEndSeasonPrompt(true)}
            disabled={league.season_id ? false : true}
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
          onPrimaryActionClick={endCurrentSeason}
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
            <TopBar main={league.league_name} menu={renderMenu()}></TopBar>
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
            <ScoresCard seasonId={league.season_id} />
            <StandingsCard
              standings={standings}
              league={league}
              title="Standings"
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
  const { leagueName } = context.params;
  let leagueData = await Leagues.findOne(leagueName);
  let standingsData = await Leagues.standings(leagueName, leagueData.season_id);

  leagueData = JSON.parse(JSON.stringify(leagueData));
  standingsData = JSON.parse(JSON.stringify(standingsData));

  return {
    revalidate: 1,
    props: {
      leagueData,
      standingsData,
    },
  };
}

export default League;
