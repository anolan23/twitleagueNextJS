import React, { useState } from "react";
import twitInput from "../sass/components/TwitInput.module.scss";
import TwitDropdown from "./TwitDropdown";

function TwitInput(props){

    const [show, setShow] = useState(false);

    const onChange = (event) => {
        props.onChange(event);
        if(!show){
            setShow(true);
        }
        if(!event.target.value){
            setShow(false);
        }
    }

    if(props.select){
        return(
            <select
            id={props.id}
            type={props.type}
            autoComplete="off"
            className={twitInput["twit-input"]}
            placeholder={props.placeHolder}
            onChange={props.onChange}
            onBlur={props.onBlur}
            value={props.value}
            name={props.name}
            >
                {props.children}
            </select>
        );
    }

    else if(props.autoComplete){
        return (
            <React.Fragment>
                <input
                    id={props.id}
                    type={props.type}
                    autoComplete="off"
                    className={twitInput["twit-input"]}
                    placeholder={props.placeHolder}
                    onChange={onChange}
                    onBlur={props.onBlur}
                    value={props.value}
                    name={props.name}
                />
                <TwitDropdown show={show}>
                    {props.children}
                </TwitDropdown>
            </React.Fragment>
            
        );
    }

    else{
        return (
            <input
                id={props.id}
                type={props.type}
                autoComplete="off"
                className={twitInput["twit-input"]}
                placeholder={props.placeHolder}
                onChange={props.onChange}
                onBlur={props.onBlur}
                value={props.value}
                name={props.name}
            />
        );
    }

}

export default TwitInput;