import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import useUser from "../lib/useUser";
import { fetchHomeTimeline } from "../actions";
import MainInput from "../components/MainInput";
import TopBar from "../components/TopBar";
import Post from "../components/Post";
import { createPost } from "../actions";
import Divide from "../components/Divide";
import home from "../sass/components/Home.module.scss";
import SuggestedUsers from "../components/SuggestedUsers";
import WhatsHappening from "../components/WhatsHappening";
import SuggestedTeams from "../components/SuggestedTeams";
import LeftColumn from "../components/LeftColumn";
import RightColumn from "../components/RightColumn";
import InfiniteList from "../components/InfiniteList";
import PopupCompose from "../components/modals/PopupCompose";
import Empty from "../components/Empty";
import TwitSpinner from "../components/TwitSpinner";

function HomePage() {
  const { user } = useUser({ redirectTo: "/" });
  const router = useRouter();
  const [posts, setPosts] = useState(null);
  const [showPopupCompose, setShowPopupCompose] = useState(false);

  const onPostSubmit = async (newPost) => {
    const post = await createPost(newPost, user.id);
    setPosts((prevArray) => [post, ...prevArray]);
    return post;
  };

  function updatePosts(post) {
    let newPosts = [...posts];
    let index = newPosts.findIndex((newPost) => newPost.id === post.id);
    newPosts[index] = post;
    setPosts(newPosts);
  }

  function getData(startIndex, stopIndex) {
    return fetchHomeTimeline(user.id, startIndex, stopIndex);
  }

  if (!user || !user.isSignedIn) {
    return (
      <div style={{ fontSize: "30px" }}>
        <TwitSpinner size={50} />
      </div>
    );
  }

  function renderEmpty() {
    if (!posts) {
      return null;
    } else if (posts.length > 0) {
      return null;
    } else {
      return (
        <Empty
          main="No posts"
          sub={`Follow teams and/or scout players to populate your home timeline`}
          actionText="View suggestions"
          onActionClick={() => router.push("/suggested/teams")}
        />
      );
    }
  }

  function itemRenderer(item) {
    return <Post post={item} update={updatePosts} user={user} fadeIn />;
  }

  return (
    <React.Fragment>
      <div className="twit-container">
        <header className="header">
          <LeftColumn onSubmit={onPostSubmit} />
        </header>
        <main className="main">
          <div className={home["home"]}>
            <TopBar main="Home" />
            <MainInput
              placeHolder="$Team or @Username"
              initialValue=""
              buttonText="Post"
              onSubmit={onPostSubmit}
              user={user}
            />
            <Divide first />
            {renderEmpty()}
            <InfiniteList
              getData={getData}
              list={posts}
              item={itemRenderer}
              updateList={(posts) => setPosts(posts)}
            />
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

export default HomePage;
