import attribute from "../sass/components/Attribute.module.scss";
import TwitIcon from "./TwitIcon";

function Attribute(props){
    return (
        <div className={attribute["attribute"]}>
                <TwitIcon className={attribute["attribute__icon"]} icon={props.icon}/>
                <span className={attribute["attribute__text"]}>{props.text}</span>
        </div>
    )
}

export default Attribute;