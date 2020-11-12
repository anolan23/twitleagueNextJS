import React, {useEffect} from "react";
import Head from 'next/head';
import {useRouter} from "next/router";
import {initializeStore} from "../../redux/store";

import MainBody from "../../components/MainBody"
import LeagueComponent from "../../components/League";
import BannerAd from "../../components/BannerAd";
import {getLeague} from "../api/league/[leagueName]";

export default function LeaguePage(props) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading League...</div>
  }

  if(!props.initialReduxState){
    return <div>no initial redux state</div>
  }
    return (
      <React.Fragment>
        <BannerAd/>
        <MainBody>
          <LeagueComponent league={props.initialReduxState.league}/>
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
    const leagueName = context.params.leagueName;
    const league = await getLeague(leagueName);

    await dispatch({type: "FETCH_LEAGUE", payload: JSON.parse(JSON.stringify(league))})
    
    const newStore = reduxStore.getState();
    console.log("newStore", newStore)
    return {
      revalidate: 1,
      props: {
        initialReduxState: newStore
      } // will be passed to the page component as props
    }  

  }
