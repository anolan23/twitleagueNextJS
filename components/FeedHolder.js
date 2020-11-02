import React, {useState} from 'react';
import {connect} from "react-redux";
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

import Post from './Post';
import {togglePostModal, trackClickedPost} from "../actions";
import "../styles/FeedHolder.css";

function FeedHolder(props) {

  const [activeLink, setActiveLink] = useState("first")

  const onPostClick = (post) => {
    props.trackClickedPost(post)
    props.togglePostModal();
  }

  const renderTeamPosts = () => {
    return props.posts.map(post => {
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
          <Nav className="nav-style">
            <Nav.Item>
              <Nav.Link eventKey="first" onSelect={(k) => setActiveLink(k)}>
                <div className={activeLink === "first" ? "link-active" : "link-inactive twit-link"}>
                  <span>Team</span>
                </div>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second" onSelect={(k) => setActiveLink(k)}>
                <div className={activeLink === "second" ? "link-active" : "link-inactive twit-link"}>
                  <span>League</span>
                </div>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="third" onSelect={(k) => setActiveLink(k)}>
                <div className={activeLink === "third" ? "link-active" : "link-inactive twit-link"}>
                  <span>Trending</span>
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

const mapStateToProps = (state) => {
  return {posts: state.posts ? Object.values(state.posts) : null}
}

export default connect(mapStateToProps,{togglePostModal, trackClickedPost})(FeedHolder);
