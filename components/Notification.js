import React from "react";
import Link from "next/link";
import {connect} from "react-redux";
import reactStringReplace from "react-string-replace";

import notification from "../sass/components/Notification.module.scss";
import TwitButton from "./TwitButton";
import Avatar from "./Avatar";
import backend from "../lib/backend";
import {deleteNotification} from "../actions";

function Notification(props) {

    const onAcceptJoinLeagueRequestClick = () => {
        const leagueId = props.notification.payload.league_id;
        const teamId = props.notification.payload.team_id;
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

    const renderNotification = () => {
        if(props.notification.type ==="Join League Request")
        {
            const text = `${props.notification.team_name}  wants to join ${props.notification.league_name}`;
            const replacedText = reactStringReplace(text, /\$(\w+)/g, (match, i) => (
                <Link key={match + i} passHref href={"/teams/"}><a>${match}</a></Link>
              ));
            return (
                <React.Fragment>
                    <span className={notification["notification__text"]}>{replacedText}</span>
                    <div className={notification["notification__actions"]}>
                        <TwitButton onClick={onAcceptJoinLeagueRequestClick} color="twit-button--primary">Accept</TwitButton>
                        <TwitButton color="twit-button--primary" outline="twit-button--primary--outline">Decline</TwitButton>
                    </div>
                </React.Fragment>
            );
        }
        else if(props.notification.type === "Join Team Invite"){
            const text = `${props.notification.abbrev} wants you to play for their team`;
            const replacedText = reactStringReplace(text, /\$(\w+)/g, (match, i) => (
                <Link key={match + i} passHref href={"/teams/"+ props.notification.abbrev}><a>${match}</a></Link>
              ));
            
            return (
                <React.Fragment>
                    <span className={notification["notification__text"]}>{replacedText}</span>
                    <div className={notification["notification__actions"]}>
                        <TwitButton onClick={onAcceptJoinTeamInviteClick} color="twit-button--primary">Accept</TwitButton>
                        <TwitButton color="twit-button--primary" outline="twit-button--primary--outline">Decline</TwitButton>
                    </div>
                </React.Fragment>
            );
        }

        else{
            return null;
        }
    }
  
        return (
            <div className={notification["notification"]}>
                <Avatar className={notification["notification__image"]} src={props.notification.team_avatar}/>
                {renderNotification()}
            </div>
        );
}

export default connect(null, {deleteNotification})(Notification);