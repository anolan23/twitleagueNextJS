import React from "react";
import Head from 'next/head';
import {useRouter} from "next/router";

import MainBody from "../../components/MainBody"
import Users from "../../db/repos/Users";
import User from "../../components/User";

function TeamPage(props) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

    return (
      <React.Fragment>
        <MainBody>
          <User user={props.user}/>
        </MainBody>
      </React.Fragment>
      
    )
  }

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
    const username = context.params.username;
    let user = await Users.findOne(username);
    user = JSON.parse(JSON.stringify(user));
    console.log(user);
    
    return {
        revalidate: 1,
        props: {
          user: user
        } // will be passed to the page component as props
    }  

  }

  export default TeamPage;
