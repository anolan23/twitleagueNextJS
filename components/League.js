import React from "react";

import LeagueHolder from "./LeagueHolder";
import TwitItem from "./TwitItem";

function League({league}) {

    const renderTeams = () => {
        if(league.teams)
        {
            return league.teams.map((team, index) => {
                return <TwitItem key={index} title={team.teamAbbrev} subtitle={team.teamName}/>
            });
        }
        else{
            return null;
        }
        
    }

    return (
        <React.Fragment>
            <LeagueHolder league={league}/>
            {renderTeams()}
        </React.Fragment> 
    );
}

export default League;