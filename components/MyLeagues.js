import React from "react";
import {connect} from "react-redux";

import myTeams from "../sass/components/MyTeams.module.scss";
import TwitButton from "./TwitButton";
import TopBar from "./TopBar";
import MyLeague from "./MyLeague";

function MyLeagues(props){

    const renderLeagues = () => {
        if(props.leagues.length > 0){
            return props.leagues.map((league, index) => {
                return (
                    <MyLeague 
                        index={index} 
                        leagueName={league.league_name}
                    />
                )
            })
        }
        else{
            return <div className="u-empty">You are not associated with any leagues</div>
        }
    }

    return (
        <div className={myTeams["my-teams"]}>
            <TopBar main="My Leagues"/>
            {renderLeagues()}
            <TwitButton href="/create/league" square>Create new league</TwitButton>
            <TwitButton href="/create/league" square outline="twit-button--primary--outline">Join an existing league</TwitButton>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {leagues: state.user.leagues? state.user.leagues : []}
}

export default connect(mapStateToProps)(MyLeagues);