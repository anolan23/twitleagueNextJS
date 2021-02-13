import {useRouter} from "next/router";
import twitStat from "../sass/components/TwitStat.module.scss";
import Avatar from "./Avatar";

function TwitStat(props){

    const router = useRouter();

    const onClick = () => {
        router.push(props.href);
    }

    const renderAvatar = () => {
        if(!props.avatar){
            return;
        }
        else{
            return <Avatar roundedCircle className={twitStat["twit-stat__avatar"]} src={props.avatar}/>
        }
    }

    return (
        <div onClick={onClick} className={twitStat["twit-stat"]}>
            {renderAvatar()}
            <span className={twitStat["twit-stat__text"]}>{props.text}</span>
        </div>
    );
} 

export default TwitStat;