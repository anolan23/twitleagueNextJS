import React, {useEffect} from "react";
import Head from 'next/head'
import {connect} from "react-redux";
import {useRouter} from "next/router";

import {loginUser} from "../actions";
import login from "../sass/pages/Login.module.scss";
import twitForm from "../sass/components/TwitForm.module.scss";
import TwitButton from "../components/TwitButton";

function LoginPage(props) {
    const router = useRouter();
    useEffect(() => {
        if(props.isSignedIn){
            router.push("/home");
        }
    }, [props.isSignedIn])

    const onSubmit = (event) => {
        event.preventDefault();
        const elements = event.target.elements;
        const formData = {
          username:elements.username.value,
          password:elements.password.value
        }
        props.loginUser(formData);
  
      }

  return (
    <div className={login["login"]}>
        <div className={login["login__logo"]}>

        </div>
        <h1 className="heading-1">Log in to twitleague</h1>
        <form onSubmit={onSubmit} className={twitForm["twit-form"]}>
            <div className={twitForm["twit-form__group"]}>
                <label htmlFor="username" className={twitForm["twit-form__label"]}>Username</label>
                <input 
                    id="username"  
                    name="username" 
                    type="text" 
                    autoComplete="off" 
                    className={twitForm["twit-form__input"]}
                />
            </div>
            <div className={twitForm["twit-form__group"]}>
                <label htmlFor="password" className={twitForm["twit-form__label"]}>Password</label>
                <input 
                    id="password"  
                    name="password" 
                    type="password" 
                    autoComplete="off" 
                    className={twitForm["twit-form__input"]}
                />
            </div>
            <TwitButton color="twit-button--primary" size="twit-button--expanded-large">Log in</TwitButton>
        </form>
        <div className={login["login__secondary-actions"]}>
            <div className={login["login__secondary-action"]}>Forgot password?</div>
            <div className={login["login__secondary-action"]}>Sign up for twitleague</div>
        </div>
    </div>
  )
}

const mapStateToProps = (state) => {
    return {isSignedIn: state.user.isSignedIn}
}

export default connect(mapStateToProps, {loginUser})(LoginPage);