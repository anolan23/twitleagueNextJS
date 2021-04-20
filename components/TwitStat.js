import {useRouter} from "next/router";
import twitStat from "../sass/components/TwitStat.module.scss";
import Avatar from "./Avatar";
import TwitButton from "./TwitButton";

function TwitStat(props){
    const router = useRouter();
    const { team } = props

    const onClick = () => {
        if(props.href){
            router.push(props.href);
        }
        else if(props.onClick){
            props.onClick();
        }
        
    }

    const renderAvatar = () => {
            return <Avatar roundedCircle className={twitStat["twit-stat__avatar"]} src={team.avatar}/>
    
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

    if(props.disabled){
        return (
            <tr onClick={null} className={`${twitStat["twit-stat"]} ${props.disabled ? twitStat["twit-stat--disabled"] : null}`}>
                <td className={twitStat["twit-stat__data"]}>{renderAvatar()}</td>
                <td className={twitStat["twit-stat__data--team"]}>{team.team_name}</td>
                <td className={twitStat["twit-stat__data"]}>{team.wins ? team.wins : 0}</td>
                <td className={twitStat["twit-stat__data"]}>{team.losses ? team.losses : 0}</td>
                <td className={twitStat["twit-stat__data"]}>{team.ties ? team.ties : 0}</td>
                <td className={twitStat["twit-stat__data"]}>{team.win_percentage ? team.win_percentage : '0.000'}</td>
                <td className={twitStat["twit-stat__data"]}>{team.gb ? team.gb : 0}</td>
            </tr>
        );
    }

    return (
        <tr onClick={onClick} className={twitStat["twit-stat"]}>
            <td className={twitStat["twit-stat__data"]}>{renderAvatar()}</td>
            <td className={twitStat["twit-stat__data--team"]}>{team.team_name}</td>
            <td className={twitStat["twit-stat__data"]}>{team.wins ? team.wins : 0}</td>
            <td className={twitStat["twit-stat__data"]}>{team.losses ? team.losses : 0}</td>
            <td className={twitStat["twit-stat__data"]}>{team.ties ? team.ties : 0}</td>
            <td className={twitStat["twit-stat__data"]}>{team.win_percentage ? team.win_percentage : '0.000'}</td>
            <td className={twitStat["twit-stat__data"]}>{team.gb ? team.gb : 0}</td>
        </tr>
    );
} 

export default TwitStat;