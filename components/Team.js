import React from "react";
import {connect} from "react-redux";

import TeamHolder from "./TeamHolder";
import FeedHolder from "./FeedHolder";
import TwitInput from "./TwitInput";
import {fetchTeamAndTeamPosts} from "../actions";
import {createPost} from "../actions";

class Team extends React.Component {

    componentDidMount(){
        const teamId = this.props.match.params.teamId;
        this.props.fetchTeamAndTeamPosts(teamId);
        
    }

    onTwitInputSubmit = (event) => {
        event.preventDefault();
        this.props.createPost();
        
    }

    render(){
        return (
            <div >
                <TeamHolder/>
                <TwitInput 
                    onSubmit={this.onTwitInputSubmit} 
                    placeHolder={"Share your take on " + this.props.team.teamAbbrev} 
                    initialValue={this.props.team.teamAbbrev}
                />
                <FeedHolder/>
            </div>
        );

        
    };
}

const mapStateToProps = (state) => {
    return {team: state.team}
}

export default connect(mapStateToProps, {fetchTeamAndTeamPosts, createPost})(Team);