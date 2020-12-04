import React, {useState} from 'react';
import {connect} from "react-redux";
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

import Post from './Post';
import TwitTabs from "./TwitTabs";
import TwitTab from "./TwitTab";
import {togglePostModal, trackClickedPost, fetchTeamPosts, fetchLeaguePosts} from "../actions";
import styles from "../styles/FeedHolder.module.css";

function FeedHolder(props) {

  const [activeLink, setActiveLink] = useState("team")

  const onPostClick = (post) => {
    props.trackClickedPost(post)
    props.togglePostModal();
  }

  const renderPosts = () => {
    return props.posts.map(post => {
      return (
        <Post 
          key={post._id}
          id={post._id}
          author={post.author} 
          content={post.postText} 
          likes={post.likes ? Object.keys(post.likes).length : 0} 
          retwits={post.retwits}
          comments={post.comments ? Object.keys(post.comments).length : 0}
          gifId={post.gifId}
          time={post.dateTime}
          outlook={post.outlook}
          onClick={() => onPostClick(post)}
          />
      );
    })
  }

  const onTeamSelect = (k) => {
    setActiveLink(k.target.id);
    props.fetchTeamPosts();
  }

  const onLeagueSelect = (k) => {
    setActiveLink(k.target.id);
    props.fetchLeaguePosts();
  }

  return (
    <React.Fragment>
      <TwitTabs>
        <TwitTab onClick={onTeamSelect} id={"team"} active={activeLink === "team" ? true : false} title="Team"/>
        <TwitTab onClick={onLeagueSelect} id={"league"} active={activeLink === "league" ? true : false} title="League"/>
        <TwitTab onClick={(k) => setActiveLink(k.target.id)} id={"media"} active={activeLink === "media" ? true : false} title="Media"/>

    </TwitTabs>
    {renderPosts()}
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {posts: state.posts ? Object.values(state.posts) : []}
}

export default connect(mapStateToProps, {trackClickedPost, togglePostModal, fetchTeamPosts, fetchLeaguePosts})(FeedHolder);
