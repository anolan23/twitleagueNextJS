import twitInput from "../sass/components/TwitInput.module.scss";

function TwitInput(props){
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
    )
}

export default TwitInput;