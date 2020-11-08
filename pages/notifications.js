import React from "react";
import Head from 'next/head'

import MainBody from "../components/MainBody"
import Notifications from "../components/Notifications";
import BannerAd from "../components/BannerAd";

export default function NotificationPage() {
  return (
    <React.Fragment>
      <BannerAd/>
      <MainBody>
      <Notifications/>
      </MainBody>
    </React.Fragment>
  )
}
