import React, {useEffect} from "react";
import Head from 'next/head'
import {connect} from "react-redux";


import {fetchTeams} from "../actions";
import MainBody from "../components/MainBody"
import MyTeams from "../components/MyTeams";

function MyTeamsPage(props) {

  useEffect(() => {
    props.fetchTeams();
  }, []);

  return (
    <React.Fragment>
      <MainBody>
      <MyTeams/>
      </MainBody>
    </React.Fragment>
  )
}

export default connect(null, {fetchTeams})(MyTeamsPage);