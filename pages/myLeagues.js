import React, {useEffect} from "react";
import Head from 'next/head'
import {connect} from "react-redux";

import {fetchTeams} from "../actions";
import MainBody from "../components/MainBody"
import MyLeagues from "../components/MyLeagues";

function MyLeaguesPage(props) {

  useEffect(() => {
    
  }, []);

  return (
    <React.Fragment>
      <MainBody>
      <MyLeagues/>
      </MainBody>
    </React.Fragment>
  )
}

export default connect(null)(MyLeaguesPage);