import myTeam from "../sass/components/MyTeam.module.scss";
import Avatar from "./Avatar";
import TwitButton from "./TwitButton";

function MyLeague(props) {
  return (
    <div key={props.index} className={myTeam["my-team"]}>
      <Avatar className={myTeam["my-team__avatar"]} src={props.avatar} />
      <div className={myTeam["my-team__info"]}>
        <span className={myTeam["my-team__info__team"]}>
          {props.leagueName}
        </span>
        <span className={myTeam["my-team__info__league"]}>12 teams</span>
      </div>
      <div className={myTeam["my-team__actions"]}>
        <TwitButton href={`/league`} color="primary">
          View
        </TwitButton>
        <TwitButton outline="primary">Manage</TwitButton>
      </div>
    </div>
  );
}
export default MyLeague;
