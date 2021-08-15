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
  console.log(posts);

  const onPostSubmit = async (values) => {
    const post = await createPost(values, user.id);
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

  function itemRenderer(item) {
    return <Post post={item} update={updatePosts} user={user} />;
  }

  return (
    <React.Fragment>
      <div className="twit-container">
        <header className="header">
          <LeftColumn setShowPopupCompose={setShowPopupCompose} />
        </header>
        <main className="main">
          <div className={home["home"]}>
            <TopBar main="Home" />
            <MainInput
              placeHolder="$Team or @Username"
              initialValue=""
              buttonText="Post"
              onSubmit={onPostSubmit}
            />
            <Divide first />
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
      <PopupCompose
        show={showPopupCompose}
        onHide={() => setShowPopupCompose(false)}
        onSubmit={onPostSubmit}
      />
    </React.Fragment>
  );
}

export default HomePage;
