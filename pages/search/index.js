import React, { useState, useEffect } from "react";
import Head from "next/head";

import useUser from "../../lib/useUser";
import { useRouter } from "next/router";
import LeftColumn from "../../components/LeftColumn";
import RightColumn from "../../components/RightColumn";
import Empty from "../../components/Empty";
import Post from "../../components/Post";
import { fetchSearchedPosts } from "../../actions";
import TopBarSearch from "../../components/TopBarSearch";
import TwitTabs from "../../components/TwitTabs";
import TwitTab from "../../components/TwitTab";
import TwitSpinner from "../../components/TwitSpinner";

function Search() {
  const { user } = useUser();
  const router = useRouter();
  const { query } = router.query;
  const [posts, setPosts] = useState(null);
  const [activeTab, setActiveTab] = useState("top");

  useEffect(() => {
    start();
  }, [query, user]);

  async function start() {
    if (!user) {
      return;
    }
    if (!router.isReady) {
      return;
    }
    const posts = await fetchSearchedPosts(query, user.id, 10, 0);
    setPosts(posts);
  }

  const onTabClick = (event) => {
    setActiveTab(event.target.id);
  };

  function renderPosts() {
    if (!posts) {
      return <TwitSpinner size={50} />;
    } else if (posts.length === 0) {
      return (
        <Empty
          main="No posts"
          sub={`your search '${query}' resulted in no posts returned`}
        />
      );
    } else {
      return posts.map((post, index) => {
        return <Post key={index} post={post} listItem={post} />;
      });
    }
  }

  return (
    <React.Fragment>
      <div className="twit-container">
        <header className="header">
          <LeftColumn />
        </header>
        <main className="main">
          <TopBarSearch>
            <TwitTabs>
              <TwitTab
                onClick={onTabClick}
                active={activeTab === "top" ? true : false}
                title="Top"
                id="top"
              />
              <TwitTab
                onClick={onTabClick}
                active={activeTab === "latest" ? true : false}
                title="Latest"
                id="latest"
              />
              <TwitTab
                onClick={onTabClick}
                active={activeTab === "images" ? true : false}
                title="Images"
                id="images"
              />
              <TwitTab
                onClick={onTabClick}
                active={activeTab === "video" ? true : false}
                title="Video"
                id="video"
              />
            </TwitTabs>
          </TopBarSearch>
          <div>{renderPosts()}</div>
        </main>
        <div className="right-bar">
          <RightColumn></RightColumn>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Search;
