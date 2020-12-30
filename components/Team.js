import React, {useEffect} from "react";
import {connect} from "react-redux";

import TeamHolder from "./TeamHolder";
import FeedHolder from "./FeedHolder";
import {createPost, fetchUser, fetchTeamPosts, clearPosts} from "../actions";
import TopBar from "./TopBar";

function TeamComponent(props) {

    useEffect(() => {
        props.fetchTeamPosts();
        if(!props.user.isSignedIn){
            props.fetchUser();
        }

        return () => {
            props.clearPosts();
        }
      }, [])
      
    const onTwitInputSubmit = (event) => {
        event.preventDefault();
        props.createPost();
        
    }
        return (
            <div >
                <TopBar main={props.team.team_name} sub="32.5k Twits"/>
                <TeamHolder team={props.team}/>
                <FeedHolder/>
            </div>
        );
}

const mapStateToProps = (state) => {
    return {user: state.user}
}

export default connect(mapStateToProps, {fetchUser, createPost, fetchTeamPosts, clearPosts})(TeamComponent);