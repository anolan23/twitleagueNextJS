import React, {useEffect} from "react";
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import BannerAd from "../components/BannerAd"

import MainBody from "../components/MainBody"
import Home from "../components/Home";

export default function HomePage() {

  return (
    <React.Fragment>
      <BannerAd/>
      <MainBody>
        <Home/>
      </MainBody>
    </React.Fragment>
    
  )
}
