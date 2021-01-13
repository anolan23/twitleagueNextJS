import React from "react";
import {connect} from "react-redux";

import TwitInput from "./TwitInput";
import TopBar from "./TopBar";
import Post from "../components/Post";
import {createPost} from "../actions";
import Divide from "./Divide";

function Home(props) {

    const renderPosts = () => {
        return props.posts.map((post, index) => {
            return (
              <Post 
                key={index}
                post={post}
                />
            );
          });
    }

    const onSubmit = () => {
        props.createPost();
    }

        return (
            <div >
                <TopBar main="Home"/>
                <TwitInput 
                    placeHolder="What's happening?" 
                    initialValue=""
                    buttonText="Post"
                    onSubmit={onSubmit}    
                />
                <Divide/>
                {renderPosts()}
                
            </div>
        );
}

const mapStateToProps = (state) => {
    return {
        posts: state.posts
    }
}

export default connect(mapStateToProps, {createPost})(Home);