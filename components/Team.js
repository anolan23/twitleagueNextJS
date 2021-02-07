import React, {useState, useEffect} from "react";
import {connect} from "react-redux";

import TeamHolder from "./TeamHolder";
import Post from "./Post";
import TwitTab from "./TwitTab";
import TwitTabs from "./TwitTabs";
import Empty from "./Empty";
import {createPost, fetchUser, fetchTeamPosts, fetchLeaguePosts, clearPosts, toggleEditRosterPopup, toggleEditEventsPopup, findEventsByTeamId} from "../actions";
import TopBar from "./TopBar";
import TwitItem from "./TwitItem";
import TwitButton from "./TwitButton";
import team from "../sass/components/Team.module.scss"
import Event from "./Event";
import backend from "../lib/backend";
import { Spinner } from "react-bootstrap";

function TeamComponent(props) {
    
    const [activeLink, setActiveLink] = useState("team")
    const [roster, setRoster] = useState(null)
    const [events, setEvents] = useState(null)

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

      const fetchRoster = async () => {
        const response = await backend.get("api/teams/rosters", {
            params: {
                teamId: props.team.id
            }
        });
        setRoster(response.data);
    }

    const fetchEvents = async () => {
        console.log(props.teamId);
        const events = await findEventsByTeamId(props.team.id);
        console.log(events);
        setEvents(events);
    }

      const renderPosts = () => {
        if(activeLink ==="team" || activeLink === "league"){
            if(props.posts === null){
                return;
            }
            else if(props.posts.length === 0){
                return (
                    <Empty
                        main="No posts yet"
                        sub="Be the first to make a post mentioning this team!"
                        actionText="Post now"
                        
                    />
                )
            }
            else{
                return props.posts.map((post, index) => {
                    return (
                        <Post 
                        key={index}
                        post={post}
                        />
                    );
                });
            }
        }
        else if(activeLink === "roster"){
            if(!roster){
                return null;
            }
            else if(roster.length === 0){
                return <Empty main="No players" sub="There are no players on this team"/>
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
            if(!events){
                return <Spinner animation="border"/>;
            }
            else if(events.length === 0){
                return <Empty main="No events" sub="The head coach hasn't scheduled any events"/>
            }
            else{
                return events.map((event, index) => {
                    return (
                        <Event key={index} event={event}/>
                    )
                });
            }
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
            fetchRoster();
        }

        const onScheduleClick = (k) => {
            setActiveLink(k.target.id);
            fetchEvents();
        }
        
      
        return (
            <div >
                <TopBar main={props.team.team_name} sub="32.5k Twits"/>
                <TeamHolder team={props.team}/>
                <TwitTabs>
                    <TwitTab onClick={onTeamSelect} id={"team"} active={activeLink === "team" ? true : false} title="Team"/>
                    <TwitTab onClick={onLeagueSelect} id={"league"} active={activeLink === "league" ? true : false} title="League"/>
                    <TwitTab onClick={onScheduleClick} id={"schedule"} active={activeLink === "schedule" ? true : false} title="Schedule"/>
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