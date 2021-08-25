import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { getThreadReplies } from "../../actions";
import MainBody from "../../components/MainBody";
import threadStyle from "../../sass/pages/Thread.module.scss";
import TopBar from "../../components/TopBar";
import backend from "../../lib/backend";
import Post from "../../components/Post";
import ActivePost from "../../components/ActivePost";
import Divide from "../../components/Divide";
import useUser from "../../lib/useUser";
import useSWR from "swr";
import TwitSpinner from "../../components/TwitSpinner";
import InfiniteList from "../../components/InfiniteList";

function ThreadPage({ threadData, threadId }) {
  const { user } = useUser();
  const router = useRouter();
  const { query, isFallback, isReady } = router;
  const [replies, setReplies] = useState(null);

  const infiniteLoaderRef = useCallback(
    (ref) => {
      if (!ref) {
        return;
      }

      setReplies(null);
      ref.resetLoadMoreRowsCache();
    },
    [query]
  );

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
    {
      initialData: threadData,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  function getData(startIndex, stopIndex) {
    return getThreadReplies({
      threadId,
      userId: user.id,
      startIndex,
      stopIndex,
    });
  }

  function updateReplies(reply) {
    let newReplies = [...replies];
    let index = newReplies.findIndex((newReply) => newReply.id === reply.id);
    newReplies[index] = reply;
    setReplies(newReplies);
  }

  const renderThread = () => {
    return thread.map((post, index) => {
      if (post.id != threadId) {
        return <Post key={index} post={post} user={user} history />;
      } else if (post.id == threadId) {
        return (
          <React.Fragment key={index}>
            <ActivePost post={post} user={user} />
            <Divide />
          </React.Fragment>
        );
      }
    });
  };

  function renderReplies() {
    if (!user || isFallback) {
      return null;
    }
    return (
      <InfiniteList
        getData={getData}
        list={replies}
        item={itemRenderer}
        updateList={(replies) => setReplies(replies)}
        infiniteLoaderRef={infiniteLoaderRef}
      />
    );
  }

  function itemRenderer(item) {
    return <Post post={item} update={updateReplies} user={user} />;
  }

  if (isFallback) {
    return <TwitSpinner size={50} />;
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
