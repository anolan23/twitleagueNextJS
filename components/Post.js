import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/router'
import {connect} from "react-redux";
import reactStringReplace from "react-string-replace";

import {likePost, unLikePost, togglePopupReply, trackClickedPost} from "../actions";
import post from "../sass/components/Post.module.scss";
import {truncate} from "../lib/twit-helpers";
import Avatar from "./Avatar";
import TwitBadge from "./TwitBadge";
import TwitMedia from "./TwitMedia";
import TwitIcon from "./TwitIcon";

function Post(props) {
  const router = useRouter();
  const [liked, setLiked] = useState(props.post.liked);
  const [likes, setLikes] = useState(props.post.likes);

  const renderMedia = () => {
    if(props.post.media)
    {
      return (
        <div className={`${post["post__media-holder"]} ${props.history ? post["post__media-holder--tree"] : null}`}>
          <TwitMedia media={props.post.media}/>
        </div>
      );
    }
    else{
      return null;
    }
   

  }

  const renderBadge = () => {
    if(props.post.outlook === null){
      return null;
    }
    else if(props.post.outlook){
      return <TwitBadge active>Hot</TwitBadge>
    }
    else if(!props.post.outlook){
      return <TwitBadge active>Cold</TwitBadge>
    }
  }

  const renderBody = () => {
    const text = props.post.body;
    let replacedText;
    replacedText = reactStringReplace(text, /\$(\w+)/g, (match, i) => (
      <Link key={match + i} href={`/teams/${match}`}><a onClick={(e) => e.stopPropagation()} className="twit-link">${match}</a></Link>
    ));

    replacedText = reactStringReplace(replacedText, /@(\w+)/g, (match, i) => (
      <Link key={match + i} href={`/users/${match}`}><a onClick={(e) => e.stopPropagation()} className="twit-link">@{match}</a></Link>
    ));
    
    replacedText = reactStringReplace(replacedText, /(https?:\/\/\S+)/g, (match, i) => (
      <Link key={match + i} href={match}><a onClick={(e) => e.stopPropagation()} className="twit-link">{truncate(match, 35)}</a></Link>
    ));

    return replacedText
  }

  const renderTree = () => {
    if(!props.history){
      return null;
    }
    else{
      return(
        <div className={post["post__tree"]}></div>
      )
    }
  }

  const onPostClick = () => {
    router.push(`/thread/${props.post.id}`).then(() => window.scrollTo(0, 0))
  }

  const onReplyClick = () => {
    props.trackClickedPost(props.post);
    props.togglePopupReply();
  }

  const onLikeClick = async (event) => {
    event.stopPropagation();
    if(!liked){
      await props.likePost(props.post.id);
      setLiked(true);
      setLikes((likes) => parseInt(likes) + 1);
    }
    else{
      await props.unLikePost(props.post.id);
      setLiked(false);
      setLikes((likes) => parseInt(likes) - 1);
    }
  }

    return (
      <div onClick={onPostClick} className={`${post["post"]} ${props.history ? post["post--history"] : null}`}>
          <Avatar roundedCircle className={post["post__image"]} src={props.post.avatar}/>
          {renderTree()}
          <div className={`${post["post__content"]} ${props.history ? post["post__content--tree"] : null}`}>
              <div className={post["post__heading"]}>
                <div className={post["post__heading-text"]}>
                  <Link passHref href={props.post.username?"/users/" + props.post.username:""}><a className={post["post__display-name"]} onClick={(e) => e.stopPropagation()}>{props.post.name}</a></Link>
                  <span className={post["post__username"] + " muted"}>@{props.post.username}</span>
                  {renderBadge()}
                </div>
                <span className={post["post__time"]}>{props.post.date}</span>
              </div>
              
              <p className={post["post__text"]}>{renderBody()}</p>
               
          </div>
          {renderMedia()}
          <div className={`${post["post__icons"]} ${props.history ? post["post__icons--tree"] : null}`}>
                  <div className={post["post__icons__holder"]}>
                    <TwitIcon className={post["post__icon"]} icon="/sprites.svg#icon-message-square"/>
                    <span className={post["post__icons__count"]}>{props.post.replies > 0 ? props.post.replies : null}</span>
                  </div>
                  <div className={post["post__icons__holder"]}>
                    <TwitIcon className={post["post__icon"]} icon="/sprites.svg#icon-repeat"/>
                    <span className={post["post__icons__count"]}>{props.post.reposts}</span>
                  </div>
                  <div onClick={onLikeClick} className={`${post["post__icons__holder"]} ${liked?post["post__icons__holder__active"]: null}`}>
                    <TwitIcon className={post["post__icon"]} icon="/sprites.svg#icon-heart"/>
                    <span className={post["post__icons__count"]}>{likes > 0 ? likes : null}</span>
                  </div>
                  <div className={post["post__icons__holder"]}>
                    <TwitIcon onClick={onReplyClick} className={post["post__icon"]} icon="/sprites.svg#icon-corner-up-right"/>
                  </div>
            </div>
      </div>
  );
  
  
}

export default connect(null, {likePost, unLikePost, togglePopupReply, trackClickedPost})(Post);