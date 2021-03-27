import React from "react";
import {connect} from "react-redux";

import smallInput from "../sass/components/SmallInput.module.scss";
import {togglePopupEventReply} from "../actions";
import Avatar from "./Avatar";
import TwitIcon from "./TwitIcon";
import Divide from "./Divide";
function SmallInput(props){
    return(
        <React.Fragment>
            <Divide/>
            <div className={smallInput["small-input"]} onClick={props.togglePopupEventReply}>
                <Avatar className={smallInput["small-input__avatar"]} src={props.user.avatar}/>
                <div className={smallInput["small-input__input"]}>
                    <div className={smallInput["small-input__input__text"]}>Share your thoughts</div>
                </div>
                <div className={smallInput["small-input__actions"]}>
                    <TwitIcon className={smallInput["small-input__actions__icon"]} icon="/sprites.svg#icon-image"/>
                    <TwitIcon className={smallInput["small-input__actions__icon"]} icon="/sprites.svg#icon-image"/>
                </div>
            </div>
            <Divide/>
        </React.Fragment>
        
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, {togglePopupEventReply})(SmallInput);