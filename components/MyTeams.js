import React from "react";
import {connect} from "react-redux";

import myTeams from "../sass/components/MyTeams.module.scss";
import TwitButton from "./TwitButton";
import TopBar from "./TopBar";
import TwitItem from "./TwitItem";

function MyTeams(props){

    const renderTeams = () => {
        if(props.teams.length > 0){
            return props.teams.map((team, index) => {
                return (
                    <TwitItem 
                        key={index}
                        avatar={team.avatar}
                        title={`${team.team_name}`}
                        subtitle={`${team.abbrev} · ${team.league_name?team.league_name:"awaiting league approval"}`}
                        href={`/teams/${team.abbrev.substring(1)}`}
                        actionText="View"
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