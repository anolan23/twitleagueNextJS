import React from "react";
import {connect} from "react-redux";

import HomeFeedHolder from "./HomeFeedHolder";
import TwitInput from "./TwitInput";
import TopBar from "./TopBar";

function Home(props) {

        return (
            <div >
                <TopBar main="Home"/>
                <TwitInput 
                    placeHolder="What's happening?" 
                    initialValue=""
                    buttonText="Post"    
                />
                <HomeFeedHolder/>
            </div>
        );
}

const mapStateToProps = (state) => {
    return {
        team: state.team
    }
}

export default connect(mapStateToProps)(Home);