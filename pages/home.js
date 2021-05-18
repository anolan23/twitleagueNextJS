import React, { useEffect, useState } from "react";
import Head from "next/head";
import { connect } from "react-redux";

import useUser from "../lib/useUser";
import backend from "../lib/backend";
import MainBody from "../components/MainBody";
import AuthBanner from "../components/AuthBanner";
import { fetchUser, clearPosts, fetchHomeTimeline } from "../actions";
import MainInput from "../components/MainInput";
import TopBar from "../components/TopBar";
import Post from "../components/Post";
import { createPost } from "../actions";
import Divide from "../components/Divide";
import home from "../sass/components/Home.module.scss";
import Empty from "../components/Empty";
import SuggestedUsers from "../components/SuggestedUsers";
import WhatsHappening from "../components/WhatsHappening";
import SuggestedTeams from "../components/SuggestedTeams";
import LeftColumn from "../components/LeftColumn";
import RightColumn from "../components/RightColumn";
import InfiniteList from "../components/InfiniteList";

function HomePage(props) {
  const { user } = useUser({ redirectTo: "/" });
  const [posts, setPosts] = useState([]);

  const onSubmit = (values) => {
    props.createPost(values, user.id);
  };

  const renderPosts = () => {
    if (props.posts === null) {
      return;
    }
    if (props.posts.length > 0) {
      return props.posts.map((post, index) => {
        return <Post key={index} post={post} />;
      });
    } else if (props.posts.length === 0) {
      return (
        <Empty
          main="Welcome to twitleague!"
          sub="This is the best place to see what’s happening in sports. Find some teams to follow and players to scout."
          actionText="Let's go!"
          actionHref="/suggested"
        />
      );
    }
  };

  const right = () => {
    return (
      <React.Fragment>
        <WhatsHappening />
        <SuggestedTeams />
        <SuggestedUsers />
      </React.Fragment>
    );
  };

  if (!user || !user.isSignedIn) {
    return <div style={{ fontSize: "30px" }}>loading homepage</div>;
  }

  return (
    <React.Fragment>
      <div className="twit-container">
        <header className="header">
          <LeftColumn />
        </header>
        <main className="main">
          <div className={home["home"]}>
            <TopBar main="Home" />
            <MainInput
              placeHolder="$Team or @Username"
              initialValue=""
              buttonText="Post"
              onSubmit={onSubmit}
            />
            <Divide first />
            <InfiniteList
              getDataFromServer={(startIndex, stopIndex) =>
                fetchHomeTimeline(user.id, startIndex, stopIndex)
              }
              list={posts}
              updateList={(posts) => setPosts(posts)}
              emptyMain="Welcome to twitleague!"
              emptySub="This is the best place to see what’s happening in sports. Find some teams to follow and players to scout."
              emptyActionText="Let's go!"
              emptyActionHref="/suggested"
            >
              <Post />
            </InfiniteList>
          </div>
        </main>
        <div className="right-bar">
          <RightColumn>
            <WhatsHappening />
            <SuggestedTeams />
            <SuggestedUsers />
          </RightColumn>
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    posts: state.posts ? state.posts : null,
  };
};

export default connect(mapStateToProps, { fetchUser, clearPosts, createPost })(
  HomePage
);
