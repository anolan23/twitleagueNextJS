import React from "react";
import Link from "next/link";
import {connect} from "react-redux";
import {useRouter} from "next/router";
import reactStringReplace from "react-string-replace";

import notification from "../sass/components/Notification.module.scss";
import TwitButton from "./TwitButton";
import Avatar from "./Avatar";
import backend from "../lib/backend";
import {deleteNotification} from "../actions";

function Notification(props) {
    const router = useRouter();

    const onAcceptJoinLeagueRequestClick = () => {
        const leagueId = props.notification.league_id;
        const teamId = props.notification.team_id;
        backend.patch("/api/join/league", {leagueId,teamId});
        props.deleteNotification(props.notification.id);
    }

    // const onDeclineClick = () => {
    //     const league = props.data.leagueToJoin;
    //     const team = props.data.teamIssuingRequest;
    //     backend.patch("/league", {league,team});
    //     props.deleteNotification(props.index);
    // }
    
    const onAcceptJoinTeamInviteClick = async () => {
        const teamId = props.notification.team_id;
        const userId = props.notification.user_id;
        await backend.post("/api/teams/rosters", {
            teamId,
            userId
        });
        props.deleteNotification(props.notification.id);
    }

    const renderSymbol = () => {
        if(props.notification.is_home_team){
            return "vs"
        }
        else{
            return "@"
        }
    }

    const renderNotification = () => {
        switch(props.notification.type){
            case "Join League Request": {
                const text = `${props.notification.abbrev}  wants to join ${props.notification.league_name}`;
                const replacedText = reactStringReplace(text, /\$(\w+)/g, (match, i) => (
                    <Link key={match + i} passHref href={`/teams/${props.notification.abbrev.substring(1)}`}><a className="twit-link">${match}</a></Link>
                  ));
                return (
                    <div className={notification["notification"]} onClick={() => router.push(`/teams/${props.notification.abbrev.substring(1)}`)}>
                        <Avatar className={notification["notification__image"]} src={props.notification.team_avatar}/>
                        <span className={notification["notification__text"]}>{replacedText}</span>
                        <div className={notification["notification__actions"]}>
                            <TwitButton onClick={onAcceptJoinLeagueRequestClick} color="twit-button--primary">Accept</TwitButton>
                            <TwitButton color="twit-button--primary" outline="twit-button--primary--outline">Decline</TwitButton>
                        </div>
                    </div>
                );
            }
            case "Join Team Invite": {
                const text = `${props.notification.abbrev} wants you to play for their team`;
                const replacedText = reactStringReplace(text, /\$(\w+)/g, (match, i) => (
                    <Link key={match + i} passHref href={"/teams/"+ props.notification.abbrev}><a>${match}</a></Link>
                  ));
                
                return (
                    <div className={notification["notification"]} onClick={() => router.push(`/teams/${props.notification.abbrev.substring(1)}`)}>
                        <span className={notification["notification__text"]}>{replacedText}</span>
                        <div className={notification["notification__actions"]}>
                            <TwitButton onClick={onAcceptJoinTeamInviteClick} color="twit-button--primary">Accept</TwitButton>
                            <TwitButton color="twit-button--primary" outline="twit-button--primary--outline">Decline</TwitButton>
                        </div>
                    </div>
                );
            }
            case "Awaiting Event Approval": {
                const event = `${props.notification.team_name} ${renderSymbol()} ${props.notification.opponent_team_name} `;
                const text = `game has ended and is waiting for ${props.notification.events_league_name} approval`

                return (
                    <div className={notification["notification"]} onClick={() => router.push("/events/" + props.notification.event_id)}>
                        <Link passHref href={"/events/"+ props.notification.event_id}><a className={notification["notification__text"]}>{event}</a></Link>
                        &nbsp;
                        <span className={notification["notification__text"]}>{text}</span>
                    </div>
                )
            }

            default:
                return null;
        }

    }
  
        return (
            <React.Fragment>
                {renderNotification()}
            </React.Fragment>
        );
}

export default connect(null, {deleteNotification})(Notification);