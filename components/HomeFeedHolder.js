import React from 'react';
import {connect} from "react-redux";
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

import Post from './Post';
import {togglePostModal, trackClickedPost, fetchUserAndWatchListPosts, fetchWatchListPosts} from "../actions";
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
    this.setState({activeLink:k})
    this.props.fetchWatchListPosts();
  }

  renderWatchListPosts = () => {
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
      <Tab.Container id="homeFeedHolder" defaultActiveKey={this.state.activeLink}>
        <Nav className={styles["nav-style"]}>
          <Nav.Item>
            <Nav.Link eventKey="watchList" onSelect={this.onWatchListSelect}>
              <div className={this.state.activeLink === "watchList" ? styles["link-active"] : styles["link-inactive"] + " " + styles["twit-link"]}>
                <span className="span-block">Watchlist</span>
              </div>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="people" onSelect={(k) => this.setState({activeLink:k})}>
              <div className={this.state.activeLink === "people" ? styles["link-active"] : styles["link-inactive"] + " " + styles["twit-link"]}>
                <span className="span-block">People</span>
              </div>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="suggestions" onSelect={(k) => this.setState({activeLink:k})}>
              <div className={this.state.activeLink === "suggestions" ? styles["link-active"] : styles["link-inactive"] + " " + styles["twit-link"]}>
                <span className="span-block">Suggestions</span>
              </div>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="trending" onSelect={(k) => this.setState({activeLink:k})}>
              <div className={this.state.activeLink === "trending" ? styles["link-active"] : styles["link-inactive"] + " " + styles["twit-link"]}>
                <span className="span-block">Trending</span>
              </div>
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="watchList">
            {this.renderWatchListPosts()}
          </Tab.Pane>
          <Tab.Pane eventKey="people">
            {/* <Sonnet /> */}
          </Tab.Pane>
          <Tab.Pane eventKey="suggestions">
            {/* <Sonnet /> */}
          </Tab.Pane>
          <Tab.Pane eventKey="trending">
            {/* <Sonnet /> */}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
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
  fetchWatchListPosts})(HomeFeedHolder);
