import { useRouter } from "next/router";
import twitStat from "../sass/components/TwitStat.module.scss";
import Avatar from "./Avatar";
import TwitButton from "./TwitButton";

function TwitStat(props) {
  const router = useRouter();
  const { team, leader } = props;

  const onClick = () => {
    if (props.href) {
      router.push(props.href);
    } else if (props.onClick) {
      props.onClick();
    }
  };

  const calcTies = () => {
    let { total_games, wins, losses } = team;
    total_games = total_games ? total_games : 0;
    wins = wins ? wins : 0;
    losses = losses ? losses : 0;
    return total_games - wins - losses;
  };

  const calcWinPercentage = () => {
    let { total_games, wins } = team;
    total_games = total_games ? total_games : 0;
    wins = wins ? wins : 0;
    let winPercentage = wins / total_games;

    if (isNaN(winPercentage)) {
      return Number(0).toFixed(3);
    } else {
      return winPercentage.toFixed(3);
    }
  };

  const calcGamesBehind = () => {
    if (!leader) {
      return "-";
    }
    let { wins, losses } = team;
    let { wins: leaderWins, losses: leaderLosses } = leader;
    const differenceInWins = Math.abs(leaderWins - wins);
    const differenceInLosses = Math.abs(leaderLosses - losses);
    const gamesBehind = (differenceInWins + differenceInLosses) / 2;
    if (gamesBehind == 0 || isNaN(gamesBehind)) {
      return "-";
    }
    return gamesBehind;
  };

  const renderAvatar = () => {
    return (
      <Avatar
        roundedCircle
        className={twitStat["twit-stat__avatar"]}
        src={team.avatar}
      />
    );
  };

  const renderAction = () => {
    if (!props.children) {
      return;
    } else {
      return (
        <div className={twitStat["twit-stat__action"]}>{props.children}</div>
      );
    }
  };

  if (props.disabled) {
    return (
      <tr
        onClick={null}
        className={`${twitStat["twit-stat"]} ${
          props.disabled ? twitStat["twit-stat--disabled"] : null
        }`}
      >
        <td className={twitStat["twit-stat__data"]}>{renderAvatar()}</td>
        <td className={twitStat["twit-stat__data--team"]}>{team.team_name}</td>
        <td className={twitStat["twit-stat__data"]}>
          {team.wins ? team.wins : 0}
        </td>
        <td className={twitStat["twit-stat__data"]}>
          {team.losses ? team.losses : 0}
        </td>
        <td className={twitStat["twit-stat__data"]}>{calcTies()}</td>
        <td className={twitStat["twit-stat__data"]}>{calcWinPercentage()}</td>
        <td className={twitStat["twit-stat__data"]}>{calcGamesBehind()}</td>
      </tr>
    );
  }

  return (
    <tr onClick={onClick} className={twitStat["twit-stat"]}>
      <td className={twitStat["twit-stat__data"]}>{renderAvatar()}</td>
      <td className={twitStat["twit-stat__data--team"]}>{team.team_name}</td>
      <td className={twitStat["twit-stat__data"]}>
        {team.wins ? team.wins : 0}
      </td>
      <td className={twitStat["twit-stat__data"]}>
        {team.losses ? team.losses : 0}
      </td>
      <td className={twitStat["twit-stat__data"]}>{calcTies()}</td>
      <td className={twitStat["twit-stat__data"]}>{calcWinPercentage()}</td>
      <td className={twitStat["twit-stat__data"]}>{calcGamesBehind()}</td>
    </tr>
  );
}

export default TwitStat;
