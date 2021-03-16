import React, {useEffect} from "react";
import Head from 'next/head';
import {useRouter} from "next/router";

import MainBody from "../../components/MainBody"
import League from "../../components/League";
import {fetchLeague} from "../../actions";

export default function LeaguePage(props) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading League...</div>
  }

    return (
      <React.Fragment>
        <MainBody>
          <League league={props.league}/>
        </MainBody>
      </React.Fragment>
      
    )
  }

  export async function getStaticPaths() {
    return { paths: [], fallback: true };
  }

  export async function getStaticProps(context) {
    const leagueName = context.params.leagueName;
    const league = await fetchLeague(leagueName);

    return {
      revalidate: 1,
      props: {
        league
      } // will be passed to the page component as props
    }  

  }
