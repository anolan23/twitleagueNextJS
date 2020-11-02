import React from "react";
import {connect} from "react-redux";

import {fetchLeague} from "../actions";
import LeagueHolder from "./LeagueHolder";
import TwitItem from "./TwitItem";

class League extends React.Component {

    componentDidMount(){
        const leagueId = this.props.match.params.leagueId;
        console.log(leagueId);
        // this.props.fetchLeagueAndLeagueTeams(leagueId);
        this.props.fetchLeague(leagueId);
    }

    renderTeams = () => {
        if(this.props.teams)
        {
            return this.props.teams.map((team, index) => {
                return <TwitItem key={index} title={team.teamAbbrev} subtitle={team.teamName}/>
            });
        }
        else{
            return null;
        }
        
    }

    render(){
        return (
            <React.Fragment>
                <LeagueHolder/>
                {this.renderTeams()}
            </React.Fragment> 
        );
    };
}

const mapStateToProps = (state) => {
    return {
        teams: state.league.teams
    }
}

export default connect(mapStateToProps, {fetchLeague})(League);