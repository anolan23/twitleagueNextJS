import React from "react";
import {connect} from "react-redux";

import Avatar from "./Avatar";

function Matchup(props){
    const {homeTeam} = props;
    const {awayTeam} = props
    console.log("homeTeam.teamName", homeTeam ? homeTeam.teamName : null);
    console.log("awayTeam.teamName", awayTeam ? awayTeam.teamName : null);

    return (
        <div className="matchup">
            <div className="twit-team twit-small-text">
            <Avatar rounded className="matchup-avatar" src={homeTeam ? homeTeam.image : null}/>
            <span className="block-span">{homeTeam ? homeTeam.teamName : null}</span>
            </div>
            
            <span className="muted">vs</span>
            
            <div className="twit-team twit-small-text">
            <Avatar rounded className="matchup-avatar" src={awayTeam ? awayTeam.image : null}/>
            <span className="block-span">{awayTeam ? awayTeam.teamName : null}</span>
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