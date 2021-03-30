import React, {useState, useEffect} from "react";
import Head from 'next/head'
import {connect} from "react-redux";


import {fetchUserTeams} from "../actions";
import MainBody from "../components/MainBody"
import myTeams from "../sass/components/MyTeams.module.scss";
import TwitButton from "../components/TwitButton";
import TopBar from "../components/TopBar";
import TwitItem from "../components/TwitItem";
import Empty from "../components/Empty";
import useUser from "../lib/useUser";

function MyTeams() {
  const { user } = useUser({redirectTo: "/"});
  const [teams , setTeams] = useState(null);
  
  useEffect(() => {
      start();
  }, [user]);

  const start = async () => {
      if(user === undefined || !user.isSignedIn){
          return
      }
      else{
          console.log(user);
          const teams =  await fetchUserTeams(user.id);
          setTeams(teams)
      }
      
  }

  const renderTeams = () => {
    if(teams === null){
        return <div>Loading teams</div>
    }
    else if (teams.length === 0){
        return <Empty main="No teams" sub="The teams that you create will go here"/>
    }
    else{
        return teams.map((team, index) => {
            return (
                <TwitItem 
                    key={index}
                    avatar={team.avatar}
                    title={`${team.team_name}`}
                    subtitle={`${team.abbrev} · ${team.league_name?team.league_name:"awaiting league approval"}`}
                    href={`/teams/${team.abbrev.substring(1)}`}
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
          <TopBar main="My Teams">
              <TwitButton href="/create/team" color="twit-button--primary">Create team</TwitButton>
          </TopBar>
          {renderTeams()}
        </div>
      </MainBody>
    </React.Fragment>
  )
}

export default MyTeams;