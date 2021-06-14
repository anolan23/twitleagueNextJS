import React from "react";
import {connect} from "react-redux";
import {useRouter} from "next/router";

import twitPanel from "../sass/components/TwitPanel.module.scss";
import {togglePanel, logOutUser} from "../actions";
import Avatar from "./Avatar";
import TwitPanelItem from "./TwitPanelItem";

function TwitPanel(props){

    const router = useRouter();

    const background = () => {
        if(props.showPanel){
            return `${twitPanel["twit-panel__background"]} ${twitPanel["twit-panel__background__open"]}`
        }
        else{
            return twitPanel["twit-panel__background"]
        }
    }

    const panel = () => {
        if(props.showPanel){
            return `${twitPanel["twit-panel"]} ${twitPanel["twit-panel__open"]}`
        }
        else{
            return twitPanel["twit-panel"]
        }
    }

    const logOut = async () => {
        await props.logOutUser();
        props.togglePanel();
    }

    return (
        <div className={background()}>
            <div className={panel()}>
                <div className={twitPanel["twit-panel__heading"]}>
                    <h1 className={twitPanel["twit-panel__heading__text"]}>Account info</h1>
                    <div onClick={props.togglePanel} className={twitPanel["twit-panel__heading__icon-box"]}>
                        <svg className={twitPanel["twit-panel__heading__icon"]}>
                            <use xlinkHref="/sprites.svg#icon-x"/>
                        </svg>
                    </div>
                </div>
                <div className={twitPanel["twit-panel__content"]}>
                    <div className={twitPanel["twit-panel__user"]}>
                        <Avatar className={twitPanel["twit-panel__user__avatar"]} src={props.avatar}/>
                        <div className={twitPanel["twit-panel__user__textbox"]}>
                                <span className={twitPanel["twit-panel__user__text--main"]}>{props.name}</span>
                                <span className={twitPanel["twit-panel__user__text--sub"]}>{`@${props.username}`}</span>
                        </div>
                    </div>
                    <div className={twitPanel["twit-panel__follow"]}>
                        <div className={twitPanel["twit-panel__follow__item"]}>
                            <span className={twitPanel["twit-panel__follow__item__count"]}>4</span>
                            <span className={twitPanel["twit-panel__follow__item__text"]}>Following</span>
                        </div>
                        <div className={twitPanel["twit-panel__follow__item"]}>
                            <span className={twitPanel["twit-panel__follow__item__count"]}>1</span>
                            <span className={twitPanel["twit-panel__follow__item__text"]}>Followers</span>
                        </div>
                    </div>
                    <nav className={twitPanel["twit-panel__nav"]}>
                        <TwitPanelItem text="Profile" href={`/users/${props.username}`} onClick={props.togglePanel}>
                            <use xlinkHref="/sprites.svg#icon-user"/>
                        </TwitPanelItem>
                        <TwitPanelItem text="Create team" href="/teams/create" onClick={props.togglePanel}>
                            <use xlinkHref="/sprites.svg#icon-plus"/>
                        </TwitPanelItem>
                        <TwitPanelItem text="My teams" href="/myTeams" onClick={props.togglePanel}>
                            <use xlinkHref="/sprites.svg#icon-server"/>
                        </TwitPanelItem>
                        <TwitPanelItem text="My leagues" href="/myLeagues" onClick={props.togglePanel}>
                            <use xlinkHref="/sprites.svg#icon-user"/>
                        </TwitPanelItem>
                        <TwitPanelItem text="Log out" href="/" onClick={logOut}>
                            <use xlinkHref="/sprites.svg#icon-arrow-left"/>
                        </TwitPanelItem>
                    </nav>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        name: state.user.name,
        username: state.user.username,
        avatar: state.user.avatar,
        showPanel: state.modals.showPanel
    }
}

export default connect(mapStateToProps, {togglePanel, logOutUser})(TwitPanel);