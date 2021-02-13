import React, {useEffect, useState} from "react";
import { connect } from "react-redux";

import leagueStyle from "../sass/components/League.module.scss";
import {setLeague} from "../actions";
import TopBar from "./TopBar";
import Empty from "./Empty";
import backend from "../lib/backend";
import TwitStat from "./TwitStat";
import TwitDropdownButton from "./TwitDropdownButton";
import TwitDropdownItem from "./TwitDropdownItem";

function League(props) {
    const league = props.league;
    const [teams, setTeams] = useState(null);
    const [divisions, setDivisions] = useState([]);

    useEffect(() => {
        props.setLeague(props.league)
        getTeams();
      }, [props.league])

    const getTeams = async () => {
        const teams = await backend.get("/api/teams", {
            params:{
                leagueId: league.id
            }
        })
        setTeams(teams.data);
    }

    const createDivision = () => {
        let newDivisions = [...divisions, {division_name: ""}];
        setDivisions(newDivisions);
        console.log(divisions)
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
                return (
                       <TwitStat 
                        key={index} 
                        avatar={team.avatar}
                        text={team.team_name} 
                        href={`/teams/${team.abbrev.substring(1)}`}
                        />
                        
                )
            });
        }
        
    }

    const renderDivision = () => {
        if(divisions.length > 0){
            return divisions.map(division => {
                return (
                <div className={leagueStyle["league__division"]}>
                    <span>NFC North</span>
                </div>
                )
            })
        }
    }

    return (
        <div className={leagueStyle["league"]}>
            <TopBar main={league.league_name}>
                <TwitDropdownButton actionText="Manage league">
                    <TwitDropdownItem onClick={createDivision}>Create division</TwitDropdownItem>
                    <TwitDropdownItem>Edit divisions</TwitDropdownItem>
                </TwitDropdownButton>
            </TopBar>
            {renderTeams()}
            {renderDivision()}
        </div> 
    );
}

export default connect(null, {setLeague})(League);