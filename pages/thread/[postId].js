import React from "react";
import Head from 'next/head';
import {useRouter} from "next/router";

import MainBody from "../../components/MainBody"
import Thread from "../../components/Thread";

function ThreadPage(props){
    const router = useRouter();
    const { postId } = router.query;
    return (
        <React.Fragment>
        <MainBody>
          <Thread postId = {postId}/>
        </MainBody>
      </React.Fragment>
    )
}

  export default ThreadPage;
