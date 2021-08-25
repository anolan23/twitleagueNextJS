import React, { useState, useEffect } from "react";

import activePost from "../sass/components/ActivePost.module.scss";
import Avatar from "../components/Avatar";
import {
  trackClickedPost,
  togglePopupReply,
  likePost,
  unLikePost,
} from "../actions";
import TwitMedia from "./TwitMedia";
import Like from "./Like";
import Linkify from "./Linkify";

function ActivePost({ post, user }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);

  useEffect(() => {
    setLiked(post.liked);
  }, [post.liked]);

  useEffect(() => {
    setLikes(post.likes);
  }, [post.likes]);

  const renderBody = () => {
    const string = post.body;
    return <Linkify string={string} user={user} hasTwitLinks />;
  };

  const renderMedia = () => {
    if (post.media) {
      return <TwitMedia media={post.media} />;
    } else {
      return null;
    }
  };

  const onLikeClick = async (event) => {
    event.stopPropagation();
    if (!user || !user.isSignedIn) {
      return;
    } else {
      if (!liked) {
        await likePost(post.id, user.id);
        setLiked(true);
        setLikes((likes) => parseInt(likes) + 1);
      } else {
        await unLikePost(post.id, user.id);
        setLiked(false);
        setLikes((likes) => parseInt(likes) - 1);
      }
    }
  };

  const onReplyClick = (event) => {
    event.stopPropagation();
    trackClickedPost(post);
    togglePopupReply();
  };

  return (
    <div className={activePost["active-post"]}>
      <div className={activePost["active-post__user"]}>
        <Avatar
          className={activePost["active-post__avatar"]}
          src={post.avatar}
        />
        <div className={activePost["active-post__user-text"]}>
          <span className={activePost["active-post__name"]}>{post.name}</span>
          <span
            className={activePost["active-post__username"]}
          >{`@${post.username}`}</span>
        </div>
      </div>
      <div className={activePost["active-post__body"]}>{renderBody()}</div>
      {renderMedia()}
      <div className={activePost["active-post__timestamp"]}>
        {post.date} · twitleague Web App
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
            <use xlinkHref="/sprites.svg#icon-message-square" />
          </svg>
        </div>
        <div className={activePost["active-post__icons__holder"]}>
          <svg className={activePost["active-post__icon"]}>
            <use xlinkHref="/sprites.svg#icon-repeat" />
          </svg>
        </div>
        <div
          onClick={onLikeClick}
          className={`${activePost["active-post__icons__holder"]} ${
            liked ? activePost["active-post__icons__holder__active"] : null
          }`}
        >
          <Like className={activePost["active-post__icon"]} liked={liked} />
        </div>
        <div
          onClick={onReplyClick}
          className={activePost["active-post__icons__holder"]}
        >
          <svg className={activePost["active-post__icon"]}>
            <use xlinkHref="/sprites.svg#icon-corner-up-right" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default ActivePost;
