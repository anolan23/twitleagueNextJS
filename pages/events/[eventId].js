import React, {useEffect, useState} from "react";
import Head from 'next/head';
import {useRouter} from "next/router";
import Link from "next/link";
import {toggleUpdateScorePopup} from "../../actions";
import {connect} from "react-redux";

import MainBody from "../../components/MainBody"
import TopBar from "../../components/TopBar";
import events from "../../sass/components/Events.module.scss"
import {fetchEvent, setEvent} from "../../actions";
import Avatar from "../../components/Avatar";
import TwitButton from "../../components/TwitButton";

function EventsPage(props){
    const event = props.event;
    const _event = props._event;
    const router = useRouter();

    useEffect(() => {
        props.setEvent(_event);
    }, [_event])

    const dateString = (string) => {
        const date = new Date(string);
        const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = date.toLocaleDateString([], dateOptions);
        const timeOptions = {hour12: true, hour: '2-digit', minute:'2-digit'};
        const time = date.toLocaleTimeString([], timeOptions);
        const result = `${formattedDate}, ${time}`
        return result;
    }

    const onUpdateScoreClick = () => {
        props.toggleUpdateScorePopup();
    }

    const renderScore = () => {
        if(!event.points){
            return(
                <div className={events["events__event__matchup__symbol-holder"]}>
                    <span className={events["events__event__matchup__symbol__symbol"]}>{event.is_home_team ? "vs" : "@"}</span>
                </div>
            )
        }
        else{
            return(
                <div className={events["events__event__matchup__score"]}>
                    <span className={events["events__event__matchup__score__points"]}>{event.points}</span>
                    <span className={events["events__event__matchup__score__dash"]}>-</span>
                    <span className={events["events__event__matchup__score__points"]}>{event.opponent_points}</span>
                </div>
            )
        }
    }

    const renderEvent = () => {
        if(event === null){
            return <div>Loading...</div>
        }
        else if(event.length === 0){
            return null;
        }
        else{
            return(
                <div className={events["events__event"]}>
                    <div className={events["events__event__info"]}>
                        <Link href={`/leagues/${events.league_name}`} passHref><a className="twit-link">{event.league_name}</a></Link>
                        &nbsp;
                        ·
                        &nbsp;
                        <span className={events["events__event__info__date"]}>{dateString(event.date)}</span>
                        <span className={events["events__event__info__status"]}>{event.play_period}</span>
                    </div>
                    <div className={events["events__event__matchup"]}>
                        <div className={events["events__event__matchup__team"]}>
                            <Avatar className={events["events__event__matchup__team__avatar"]} src={event.avatar}/>
                            <span className={events["events__event__matchup__team__name"]}>{event.team_name}</span>
                        </div>
                        {renderScore()}
                        <div className={events["events__event__matchup__team"]}>
                            <Avatar className={events["events__event__matchup__team__avatar"]} src={event.opponent_avatar}/>
                            <span className={events["events__event__matchup__team__name"]}>{event.opponent_team_name}</span>
                        </div>
                    </div>
                    <div className={events["events__event__more-info"]}>
                        <span className={events["events__event__more-info__info"]}>{event.type}</span>
                        <span className={events["events__event__more-info__info"]}>{event.location ? event.location : "Unknown location"}</span>
                        <p className={events["events__event__more-info__notes"]}>{event.notes}</p>
                    </div>
                </div>
            )
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
                        <TwitButton onClick={onUpdateScoreClick} color="twit-button--primary" size="twit-button--expanded">Update score</TwitButton>
                    </div>
                </TopBar>
                <div className={events["events"]}>
                    {renderEvent()}
                </div>          
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
        event: state.event
    }
}

export default connect(mapStateToProps, {toggleUpdateScorePopup, setEvent})(EventsPage);