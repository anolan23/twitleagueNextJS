import React, {useEffect, useState} from "react";
import Head from 'next/head';
import {useRouter} from "next/router";
import { connect } from "react-redux";
import useSWR from "swr";

import MainBody from "../../components/MainBody"
import leagueStyle from "../../sass/components/League.module.scss";
import {fetchLeague, fetchLeaguePosts, clearPosts, setLeague} from "../../actions";
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

function League(props) {
    const router = useRouter()
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState("mentions");
    const [teams, setTeams] = useState(null);
    const [divisions, setDivisions] = useState([]);
    const [division, setDivision] = useState({});
    const [mode, setMode] = useState("default")

    const getLeague = async (url) => {
        const league = await backend.get(url);
        return league.data;
    }

    const { data: league, mutate: mutateLeague } = useSWR(props.league && user ? `/api/leagues/${props.league.league_name}` : null, getLeague, {initialData: props.league, revalidateOnMount:true});

    useEffect(() => {
        if(!props.league){
        return;
        }
        props.setLeague(props.league)
        setActiveTab("mentions");
        props.fetchLeaguePosts(props.league.id);
        getTeams();
        getDivisions();

        return () => {
        props.clearPosts();
    }

    }, [props.league]);

    useEffect(() => {
        if(!league){
        return;
        }
        props.setLeague(league)

    }, [league]);

    const getTeams = async () => {
        const teams = await backend.get(`/api/leagues/${league.league_name}/teams`);
        setTeams(teams.data);
    }

    const getDivisions = async () => {
        const divisions = await backend.get("/api/leagues/divisions", {
            params:{
                leagueId: league.id
            }
        })
        let reformat = divisions.data.map(row => row.division) 
        setDivisions(reformat);
    }

    const onAddButtonClick = (team) => {
        let teams = division.teams?division.teams:[]
        teams.push(team);
        const divisionIndex = divisions.findIndex(_division => _division === division);
        const newDivision = {...division, teams}
        setDivision(newDivision)
        let newDivisions = [...divisions];
        newDivisions[divisionIndex] = newDivision;
        setDivisions(newDivisions);
        backend.patch("/api/teams", {
            teamId: team.id,
            values: {divisionId: division.id}
        })
    }

    const onDropdownItemClick = (fn) => {
        
    }

    const createDivision = async () => {
        const division = await backend.post("/api/leagues/divisions", {
            leagueId: league.id
        })
        let newDivisions = [...divisions, division.data];
        setDivisions(newDivisions);
    }

    const newSeason = async () => {
        const season = await backend.post("/api/seasons", {
            leagueId: league.id
        });
        mutateLeague()
    }

    const endSeason = async () => {
        const season = await backend.patch("/api/seasons", {
            leagueId: league.id
        });
        mutateLeague()
    }

    const addTeams = (division) => {
        setDivision(division);
        setMode("addTeams");
    }

    const removeTeams = (division) => {
        setDivision(division);
        setMode("removeTeams")
    }

    const editName = (division) => {
        setDivision(division);
        setMode("editDivisionName")
    }

    const updateDivisions = (newDivision) => {
        const divisionIndex = divisions.findIndex(_division => _division.id === division.id);
        let newDivisions = [...divisions];
        newDivisions[divisionIndex] = newDivision;
        setDivision(newDivision);
        setDivisions(newDivisions);
    }

    const onMentionsSelect = (k) => {
    setActiveTab(k.target.id);
    // props.fetchLeaguePosts(league.id);
    }

    const onStandingSelect = (k) => {
        setActiveTab(k.target.id);
    }

    const onMediaSelect = (k) => {
        setActiveTab(k.target.id);
    }

    const renderTeamButton = (team) => {
        if(mode === "addTeams"){
            return <TwitButton size="twit-button--primary--small" onClick={() => onAddButtonClick(team)} color="twit-button--primary">Add</TwitButton>

        }
        else{
            return null;
        }
    }

    const renderTeams = () => {
        if(teams === null){
            return;
        }
        else if(teams.length === 0){
            return <Empty main="No teams" sub="This league doesn't have any teams"/>
        }
        else
        {
            return teams.map((team, index) => {
                if(!divisions.some(division => division.teams?division.teams.find(thisTeam => thisTeam.id === team.id):false)){
                    return (
                        <TwitStat 
                        key={index} 
                        avatar={team.avatar}
                        text={team.team_name}
                        href={`/teams/${team.abbrev.substring(1)}`}
                        >
                        {renderTeamButton(team)}
                        </TwitStat>
                        
                ) 
                }
            });
        }
        
    }

    const renderDivisions = () => {
        if(divisions.length > 0){
            return divisions.map((division, index) => {
                return (
                <Division 
                    key={index} 
                    division={division} 
                    addTeams={addTeams} 
                    removeTeams={removeTeams}
                    editName={editName} 
                    updateDivisions={updateDivisions}
                    editable={user.id === league.owner_id}
                />
            
                )
            })
        }
    }

    const renderContent = () => {
    switch (activeTab) {
        case "mentions":
        if(props.posts === null){
            return;
        }
        else if(props.posts.length === 0){
            return (
                <Empty
                    main="No team mentions yet"
                    sub="Be the first to make a post mentioning a team wihtin this league"
                    actionText="Post now"
                    
                />
            )
        }
        else{
            return props.posts.map((post, index) => {
                return (
                    <Post 
                    key={index}
                    post={post}
                    />
                );
            });
        }
        case "standings":
        return (
            <React.Fragment>
            <div className={leagueStyle["league__teams"]}>
                {renderTeams()}
            </div>
            <Divide/>
            {renderDivisions()}
            </React.Fragment>
        )
        case "media":
        return null;
        default:
        return null;
    }
    }

    const renderManageLeagueButon = () => {
        if(!user){
            return null;
        }
        if(user.id === league.owner_id){
            return(
                <TwitDropdownButton actionText="Manage league">
                    <TwitDropdownItem onClick={createDivision}>Create division</TwitDropdownItem>
                    <TwitDropdownItem onClick={newSeason} disabled={league.season_id ? true : false}>Start new season</TwitDropdownItem>
                    <TwitDropdownItem onClick={endSeason} disabled={league.season_id ? false : true}>End current season</TwitDropdownItem>
                </TwitDropdownButton>
            )
        }
        else{
            return null;
        }
    }

    if (router.isFallback) {
    return <div>Loading League...</div>
    }

    return (
        <React.Fragment>
        <MainBody>
            <div className={leagueStyle["league"]}>
                <TopBar main={league.league_name}>
                    {renderManageLeagueButon()}
                </TopBar>
                <LeagueProfile league={league}/>
                <TwitTabs>
                <TwitTab onClick={onMentionsSelect} id={"mentions"} active={activeTab === "mentions" ? true : false} title="Mentions"/>
                <TwitTab onClick={onStandingSelect} id={"standings"} active={activeTab === "standings" ? true : false} title="Standings"/>
                <TwitTab onClick={onMediaSelect} id={"media"} active={activeTab === "media" ? true : false} title="Media"/>
                </TwitTabs> 
                {renderContent()} 
            </div> 
        </MainBody>
        </React.Fragment>
        
    )
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
        league
      } // will be passed to the page component as props
    }  

  }

  const mapStateToProps = (state) => {
    return {
      posts: state.posts
    }
  }

  export default connect(mapStateToProps, {setLeague, fetchLeaguePosts, clearPosts})(League);
