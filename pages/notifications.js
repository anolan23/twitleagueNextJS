import React, {useEffect, useState} from "react";
import Head from 'next/head'

import useUser from "../lib/useUser";
import MainBody from "../components/MainBody"
import {fetchNotifications} from "../actions"
import notificationsStyle from "../sass/components/Notifications.module.scss";
import Notification from "../components/Notification";
import TopBar from "../components/TopBar";
import TwitTabs from "../components/TwitTabs";
import TwitTab from "../components/TwitTab";
import Post from "../components/Post";
import Empty from "../components/Empty";
import backend from "../lib/backend";

function Notifications(props){
  const { user } = useUser()
  const [tab, setTab] = useState("all");
  const [mentionedPosts, setMentionedPosts] = useState(null);
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    if(user){
      getNotifications()
    }
  }, [user]);

  const getNotifications = async () => {
    const notifications = await fetchNotifications(user.id);
    setNotifications(notifications);
 }

  const getUserMentionedPosts = async () => {
      const posts = await backend.get("/api/posts/user",{
          params:{
              userId: props.userId,
              mentioned: true,
              num: 10,
              offset: 0
          }
      });
      setMentionedPosts(posts.data);
   }

  const renderNotifications = () => {
    if(!notifications){
      return null;
    }
    else if(notifications.length === 0){
      return (
        <Empty
            main="You have no notifications."
            sub="come back in  a little bit"
        />
      );
    }
    else{
      return notifications.map((notification, index) => {
        return <Notification key={index} notification={notification} index={index}/>
      });
    }  
  }

  const renderMentions = () => {
      if(mentionedPosts === null){
          return;
      }
      if(mentionedPosts.length > 0){
          return mentionedPosts.map((post, index) => {
              return (
                <Post 
                  key={index}
                  post={post}
                  />
              );
            });
      }
  
      else if(mentionedPosts.length === 0){
          return (
              <Empty
                  main="Nobody has mentioned you in a post"
                  sub="Try to make more friends"
                  actionText="Make friends"
              />
          )
      } 
   }

  const renderContent = () => {   
      if(tab === "all"){
          return renderNotifications();
      }
      else if(tab === "mentions"){
          return renderMentions();
      }
      
  }

  const onAllClick = (event) => {   
      setTab(event.target.id)
  }

  const onMentionsClick = (event) => {   
      setTab(event.target.id)
      getUserMentionedPosts();
  }

  return(
    <React.Fragment>
      <MainBody>
        <div className={notificationsStyle["notifications"]}>
          <TopBar main="Notifications"/>
          <div className={notificationsStyle["notifications__holder"]}>
              <TwitTabs>
                  <TwitTab 
                      onClick={onAllClick}
                      id="all"
                      title="All" 
                      active={tab === "all" ? true : false}

                      />
                  <TwitTab 
                      onClick={onMentionsClick}
                      id="mentions"
                      title="Mentions"
                      active={tab === "mentions" ? true : false}
                      />
              </TwitTabs>
              {renderContent()}
          </div>
        </div>
      </MainBody>
    </React.Fragment>
  )
}

export default Notifications;
