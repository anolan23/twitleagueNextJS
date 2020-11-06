import React from "react";
import {connect} from "react-redux";

import TeamHolder from "./TeamHolder";
import FeedHolder from "./FeedHolder";
import TwitInput from "./TwitInput";
import {fetchTeamAndTeamPosts} from "../actions";
import {createPost} from "../actions";

function TeamComponent(props) {

    // componentDidMount(){
    //     const teamId = this.props.match.params.teamId;
    //     this.props.fetchTeamAndTeamPosts(teamId);
        
    // }

    const onTwitInputSubmit = (event) => {
        event.preventDefault();
        props.createPost();
        
    }

        return (
            <div >
                <TeamHolder teamData={props.teamData}/>
                <TwitInput 
                    onSubmit={onTwitInputSubmit} 
                    placeHolder={"Share your take on " + props.teamData.teamAbbrev} 
                    initialValue={props.teamData.teamAbbrev}
                />
                <FeedHolder/>
            </div>
        );
}


export default connect(null, {fetchTeamAndTeamPosts, createPost})(TeamComponent);