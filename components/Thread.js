import React, {useEffect} from "react";
import {connect} from "react-redux";

import thread from "../sass/components/Thread.module.scss";
import TopBar from "./TopBar";
import Post from "./Post";
import {fetchThreadPosts} from "../actions";

function Thread(props) {
    
    useEffect(() => {
        props.fetchThreadPosts(props.postId);
    }, [])

   const renderPosts = () => {
        return props.posts.map((post, index) => {
            return <Post key={index} post={post}/>
        })
   }
        return (
            <div className={thread["thread"]}>
                <TopBar main="Thread"/>
                <div className={thread["thread__holder"]}>
                    {renderPosts()}
                </div>
            </div>
        );
    }

const mapStateToProps = (state) => {
    return {posts: state.posts}
}

export default connect(mapStateToProps, {fetchThreadPosts})(Thread);