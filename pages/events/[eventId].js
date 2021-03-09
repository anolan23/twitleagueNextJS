import React, {useEffect, useState} from "react";
import Head from 'next/head';
import {useRouter} from "next/router";
import Link from "next/link";

import MainBody from "../../components/MainBody"
import TopBar from "../../components/TopBar";
import events from "../../sass/components/Events.module.scss"
import {fetchEvent} from "../../actions";
import Avatar from "../../components/Avatar";

function EventsPage(props){
    const router = useRouter();
    const { eventId } = router.query;
    const [event, setEvent] = useState(null);
    console.log(event)

    useEffect(() => {
        start();
    }, [])

    const start = async () => {
        const event = await fetchEvent(eventId);
        setEvent(event);
    }

    const dateString = (string) => {
        const date = new Date(string);
        const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = date.toLocaleDateString([], dateOptions);
        const timeOptions = {hour12: true, hour: '2-digit', minute:'2-digit'};
        const time = date.toLocaleTimeString([], timeOptions);
        const result = `${formattedDate}, ${time}`
        return result;
    }

    const renderScore = () => {
        if(!event.score){
            return(
                <div className={events["events__event__matchup__symbol-holder"]}>
                    <span className={events["events__event__matchup__symbol__symbol"]}>{event.is_home_team ? "vs" : "@"}</span>
                </div>
            )
        }
        else{
            return(
                <div className={events["events__event__matchup__score"]}>
                    <span className={events["events__event__matchup__score__points"]}>24</span>
                    <span className={events["events__event__matchup__score__dash"]}>-</span>
                    <span className={events["events__event__matchup__score__points"]}>17</span>
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
                        <span className={events["events__event__more-info__type"]}>{event.type}</span>
                        <p className={events["events__event__more-info__notes"]}>{event.notes}</p>
                    </div>
                </div>
            )
        }
    }
    
    return (
        <React.Fragment>
        <MainBody>
            <TopBar main="Event"/>
            <div className={events["events"]}>
                {renderEvent()}
            </div>          
        </MainBody>
      </React.Fragment>
    )
}

  export default EventsPage;