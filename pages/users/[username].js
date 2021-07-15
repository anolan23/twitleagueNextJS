import React, { useState, useEffect, useCallback, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import useSWR from "swr";

import useUser from "../../lib/useUser";
import Users from "../../db/repos/Users";
import TwitItem from "../../components/TwitItem";
import TwitTab from "../../components/TwitTab";
import TwitTabs from "../../components/TwitTabs";
import Post from "../../components/Post";
import Empty from "../../components/Empty";
import {
  fetchPostsByUsername,
  fetchMediaPostsByUsername,
  fetchLikedPostsByUsername,
} from "../../actions";
import TopBar from "../../components/TopBar";
import FeedCard from "../../components/FeedCard";
import UserProfile from "../../components/UserProfile";
import backend from "../../lib/backend";
import userStyle from "../../sass/components/User.module.scss";
import InfiniteList from "../../components/InfiniteList";
import SuggestedUsers from "../../components/SuggestedUsers";
import WhatsHappening from "../../components/WhatsHappening";
import SuggestedTeams from "../../components/SuggestedTeams";
import LeftColumn from "../../components/LeftColumn";
import RightColumn from "../../components/RightColumn";
import TwitSpinner from "../../components/TwitSpinner";
import EditProfilePopup from "../../components/modals/EditProfilePopup";

function User({ userData }) {
  const { user } = useUser();
  const { query, isReady, isFallback } = useRouter();
  const [showEditProfilePopup, setShowEditProfilePopup] = useState(false);
  const [tab, setTab] = useState("posts");
  const [users, setUsers] = useState(null);
  const [posts, setPosts] = useState(null);
  const [mediaPosts, setMediaPosts] = useState(null);
  const [likedPosts, setLikedPosts] = useState(null);
  const postsLoaderRef = useRef(null);
  const mediaPostsLoaderRef = useRef(null);
  const likedPostsLoaderRef = useRef(null);

  const getUser = async (url) => {
    const response = await backend.get(url, {
      params: {
        userId: user.id,
      },
    });
    return response.data;
  };

  const { data: userProfile } = useSWR(
    userData && user ? `/api/users/${userData.username}` : null,
    getUser,
    { initialData: userData, revalidateOnMount: true }
  );

  useEffect(() => {
    setPosts(null);
    setMediaPosts(null);
    setLikedPosts(null);

    setTab("posts");

    return () => {
      if (postsLoaderRef.current) {
        postsLoaderRef.current.resetLoadMoreRowsCache();
      }
      if (mediaPostsLoaderRef.current) {
        mediaPostsLoaderRef.current.resetLoadMoreRowsCache();
      }
      if (likedPostsLoaderRef.current) {
        likedPostsLoaderRef.current.resetLoadMoreRowsCache();
      }
    };
  }, [query.username]);

  useEffect(() => {
    getSuggestedUsers();
  }, []);

  const getSuggestedUsers = async () => {
    const users = await backend.get("/api/users/suggested", {
      params: {
        num: 3,
      },
    });
    setUsers(users.data);
  };

  const onPostsSelect = (k) => {
    setTab(k.target.id);
    //fetch user posts
  };

  const onMediaSelect = async (k) => {
    setTab(k.target.id);
    //fetch user posts with media
  };

  const onLikesSelect = async (k) => {
    setTab(k.target.id);
    //fetch user liked posts
  };

  const renderUsers = () => {
    if (users === null) {
      return <TwitSpinner size={30} />;
    } else if (users.length === 0) {
      return <Empty main="No Users" sub="There are no users to scout" />;
    } else {
      return users.map((user, index) => {
        return (
          <TwitItem
            key={index}
            avatar={user.avatar}
            title={user.name}
            subtitle={`@${user.username}`}
            onClick={() => router.push(`/users/${user.username}`)}
            actionText="Scout"
            paragraph="The most beautiful thing we can experience is the mysterious. It is the source of all true art and science"
          />
        );
      });
    }
  };

  const renderEmpty = () => {
    return (
      <Empty main="No posts" sub={`@${query.username} hasn't posted yet`} />
    );
  };

  const renderContent = () => {
    switch (tab) {
      case "posts":
        return (
          <InfiniteList
            key={query.username}
            getDataFromServer={(startIndex, stopIndex) =>
              fetchPostsByUsername({
                username: query.username,
                userId: user.id,
                startIndex,
                stopIndex,
              })
            }
            list={posts}
            updateList={(posts) => setPosts(posts)}
            infiniteLoaderRef={postsLoaderRef}
            empty={renderEmpty()}
          >
            <Post user={user} />
          </InfiniteList>
        );

      case "media":
        return (
          <InfiniteList
            key={query.username}
            getDataFromServer={(startIndex, stopIndex) =>
              fetchMediaPostsByUsername({
                username: query.username,
                userId: user.id,
                startIndex,
                stopIndex,
              })
            }
            list={mediaPosts}
            updateList={(mediaPosts) => setMediaPosts(mediaPosts)}
            infiniteLoaderRef={mediaPostsLoaderRef}
            empty={renderEmpty()}
          >
            <Post user={user} />
          </InfiniteList>
        );

      case "likes":
        return (
          <InfiniteList
            key={query.username}
            getDataFromServer={(startIndex, stopIndex) =>
              fetchLikedPostsByUsername({
                username: query.username,
                userId: user.id,
                startIndex,
                stopIndex,
              })
            }
            list={likedPosts}
            updateList={(likedPosts) => setLikedPosts(likedPosts)}
            infiniteLoaderRef={likedPostsLoaderRef}
            empty={renderEmpty()}
          >
            <Post user={user} />
          </InfiniteList>
        );

      default:
        return null;
    }
  };

  if (isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <div className="twit-container">
        <header className="header">
          <LeftColumn />
        </header>
        <main className="main">
          <div className={userStyle["user"]}>
            <TopBar main={userProfile.username} />
            <UserProfile
              userProfile={userProfile}
              onAvatarClick={() => setShowEditProfilePopup(true)}
            />
            <TwitTabs>
              <TwitTab
                onClick={onPostsSelect}
                id="posts"
                active={tab === "posts" ? true : false}
                title="Posts"
              />
              <TwitTab
                onClick={onMediaSelect}
                id="media"
                active={tab === "media" ? true : false}
                title="Media"
              />
              <TwitTab
                onClick={onLikesSelect}
                id="likes"
                active={tab === "likes" ? true : false}
                title="Likes"
              />
            </TwitTabs>
            <div className={userStyle["user__feed-holder"]}>
              {renderContent()}
              <FeedCard title="Who to Scout">{renderUsers()}</FeedCard>
            </div>
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
      <EditProfilePopup
        show={showEditProfilePopup}
        onHide={() => setShowEditProfilePopup(false)}
      />
    </React.Fragment>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  const { username } = context.params;
  let userData = await Users.findOne(username, null);
  userData = JSON.parse(JSON.stringify(userData));

  return {
    revalidate: 1,
    props: {
      userData,
    },
  };
}

export default User;
