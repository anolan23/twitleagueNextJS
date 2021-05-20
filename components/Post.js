import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import reactStringReplace from "react-string-replace";

import {
  likePost,
  unLikePost,
  togglePopupReply,
  trackClickedPost,
  deletePost,
  fetchTeam,
  fetchUserByUsername,
} from "../actions";
import useUser from "../lib/useUser";
import postStyle from "../sass/components/Post.module.scss";
import { truncate } from "../lib/twit-helpers";
import Avatar from "./Avatar";
import TwitBadge from "./TwitBadge";
import TwitMedia from "./TwitMedia";
import TwitIcon from "./TwitIcon";
import Like from "./Like";
import TwitDate from "../lib/twit-date";
import TwitDropdown from "./TwitDropdown";
import TwitDropdownItem from "./TwitDropdownItem";
import Prompt from "./modals/Prompt";
import TwitLink from "./TwitLink";
import ScoutButton from "./ScoutButton";
import Linkify from "./Linkify";

function Post({ history, trackClickedPost, togglePopupReply, listItem: post }) {
  if (!post) {
    return null;
  }
  const { user } = useUser();
  const router = useRouter();
  const ref = useRef();
  const [showPost, setShowPost] = useState(true);
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [show, setShow] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  useEffect(() => {
    setLiked(post.liked);
  }, [post.liked]);

  useEffect(() => {
    setLikes(post.likes);
  }, [post.likes]);

  useEffect(() => {
    document.body.addEventListener("click", clickOutsideDropdownButton);
    return () => {
      document.body.removeEventListener("click", clickOutsideDropdownButton);
    };
  }, []);

  const clickOutsideDropdownButton = (event) => {
    if (!ref.current) {
      return;
    }
    if (ref.current.contains(event.target)) {
      return;
    }
    setShow(false);
  };

  const renderMedia = () => {
    if (post.media) {
      return (
        <div
          className={`${postStyle["post__media-holder"]} ${
            history ? postStyle["post__media-holder--tree"] : null
          }`}
        >
          <TwitMedia media={post.media} />
        </div>
      );
    } else {
      return null;
    }
  };

  const renderBadge = () => {
    if (post.outlook === null) {
      return null;
    } else if (post.outlook) {
      return <TwitBadge active>Hot</TwitBadge>;
    } else if (!post.outlook) {
      return <TwitBadge active>Cold</TwitBadge>;
    }
  };

  const renderBody = () => {
    const string = post.body;
    return <Linkify string={string} user={user} hasTwitLinks />;
  };

  const renderTree = () => {
    if (!history) {
      return null;
    } else {
      return <div className={postStyle["post__tree"]}></div>;
    }
  };

  const onPostClick = () => {
    router.push(`/thread/${post.id}`).then(() => window.scrollTo(0, 0));
  };

  const onReplyClick = (event) => {
    event.stopPropagation();
    trackClickedPost(post);
    togglePopupReply();
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

  const onDeleteOptionClick = (event) => {
    event.stopPropagation();
    setShowDeletePrompt(true);
    setShow(false);
  };

  const onDeleteClick = async () => {
    await deletePost(post.id);
    setShowDeletePrompt(false);
    setShowPost(false);
  };

  const onEditIconClick = (event) => {
    event.stopPropagation();
    setShow(!show);
  };

  const renderDropDownItems = () => {
    if (!user) {
      return null;
    }
    if (user.id === post.author_id) {
      return (
        <React.Fragment>
          <TwitDropdownItem onClick={null}>Save</TwitDropdownItem>
          <TwitDropdownItem onClick={onDeleteOptionClick}>
            Delete
          </TwitDropdownItem>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <TwitDropdownItem onClick={null}>Not interested</TwitDropdownItem>
          <TwitDropdownItem onClick={null}>Report</TwitDropdownItem>
        </React.Fragment>
      );
    }
  };

  const renderEditIcon = () => {
    return (
      <div className={postStyle["post__heading__icon-holder"]} ref={ref}>
        <TwitIcon
          onClick={onEditIconClick}
          className={postStyle["post__heading__icon-holder__icon"]}
          icon="/sprites.svg#icon-more-horizontal"
        />
        <div className={postStyle["post__heading__icon-holder__dropdown"]}>
          <TwitDropdown show={show}>{renderDropDownItems()}</TwitDropdown>
        </div>
      </div>
    );
  };

  const renderScoutButton = () => {
    return <ScoutButton user={{ scouted: post.scouted, id: post.author_id }} />;
  };

  if (!showPost) {
    return null;
  }

  return (
    <div
      onClick={onPostClick}
      className={`${postStyle["post"]} ${
        history ? postStyle["post--history"] : null
      }`}
    >
      <Avatar
        roundedCircle
        className={postStyle["post__image"]}
        src={post.avatar}
      />
      {renderTree()}
      <div
        className={`${postStyle["post__content"]} ${
          history ? postStyle["post__content--tree"] : null
        }`}
      >
        <div className={postStyle["post__heading"]}>
          <div className={postStyle["post__heading-text"]}>
            <TwitLink
              className={postStyle["post__display-name"]}
              href={`/users/${post.username}`}
              type="user"
              info={{ ...post, username: post.username }}
            >
              {post.name}
            </TwitLink>
            <span className={postStyle["post__username"] + " muted"}>
              @{post.username}
            </span>
            {renderBadge()}
            <span
              className={postStyle["post__time"]}
            >{` · ${TwitDate.dynamicPostDate(post.created_at)}`}</span>
          </div>
          {renderEditIcon()}
        </div>

        <div className={postStyle["post__text"]}>{renderBody()}</div>
      </div>
      {renderMedia()}
      <div
        className={`${postStyle["post__icons"]} ${
          history ? postStyle["post__icons--tree"] : null
        }`}
      >
        <div className={postStyle["post__icons__holder"]}>
          <TwitIcon
            className={postStyle["post__icon"]}
            icon="/sprites.svg#icon-message-square"
          />
          <span className={postStyle["post__icons__count"]}>
            {post.replies > 0 ? post.replies : null}
          </span>
        </div>
        <div className={postStyle["post__icons__holder"]}>
          <TwitIcon
            className={postStyle["post__icon"]}
            icon="/sprites.svg#icon-repeat"
          />
          <span className={postStyle["post__icons__count"]}>
            {post.reposts}
          </span>
        </div>
        <div
          onClick={onLikeClick}
          className={`${postStyle["post__icons__holder"]} ${
            liked ? postStyle["post__icons__holder__active"] : null
          }`}
        >
          <Like className={postStyle["post__icon"]} liked={liked} />
          <span className={postStyle["post__icons__count"]}>
            {likes > 0 ? likes : null}
          </span>
        </div>
        <div className={postStyle["post__icons__holder"]}>
          <TwitIcon
            onClick={onReplyClick}
            className={postStyle["post__icon"]}
            icon="/sprites.svg#icon-corner-up-right"
          />
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

export default connect(null, { togglePopupReply, trackClickedPost })(Post);
