import React, {useState, useEffect} from "react";
import {connect} from "react-redux";

import TeamHolder from "./TeamHolder";
import Post from "./Post";
import TwitTab from "./TwitTab";
import TwitTabs from "./TwitTabs";
import EmptyPosts from "./EmptyPosts";
import {createPost, fetchUser, fetchTeamPosts, fetchLeaguePosts, clearPosts, toggleEditRosterPopup} from "../actions";
import TopBar from "./TopBar";
import TwitItem from "./TwitItem";
import TwitButton from "./TwitButton";
import team from "../sass/components/Team.module.scss"

function TeamComponent(props) {
    
    const [activeLink, setActiveLink] = useState("team")

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

      const renderInvite = () => {
          return (
            <div className={team["team__roster__invite"]}>
                <TwitButton onClick={props.toggleEditRosterPopup} color="twit-button--primary">
                    Edit roster
                </TwitButton>
            </div>
          )
      }

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
            return (
                <div className={team["team__roster"]}>
                    {renderInvite()}
                    <TwitItem
                        title="anolan"
                        subtitle="@anolan"
                        actionText="Scout"
                    />
                    <TwitItem
                        title="anolan23"
                        subtitle="@anolan23"
                        actionText="Scout"
                    />
                    <TwitItem
                        title="cranberri12"
                        subtitle="@cranberri12"
                        actionText="Scout"
                    />
                    <TwitItem
                        title="anol1258"
                        subtitle="@anol1258"
                        actionText="Scout"
                    />
                    <TwitItem
                        title="seansi2k"
                        subtitle="@seansi2k"
                        actionText="Scout"
                    />
                    <TwitItem
                        title="caribear"
                        subtitle="@caribear"
                        actionText="Scout"
                    />
                </div>
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
        posts: state.posts ? state.posts : null
    
    }
}

export default connect(mapStateToProps, {fetchUser, createPost, fetchTeamPosts, fetchLeaguePosts, clearPosts, toggleEditRosterPopup})(TeamComponent);