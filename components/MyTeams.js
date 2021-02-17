import React, { useState, useEffect } from "react";
import {connect} from "react-redux";

import myTeams from "../sass/components/MyTeams.module.scss";
import TwitButton from "./TwitButton";
import TopBar from "./TopBar";
import TwitItem from "./TwitItem";
import Empty from "./Empty";
import {fetchUserTeams} from "../actions";

function MyTeams(props){

    const [teams , setTeams] = useState(null);

    
    useEffect(() => {
        start();
    }, []);

    const start = async () => {
        let teams =  await fetchUserTeams(props.userId);
        setTeams(teams)
    }
    console.log(teams)

    const renderTeams = () => {
        if(!teams){
            return <div>Loading teams</div>
        }
        else if (teams.length === 0){
            return <Empty main="No teams" sub="The teams that you create will go here"/>
        }
        else{
            return teams.map((team, index) => {
                return (
                    <TwitItem 
                        key={index}
                        avatar={team.avatar}
                        title={`${team.team_name}`}
                        subtitle={`${team.abbrev} · ${team.league_name?team.league_name:"awaiting league approval"}`}
                        href={`/teams/${team.abbrev.substring(1)}`}
                    />
                ) 
            })      
        }
    }

    return (
        <div className={myTeams["my-teams"]}>
            <TopBar main="My Teams">
                <TwitButton href="/create/team" color="twit-button--primary">Create team</TwitButton>
            </TopBar>
            {renderTeams()}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        userId: state.user.id
    }
}

export default connect(mapStateToProps)(MyTeams);