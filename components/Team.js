import React, {useEffect} from "react";
import {connect} from "react-redux";

import TeamHolder from "./TeamHolder";
import FeedHolder from "./FeedHolder";
import TwitInput from "./TwitInput";
import {createPost, fetchUser} from "../actions";

function TeamComponent(props) {

    useEffect(() => {
        if(!props.user.isSignedIn){
            props.fetchUser();
        }
      }, [])
      
    const onTwitInputSubmit = (event) => {
        event.preventDefault();
        props.createPost();
        
    }
        return (
            <div >
                <TeamHolder team={props.team}/>
                <TwitInput 
                    onSubmit={onTwitInputSubmit} 
                    placeHolder={"Share your take on " + props.team.teamAbbrev} 
                    initialValue={props.team.teamAbbrev}
                />
                <FeedHolder posts={props.posts}/>
            </div>
        );
}

const mapStateToProps = (state) => {
    return {user: state.user}
}

export default connect(mapStateToProps, {fetchUser, createPost})(TeamComponent);