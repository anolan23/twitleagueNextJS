import React, {useState, useEffect} from "react";
import {connect} from "react-redux";

import TeamHolder from "./TeamHolder";
import Post from "./Post";
import TwitTab from "./TwitTab";
import TwitTabs from "./TwitTabs";
import {createPost, fetchUser, fetchTeamPosts, fetchLeaguePosts, clearPosts} from "../actions";
import TopBar from "./TopBar";

function TeamComponent(props) {
    
    const [activeLink, setActiveLink] = useState("team")

    useEffect(() => {
        props.fetchTeamPosts();
        if(!props.user.isSignedIn){
            props.fetchUser();
        }

        return () => {
            props.clearPosts();
        }
      }, [])

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
        });
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
            <div >
                <TopBar main={props.team.team_name} sub="32.5k Twits"/>
                <TeamHolder team={props.team}/>
                <TwitTabs>
                    <TwitTab onClick={onTeamSelect} id={"team"} active={activeLink === "team" ? true : false} title="Team"/>
                    <TwitTab onClick={onLeagueSelect} id={"league"} active={activeLink === "league" ? true : false} title="League"/>
                    <TwitTab onClick={onEventsSelect} id={"events"} active={activeLink === "events" ? true : false} title="Events"/>
                    <TwitTab onClick={onRosterSelect} id={"roster"} active={activeLink === "roster" ? true : false} title="Roster"/>
                    <TwitTab onClick={(k) => setActiveLink(k.target.id)} id={"media"} active={activeLink === "media" ? true : false} title="Media"/>
                </TwitTabs>
                {renderPosts()}
            </div>
        );
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        posts: state.posts ? state.posts : []
    
    }
}

export default connect(mapStateToProps, {fetchUser, createPost, fetchTeamPosts, fetchLeaguePosts, clearPosts})(TeamComponent);