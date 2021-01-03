import React, {useState, useEffect} from "react";
import {connect} from "react-redux";

import TwitTabs from "./TwitTabs";
import TwitTab from "./TwitTab";
import TwitButton from "./TwitButton";
import Avatar from "../components/Avatar";
import Post from "./Post";
import {clearPosts, toggleEditProfilePopup, fetchUserPosts} from "../actions";
import TopBar from "./TopBar";
import teamHolder from "../sass/components/TeamHolder.module.scss";

function User(props) {

    const [activeLink, setActiveLink] = useState("posts");

    useEffect(() => {
        props.fetchUserPosts(props.user.id, 10, 0);
        return () => {
            props.clearPosts();
        }
      }, [])

    const onPostsSelect = (k) => {
        setActiveLink(k.target.id);
        //fetch user posts
        props.fetchUserPosts(props.user.id, 10, 0);
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
                {renderPosts()}
            </div>
        );
}

const mapStateToProps = (state) => {
    return {
        userId: state.user.id,
        posts: state.posts ? state.posts : []
    }
}

export default connect(mapStateToProps, {clearPosts, toggleEditProfilePopup, fetchUserPosts})(User);