import React from "react";
import {connect} from "react-redux";
import {toggleSignUpModal} from "../actions";

import TwitButton from "./TwitButton";
import authBanner from "../sass/components/AuthBanner.module.scss";

function AuthBanner(props){
    if(props.isSignedIn){
        return null;
    }
    else{
        return (
                <div className={authBanner["auth-banner"]}>
                    <div className="auth-banner__text">
                        <h1 className="heading-1">Don’t miss what’s happening</h1>
                        <h2 className="heading-3">People on twitleague are the first to know.</h2>
                    </div>
                    <div className={authBanner["auth-banner__actions"]}>
                        <TwitButton href="/login" color="twit-button--white" outline="twit-button--white--outline">Log in</TwitButton>
                        <TwitButton onClick={props.toggleSignUpModal} color="twit-button--white">Sign up</TwitButton>
                    </div>
                </div>  
        )
    }
}

const mapStateToProps = (state) => {
    return {isSignedIn: state.user.isSignedIn};
}

export default connect(mapStateToProps, {toggleSignUpModal})(AuthBanner);