import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { fetchThreadReplies, clearReplies } from "../../actions";
import MainBody from "../../components/MainBody";
import thread from "../../sass/components/Thread.module.scss";
import TopBar from "../../components/TopBar";
import backend from "../../lib/backend";
import Post from "../../components/Post";
import ActivePost from "../../components/ActivePost";
import Divide from "../../components/Divide";
import useUser from "../../lib/useUser";
import useSWR from "swr";
import TwitSpinner from "../../components/TwitSpinner";

function ThreadPage({ threadData, threadId }) {
  const { user } = useUser();
  const router = useRouter();
  const [replies, setReplies] = useState(null);

  useEffect(async () => {
    if (threadId && user) {
      const results = await fetchThreadReplies(threadId, user.id);
      console.log(results);
      setReplies(results);
    }

    return () => {
      clearReplies();
    };
  }, [threadId, user]);

  const getThread = async (url) => {
    const response = await backend.get(url, {
      params: {
        userId: user.id,
      },
    });
    return response.data;
  };

  const { data: thread } = useSWR(
    threadId && user ? `/api/thread/${threadId}` : null,
    getThread,
    { initialData: threadData, revalidateOnMount: true }
  );

  const renderThread = () => {
    return thread.map((post, index) => {
      if (post.id != threadId) {
        return <Post key={index} post={post} history />;
      } else if (post.id == threadId) {
        return (
          <React.Fragment key={index}>
            <ActivePost post={post} />
            <Divide />
          </React.Fragment>
        );
      }
    });
  };

  const renderReplies = () => {
    if (!replies) {
      return <TwitSpinner size={50} />;
    } else if (replies.length === 0) {
      return null;
    } else {
      return replies.map((reply, index) => {
        return <Post key={index} listItem={reply} />;
      });
    }
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  } else {
  }
  return (
    <React.Fragment>
      <MainBody>
        <div className={thread["thread"]}>
          <TopBar main="Thread" />
          <div className={thread["thread__holder"]}>
            {renderThread()}
            {renderReplies()}
          </div>
        </div>
      </MainBody>
    </React.Fragment>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  const { threadId } = context.params;
  let result = await backend.get(`/api/thread/${threadId}`);
  const threadData = result.data;

  return {
    revalidate: 1,
    props: {
      threadData,
      threadId,
    }, // will be passed to the page component as props
  };
}

export default ThreadPage;
