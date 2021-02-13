import React, {useState, useEffect} from "react";
import {connect} from "react-redux";

import myTeams from "../sass/components/MyTeams.module.scss";
import {fetchLeagues} from "../actions";
import TwitButton from "./TwitButton";
import TopBar from "./TopBar";
import TwitItem from "./TwitItem";
import Empty from "./Empty";

function MyLeagues(props){

    const [leagues, setLeagues] = useState(null);

    useEffect(() => {
        start();
  }, []);

  const start = async () => {
      if(props.isSignedIn){
        const leagues = await fetchLeagues(props.userId);
        setLeagues(leagues);
      }
      
  }

    const renderLeagues = () => {
        if(leagues === null){
            return 
        }
        else if(leagues.length === 0){
            return <Empty main="No leagues" sub="You haven't created a league"/>
        }
        else{
            return leagues.map((league, index) => {
                return (
                    <TwitItem 
                        key={index} 
                        title={league.league_name}
                        subtitle={league.sport}
                        href={`/leagues/${league.league_name}`}
                    />
                )
            })
        }
    }

    return (
        <div className={myTeams["my-teams"]}>
            <TopBar main="My Leagues"/>
            {renderLeagues()}
            <TwitButton href="/create/league" square>Create new league</TwitButton>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        userId: state.user.id,
        isSignedIn: state.user.isSignedIn
    }
}

export default connect(mapStateToProps)(MyLeagues);