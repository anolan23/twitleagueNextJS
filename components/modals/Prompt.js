import React from "react";

import prompt from "../../sass/components/Prompt.module.scss";
import TwitButton from "../../components/TwitButton";

function Prompt(props){

    const onPromptClick = (event) => {
        event.stopPropagation();
        props.onHide();
    }

    if(props.show){
        return(
            <div className={`${prompt["prompt"]} ${prompt["prompt__show"]}`} onClick={onPromptClick}>
                <div className={prompt["prompt__window"]}>
                    <span className={prompt["prompt__window__main"]}>{props.main}</span>
                    <p className={prompt["prompt__window__sub"]}>{props.sub}</p>
                    <div className={prompt["prompt__window__actions"]}>
                        <TwitButton onClick={props.onSecondaryActionClick} color={"twit-button--primary"} size="twit-button--expanded-large" outline="twit-button--primary--outline">{props.secondaryActionText}</TwitButton>
                        <TwitButton onClick={props.onPrimaryActionClick} color={"twit-button--primary"} size="twit-button--expanded-large">{props.primaryActionText}</TwitButton>
                    </div>
                </div>
            </div>
        )
    }
    else{
        return null;
    }

   
}

export default Prompt;