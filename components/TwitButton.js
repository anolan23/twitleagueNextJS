import React from "react";
import Link from "next/link";

import twitButton from "../sass/components/TwitButton.module.scss";

function TwitButton(props){

    const type = () => {
        if(props.square){
            return twitButton["twit-button--square"];
        }
        else{
            return twitButton["twit-button"];
        }
    }

    if(props.href){
        return (
            <Link href={props.href} passHref>
                <a
                    className={`${type()} ${twitButton[props.color]} ${twitButton[props.size]} ${twitButton[props.outline]} ${twitButton[props.collapse]}`} 
                    onClick={props.onClick}
                    disabled={props.disabled}
                    >
                    {props.children}
                </a>
            </Link>
        )
    }
    else{
        return (
            <button 
                type="submit"
                className={`${type()} ${twitButton[props.color]} ${twitButton[props.size]} ${twitButton[props.outline]} ${twitButton[props.collapse]}`} 
                onClick={props.onClick}
                disabled={props.disabled}
                form={props.form ? props.form : null}
                >
                {props.children}
            </button>
        )
    }
  
}

export default TwitButton;