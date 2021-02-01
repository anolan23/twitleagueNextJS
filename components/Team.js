import React, {useState, useEffect} from "react";
import {connect} from "react-redux";

import TeamHolder from "./TeamHolder";
import Post from "./Post";
import TwitTab from "./TwitTab";
import TwitTabs from "./TwitTabs";
import EmptyPosts from "./EmptyPosts";
import {createPost, fetchUser, fetchTeamPosts, fetchLeaguePosts, clearPosts, toggleEditRosterPopup, toggleEditEventsPopup} from "../actions";
import TopBar from "./TopBar";
import TwitItem from "./TwitItem";
import TwitButton from "./TwitButton";
import team from "../sass/components/Team.module.scss"
import Event from "./Event";
import backend from "../lib/backend";

function TeamComponent(props) {
    
    const [activeLink, setActiveLink] = useState("team")
    const [roster, setRoster] = useState(null)

    useEffect(() => {

        const start = async () => {
            if(props.user.isSignedIn){
                props.fetchTeamPosts();
            }
            else{
                await props.fetchUser();
                props.fetchTeamPosts();
            }
        }
        start();
        

        return () => {
            props.clearPosts();
        }
      }, [])

      useEffect(() => {
        const getRoster = async () => {
            const response = await backend.get("api/teams/rosters", {
                params: {
                    teamId: props.team.id
                }
            });
            setRoster(response.data);
        }
        getRoster();
        
    }, [props.team.id])

      const renderPosts = () => {
        if(activeLink ==="team" || activeLink === "league"){
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
                        main="No posts yet"
                        sub="Be the first to make a post mentioning this team!"
                        actionText="Post now"
                    />
                )
            }
        }
        else if(activeLink === "roster"){
            if(!roster){
                return null;
            }
            else{
                return roster.map(player => {
                    return (
                        <TwitItem
                            avatar={player.avatar}
                            title={player.name}
                            subtitle={`@${player.username}`}
                            actionText="Scout"
                        />
                    )
                });
            }
        }

        else if(activeLink === "schedule"){
            return (
                <React.Fragment>
                    <Event/>
                    <Event/>
                    <Event/>
                    <Event/>
                </React.Fragment>
                
            )
        }
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
                    <TwitTab onClick={onEventsSelect} id={"schedule"} active={activeLink === "schedule" ? true : false} title="Schedule"/>
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
        posts: state.posts ? state.posts : null
    
    }
}

export default connect(mapStateToProps, 
    {
        fetchUser, 
        createPost, 
        fetchTeamPosts, 
        fetchLeaguePosts, 
        clearPosts, 
        toggleEditRosterPopup,
        toggleEditEventsPopup
    })(TeamComponent);