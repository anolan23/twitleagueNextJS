import React from "react";
import Link from "next/link";
import {connect} from "react-redux";

import myTeams from "../sass/components/MyTeams.module.scss";
import TwitButton from "./TwitButton";
import TopBar from "./TopBar";
import MyTeam from "./MyTeam";

function MyTeams(props){

    const renderTeams = () => {
        if(props.teams.length > 0){
            return props.teams.map((team, index) => {
                return (
                    <MyTeam 
                        key={index} 
                        avatar={team.avatar}
                        teamName={team.team_name}
                        leagueName={team.league_id}
                        abbrev={team.abbrev}
                    />
                )
            })
        }
        else{
            return <div className="u-empty">You are not associated with any teams</div>
        }
    }

    return (
        <div className={myTeams["my-teams"]}>
            <TopBar main="My Teams"/>
            {renderTeams()}
            <TwitButton href="/create/team" square>Create new team</TwitButton>
            <TwitButton href="/create/team" square outline="twit-button--primary--outline">Join an existing team</TwitButton>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {teams: state.user.teams? state.user.teams : []}
}

export default connect(mapStateToProps)(MyTeams);