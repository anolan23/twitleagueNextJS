import React, {useEffect} from "react";
import Head from 'next/head'
import {connect} from "react-redux";

import MainBody from "../components/MainBody"
import Notifications from "../components/Notifications";
import {fetchNotifications} from "../actions"

function NotificationPage(props){

  useEffect(() => {
    props.fetchNotifications();
    console.log("componentDidMount")
  }, []);

  return(
    <React.Fragment>
      <MainBody>
        <Notifications/>
      </MainBody>
    </React.Fragment>
  )
}

export default connect(null, {fetchNotifications})(NotificationPage);
