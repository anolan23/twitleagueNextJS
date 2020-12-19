import myTeam from "../sass/components/MyTeam.module.scss"; 
import Avatar from "./Avatar";
import TwitButton from "./TwitButton";

function MyTeam(){
    return (
        <div className={myTeam["my-team"]}>
            <Avatar className={myTeam["my-team__avatar"]}/>
            <div className={myTeam["my-team__info"]}>
                <span className={myTeam["my-team__info__team"]}>White Sox</span>
                <span className={myTeam["my-team__info__league"]}>Major League Baseball</span>
            </div>
            <div className={myTeam["my-team__actions"]}>
                <TwitButton color="twit-button--primary">View</TwitButton>
                <TwitButton outline="twit-button--primary--outline">Manage</TwitButton>
            </div>
        </div>
    )
}
export default MyTeam;