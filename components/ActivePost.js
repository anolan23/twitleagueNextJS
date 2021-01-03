import React from "react";
import {connect} from "react-redux";
import reactStringReplace from "react-string-replace";
import Link from "next/link";

import activePost from "../sass/components/ActivePost.module.scss";
import Avatar from "../components/Avatar";
import {trackClickedPost, togglePopupReply} from "../actions";

function ActivePost(props){

    const onReplyClick = () => {
        props.trackClickedPost(props.post);
        props.togglePopupReply();
      }

      const renderBody = () => {
        const text = props.post.body;
        let replacedText;
        replacedText = reactStringReplace(text, /\$(\w+)/g, (match, i) => (
          <Link key={match + i} href={`/teams/${match}`}><a className="twit-link">${match}</a></Link>
        ));
    
        replacedText = reactStringReplace(replacedText, /@(\w+)/g, (match, i) => (
          <Link key={match + i} href={`/users/${match}`}><a className="twit-link">@{match}</a></Link>
        ));
    
        return replacedText
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
            <div className={activePost["active-post__timestamp"]}>
                {props.post.created_at} · twitleague Web App
            </div>
            <div className={activePost["active-post__stats"]}>
                <div className={activePost["active-post__stat-box"]}>
                    <span className={activePost["active-post__value"]}>{props.post.likes}</span>
                    <span className={activePost["active-post__stat"]}>Likes</span>
                </div>
            </div>
            <div className={activePost["active-post__icons"]}>
                    <svg className={activePost["active-post__icon"]}>
                      <use xlinkHref="/sprites.svg#icon-message-square"/>
                    </svg>                  
                    <svg className={activePost["active-post__icon"]}>
                      <use xlinkHref="/sprites.svg#icon-repeat"/>
                    </svg>
                    <svg className={activePost["active-post__icon"]}>
                      <use xlinkHref="/sprites.svg#icon-thumbs-up"/>
                    </svg>                  
                    <svg onClick={onReplyClick} className={activePost["active-post__icon"]}>
                      <use xlinkHref="/sprites.svg#icon-corner-up-right"/>
                    </svg>
            </div>

        </div>
    )
}

export default connect(null, {trackClickedPost, togglePopupReply})(ActivePost);