import React, { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import useSWR from 'swr';

import useUser from '../../../lib/useUser';
import Users from '../../../db/repos/Users';
import TwitItem from '../../../components/TwitItem';
import TwitTab from '../../../components/TwitTab';
import TwitTabs from '../../../components/TwitTabs';
import Post from '../../../components/Post';
import Empty from '../../../components/Empty';
import {
  getUsersPosts,
  fetchMediaPostsByUsername,
  fetchLikedPostsByUsername,
} from '../../../actions';
import TopBar from '../../../components/TopBar';
import FeedCard from '../../../components/FeedCard';
import UserProfile from '../../../components/UserProfile';
import backend from '../../../lib/backend';
import styles from '../../../sass/components/User.module.scss';
import InfiniteList from '../../../components/InfiniteList';
import SuggestedUsers from '../../../components/SuggestedUsers';
import WhatsHappening from '../../../components/WhatsHappening';
import SuggestedTeams from '../../../components/SuggestedTeams';
import LeftColumn from '../../../components/LeftColumn';
import RightColumn from '../../../components/RightColumn';
import TwitSpinner from '../../../components/TwitSpinner';
import EditProfilePopup from '../../../components/modals/EditProfilePopup';

function User({ userData }) {
  const { user } = useUser();

  const router = useRouter();
  const { query, isReady, isFallback } = router;
  const { username } = query;

  const [showEditProfilePopup, setShowEditProfilePopup] = useState(false);
  const [tab, setTab] = useState('posts');
  const [users, setUsers] = useState(null);
  const [posts, setPosts] = useState(null);

  const fetcher = async (url) => {
    const response = await backend.get(url, {
      params: {
        userId: user.id,
      },
    });
    return response.data;
  };

  const { data: userProfile } = useSWR(
    username && userData.id ? `/api/users/${username}` : null,
    fetcher,
    { revalidateOnMount: true, revalidateOnFocus: false }
  );

  console.log(userProfile);

  const infiniteLoaderRef = useCallback(
    (ref) => {
      if (!ref) {
        return;
      }

      setPosts(null);
      ref.resetLoadMoreRowsCache();
    },
    [tab]
  );

  useEffect(() => {
    getSuggestedUsers();
  }, []);

  const getSuggestedUsers = async () => {
    const users = await backend.get('/api/users/suggested', {
      params: {
        num: 3,
      },
    });
    setUsers(users.data);
  };

  function getData(startIndex, stopIndex) {
    return getUsersPosts({
      username,
      filter: tab,
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
    const { id } = event.target;
    setTab(id);
  }

  function renderUsers() {
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
  }

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
    return <Post post={item} update={updatePosts} user={user} fadeIn />;
  }

  function renderPosts() {
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
  }

  if (isFallback) {
    return <TwitSpinner size={50} />;
  } else {
    return (
      <React.Fragment>
        <div className="twit-container">
          <header className="header">
            <LeftColumn />
          </header>
          <main className="main">
            <div className={styles['user']}>
              <TopBar main={userProfile?.username} />
              <UserProfile
                userProfile={userProfile}
                onAvatarClick={() => setShowEditProfilePopup(true)}
              />
              <TwitTabs>
                <TwitTab
                  onClick={onTabSelect}
                  id="posts"
                  active={tab === 'posts' ? true : false}
                  title="Posts"
                />
                <TwitTab
                  onClick={onTabSelect}
                  id="media"
                  active={tab === 'media' ? true : false}
                  title="Media"
                />
                <TwitTab
                  onClick={onTabSelect}
                  id="likes"
                  active={tab === 'likes' ? true : false}
                  title="Likes"
                />
              </TwitTabs>
              <div className={styles['user__feed-holder']}>
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
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  console.log(context.params);
  const { username } = context.params;
  let userData = await Users.findOne(username, null);
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
