import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import reactStringReplace from "react-string-replace";
import Link from "next/link";

import activePost from "../sass/components/ActivePost.module.scss";
import post from "../sass/components/Post.module.scss";
import Avatar from "../components/Avatar";
import {Gif} from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import {trackClickedPost, togglePopupReply} from "../actions";

function ActivePost(props){

  const [gif, setGif] = useState(null);

  useEffect(() => {
    if(props.post.gif){
      fetchGif();
    }
  }, [])

  const fetchGif = async () => {
    const giphyFetch = new GiphyFetch("G2kN8IH9rTIuaG2IZGKO9il0kWamzKmX");
    const {data} = await giphyFetch.gif(props.post.gif);
    setGif(data);
  }

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

      const renderMedia = () => {
        if(gif){
          return (
            <div className={post["post__gif"]}>
              <Gif gif={gif} width="100%" height="auto"/>
            </div>
          );
        }
        else{
          return null;
        }
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
                      <use xlinkHref="/sprites.svg#icon-heart"/>
                    </svg>                  
                    <svg onClick={onReplyClick} className={activePost["active-post__icon"]}>
                      <use xlinkHref="/sprites.svg#icon-corner-up-right"/>
                    </svg>
            </div>

        </div>
    )
}

export default connect(null, {trackClickedPost, togglePopupReply})(ActivePost);