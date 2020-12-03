import React from 'react';
import {connect} from "react-redux";
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

import Post from './Post';
import {togglePostModal, trackClickedPost, fetchUserAndWatchListPosts, fetchWatchListPosts, fetchTrendingPosts} from "../actions";
import TwitTabs from "./TwitTabs";
import TwitTab from "./TwitTab";
import styles from "../styles/FeedHolder.module.css";

class HomeFeedHolder extends React.Component {

  state = {activeLink: "watchList"};

  componentDidMount(){
    if(this.state.activeLink === "watchList"){
      this.props.fetchUserAndWatchListPosts();
    }
    else if(this.state.activeLink === "people"){

    }
    else if(this.state.activeLink === "suggestions"){
      
    }
    else if(this.state.activeLink === "trending"){
      
    }
    else{

    }
  }

  onPostClick = (post) => {
    this.props.trackClickedPost(post)
    this.props.togglePostModal();
  }

  onWatchListSelect = (k) => {
    this.setState({activeLink:k.target.id})
    this.props.fetchWatchListPosts();
  }

  onTrendingSelect = (k) => {
    this.setState({activeLink:k.target.id})
    this.props.fetchTrendingPosts(10);
  }

  renderPosts = () => {
    return this.props.posts.map(post => {
      return (
        <Post 
          key={post._id}
          id={post._id}
          author={post.author} 
          content={post.postText} 
          likes={post.likes ? Object.keys(post.likes).length : 0} 
          retwits={post.retwits}
          comments={post.comments ? Object.keys(post.comments).length : 0}
          gifId={post.gifId}
          time={post.dateTime}
          outlook={post.outlook}
          onClick={() => this.onPostClick(post)}
          />
      );
    })
  }
  
  render(){
    return (
      <React.Fragment>
        <TwitTabs>
          <TwitTab onClick={this.onWatchListSelect} id={"watchlist"} active={this.state.activeLink === "watchlist" ? true : false} title="Watching"/>
          <TwitTab onClick={(k) => this.setState({activeLink: k.target.id})} id={"people"} active={this.state.activeLink === "people" ? true : false} title="People"/>
          <TwitTab onClick={(k) => this.setState({activeLink: k.target.id})} id={"suggestions"} active={this.state.activeLink === "suggestions" ? true : false} title="Suggestions"/>
          <TwitTab onClick={(k) => this.setState({activeLink: k.target.id})} id={"trending"} active={this.state.activeLink === "trending" ? true : false} title="Trending"/>
        </TwitTabs>
        {this.renderPosts()}
      </React.Fragment>
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
    posts: state.posts ? Object.values(state.posts) : null,
  }
}

export default connect(mapStateToProps, {
  togglePostModal, 
  trackClickedPost, 
  fetchUserAndWatchListPosts, 
  fetchWatchListPosts,
  fetchTrendingPosts
})(HomeFeedHolder);
