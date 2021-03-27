import React, { useEffect, useState } from "react";
import Head from 'next/head';
import {useRouter} from "next/router";

import MainBody from "../../components/MainBody"
import thread from "../../sass/components/Thread.module.scss";
import TopBar from "../../components/TopBar";
import backend from "../../lib/backend";
import Post from "../../components/Post"
import ActivePost from "../../components/ActivePost";
import Divide from "../../components/Divide";

function ThreadPage(props){
  const [replies, setReplies] = useState(null);
  const router = useRouter();

  useEffect(() => {
    start();
  }, [props.threadId])

  const start = async () => {
    if(props.threadId){
      let result = await backend.get(`/api/thread/${props.threadId}/replies`);
      const replies = result.data;
      setReplies(replies);
    }
  }

  const renderThread = () => {
    return props.thread.map((post, index) => {
        if(post.id != props.threadId){
            return <Post key={index} post={post}/>
        }
        else if(post.id == props.threadId){
            return (
                <React.Fragment key={index}>
                    <ActivePost post={post}/>
                    <Divide/>
                </React.Fragment>
            )
        }
        
    })
}

const renderReplies = () => {
  if(replies === null){
    return <div>spinner</div>
  }
  else if(replies.length === 0){
    return null;
  }
  else{
    return replies.map((reply, index) => {
      return <Post key={index} post={reply}/>
    })
  }
}

  if (router.isFallback) {
    return <div>Loading...</div>
  }
  else{

  }
    return (
        <React.Fragment>
        <MainBody>
          <div className={thread["thread"]}>
                  <TopBar main="Thread"/>
                  <div className={thread["thread__holder"]}>
                      {renderThread()}
                      {renderReplies()}
                  </div>
            </div>
        </MainBody>
      </React.Fragment>
    )
}


export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  const threadId = context.params.threadId;
    let result = await backend.get(`/api/thread/${threadId}`);
    const thread = result.data;

    return {
        revalidate: 1,
        props: {
          thread,
          threadId 
        } // will be passed to the page component as props
    }  

  }

  export default ThreadPage;
