import React, {useEffect, useState} from "react";
import { connect } from "react-redux";

import leagueStyle from "../sass/components/League.module.scss";
import {setLeague} from "../actions";
import TopBar from "./TopBar";
import backend from "../lib/backend";
import TwitStat from "./TwitStat";
import TwitDropdownButton from "./TwitDropdownButton";
import TwitDropdownItem from "./TwitDropdownItem";
import TwitButton from "./TwitButton";
import Division from "./Division";
import Divide from "./Divide";
import Empty from "./Empty";

function League(props) {
    const league = props.league;
    const [teams, setTeams] = useState(null);
    const [divisions, setDivisions] = useState([]);
    const [division, setDivision] = useState({});
    const [mode, setMode] = useState("default")

    useEffect(() => {
        props.setLeague(props.league)
        getTeams();
        getDivisions();
      }, [props.league])

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
        console.log("reformat", reformat);
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

    const createDivision = async () => {
        const division = await backend.post("/api/leagues/divisions", {
            leagueId: league.id
        })
        let newDivisions = [...divisions, division.data];
        setDivisions(newDivisions);
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
                    editable={props.userId === league.owner_id}
                />
            
                )
            })
        }
    }

    const renderManageLeagueButon = () => {
        if(props.userId === league.owner_id){
            return(
                <TwitDropdownButton actionText="Manage league">
                    <TwitDropdownItem onClick={createDivision}>Create division</TwitDropdownItem>
                </TwitDropdownButton>
            )
        }
        else{
            return null;
        }
    }
    
    return (
        <div className={leagueStyle["league"]}>
            <TopBar main={league.league_name}>
                {renderManageLeagueButon()}
            </TopBar>
            <div className={leagueStyle["league__teams"]}>
                {renderTeams()}
            </div>
            <Divide/>
            {renderDivisions()}
            
        </div> 
    );
}

const mapStateToProps = (state) => {
    return {
        userId: state.user.id
    }
}

export default connect(mapStateToProps, {setLeague})(League);