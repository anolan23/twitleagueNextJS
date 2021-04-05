import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import reactStringReplace from "react-string-replace";
import Link from "next/link";

import activePost from "../sass/components/ActivePost.module.scss";
import useUser from "../lib/useUser";
import Avatar from "../components/Avatar";
import {trackClickedPost, togglePopupReply, likePost, unLikePost} from "../actions";
import {truncate} from "../lib/twit-helpers";
import TwitMedia from "./TwitMedia";

function ActivePost(props){
  const { user } = useUser();
  const [liked, setLiked] = useState(props.post.liked);
  const [likes, setLikes] = useState(props.post.likes);

  useEffect(() => {
    setLiked(props.post.liked);
  }, [props.post.liked])

  useEffect(() => {
    setLikes(props.post.likes);
  }, [props.post.likes])

  const renderBody = () => {
    const text = props.post.body;
    let replacedText;
    replacedText = reactStringReplace(text, /\$(\w+)/g, (match, i) => (
      <Link key={match + i} href={`/teams/${match}`}><a className="twit-link">${match}</a></Link>
    ));

    replacedText = reactStringReplace(replacedText, /@(\w+)/g, (match, i) => (
      <Link key={match + i} href={`/users/${match}`}><a className="twit-link">@{match}</a></Link>
    ));
    
    replacedText = reactStringReplace(replacedText, /(https?:\/\/\S+)/g, (match, i) => (
      <Link key={match + i} href={match}><a onClick={(e) => e.stopPropagation()} className="twit-link">{truncate(match, 35)}</a></Link>
    ));

    return replacedText
  }

  const renderMedia = () => {
    if(props.post.media){
      return (
        <TwitMedia media={props.post.media}/>
      );
    }
    else{
      return null;
    }
  }

  const onLikeClick = async (event) => {
    event.stopPropagation();
    if(!user || !user.isSignedIn){
      return
    }
    else{
      if(!liked){
        await likePost(props.post.id, user.id);
        setLiked(true);
        setLikes((likes) => parseInt(likes) + 1);
      }
      else{
        await unLikePost(props.post.id, user.id);
        setLiked(false);
        setLikes((likes) => parseInt(likes) - 1);
      }
    }
  }

  const onReplyClick = () => {
    props.trackClickedPost(props.post);
    props.togglePopupReply();
  }

    return(
        <div className={activePost["active-post"]}>
            <div className={activePost["active-post__user"]}>
                <Avatar className={activePost["active-post__avatar"]} src={props.post.avatar}/>
                <div className={activePost["active-post__user-text"]}>
                    <span className={activePost["active-post__name"]}>{props.post.name}</span>
                    <span className={activePost["active-post__username"]}>{`@${props.post.username}`}</span>
                </div>
            </div>
            <div className={activePost["active-post__body"]}>
                {renderBody()}
            </div>
            {renderMedia()}
            <div className={activePost["active-post__timestamp"]}>
                {props.post.date} · twitleague Web App
            </div>
            <div className={activePost["active-post__stats"]}>
                <div className={activePost["active-post__stat-box"]}>
                    <span className={activePost["active-post__value"]}>{likes}</span>
                    <span className={activePost["active-post__stat"]}>Likes</span>
                </div>
            </div>
            <div className={activePost["active-post__icons"]}>
                    <div className={activePost["active-post__icons__holder"]}>
                      <svg className={activePost["active-post__icon"]}>
                        <use xlinkHref="/sprites.svg#icon-message-square"/>
                      </svg> 
                    </div>                  
                    <div className={activePost["active-post__icons__holder"]}>
                      <svg className={activePost["active-post__icon"]}>
                        <use xlinkHref="/sprites.svg#icon-repeat"/>
                      </svg>
                    </div> 
                    <div onClick={onLikeClick} className={`${activePost["active-post__icons__holder"]} ${liked ? activePost["active-post__icons__holder__active"] : null}`}>
                      <svg className={activePost["active-post__icon"]}>
                        <use xlinkHref="/sprites.svg#icon-heart"/>
                      </svg>
                    </div>               
                    <div onClick={onReplyClick} className={activePost["active-post__icons__holder"]}>
                      <svg className={activePost["active-post__icon"]}>
                        <use xlinkHref="/sprites.svg#icon-corner-up-right"/>
                      </svg>
                    </div> 
            </div>
        </div>
    )
}

export default connect(null, {trackClickedPost, togglePopupReply, likePost, unLikePost})(ActivePost);