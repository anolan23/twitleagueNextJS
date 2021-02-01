import React from "react";

import input from "../sass/components/Input.module.scss";

function Input(props){
    return (
        <input
            id={props.id}
            type={props.type}
            autoComplete="off"
            className={input["input"]}
            placeholder={props.placeHolder}
            onChange={props.onChange}
            onBlur={props.onBlur}
            value={props.value}
            name={props.name}
        />
    )
}

export default Input;