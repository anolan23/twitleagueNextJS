import React, {useState} from "react";
import {connect} from "react-redux";

import notifications from "../sass/components/Notifications.module.scss";
import Notification from "./Notification";
import TopBar from "./TopBar";
import TwitTabs from "./TwitTabs";
import TwitTab from "./TwitTab";
import Post from "./Post";
import Empty from "./Empty";
import backend from "../lib/backend";

function Notifications(props) {
    const [tab, setTab] = useState("all");
    const [mentionedPosts, setMentionedPosts] = useState(null);

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
       if(props.notifications.length > 0){
        return props.notifications.map((notification, index) => {
            return <Notification key={index} notification={notification} index={index}/>
        }
       );
       
       }
       else{
        return (
            <Empty
                main="You have no notifications."
                sub="come back in  a little bit"
            />
        );
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
                    main="Nobody has mentioned you in a post."
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
        return (
            <div className={notifications["notifications"]}>
                <TopBar main="Notifications"/>
                <div className={notifications["notifications__holder"]}>
                    <TwitTabs>
                        <TwitTab 
                            onClick={onAllClick}
                            id={"all"} 
                            title="All" 
                            active={tab === "all" ? true : false}

                            />
                        <TwitTab 
                            onClick={onMentionsClick}
                            id={"mentions"} 
                            title="Mentions"
                            active={tab === "mentions" ? true : false}
                            />
                    </TwitTabs>
                    {renderContent()}
                </div>
            </div>
        );
    }

const mapStateToProps = (state) => {
    return {
        notifications: state.user.notifications ? state.user.notifications : [],
        userId: state.user.id
    }
}

export default connect(mapStateToProps)(Notifications);