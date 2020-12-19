import React from "react";
import Head from 'next/head'

import MainBody from "../../components/MainBody"
import CreateTeam from "../../components/CreateTeam";

export default function CreateTeamPage() {
  return (
    <React.Fragment>
      <MainBody>
      <CreateTeam/>
      </MainBody>
    </React.Fragment>
  )
}