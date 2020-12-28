import React, {useState, useEffect} from 'react';
import Link from "next/link";
import { useRouter } from 'next/router'
import Avatar from "./Avatar";
import Badge from 'react-bootstrap/Badge';
import {connect} from "react-redux";
import {Gif} from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import reactStringReplace from "react-string-replace";


import {likePost, togglePopupReply, trackClickedPost} from "../actions";
import post from "../sass/components/Post.module.scss";

function Post(props) {

  const [gif, SetGif] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if(props.post.gif){
      fetchGif();
    }
  }, [])

  const fetchGif = async () => {
    const giphyFetch = new GiphyFetch("G2kN8IH9rTIuaG2IZGKO9il0kWamzKmX");
    const {data} = await giphyFetch.gif(props.post.gif);
    SetGif(data);
  }

  const renderMedia = () => {
    if(gif)
    {
      return (
        <div className={post["post__gif"]}>
          <Gif gif={gif} width="100%"/>
        </div>
      );
    }
    else{
      return null;
    }
  }


  const renderBadge = () => {
    if(props.post.outlook === "bullish"){
      return <Badge className="bullish" pill variant="success">Bullish</Badge>
    }
    else if(props.post.outlook === "bearish"){
      return <Badge className="bearish" pill variant="danger">Bearish</Badge>
    }
    else{
      return null;
    }
  }

  const renderContent = () => {
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

  const onPostClick = () => {
    router.push(`/thread/${props.post.conversation_id}`)
  }

  const onReplyClick = () => {
    props.trackClickedPost(props.post);
    props.togglePopupReply();
  }
    return (
      <div onClick={onPostClick} className={post.post}>
          <Avatar roundedCircle className={post["post__image"]}/>
          <div className={post["post__content"]}>
              <div className={post["post__heading"]}>
                <div className={post["post__heading-text"]}>
                  <Link passHref href={props.post.username?"/users/" + props.post.username:""}><a className={post["post__display-name"]}>{props.post.name}</a></Link>
                  <span className={post["post__username"] + " muted"}>@{props.post.username}</span>
                  {renderBadge()}
                </div>
                <span className={post["post__time"]}>{props.post.created_at}</span>
              </div>
              
              <p className={post["post__text"]}>{renderContent()}</p>
              {renderMedia()} 
          </div>
          <div className={post["post__icons"]}>
                  <div className={post["post__icons__holder"]}>
                    <svg className={post["post__icon"]}>
                      <use xlinkHref="/sprites.svg#icon-message-square"/>
                    </svg>
                    <span className={post["post__icons__count"]}>{props.post.replies}</span>
                  </div>
                  <div className={post["post__icons__holder"]}>
                    <svg className={post["post__icon"]}>
                      <use xlinkHref="/sprites.svg#icon-repeat"/>
                    </svg>
                    <span className={post["post__icons__count"]}>{props.post.reposts}</span>
                  </div>
                  <div onClick={() => props.likePost(props.post.id)} className={post["post__icons__holder"]}>
                    <svg className={post["post__icon"]}>
                      <use xlinkHref="/sprites.svg#icon-thumbs-up"/>
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


const mapStateToProps = (state) => {
  return {
    posts: state.posts
  }
}

export default connect(mapStateToProps, {likePost, togglePopupReply, trackClickedPost})(Post);