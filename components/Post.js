import React from 'react';
import Link from "next/link";
import { useRouter } from 'next/router'
import {connect} from "react-redux";
import reactStringReplace from "react-string-replace";

import {likePost, togglePopupReply, trackClickedPost} from "../actions";
import post from "../sass/components/Post.module.scss";
import Avatar from "./Avatar";
import TwitBadge from "../components/TwitBadge";
import TwitMedia from "../components/TwitMedia";

function Post(props) {
  const router = useRouter();

  const truncate = (string, length) => {
    const newString = string.length > length ? string.substring(0, length - 3) + "..." : string;
    return newString;
  }

  const renderMedia = () => {
    if(props.post.media)
    {
      return (
        <TwitMedia media={props.post.media}/>
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

  const onPostClick = () => {
    router.push(`/thread/${props.post.id}`).then(() => window.scrollTo(0, 0))
  }

  const onReplyClick = () => {
    props.trackClickedPost(props.post);
    props.togglePopupReply();
  }

  const onLikeClick = (event) => {
    event.stopPropagation();
    props.likePost(props.post.id);
  }

    return (
      <div onClick={onPostClick} className={post.post}>
          <Avatar roundedCircle className={post["post__image"]} src={props.post.avatar}/>
          <div className={post["post__content"]}>
              <div className={post["post__heading"]}>
                <div className={post["post__heading-text"]}>
                  <Link passHref href={props.post.username?"/users/" + props.post.username:""}><a className={post["post__display-name"]}>{props.post.name}</a></Link>
                  <span className={post["post__username"] + " muted"}>@{props.post.username}</span>
                  {renderBadge()}
                </div>
                <span className={post["post__time"]}>{props.post.date}</span>
              </div>
              
              <p className={post["post__text"]}>{renderBody()}</p>
               
          </div>
          {renderMedia()}
          <div className={post["post__icons"]}>
                  <div className={post["post__icons__holder"]}>
                    <svg className={post["post__icon"]}>
                      <use xlinkHref="/sprites.svg#icon-message-square"/>
                    </svg>
                    <span className={post["post__icons__count"]}>{props.post.replies > 0 ? props.post.replies : null}</span>
                  </div>
                  <div className={post["post__icons__holder"]}>
                    <svg className={post["post__icon"]}>
                      <use xlinkHref="/sprites.svg#icon-repeat"/>
                    </svg>
                    <span className={post["post__icons__count"]}>{props.post.reposts}</span>
                  </div>
                  <div onClick={onLikeClick} className={`${post["post__icons__holder"]} ${props.post.liked?post["post__icons__holder__active"]: null}`}>
                    <svg className={post["post__icon"]}>
                      <use xlinkHref="/sprites.svg#icon-heart"/>
                    </svg>
                    <span className={post["post__icons__count"]}>{props.post.likes > 0 ? props.post.likes : null}</span>
                  </div>
                  <div className={post["post__icons__holder"]}>
                    <svg onClick={onReplyClick} className={post["post__icon"]}>
                      <use xlinkHref="/sprites.svg#icon-corner-up-right"/>
                    </svg>
                  </div>
            </div>
      </div>
  );
  
  
}

export default connect(null, {likePost, togglePopupReply, trackClickedPost})(Post);