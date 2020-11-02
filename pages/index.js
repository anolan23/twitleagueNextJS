import Head from 'next/head'
import styles from '../styles/Home.module.css'

import MainBody from "../components/MainBody"
import Home from "../components/Home";

export default function HomePage() {
  return (
    <MainBody>
      <Home/>
    </MainBody>
  )
}
