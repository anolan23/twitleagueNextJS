import React from "react";
import {connect} from "react-redux";

import HomeFeedHolder from "./HomeFeedHolder";
import TwitInput from "./TwitInput";
import {createPost} from "../actions";
import TopBar from "./TopBar";

function Home(props) {

    const onTwitInputSubmit = (event) => {
        event.preventDefault();
        props.createPost();
    }

        return (
            <div >
                <TopBar main="Home"/>
                <TwitInput onSubmit={onTwitInputSubmit} placeHolder="What's your take?"/>
                <HomeFeedHolder/>
            </div>
        );
}

const mapStateToProps = (state) => {
    return {
        team: state.team
    }
}

export default connect(mapStateToProps, {createPost})(Home);