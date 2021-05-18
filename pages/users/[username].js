import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import useSWR from "swr";

import useUser from "../../lib/useUser";
import MainBody from "../../components/MainBody";
import Users from "../../db/repos/Users";
import TwitItem from "../../components/TwitItem";
import TwitTab from "../../components/TwitTab";
import TwitTabs from "../../components/TwitTabs";
import TwitButton from "../../components/TwitButton";
import Avatar from "../../components/Avatar";
import Post from "../../components/Post";
import Empty from "../../components/Empty";
import {
  clearPosts,
  toggleEditProfilePopup,
  fetchUserPosts,
  fetchUser,
  togglePopupCompose,
} from "../../actions";
import TopBar from "../../components/TopBar";
import FeedCard from "../../components/FeedCard";
import UserProfile from "../../components/UserProfile";
import backend from "../../lib/backend";
import teamHolder from "../../sass/components/TeamProfile.module.scss";
import userStyle from "../../sass/components/User.module.scss";

function User(props) {
  const { user } = useUser();
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("posts");
  const [users, setUsers] = useState(null);

  const getUser = async (url) => {
    const response = await backend.get(url, {
      params: {
        userId: user.id,
      },
    });
    return response.data;
  };

  const { data: userProfile } = useSWR(
    props.userProfile && user
      ? `/api/users/${props.userProfile.username}`
      : null,
    getUser,
    { initialData: props.userProfile, revalidateOnMount: true }
  );

  useEffect(() => {
    getSuggestedUsers();
  }, []);

  useEffect(() => {
    if (!user || !userProfile) {
      return;
    }
    props.fetchUserPosts(userProfile.id, user.id, 10, 0);
    return () => {
      props.clearPosts();
    };
  }, [user, userProfile]);

  const getSuggestedUsers = async () => {
    const users = await backend.get("/api/users/suggested", {
      params: {
        num: 3,
      },
    });
    setUsers(users.data);
  };

  const onPostsSelect = (k) => {
    setActiveLink(k.target.id);
    //fetch user posts
    props.fetchUserPosts(userProfile.id, user.id, 10, 0);
  };

  const onMediaSelect = async (k) => {
    setActiveLink(k.target.id);
    //fetch user posts with media
  };

  const onLikesSelect = async (k) => {
    setActiveLink(k.target.id);
    //fetch user liked posts
  };

  const onAvatarClick = () => {
    if (userProfile.id == props.userId) {
      props.toggleEditProfilePopup();
    }
  };

  const renderAction = () => {
    if (userProfile.id == props.userId) {
      return (
        <TwitButton
          onClick={props.toggleEditProfilePopup}
          color="primary"
          outline="primary"
        >
          Edit Profile
        </TwitButton>
      );
    } else {
      return (
        <TwitButton color="primary" outline="primary">
          Scout
        </TwitButton>
      );
    }
  };

  const renderPosts = () => {
    if (props.posts === null) {
      return;
    }
    if (props.posts.length > 0) {
      if (activeLink === "posts") {
        return props.posts.map((post, index) => {
          return <Post key={index} post={post} />;
        });
      } else {
        return null;
      }
    } else if (props.posts.length === 0) {
      if (userProfile.id === props.userId) {
        return (
          <Empty
            main="You haven’t posted yet"
            sub="When you make a post, it’ll show up here."
            actionText="Post now"
            onActionClick={props.togglePopupCompose}
          />
        );
      } else {
        return (
          <Empty
            main="This user hasn't posted yet"
            sub="When they make a post, it’ll show up here."
            actionText="Send message"
          />
        );
      }
    }
  };

  const renderUsers = () => {
    if (users === null) {
      return <div>Loading...</div>;
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
            actionText="Scout"
            paragraph="The most beautiful thing we can experience is the mysterious. It is the source of all true art and science"
          />
        );
      });
    }
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <MainBody>
        <TopBar main={userProfile.username} />
        <UserProfile user={userProfile} />
        <TwitTabs>
          <TwitTab
            onClick={onPostsSelect}
            id={"posts"}
            active={activeLink === "posts" ? true : false}
            title="Posts"
          />
          <TwitTab
            onClick={onMediaSelect}
            id={"media"}
            active={activeLink === "media" ? true : false}
            title="Media"
          />
          <TwitTab
            onClick={onLikesSelect}
            id={"likes"}
            active={activeLink === "likes" ? true : false}
            title="Likes"
          />
        </TwitTabs>
        <div className={userStyle["user__feed-holder"]}>
          {renderPosts()}
          <FeedCard title="Who to Scout">{renderUsers()}</FeedCard>
        </div>
      </MainBody>
    </React.Fragment>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  const { username } = context.params;
  let userProfile = await Users.findOne(username, null);
  userProfile = JSON.parse(JSON.stringify(userProfile));

  return {
    revalidate: 1,
    props: {
      userProfile,
    },
  };
}

const mapStateToProps = (state) => {
  return {
    userId: state.user.id ? state.user.id : null,
    isSignedIn: state.user.isSignedIn,
    posts: state.posts ? state.posts : null,
  };
};

export default connect(mapStateToProps, {
  clearPosts,
  toggleEditProfilePopup,
  fetchUserPosts,
  fetchUser,
  togglePopupCompose,
})(User);
