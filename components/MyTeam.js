import myTeam from "../sass/components/MyTeam.module.scss"; 
import Avatar from "./Avatar";
import TwitButton from "./TwitButton";

function MyTeam(props){
    return (
        <div key={props.key} className={myTeam["my-team"]}>
            <Avatar className={myTeam["my-team__avatar"]} src={props.avatar}/>
            <div className={myTeam["my-team__info"]}>
                <span className={myTeam["my-team__info__team"]}>{props.teamName}</span>
                <span className={myTeam["my-team__info__league"]}>{props.leagueName}</span>
            </div>
            <div className={myTeam["my-team__actions"]}>
                <TwitButton href={`/teams/${props.abbrev.substring(1)}`} color="twit-button--primary">View</TwitButton>
            </div>
        </div>
    )
}
export default MyTeam;