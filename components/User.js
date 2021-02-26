import React, {useState, useEffect} from "react";
import {connect} from "react-redux";

import TwitTabs from "./TwitTabs";
import TwitItem from "./TwitItem";
import TwitTab from "./TwitTab";
import TwitButton from "./TwitButton";
import Avatar from "../components/Avatar";
import Post from "./Post";
import Empty from "./Empty";
import {clearPosts, toggleEditProfilePopup, fetchUserPosts, fetchUser, togglePopupCompose} from "../actions";
import TopBar from "./TopBar";
import FeedCard from "./FeedCard";
import backend from "../lib/backend";
import teamHolder from "../sass/components/TeamHolder.module.scss";
import user from "../sass/components/User.module.scss";

function User(props) {

    const [activeLink, setActiveLink] = useState("posts");
    const [users, setUsers] = useState(null);


    useEffect(() => {
        start();
        return () => {
            props.clearPosts();
        }
      }, []);

    const start = async () => {
        if(props.isSignedIn){
            props.fetchUserPosts(props.user.id,props.userId, 10, 0);
        }
        else{
            await props.fetchUser();
            props.fetchUserPosts(props.user.id,props.userId, 10, 0);
        }
        const users = await backend.get("/api/users/suggested", {
            params:{
                num: 3
            }
        });
        setUsers(users.data);
    }

    const onPostsSelect = (k) => {
        setActiveLink(k.target.id);
        //fetch user posts
        props.fetchUserPosts(props.user.id,props.userId, 10, 0);
    }

    const onMediaSelect = async (k) => {
        setActiveLink(k.target.id);
        //fetch user posts with media
    }

    const onLikesSelect = async (k) => {
        setActiveLink(k.target.id);
        //fetch user liked posts
    }

    const onAvatarClick = () => {
        if(props.user.id == props.userId){
            props.toggleEditProfilePopup();
        }
    }

    const renderAction = () => {
        if(props.user.id == props.userId){
            return <TwitButton onClick={props.toggleEditProfilePopup} color="twit-button--primary" outline="twit-button--primary--outline">Edit Profile</TwitButton>
        }
        else{
            return <TwitButton color="twit-button--primary" outline="twit-button--primary--outline">Scout</TwitButton>

        }
    }

    const renderPosts = () => {
        if(props.posts === null){
            return;
        }
        if(props.posts.length > 0){
            if(activeLink === "posts"){
                return props.posts.map((post, index) => {
                    return (
                      <Post 
                        key={index}
                        post={post}
                        />
                    );
                  });
            }
            else{
                return null;
            }
        }
        else if(props.posts.length === 0){
            if(props.user.id === props.userId){
                return (
                    <Empty
                        main="You haven’t posted yet"
                        sub="When you make a post, it’ll show up here."
                        actionText="Post now"
                        onActionClick={props.togglePopupCompose}
                    />
                )
            }
            else{
                return (
                    <Empty
                        main="This user hasn't posted yet"
                        sub="When they make a post, it’ll show up here."
                        actionText="Send message"
                    />
                )
            }
        }
      }

      const renderUsers = () => {
        if(users === null){
            return <div>Loading...</div>
        }
        else if(users.length === 0){
            return <Empty main="No Users" sub="There are no users to scout"/>
        }
        else{
            return users.map(user => {
                return (
                    <TwitItem 
                        avatar={user.avatar}
                        title={user.name}
                        subtitle={`@${user.username}`} 
                        actionText="Scout"   
                        paragraph="The most beautiful thing we can experience is the mysterious. It is the source of all true art and science"
                    />
                )
            })
        }
    }

        return (
            <div >
                <TopBar main={props.user.username}/>
                <div className={teamHolder["team-holder"]}>
                    <div className={teamHolder["team-holder__banner"]}>
                        <img className={teamHolder["team-holder__banner-image"]} src={null}></img>
                    </div>
                    <div className={teamHolder["team-holder__action-box"]}>
                        <div className={teamHolder["team-holder__team-image"]}>
                        <Avatar onClick={onAvatarClick} className={teamHolder["team-holder__image"]} src={props.user.avatar} alt="team profile image"/>
                        </div>
                        <div className={teamHolder["team-holder__action"]}>
                            {renderAction()}
                        </div>
                    </div>
                    <div className={teamHolder["team-holder__info"]}>
                        <div className={`${teamHolder["team-holder__teamname-box"]} u-margin-top-tiny`}>
                            <h1 className="heading-1">{props.user.name}</h1>
                        </div>
                        <h3 className={teamHolder["team-holder__info__league"] + " muted"}>{props.user.username}</h3>
                        <h3 className={teamHolder["team-holder__info__bio"] + " muted"}>This is my user biography</h3>
                        <h3 className={teamHolder["team-holder__attributes"] + " muted"}>
                            <div className={teamHolder["team-holder__attribute"]}>
                            <i className={"fas fa-map-marker-alt " + teamHolder["team-holder__icon"]}></i>
                            <span>Baton Rouge, LA</span>
                            </div>
                            <div className={teamHolder["team-holder__attribute"]}>
                            <i className={"fas fa-calendar-alt " + teamHolder["team-holder__icon"]}></i>
                            <span>Joined Oct 2020</span>
                            </div>
                        </h3>
                        <div style={{width: "100%"}}>
                            <div>
                            <span style={{fontWeight:900, marginRight:"3px"}}>0</span>
                            <span className={teamHolder["team-holder__info__bio"] + " muted"}>Followers</span>
                            </div>
                        </div>
                    </div>
                </div>
                <TwitTabs>
                    <TwitTab onClick={onPostsSelect} id={"posts"} active={activeLink === "posts" ? true : false} title="Posts"/>
                    <TwitTab onClick={onMediaSelect} id={"media"} active={activeLink === "media" ? true : false} title="Media"/>
                    <TwitTab onClick={onLikesSelect} id={"likes"} active={activeLink === "likes" ? true : false} title="Likes"/>
                </TwitTabs>
                <div className={user["user__feed-holder"]}>   
                    {renderPosts()}
                    <FeedCard title="Who to Scout">
                        {renderUsers()}
                    </FeedCard>
                </div>
                
            </div>
        );
}

const mapStateToProps = (state) => {
    return {
        userId: state.user.id ? state.user.id : null,
        isSignedIn: state.user.isSignedIn,
        posts: state.posts ? state.posts : null
    }
}

export default connect(mapStateToProps, {clearPosts, toggleEditProfilePopup, fetchUserPosts, fetchUser, togglePopupCompose})(User);