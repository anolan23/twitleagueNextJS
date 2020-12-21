import React, {useEffect} from "react";
import Head from 'next/head'
import {connect} from "react-redux";

import {fetchLeagues} from "../actions";
import MainBody from "../components/MainBody"
import MyLeagues from "../components/MyLeagues";

function MyLeaguesPage(props) {

  useEffect(() => {
    props.fetchLeagues();
  }, []);

  return (
    <React.Fragment>
      <MainBody>
      <MyLeagues/>
      </MainBody>
    </React.Fragment>
  )
}

export default connect(null, {fetchLeagues})(MyLeaguesPage);