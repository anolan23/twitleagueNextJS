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
    
    const onAcceptJoinTeamRequestClick = () => {
        const teamId = props.data.teamToJoin._id;
        const userId = props.data.userIssuingRequest._id;
        backend.patch("/api/join/team", {
            teamId,
            userId
        });
        props.deleteNotification(props.index);
    }

    const renderNotification = () => {
        if(props.notification.type ==="Join League Request")
        {
            const text = props.notification.payload.message;
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
        else if(props.type === "Join Team Request"){
            const text = "@"+props.data.userIssuingRequest.username + " wants to join the " + props.data.teamToJoin.teamName + " roster";
            const replacedText = reactStringReplace(text, /@(\w+)/g, (match, i) => (
                <Link key={match + i} passHref href={"/users/"+ props.data.userIssuingRequest.username}><a>@{match}</a></Link>
              ));
            
            return (
                <React.Fragment>
                    <span className={notification["notification__text"]}>{replacedText}</span>
                    <TwitButton onClick={onAcceptJoinTeamRequestClick} color="twit-button--primary">Accept</TwitButton>
                    <TwitButton color="twit-button--primary" outline="twit-button--primary--outline">Decline</TwitButton>
                </React.Fragment>
            );
        }

        else{
            return null;
        }
    }
  
        return (
            <div className={notification["notification"]}>
                <Avatar className={notification["notification__image"]}/>
                {renderNotification()}
            </div>
        );
}

export default connect(null, {deleteNotification})(Notification);