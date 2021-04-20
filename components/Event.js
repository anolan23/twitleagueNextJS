import React, {useState} from "react";
import {useRouter} from "next/router";

import useUser from "../lib/useUser";
import {likeEvent, unLikeEvent} from "../actions";
import event from "../sass/components/Event.module.scss";
import post from "../sass/components/Post.module.scss"
import TwitIcon from "./TwitIcon";
import Like from "./Like";

function Event(props) {
  const { user } = useUser();
  const router = useRouter();
  const [liked, setLiked] = useState(props.event.liked);
  const [likes, setLikes] = useState(props.event.likes);

  const onLikeClick = async (event) => {
    event.stopPropagation();
    if(!user || !user.isSignedIn){
      return
    }
    else{
      if(!liked){
        await likeEvent(props.event.id, user.id);
        setLiked(true);
        setLikes((likes) => parseInt(likes) + 1);
      }
      else{
        await unLikeEvent(props.event.id, user.id);
        setLiked(false);
        setLikes((likes) => parseInt(likes) - 1);
      }
    }
  }

  const renderTeams = () => {
    if(props.event.type === "game"){
      return(
        <div className={event["event__wrap"]}>
          <div className={event["event__teams"]}>
            <div className={event["event__teams__team"]} style={{backgroundImage: `url(${props.event.avatar})`}}>

            </div>
            <div className={event["event__teams__team"]} style={{backgroundImage: `url(${props.event.opponent_avatar})`}} >

            </div>
          </div>
        </div>
      )
    }
    else{
      return null;
    }
  }

  const renderTeamNames = () => {
    if(props.event.type !== "game"){
      return null
    }
    else if(props.event.isHomeTeam == true || props.event.is_home_team == true){
      return <span className={event["event__matchup__vs"]}>{`${props.event.team_name} vs ${props.event.opponent_team_name}`}</span>
    }
    else{
      return <span className={event["event__matchup__vs"]}>{`${props.event.team_name} @ ${props.event.opponent_team_name}`}</span>
    }
  }

  const renderPlayPeriod = () => {
    if(props.event.play_period){
      return <span className={event["event__status__text"]}>{props.event.play_period}</span>
    }
    else{
      return <span className={event["event__status__text"]}>Upcoming</span>
    }
  }

  const renderResult = () => {
    if(props.event.league_approved){
      const {points, opponent_points, team_id, opponent_id} = props.event;
      if(props.teamId === team_id){
        if(points > opponent_points){
          return <span className={event["event__status__result--win"]}>W</span>
        }
        else if(points < opponent_points){
          return <span className={event["event__status__result--loss"]}>L</span>
        }
        else if(points === opponent_points){
          return <span className={event["event__status__result"]}>T</span>
        }
        else{
          return null;
        }
      }
      else if(props.teamId === opponent_id){
        if(points > opponent_points){
          return <span className={event["event__status__result--loss"]}>L</span>
        }
        else if(points < opponent_points){
          return <span className={event["event__status__result--win"]}>W</span>
        }
        else if(points === opponent_points){
          return <span className={event["event__status__result"]}>T</span>
        }
        else{
          return null;
        }
      }
    }
    else{
      return null;
    }
  }

  return(
          <div onClick={() => router.push(`/events/${props.event.id}`).then(() => window.scrollTo(0, 0))} className={event["event"]}>
            {renderTeams()}
            <div className={event["event__date"]}>
                <span className={event["event__date--day"]}>{props.event.day}</span>
                <span className={event["event__date--month"]}>{props.event.month}</span>
            </div>
            <div className={event["event__content"]}>
              <div className={event["event__matchup"]}>
                <div className={event["event__info"]}>
                  <span className={event["event__type"]}>{props.event.type === "game" ? null : props.event.type}</span>
                  {renderTeamNames()}
                  {renderResult()}
                  <span className={event["event__time"]}>{props.event.play_period ? null : props.event.time}</span>
                  <span className={event["event__location"]}>{props.event.location}</span>
                  <span className={event["event__notes"]}>{props.event.notes}</span>
                </div>
              </div>
              <div className={event["event__status"]}>
                {renderPlayPeriod()}
                <span className={event["event__status__score"]}>{props.event.points ? `${props.event.points} - ${props.event.opponent_points}` : null}</span>
              </div>
            </div>
            <div className={post["post__icons"]}>
                  <div className={post["post__icons__holder"]}>
                    <TwitIcon className={post["post__icon"]} icon="/sprites.svg#icon-message-square"/>
                    <span className={post["post__icons__count"]}>{props.event.replies ? props.event.replies : 0}</span>
                  </div>
                  <div className={post["post__icons__holder"]}>
                    <TwitIcon className={post["post__icon"]} icon="/sprites.svg#icon-repeat"/>
                    <span className={post["post__icons__count"]}>{0}</span>
                  </div>
                  <div onClick={onLikeClick} className={`${post["post__icons__holder"]} ${liked ? post["post__icons__holder__active"] : null}`}>
                    <Like className={post["post__icon"]} liked={liked}/>
                    <span className={post["post__icons__count"]}>{likes > 0 ? likes : null}</span>
                  </div>
                  <div className={post["post__icons__holder"]}>
                    <TwitIcon onClick={null} className={post["post__icon"]} icon="/sprites.svg#icon-corner-up-right"/>
                  </div>
            </div>
          </div>
  );
}

export default Event;