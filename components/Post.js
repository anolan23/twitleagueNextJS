import React from 'react';
import Link from "next/link";
import Avatar from "./Avatar";
import Badge from 'react-bootstrap/Badge';
import {connect} from "react-redux";
import {Gif} from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import reactStringReplace from "react-string-replace";


import {likePost} from "../actions";
import styles from "../styles/Post.module.css";

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

  renderGif = () => {
    if(this.state.gif)
    {
      return (
        <Gif gif={this.state.gif} width={200}/>
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
      <div onClick={this.props.onClick} className={this.props.selected ? `${styles.post} ${styles.selected}` : styles.post}>
  
          <Avatar roundedCircle className={styles["avatar-post"]}/>
          <div style={{width:"100%"}}>
              <div className={styles["post-heading-div"]}>
                <div className={styles["post-heading-div-left"]}>
                  <Link passHref href={"/users/" + this.props.author}><a className={styles["username"]}>{this.props.author}</a></Link>
                  <div className={styles["badge-div"]}>
                    {this.renderBadge()}
                  </div>
                </div>
                <span className={styles.time}>{this.renderTime()}</span>
              </div>
              
              <p className={styles.content}>{this.renderContent()}</p>
              {this.renderGif()}
              <div style={{display:"flex" , justifyContent:"space-between"}}>
                <div className="icon-holder">
                  <div style={{alignSelf:"center"}}> 
                    <div onClick={() => this.props.likePost(this.props.id)} style={this.styleLikedPost(this.props.id)} className={styles["post-icons"]}>
                      <i style={{paddingRight:"5px"}} className="fas fa-thumbs-up"></i>
                  
                      <span>{this.props.likes}</span>
                    </div>
                  </div>
                  <div style={{alignSelf:"center"}} href="#icon"> 
                    <div className={styles["post-icons"]}>
                      <i style={{paddingRight:"5px"}} className="fas fa-reply"></i>
                    </div>
                  </div>
                  <div style={{alignSelf:"center"}} href="#icon"> 
                    <div className={styles["post-icons"]}>
                      <i style={{paddingRight:"5px"}} className="fas fa-retweet"></i>
                  
                      <span>{this.props.retwits}</span>
                    </div>
                  </div>
                  <div style={{alignSelf:"center"}} href="#icon"> 
                    <div className={styles["post-icons"]}>
                      <i style={{paddingRight:"5px"}} className="fas fa-ellipsis-h"></i>
                    </div>
                  </div>
                </div>
                  <div style={{marginRight:"0"}}>
                    <div style={{alignSelf:"center"}} href="#icon"> 
                      <div className={styles["post-icons"]}>
                        <i style={{paddingRight:"5px"}} className="fas fa-comment"></i>
                        <span>{this.props.comments}</span>
                      </div>
                    </div>
                  </div>
              </div>
            
              
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