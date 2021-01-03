import React, {useEffect} from "react";
import {connect} from "react-redux";

import TwitInput from "./TwitInput";
import TopBar from "./TopBar";
import Post from "../components/Post";
import {fetchPosts, clearPosts, createPost} from "../actions";
import Divide from "./Divide";

function Home(props) {

    useEffect(() => {
        props.fetchPosts(10,0);

        return () => {
            props.clearPosts();
        }
      }, [])

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

export default connect(mapStateToProps, {fetchPosts, clearPosts, createPost})(Home);