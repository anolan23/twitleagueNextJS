import React from "react";
import {connect} from "react-redux";

import TwitInput from "./TwitInput";
import TopBar from "./TopBar";
import Post from "../components/Post";
import {createPost} from "../actions";
import Divide from "./Divide";
import home from "../sass/components/Home.module.scss";
import TwitButton from "./TwitButton";
import EmptyPosts from "./EmptyPosts";

function Home(props) {

    let empty = true;

    const renderPosts = () => {
        if(props.posts === null){
            return;
        }
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
    
        else if(props.posts.length === 0){
            return (
                <EmptyPosts
                    main="Welcome to twitleague!"
                    sub="This is the best place to see what’s happening in sports. Find some teams and players to follow."
                    actionText="Let's go!"
                />
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
        posts: state.posts ? state.posts : null
    }
}

export default connect(mapStateToProps, {createPost})(Home);