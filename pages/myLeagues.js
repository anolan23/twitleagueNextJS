import React, {useState, useEffect} from "react";
import Head from 'next/head'

import useUser from "../lib/useUser";
import MainBody from "../components/MainBody"
import myTeams from "../sass/components/MyTeams.module.scss";
import {fetchLeagues} from "../actions";
import TwitButton from "../components/TwitButton";
import TopBar from "../components/TopBar";
import TwitItem from "../components/TwitItem";
import Empty from "../components/Empty";

function MyLeagues() {
  const { user } = useUser({redirectTo: "/"});
  const [leagues, setLeagues] = useState(null);

  useEffect(() => {
      start();
  }, [user]);

  const start = async () => {
    if(user === undefined || !user.isSignedIn){
      return
    }
    else{
      const leagues = await fetchLeagues(user.id);
      setLeagues(leagues);
    }
      
  }

    const renderLeagues = () => {
        if(leagues === null){
            return 
        }
        else if(leagues.length === 0){
            return <Empty main="No leagues" sub="The leagues that you create will go here"/>
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
  
  if(!user || !user.isSignedIn){
    return <div>loading...</div>
  }

  return (
    <React.Fragment>
      <MainBody>
        <div className={myTeams["my-teams"]}>
              <TopBar main="My Leagues">
                  <TwitButton href="/create/league" color="twit-button--primary">Create league</TwitButton>
              </TopBar>
              {renderLeagues()}
          </div>
      </MainBody>
    </React.Fragment>
  )
}



export default MyLeagues;