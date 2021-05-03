import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { useRouter } from 'next/router'
import {connect} from "react-redux";
import reactStringReplace from "react-string-replace";

import {likePost, unLikePost, togglePopupReply, trackClickedPost, deletePost} from "../actions";
import useUser from "../lib/useUser";
import post from "../sass/components/Post.module.scss";
import {truncate} from "../lib/twit-helpers";
import Avatar from "./Avatar";
import TwitBadge from "./TwitBadge";
import TwitMedia from "./TwitMedia";
import TwitIcon from "./TwitIcon";
import Like from "./Like";
import TwitDate from "../lib/twit-date";
import TwitDropdown from "./TwitDropdown";
import TwitDropdownItem from "./TwitDropdownItem";
import Prompt from "./modals/Prompt";

function Post(props) {
  const { user } = useUser();
  const router = useRouter();
  const ref = useRef();
  const [showPost, setShowPost] = useState(true);
  const [liked, setLiked] = useState(props.post.liked);
  const [likes, setLikes] = useState(props.post.likes);
  const [show, setShow] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  useEffect(() => {
    setLiked(props.post.liked);
  }, [props.post.liked])

  useEffect(() => {
    setLikes(props.post.likes);
  }, [props.post.likes]);

  useEffect(() => {
    document.body.addEventListener("click", clickOutsideDropdownButton);
    return () => {
        document.body.removeEventListener("click", clickOutsideDropdownButton);
      }
  }, [])

  const clickOutsideDropdownButton = (event) => {
          if(!ref.current){
              return;
          }
          if(ref.current.contains(event.target)){
              return;
          }
          setShow(false);
  }

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

  const onReplyClick = (event) => {
    event.stopPropagation();
    props.trackClickedPost(props.post);
    props.togglePopupReply();
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

  const onDeleteOptionClick = (event) => {
    event.stopPropagation();
    setShowDeletePrompt(true);
    setShow(false);
  }

  const onDeleteClick = async () => {
    await deletePost(props.post.id)
    setShowDeletePrompt(false);
    setShowPost(false);
  }

  const onEditIconClick = (event) => {
    event.stopPropagation();
    setShow(!show);
  }

  const renderDropDownItems = () => {
    if(!user){
      return null;
    }
    if(user.id === props.post.author_id){
      return (
        <React.Fragment>
          <TwitDropdownItem onClick={null} >Save</TwitDropdownItem>
          <TwitDropdownItem onClick={onDeleteOptionClick}>Delete</TwitDropdownItem>
        </React.Fragment> 
      )
    }
    else{
      return (
        <React.Fragment>
          <TwitDropdownItem onClick={null}>Not interested</TwitDropdownItem>
          <TwitDropdownItem onClick={null}>Report</TwitDropdownItem>
        </React.Fragment> 
      )
    }
  }

  const renderEditIcon = () => {
    return (
      <div className={post["post__heading__icon-holder"]} ref={ref}>
          <TwitIcon onClick={onEditIconClick} className={post["post__heading__icon-holder__icon"]} icon="/sprites.svg#icon-more-horizontal"/>
          <div className={post["post__heading__icon-holder__dropdown"]}>
              <TwitDropdown show={show}>
                  {renderDropDownItems()}
              </TwitDropdown>
          </div>
      </div>
    )
  }

  if(!showPost){
    return null;
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
                <span className={post["post__time"]}>{` · ${TwitDate.dynamicPostDate(props.post.created_at)}`}</span>
              </div>
              {renderEditIcon()}
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
                  <Like className={post["post__icon"]} liked={liked}/>
                  <span className={post["post__icons__count"]}>{likes > 0 ? likes : null}</span>
                </div>
                <div className={post["post__icons__holder"]}>
                  <TwitIcon onClick={onReplyClick} className={post["post__icon"]} icon="/sprites.svg#icon-corner-up-right"/>
                </div>
        </div>
        <Prompt
          show={showDeletePrompt}
          onHide={() => setShowDeletePrompt(false)}
          main="Delete post?"
          sub="This can’t be undone and it will be removed from your profile and the timeline of any accounts that follow you."
          primaryActionText="Delete"
          secondaryActionText="Cancel"
          onSecondaryActionClick={() => setShowDeletePrompt(false)}
          onPrimaryActionClick={onDeleteClick}
        />
    </div>
  );
    
}

export default connect(null, {togglePopupReply, trackClickedPost})(Post);