import React from "react";
import Head from 'next/head';
import {useRouter} from "next/router";

import MainBody from "../../components/MainBody"
import Team from "../../components/Team";
import backend from "../../lib/backend";
import AuthBanner from "../../components/AuthBanner";

function TeamPage(props) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }
    return (
      <React.Fragment>
        <MainBody>
          <Team 
            team={props.team} 
          />
        </MainBody>
        <AuthBanner/>
      </React.Fragment>
      
    )
  }

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
    const abbrev = "$" + context.params.abbrev;
    let result = await backend.get("/api/teams", {
      params:{
        abbrev
      }
    });
    
    const team = result.data;

    return {
        revalidate: 1,
        props: {
          team
        } // will be passed to the page component as props
    }  

  }

  export default TeamPage;
