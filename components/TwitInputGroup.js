import TwitInput from "./TwitInput";
import twitForm from "../sass/components/TwitForm.module.scss";

function TwitInputGroup(props){
    return(
        <div className={twitForm["twit-form__group"]}>
            <label htmlFor={props.id} className={twitForm["twit-form__label"]}>{props.labelText}</label>
            <TwitInput
                id={props.id} 
                onChange={props.onChange} 
                onBlur={props.onBlur} 
                value={props.value} 
                name={props.name} 
                type={props.type} 
                className={props.className}
                placeHolder={props.placeHolder}
            />
        </div>
    )
}

export default TwitInputGroup;