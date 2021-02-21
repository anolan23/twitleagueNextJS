import React from "react";
import {Gif} from "@giphy/react-components";
import {connect} from "react-redux";

import twitGif from "../sass/components/TwitGif.module.scss";
import {closeMedia} from "../actions";

function TwitGif(props) {

    return (
        <div className={twitGif["twit-gif"]}>
            <div onClick={props.closeMedia} className={twitGif["twit-gif__close"]}>
                <svg className={twitGif["twit-gif__icon"]}>
                    <use xlinkHref="/sprites.svg#icon-x"/>
                </svg>
            </div>
            <Gif gif={props.gif} width="100%"/>
        </div>
    );
}

export default connect(null, {closeMedia})(TwitGif);