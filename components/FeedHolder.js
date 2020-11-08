import React, {useState} from 'react';
import {connect} from "react-redux";
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

import Post from './Post';
import {togglePostModal, trackClickedPost} from "../actions";
import styles from "../styles/FeedHolder.module.css";

function FeedHolder(props) {

  const [activeLink, setActiveLink] = useState("first")

  const onPostClick = (post) => {
    props.trackClickedPost(post)
    props.togglePostModal();
  }

  const posts = props.posts ? Object.values(props.posts) : null
  const renderTeamPosts = () => {
    return posts.map(post => {
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
          onClick={() => onPostClick(post)}
          />
      );
    })
  }
  
  return (
    <Tab.Container id="feedHolder" defaultActiveKey="first">
          <Nav className={styles["nav-style"]}>
            <Nav.Item>
              <Nav.Link eventKey="first" onSelect={(k) => setActiveLink(k)}>
                <div className={activeLink === "first" ? styles["link-active"] : styles["link-inactive"] + " " + styles["twit-link"]}>
                  <span className="span-block">Team</span>
                </div>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second" onSelect={(k) => setActiveLink(k)}>
                <div className={activeLink === "second" ? styles["link-active"] : styles["link-inactive"] + " " + styles["twit-link"]}>
                  <span className="span-block">League</span>
                </div>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="third" onSelect={(k) => setActiveLink(k)}>
                <div className={activeLink === "third" ? styles["link-active"] : styles["link-inactive"] + " " + styles["twit-link"]}>
                  <span className="span-block">Trending</span>
                </div>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="first">
              {renderTeamPosts()}
            </Tab.Pane>
            <Tab.Pane eventKey="second">
              {/* <Sonnet /> */}
            </Tab.Pane>
          </Tab.Content>
    </Tab.Container>
  );
}

export default connect(null, {trackClickedPost, togglePostModal})(FeedHolder);
