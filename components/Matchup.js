import Link from "next/link";

import matchup from "../sass/components/Matchup.module.scss";
import {dateString} from "../lib/twit-helpers";
import Avatar from "./Avatar";

function Matchup({event}){

    const renderPlayPeriod = () => {
        if(event.play_period){
          return <span className={matchup["matchup__info__status--live"]}>{event.play_period}</span>
        }
        else{
          return <span className={matchup["matchup__info__status"]}>Upcoming</span>
        }
      }
    
    const renderScore = () => {
        if(!event.points){
            return(
                <div className={matchup["matchup__matchup__symbol-holder"]}>
                    <span className={matchup["matchup__matchup__symbol__symbol"]}>{event.is_home_team ? "vs" : "@"}</span>
                </div>
            )
        }
        else{
            return(
                <div className={matchup["matchup__matchup__score"]}>
                    <span className={matchup["matchup__matchup__score__points"]}>{event.points}</span>
                    <span className={matchup["matchup__matchup__score__dash"]}>-</span>
                    <span className={matchup["matchup__matchup__score__points"]}>{event.opponent_points}</span>
                </div>
            )
        }
    }
    return(
        <div className={matchup["matchup"]}>
            <div className={matchup["matchup__info"]}>
                <Link href={`/leagues/${event.league_name}`} passHref><a className="twit-link">{event.league_name}</a></Link>
                &nbsp;
                ·
                &nbsp;
                <span className={matchup["matchup__info__date"]}>{dateString(event.date)}</span>
                {renderPlayPeriod()}
            </div>
            <div className={matchup["matchup__matchup"]}>
                <div className={matchup["matchup__matchup__team"]}>
                    <Avatar className={matchup["matchup__matchup__team__avatar"]} src={event.avatar}/>
                    <span className={matchup["matchup__matchup__team__name"]}>{event.team_name}</span>
                </div>
                {renderScore()}
                <div className={matchup["matchup__matchup__team"]}>
                    <Avatar className={matchup["matchup__matchup__team__avatar"]} src={event.opponent_avatar}/>
                    <span className={matchup["matchup__matchup__team__name"]}>{event.opponent_team_name}</span>
                </div>
            </div>
            <div className={matchup["matchup__more-info"]}>
                <span className={matchup["matchup__more-info__info"]}>{event.type}</span>
                <span className={matchup["matchup__more-info__info"]}>{event.location ? event.location : "Unknown location"}</span>
                <p className={matchup["matchup__more-info__notes"]}>{event.notes}</p>
            </div>
        </div>
    )
}

export default Matchup;