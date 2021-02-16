import {useRouter} from "next/router";
import twitStat from "../sass/components/TwitStat.module.scss";
import Avatar from "./Avatar";
import TwitButton from "./TwitButton";

function TwitStat(props){
    const router = useRouter();

    const onClick = () => {
        if(props.href){
            router.push(props.href);
        }
        else if(props.onClick){
            props.onClick();
        }
        
    }

    const renderAvatar = () => {
            return <Avatar roundedCircle className={twitStat["twit-stat__avatar"]} src={props.avatar}/>
    
    }

    const renderAction = () => {
        if(!props.children){
            return;
        }
        else{
            return (
                <div className={twitStat["twit-stat__action"]}>
                    {props.children}
                </div>
            )
        }
    }

    return (
        <div onClick={onClick} className={twitStat["twit-stat"]}>
            {renderAvatar()}
            <span className={twitStat["twit-stat__text"]}>{props.text}</span>
            {renderAction()}
        </div>
    );
} 

export default TwitStat;