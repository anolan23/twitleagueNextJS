import React, { useEffect } from "react";
import Head from "next/head";

import MainBody from "../components/MainBody";
import Suggested from "../components/Suggested";

function SuggestedPage() {
  useEffect(() => {}, []);

  return (
    <React.Fragment>
      <MainBody>
        <Suggested />
      </MainBody>
    </React.Fragment>
  );
}

export default SuggestedPage;
