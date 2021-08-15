import React, { useState, useEffect, useCallback, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import useSWR from "swr";

import useUser from "../../../lib/useUser";
import Users from "../../../db/repos/Users";
import TwitItem from "../../../components/TwitItem";
import TwitTab from "../../../components/TwitTab";
import TwitTabs from "../../../components/TwitTabs";
import Post from "../../../components/Post";
import Empty from "../../../components/Empty";
import {
  getUsersPosts,
  fetchMediaPostsByUsername,
  fetchLikedPostsByUsername,
} from "../../../actions";
import TopBar from "../../../components/TopBar";
import FeedCard from "../../../components/FeedCard";
import UserProfile from "../../../components/UserProfile";
import backend from "../../../lib/backend";
import userStyle from "../../../sass/components/User.module.scss";
import InfiniteList from "../../../components/InfiniteList";
import SuggestedUsers from "../../../components/SuggestedUsers";
import WhatsHappening from "../../../components/WhatsHappening";
import SuggestedTeams from "../../../components/SuggestedTeams";
import LeftColumn from "../../../components/LeftColumn";
import RightColumn from "../../../components/RightColumn";
import TwitSpinner from "../../../components/TwitSpinner";
import EditProfilePopup from "../../../components/modals/EditProfilePopup";

function User({ userData }) {
  const { user } = useUser();

  const router = useRouter();
  const { query, isReady, isFallback } = router;
  const { username } = query;
  const [_username, filter = "posts"] = username || [];

  const [showEditProfilePopup, setShowEditProfilePopup] = useState(false);
  const [tab, setTab] = useState(filter);
  const [users, setUsers] = useState(null);
  const [posts, setPosts] = useState(null);

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
    { initialData: userData, revalidateOnMount: true, revalidateOnFocus: false }
  );

  const infiniteLoaderRef = useCallback(
    (ref) => {
      if (!ref) {
        return;
      }

      setPosts(null);
      ref.resetLoadMoreRowsCache();
    },
    [filter]
  );

  useEffect(() => {
    setTab(filter);
  }, [filter]);

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

  function getData(startIndex, stopIndex) {
    return getUsersPosts({
      username: _username,
      filter,
      userId: user.id,
      startIndex,
      stopIndex,
    });
  }

  function updatePosts(post) {
    let newPosts = [...posts];
    let index = newPosts.findIndex((newPost) => newPost.id === post.id);
    newPosts[index] = post;
    setPosts(newPosts);
  }

  function onTabSelect(event) {
    const { username } = userProfile;
    const { id } = event.target;
    const filter = id === "posts" ? "" : id;
    router.push(
      {
        pathname: `/users/${username}/${filter}`,
      },
      undefined,
      { shallow: true, scroll: false }
    );
  }

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

  function renderEmpty() {
    if (!posts) {
      return null;
    } else if (posts.length > 0) {
      return null;
    } else {
      return (
        <Empty main="No posts" sub={`@${query.username} hasn't posted yet`} />
      );
    }
  }

  function itemRenderer(item) {
    return <Post post={item} update={updatePosts} user={user} />;
  }

  const renderPosts = () => {
    if (!user || !isReady) {
      return null;
    }
    return (
      <InfiniteList
        getData={getData}
        list={posts}
        item={itemRenderer}
        updateList={(posts) => setPosts(posts)}
        infiniteLoaderRef={infiniteLoaderRef}
      />
    );
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
                onClick={onTabSelect}
                id="posts"
                active={tab === "posts" ? true : false}
                title="Posts"
              />
              <TwitTab
                onClick={onTabSelect}
                id="media"
                active={tab === "media" ? true : false}
                title="Media"
              />
              <TwitTab
                onClick={onTabSelect}
                id="likes"
                active={tab === "likes" ? true : false}
                title="Likes"
              />
            </TwitTabs>
            <div className={userStyle["user__feed-holder"]}>
              {renderEmpty()}
              {renderPosts()}
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
  let userData = await Users.findOne(username[0], null);
  console.log(userData);
  userData = JSON.parse(JSON.stringify(userData));

  return {
    revalidate: 1,
    props: {
      userData,
    },
  };
}

export default User;
