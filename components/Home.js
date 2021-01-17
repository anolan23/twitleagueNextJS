import React from "react";
import {connect} from "react-redux";

import TwitInput from "./TwitInput";
import TopBar from "./TopBar";
import Post from "../components/Post";
import {createPost} from "../actions";
import Divide from "./Divide";
import home from "../sass/components/Home.module.scss";
import TwitButton from "./TwitButton";

function Home(props) {

    const renderPosts = () => {
        if(props.posts.length > 0){
            return props.posts.map((post, index) => {
                return (
                  <Post 
                    key={index}
                    post={post}
                    />
                );
              });
        }
        else{
            return (
                <div className={home["home__empty"]}>
                    <h2 className={home["home__empty__main"]}>Welcome to twitleague!</h2>
                    <p className={home["home__empty__sub"]}>
                        This is the best place to see what’s happening in the world of sports. Find some teams and players to follow now.
                    </p>
                    <div className={home["home__empty__action"]}>
                        <TwitButton color="twit-button--primary">Let's go!</TwitButton>
                    </div>
                </div>
            )
        }
        
    }

    const onSubmit = () => {
        props.createPost();
    }

        return (
            <div className={home["home"]}>
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
        posts: state.posts ? state.posts : []
    }
}

export default connect(mapStateToProps, {createPost})(Home);