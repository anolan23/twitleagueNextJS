import React from "react";

import twitMedia from "../sass/components/TwitMedia.module.scss";
import TwitIcon from "./TwitIcon";
import ReactPlayer from "react-player";

function TwitMedia(props) {

    const renderClose = () => {
        if(props.close){
            return(
                <div onClick={props.onClick} className={twitMedia["twit-media__close"]}>
                    <TwitIcon className={twitMedia["twit-media__icon"]} icon="/sprites.svg#icon-x"/>
                </div>
            )
        }
        else{
            return null;
        }
    }

    return (
        <div className={twitMedia["twit-media"]}>
            {renderClose()}
            <ReactPlayer controls muted className={twitMedia["twit-media__player"]} url={props.url} height="100%" width="100%"></ReactPlayer>
        </div>
    );
}

export default TwitMedia;