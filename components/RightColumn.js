import React from "react";
import Link from "next/link";

import TwitSearch from "./TwitSearch";
import TwitIcon from "./TwitIcon";

function RightColumn({ children }) {
  return (
    <div className="right-bar__right-column">
      <div className="right-bar__right-column__input-box">
        <div className="right-bar__right-column__input-box__input">
          <TwitIcon
            className="right-bar__right-column__icon"
            icon="/sprites.svg#icon-search"
          />
          <TwitSearch inline placeHolder="Search twitleague" />
        </div>
      </div>
      {children}
      <div className="right-bar__right-column__footer">
        <nav className="right-bar__right-column__footer__nav">
          <Link passHref href="/">
            <a className="right-bar__right-column__footer__nav__item">
              Terms of Service
            </a>
          </Link>
          <Link passHref href="/">
            <a className="right-bar__right-column__footer__nav__item">
              Privacy Policy
            </a>
          </Link>
          <Link passHref href="/">
            <a className="right-bar__right-column__footer__nav__item">
              Cookie Policy
            </a>
          </Link>
          <Link passHref href="/">
            <a className="right-bar__right-column__footer__nav__item">
              Ads info
            </a>
          </Link>
          <Link passHref href="/">
            <a className="right-bar__right-column__footer__nav__item">More</a>
          </Link>
          <span className="right-bar__right-column__footer__nav__copyright">
            {" "}
            &copy; {new Date().getFullYear()} twitleague
          </span>
        </nav>
      </div>
    </div>
  );
}

export default RightColumn;
