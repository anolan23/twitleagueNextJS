import React from "react"
import Link from "next/link"
import twitNavItem from "../sass/components/TwitNavItem.module.scss"

function TwitNavItem(props){
    return (
        <div className={`${props.className} ${twitNavItem["twit-nav-item"]}`}>
            <Link href={props.href} passHref>
                <a className={`${twitNavItem["twit-nav-item__holder"]} ${twitNavItem["twit-nav-item__tagged"]}`}>
                    {props.children} 
                    <div className={twitNavItem["twit-nav-item__text-holder"]}>
                        <span className={twitNavItem["twit-nav-item__text"]}>{props.title}</span>
                    </div>
                </a>     
            </Link>
        </div>
    );
}

export default TwitNavItem;