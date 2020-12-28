import React from "react";
import Head from 'next/head';
import {useRouter} from "next/router";
import {initializeStore} from "../../redux/store";
import Figure from "react-bootstrap/Figure"

import MainBody from "../../components/MainBody"
import TeamComponent from "../../components/Team";
import Teams from "../../db/repos/Teams";
import Followers from "../../db/repos/Followers";

function TeamPage(props) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if(!props.initialReduxState){
    return <div>no initial redux state</div>
  }
    return (
      <React.Fragment>
        <MainBody>
          <TeamComponent 
            team={props.initialReduxState.team} 
          />
        </MainBody>
      </React.Fragment>
      
    )
  }

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  const reduxStore = initializeStore();
  const {dispatch} = reduxStore;

    const teamAbbrev = "$" + context.params.teamAbbrev;
    let team = await Teams.findOne(teamAbbrev);
    const followers = await Followers.findByTeamId(team.id);
    
    team = {...team, followers: followers};


    await dispatch({type:"FETCH_TEAM", payload: JSON.parse(JSON.stringify(team))});

    const newStore = reduxStore.getState();
    
    return {
        revalidate: 1,
        props: {
          initialReduxState: newStore
        } // will be passed to the page component as props
    }  

  }

  export default TeamPage;
