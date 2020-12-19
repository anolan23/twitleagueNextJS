import React from "react";
import Head from 'next/head'

import MainBody from "../components/MainBody"
import MyTeams from "../components/MyTeams";

export default function MyTeamsPage() {
  return (
    <React.Fragment>
      <MainBody>
      <MyTeams/>
      </MainBody>
    </React.Fragment>
  )
}