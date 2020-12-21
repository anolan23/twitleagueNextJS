import React from "react";
import Link from "next/link";

import myTeams from "../sass/components/MyTeams.module.scss";
import TwitButton from "./TwitButton";
import TopBar from "./TopBar";
import MyTeam from "./MyTeam";

function MyLeagues(){
    return (
        <div className={myTeams["my-teams"]}>
            <TopBar main="My Leagues"/>
            <div className="u-empty">You are not associated with any teams</div>
            <MyTeam/>
            <MyTeam/>
            <MyTeam/>
            <TwitButton href="/create/team" square>Create new team</TwitButton>
            <TwitButton href="/create/team" square outline="twit-button--primary--outline">Join an existing team</TwitButton>
        </div>
    )
}

export default MyLeagues;