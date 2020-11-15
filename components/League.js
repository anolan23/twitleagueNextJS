import React from "react";
import Link from "next/link";

import LeagueHolder from "./LeagueHolder";
import TwitItem from "./TwitItem";

function League({league}) {

    const renderTeams = () => {
        if(league.teams)
        {
            return league.teams.map((team, index) => {
                return (
                    <Link passHref href={"/team/" + team.teamAbbrev.substring(1)} key={index}>
                       <TwitItem key={index} title={team.teamAbbrev} subtitle={team.teamName}/>
                    </Link>
                )
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