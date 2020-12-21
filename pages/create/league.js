import React from "react";
import Head from 'next/head'

import MainBody from "../../components/MainBody"
import CreateLeague from "../../components/CreateLeague";

export default function CreateLeaguePage() {
  return (
    <React.Fragment>
      <MainBody>
      <CreateLeague/>
      </MainBody>
    </React.Fragment>
  )
}