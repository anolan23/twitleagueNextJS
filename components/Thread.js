import React, {useEffect} from "react";
import {connect} from "react-redux";

import thread from "../sass/components/Thread.module.scss";
import TopBar from "./TopBar";
import Post from "./Post";
import Divide from "./Divide";
import ActivePost from "./ActivePost";
import {fetchThreadPosts, clearPosts} from "../actions";

function Thread(props) {
    
    useEffect(() => {
        props.fetchThreadPosts(props.postId);
    }, [props.postId])

    useEffect(() => {
        return () => {
            props.clearPosts();
        };
    }, [])

   const renderPosts = () => {
        return props.posts.map((post, index) => {
            if(post.id != props.postId){
                return <Post key={index} post={post}/>
            }
            else if(post.id == props.postId){
                return (
                    <React.Fragment>
                        <ActivePost key={index} post={post}/>
                        <Divide/>
                    </React.Fragment>
                )
            }
            
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
    return {posts: state.posts ? state.posts : []}
}

export default connect(mapStateToProps, {fetchThreadPosts, clearPosts})(Thread);