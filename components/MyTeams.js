import React from "react";
import Link from "next/link";

import myTeams from "../sass/components/MyTeams.module.scss";
import TopBar from "./TopBar";
import MyTeam from "./MyTeam";

function MyTeams(){
    return (
        <div className={myTeams["my-teams"]}>
            <TopBar main="My Teams"/>
            <div className="u-empty">You are not associated with any teams</div>
            <MyTeam/>
            <MyTeam/>
            <MyTeam/>
            <Link href="/create/team" passHref><a className={myTeams["my-teams__create"]}>Create new team</a></Link>
            <Link href="/" className={myTeams["my-teams__create"]}>Join an existing team</Link>
        </div>
    )
}

export default MyTeams;