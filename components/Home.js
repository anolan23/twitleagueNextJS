import React from "react";
import {connect} from "react-redux";

import HomeFeedHolder from "./HomeFeedHolder";
import TwitInput from "./TwitInput";
import {createPost} from "../actions";

class Home extends React.Component {

    onTwitInputSubmit = (event) => {
        event.preventDefault();
        this.props.createPost();
    }

    render(){
        return (
            <div >
                <TwitInput onSubmit={this.onTwitInputSubmit} placeHolder={"Share your take on " + this.props.team.teamAbbrev} value={this.props.team.teamAbbrev}/>
                
                <HomeFeedHolder/>
            </div>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        team: state.team
    }
}

export default connect(mapStateToProps, {createPost})(Home);