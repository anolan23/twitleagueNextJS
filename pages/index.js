import React from "react";
import Head from 'next/head'
import index from "../sass/pages/Index.module.scss";
import Link from "next/link"
import {connect} from "react-redux";

import useUser from "../lib/useUser";
import TwitButton from "../components/TwitButton";
import {fetchUser, toggleSignupPopup} from "../actions";

function IndexPage(props) {
    const { user } = useUser({redirectIfFound: true, redirectTo: "/home"});

    if(!user){
        return <div>...Loading user</div>
    } 
    
    else if(user.isSignedIn){
        return <div>redirecting...</div>
    }

    return (
    <div className={index["index"]}>
        <div className={index["index__left"]}>
            <div className={index["index__left__items"]}>
                <div className={index["index__left__items__item"]}>
                    <svg className={index["index__left__items__item__icon"]}>
                        <use xlinkHref="/sprites.svg#icon-plus-circle"/>
                    </svg>
                    <span className={index["index__left__items__item__text"]}>Join your youth sports team</span>
                </div>
                <div className={index["index__left__items__item"]}>
                    <svg className={index["index__left__items__item__icon"]}>
                        <use xlinkHref="/sprites.svg#icon-plus-circle"/>
                    </svg>
                    <span className={index["index__left__items__item__text"]}>Show off your highlight reels.</span>
                </div>
                <div className={index["index__left__items__item"]}>
                    <svg className={index["index__left__items__item__icon"]}>
                        <use xlinkHref="/sprites.svg#icon-plus-circle"/>
                    </svg>
                    <span className={index["index__left__items__item__text"]}>Join the conversation.</span>
                </div>
            </div>
        </div>
        <div className={index["index__right"]}>
            <div className={index["index__right__content"]}>
                <div className="index__right__content__logo">
                </div>
                <h1 className={index["index__right__content__heading"]}>See what’s happening in the world right now</h1>
                <h3 className={index["index__right__content__subheading"]}>Join twitleague today.</h3>
                <div className={index["index__right__content__actions"]}>
                    <TwitButton onClick={props.toggleSignupPopup} color="twit-button--primary" size="twit-button--expanded-large">Sign up</TwitButton>
                    <TwitButton href="/login" color="twit-button--primary" size="twit-button--expanded-large" outline="twit-button--primary--outline">Log in</TwitButton>
                </div>
            </div>
        </div>
        <nav className={index["index__nav"]}>
            <Link href="/home" passHref>
                <a className={index["index__link"]}>About</a>
            </Link>
            <Link href="/home" passHref>
                <a className={index["index__link"]}>Help Center</a>
            </Link>
            <Link href="/home" passHref>
                <a className={index["index__link"]}>Terms of Service</a>
            </Link>
            <Link href="/home" passHref>
                <a className={index["index__link"]}>Privacy Policy</a>
            </Link>
            <Link href="/home" passHref>
                <a className={index["index__link"]}>Cookie Policy</a>
            </Link>
            <Link href="/home" passHref>
                <a className={index["index__link"]}>Ads Info</a>
            </Link>
            <Link href="/home" passHref>
                <a className={index["index__link"]}>Blog</a>
            </Link>
            <Link href="/home" passHref>
                <a className={index["index__link"]}>Status</a>
            </Link>
            <Link href="/home" passHref>
                <a className={index["index__link"]}>Careers</a>
            </Link>
            <Link href="/home" passHref>
                <a className={index["index__link"]}>Brand Resource</a>
            </Link>
            <Link href="/home" passHref>
                <a className={index["index__link"]}>Advertising</a>
            </Link>
            <Link href="/home" passHref>
                <a className={index["index__link"]}>Marketing</a>
            </Link>
            <Link href="/home" passHref>
                <a className={index["index__link"]}>Developers</a>
            </Link>
            <Link href="/home" passHref>
                <a className={index["index__link"]}>Settings</a>
            </Link>
        </nav>
    </div>
        )
    }

export default connect(null, {fetchUser, toggleSignupPopup})(IndexPage);