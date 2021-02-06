import TwitInput from "./TwitInput";
import twitForm from "../sass/components/TwitForm.module.scss";

function TwitInputGroup(props){
    return(
        <div className={twitForm["twit-form__group"]}>
            <label htmlFor={props.id} className={twitForm["twit-form__label"]}>{props.labelText}</label>
            {props.children}
        </div>
    )
}

export default TwitInputGroup;