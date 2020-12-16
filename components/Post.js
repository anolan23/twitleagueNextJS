import React from 'react';
import Link from "next/link";
import Avatar from "./Avatar";
import Badge from 'react-bootstrap/Badge';
import {connect} from "react-redux";
import {Gif} from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import reactStringReplace from "react-string-replace";


import {likePost} from "../actions";
import post from "../sass/components/Post.module.scss";

class Post extends React.Component {

  state = {gif: null};

  componentDidMount(){
    if(this.props.gifId){
      this.fetchGif();
    }
  }

  fetchGif = async () => {
    const giphyFetch = new GiphyFetch("G2kN8IH9rTIuaG2IZGKO9il0kWamzKmX");
    const {data} = await giphyFetch.gif(this.props.gifId);
    this.setState({gif: data});
  }

  styleLikedPost = (postId) => {
    if(!this.props.posts[postId]){
      return null;
    }
    if(!this.props.posts[postId].likes)
    {
      return null;
    }
    if(this.props.posts[postId].likes[this.props.username]){
      return {
        color:"#00baff",
        textDecoration: "none",
        transition: "color .2s ease-in-out"
      }
    }
  }

  renderMedia = () => {
    if(this.state.gif)
    {
      return (
        <div className={post["post__gif"]}>
          <Gif gif={this.state.gif} width="100%"/>
        </div>
      );
    }
    else{
      return null;
    }
  }

  renderTime = () => {
    const currentDate = new Date();
    const currentDayofMonth = currentDate.getDate();
    // const currentTime = currentDate.getTime();
    const postDate = new Date(parseInt(this.props.time));
    const postDayofMonth = postDate.getDate();
    // const postTime = postDate.getTime();

    if(postDayofMonth !== currentDayofMonth)
    {
      return postDate.toDateString();
    }
    else {
      return postDate.toLocaleTimeString();
    }

  }

  renderBadge = () => {
    if(this.props.outlook === "bullish"){
      return <Badge className="bullish" pill variant="success">Bullish</Badge>
    }
    else if(this.props.outlook === "bearish"){
      return <Badge className="bearish" pill variant="danger">Bearish</Badge>
    }
    else{
      return null;
    }
  }

  renderContent = () => {
    const text = this.props.content;
    let replacedText;
    replacedText = reactStringReplace(text, /\$(\w+)/g, (match, i) => (
      <Link key={match + i} href={`/team/${match}`}><a className="twit-link">${match}</a></Link>
    ));

    replacedText = reactStringReplace(replacedText, /@(\w+)/g, (match, i) => (
      <Link key={match + i} href={`/users/${match}`}><a className="twit-link">@{match}</a></Link>
    ));

    return replacedText
  }

  
  
  render() {
    return (
      <div onClick={this.props.onClick} className={this.props.selected ? `${post.post} ${post["post__selected"]}` : post.post}>
  
          <Avatar roundedCircle className={post["post__image"]}/>
          <div className={post["post__content"]}>
              <div className={post["post__heading"]}>
                <div className={post["post__heading-text"]}>
                  <Link passHref href={"/users/" + this.props.author}><a className={post["post__display-name"]}>{this.props.author}</a></Link>
                  <span className={post["post__username"] + " muted"}>@{this.props.author}</span>
                  {this.renderBadge()}
                </div>
                <span className={post["post__time"]}>{this.renderTime()}</span>
              </div>
              
              <p className={post["post__text"]}>{this.renderContent()}</p>
              {this.renderMedia()} 
          </div>
          <div className={post["post__icons"]}>
                  <svg className={post["post__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-thumbs-up"/>
                  </svg>
                  <svg className={post["post__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-corner-up-right"/>
                  </svg>
                  <svg className={post["post__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-repeat"/>
                  </svg>
                  <svg className={post["post__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-message-square"/>
                  </svg>
            </div>
      </div>
  );
  }
  
}


const mapStateToProps = (state) => {
  return {
    posts: state.posts,
    username: state.user.username
  }
}

export default connect(mapStateToProps, {likePost})(Post);