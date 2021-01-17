import React, {useEffect} from "react";
import Head from 'next/head';
import {connect} from "react-redux";
import {useRouter} from "next/router";

import MainBody from "../components/MainBody"
import Home from "../components/Home";
import AuthBanner from '../components/AuthBanner';
import {fetchUser, clearPosts, fetchPosts} from "../actions";


function HomePage(props) {
  const router = useRouter(); 
  
  useEffect(() => {
    props.fetchUser();
    props.fetchPosts(10,0);
    return () => {
      // props.clearPosts();
    }
  }, []);

  useEffect(() => {
    if(props.isSignedIn === false){
      console.log("router.push")
      router.push("/");
    }
  }, [props.isSignedIn]);

  if(!props.isSignedIn){
    return <div style={{fontSize: "30px"}}>...Home</div>;
  }
  else if (props.isSignedIn){
    return (
      <React.Fragment>
        <MainBody>
          <Home/>
          <AuthBanner/>
        </MainBody>
      </React.Fragment>
    )
  }

}

const mapStateToProps = (state) => {
  return {isSignedIn: state.user.isSignedIn}
}

export default connect(mapStateToProps, {fetchUser, clearPosts, fetchPosts})(HomePage);
