import React, {useEffect} from "react";
import Head from 'next/head'
import {connect} from "react-redux";

import MainBody from "../components/MainBody"
import Suggested from "../components/Suggested";
import {fetchNotifications} from "../actions"

function SuggestedPage(props){

  useEffect(() => {
    
  }, []);

  return(
    <React.Fragment>
      <MainBody>
        <Suggested/>
      </MainBody>
    </React.Fragment>
  )
}

export default connect(null, {fetchNotifications})(SuggestedPage);