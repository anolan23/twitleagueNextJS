import React from "react";
import Head from 'next/head'

import MainBody from "../components/MainBody"
import Notifications from "../components/Notifications";

export default function NotificationPage() {
  return (
    <React.Fragment>
      <MainBody>
      <Notifications/>
      </MainBody>
    </React.Fragment>
  )
}
