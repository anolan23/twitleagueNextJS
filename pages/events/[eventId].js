import React, {useEffect, useState} from "react";
import Head from 'next/head';
import {useRouter} from "next/router";
import Link from "next/link";
import {toggleUpdateScorePopup, approveEvent} from "../../actions";
import {connect} from "react-redux";

import MainBody from "../../components/MainBody"
import TopBar from "../../components/TopBar";
import events from "../../sass/components/Events.module.scss"
import activePost from "../../sass/components/ActivePost.module.scss";
import {fetchEvent, setEvent, fetchEventPosts} from "../../actions";
import TwitButton from "../../components/TwitButton";
import SmallInput from "../../components/SmallInput";
import Matchup from "../../components/Matchup";
import Empty from "../../components/Empty";
import Post from "../../components/Post";

function EventsPage(props){
    const event = props.event;
    const _event = props._event;
    const router = useRouter();
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        start();
    }, [_event])

    const start = async () => {
        props.setEvent(_event);
        const posts = await fetchEventPosts(props.event.id);
        setPosts(posts);
    }

    const onUpdateScoreClick = () => {
        props.toggleUpdateScorePopup();
    }

    const onApproveClick = () => {
        props.approveEvent(event.id);
    }

    const renderEvent = () => {
        if(event === null){
            return <div>Loading...</div>
        }
        else if(event.length === 0){
            return null;
        }
        else{
            return (
                <div className={events["events__event"]}>
                    <Matchup event={event}/>
                    <div className={activePost["active-post__timestamp"]}>
                        {event.created_at} · twitleague Web App
                    </div>
                    <div className={activePost["active-post__stats"]}>
                        <div className={activePost["active-post__stat-box"]}>
                            <span className={activePost["active-post__value"]}>{0}</span>
                            <span className={activePost["active-post__stat"]}>Likes</span>
                        </div>
                    </div>
                    <div className={activePost["active-post__icons"]}>
                            <div className={activePost["active-post__icons__holder"]}>
                            <svg className={activePost["active-post__icon"]}>
                                <use xlinkHref="/sprites.svg#icon-message-square"/>
                            </svg> 
                            </div>                  
                            <div className={activePost["active-post__icons__holder"]}>
                            <svg className={activePost["active-post__icon"]}>
                                <use xlinkHref="/sprites.svg#icon-repeat"/>
                            </svg>
                            </div> 
                            <div onClick={null} className={`${activePost["active-post__icons__holder"]}`}>
                            <svg className={activePost["active-post__icon"]}>
                                <use xlinkHref="/sprites.svg#icon-heart"/>
                            </svg>
                            </div>               
                            <div onClick={null} className={activePost["active-post__icons__holder"]}>
                            <svg className={activePost["active-post__icon"]}>
                                <use xlinkHref="/sprites.svg#icon-corner-up-right"/>
                            </svg>
                            </div> 
                    </div>
                </div>
            )
        }
    }

    const renderUpdateScoreAction = () => {
        const approvedUsers = [event.owner_id, event.team_owner_id, event.opponent_owner_id]
        if(!approvedUsers.includes(props.userId) || event.league_approved){
            return null
        }
        else{
            return <TwitButton onClick={onUpdateScoreClick} color="twit-button--primary">Update score</TwitButton>
        }
    }

    const renderPosts = () => {
        if(posts === null){
            return <div>spinner</div>
        }
        else if(posts.length === 0){
            return <Empty main="No posts" sub="Be the first to post about this event"/>
        }
        else{
            return posts.map((post, index) => {
                return <Post key={index} post={post}/>
            })
        }
    } 

    const renderApproveAction = () => {
        if(props.userId !== event.owner_id){
            return null
        }
        else if(event.play_period === "Final"){
            if(!event.league_approved){
            return <TwitButton onClick={onApproveClick} color="twit-button--primary">Approve</TwitButton>
            }
            else{
            return <TwitButton disabled color="twit-button--primary">Approved</TwitButton>
            }
        }
        else{
        return <TwitButton disabled color="twit-button--primary">Approve</TwitButton>
        }
    }

    if (router.isFallback) {
        return <div>Loading...</div>
    }
    else{
        return (
            <React.Fragment>
            <MainBody>
                <TopBar main="Event">
                    <div className={events["events__event__more-info__actions"]}>
                        {renderUpdateScoreAction()}
                        {renderApproveAction()}
                    </div>
                </TopBar>
                <div className={events["events"]}>
                    {renderEvent()}
                </div> 
                <SmallInput/>
                {renderPosts()}       
            </MainBody>
          </React.Fragment>
        )
    }
    
    

}

export async function getStaticPaths() {
    return { paths: [], fallback: true };
  }
  
export async function getStaticProps(context) {
    const eventId = context.params.eventId;
    const _event = await fetchEvent(eventId);

    return {
        revalidate: 1,
        props: {
        _event
        } // will be passed to the page component as props
    }  

}

const mapStateToProps = (state) => {
    return {
        event: state.event,
        userId: state.user.id
    }
}

export default connect(mapStateToProps, {toggleUpdateScorePopup, setEvent, approveEvent})(EventsPage);