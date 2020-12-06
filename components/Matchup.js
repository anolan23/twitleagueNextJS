import React from "react";
import {connect} from "react-redux";

import Avatar from "./Avatar";
import matchup from "../sass/components/Matchup.module.scss";

function Matchup(props){
    const {homeTeam} = props;
    const {awayTeam} = props;

    return (
        <div className={matchup["matchup"]}>
            <div className={matchup["matchup__team"]}>
                <Avatar className={matchup["matchup__image"]} src={homeTeam ? homeTeam.image : null}/>
                <span className={matchup["matchup__teamname"]}>{homeTeam ? homeTeam.teamAbbrev : null}</span>
            </div>
            <span className="muted heading-1">vs</span>
            <div className={matchup["matchup__team"]}>
                <Avatar className={matchup["matchup__image"]} src={awayTeam ? awayTeam.image : null}/>
                <span className={matchup["matchup__teamname"]}>{awayTeam ? awayTeam.teamAbbrev : null}</span>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        team: {
            teamName: state.team.teamName,
            image: state.team.image
        }
        

}

}

export default connect(mapStateToProps)(Matchup);