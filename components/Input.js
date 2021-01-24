import React from "react";

import input from "../sass/components/Input.module.scss";

function Input(props){
    return (
        <input 
            type={props.type} 
            className={input["input"]}
            placeholder={props.placeHolder}
            onChange={props.onChange}
            value={props.value}
        />
    )
}

export default Input;