import React, {useState} from 'react';
import {connect} from "react-redux";

import Post from './Post';
import TwitTabs from "./TwitTabs";
import TwitTab from "./TwitTab";
import {togglePostModal, trackClickedPost, fetchTeamPosts, fetchLeaguePosts} from "../actions";
import styles from "../styles/FeedHolder.module.css";
import Player from './Player';
import Event from "./Event";

function FeedHolder(props) {

  const [activeLink, setActiveLink] = useState("team")

  const onPostClick = (post) => {
    props.trackClickedPost(post)
    props.togglePostModal();
  }

  const renderPosts = () => {
    if(activeLink !=="team" && activeLink !=="league"){
      return null;
    }

    return props.posts.map((post, index) => {
      return (
        <Post 
          key={index}
          post={post}
          />
      );
    })
  }

  const renderRoster = () => {
    if(activeLink !=="roster"){
      return null;
    }
    return props.roster.map((player, index) => {
      return <Player key={index} username={player.username}/>
    })
  }

  const renderEvents = () => {
    if(activeLink !=="events"){
      return null;
    }
    return props.events.map((event, index) => {
      return (
        <Event
          key={index}
          eventDate={event.eventDate}
          eventType={event.eventType}
          isHomeTeam={event.isHomeTeam}
          opponent={event.opponent}
          location={event.location}
          time={event.time}
        />
      ) 
    })
  }

  const onTeamSelect = (k) => {
    setActiveLink(k.target.id);
    props.fetchTeamPosts();
  }

  const onLeagueSelect = async (k) => {
    setActiveLink(k.target.id);
    props.fetchLeaguePosts();
  }

  const onRosterSelect = (k) => {
    setActiveLink(k.target.id);
  }

  const onEventsSelect = (k) => {
    setActiveLink(k.target.id);
  }

  return (
    <React.Fragment>
      <TwitTabs>
        <TwitTab onClick={onTeamSelect} id={"team"} active={activeLink === "team" ? true : false} title="Team"/>
        <TwitTab onClick={onLeagueSelect} id={"league"} active={activeLink === "league" ? true : false} title="League"/>
        <TwitTab onClick={onEventsSelect} id={"events"} active={activeLink === "events" ? true : false} title="Events"/>
        <TwitTab onClick={onRosterSelect} id={"roster"} active={activeLink === "roster" ? true : false} title="Roster"/>
        <TwitTab onClick={(k) => setActiveLink(k.target.id)} id={"media"} active={activeLink === "media" ? true : false} title="Media"/>
    </TwitTabs>
    {renderPosts()}
    {renderRoster()}
    {renderEvents()}
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    posts: state.posts ? Object.values(state.posts) : [],
    roster: state.team.roster ? state.team.roster : [],
    events: state.team.events ? state.team.events : []
  }
}

export default connect(mapStateToProps, {trackClickedPost, togglePostModal, fetchTeamPosts, fetchLeaguePosts})(FeedHolder);
