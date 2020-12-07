import React from 'react';
import Image from "next/image";
import Link from "next/link"
import {connect} from "react-redux";

import {togglePopupCompose} from "../actions";
import TwitNav from "./TwitNav";
import UserToggle from "./UserToggle";
import TwitButton from "./TwitButton";
import TwitPostCircle from './TwitPostCircle';
import Avatar from './Avatar';



function LeftColumn(props) {
  return(
      <div className="header__left-column">
        <Link href="/" passHref>
          <a className="header__logo heading-1 u-margin-bottom-small u-margin-top-small">twitleague</a>
        </Link>
        <TwitNav/>
        <TwitButton 
          onClick={props.togglePopupCompose}
          color="twit-button--primary" 
          size="twit-button--expanded-large"
          collapse="twit-button--collapse"
          >
          New Post
        </TwitButton>
        <TwitPostCircle onClick={props.togglePopupCompose}/>
        <UserToggle/>
        <Avatar className="header__avatar"/>
      </div>
  )
}

export default connect(null, {togglePopupCompose})(LeftColumn);
