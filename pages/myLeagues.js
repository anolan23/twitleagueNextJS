import React, {useEffect} from "react";
import Head from 'next/head'

import MainBody from "../components/MainBody"
import MyLeagues from "../components/MyLeagues";

function MyLeaguesPage() {

  return (
    <React.Fragment>
      <MainBody>
      <MyLeagues/>
      </MainBody>
    </React.Fragment>
  )
}



export default MyLeaguesPage;