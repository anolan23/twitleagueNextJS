import React, {useState, useEffect} from "react";
import { Gif } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";

import twitMedia from "../sass/components/TwitMedia.module.scss";
import TwitIcon from "./TwitIcon";
import ReactPlayer from "react-player";


function TwitMedia(props) {

    const [gif, setGif] = useState(null);
    console.log(gif);

    useEffect(() => {
        if(props.media.type === "gif"){
            fetchGif(props.media.location);
        }
    }, [props.media])

    const fetchGif = async (gifId) => {
        const giphyFetch = new GiphyFetch("G2kN8IH9rTIuaG2IZGKO9il0kWamzKmX");
        const {data} = await giphyFetch.gif(gifId);
        setGif(data);
      }

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

    const renderMedia = () => {
        if(props.media.type === "file"){
            return (
                <div className={twitMedia["twit-media__file"]}>
                    <ReactPlayer controls muted className={twitMedia["twit-media__player"]} url={props.media.location} height="100%" width="100%"></ReactPlayer>
                </div>
            )
        }
        else if(props.media.type === "gif"){
            if(gif){
                return <Gif gif={gif} width="100%"/>
            }
            else{
                return null;
            }
        }
        else{
            return null;
        }
    }

    return (
        <div className={twitMedia["twit-media"]}>
            {renderClose()}
            {renderMedia()}
        </div>
    );
}

export default TwitMedia;