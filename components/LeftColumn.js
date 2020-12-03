import React from 'react';
import TwitNav from "./TwitNav";
import UserToggle from "./UserToggle";
import Image from "next/image";
import Link from "next/link"

function LeftColumn() {
  return(
      <div className="header__left-column">
        <Link href="/" passHref>
          <a className="header__logo heading-1 u-margin-bottom-small u-margin-top-small">twitleague</a>
        </Link>
        <TwitNav/>
        <UserToggle/>
      </div>
  )
}

export default LeftColumn;
