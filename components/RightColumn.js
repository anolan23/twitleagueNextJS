import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import TwitSearch from './TwitSearch';
import TwitIcon from './TwitIcon';

function RightColumn({ children }) {
  const router = useRouter();
  function onSearch(query) {
    router.push({
      pathname: '/search',
      query: {
        query,
        filter: 'top',
      },
    });
  }
  return (
    <div className="right-bar__right-column">
      <div className="right-bar__right-column__input-box">
        <div className="right-bar__right-column__input-box__input">
          <TwitIcon
            className="right-bar__right-column__icon"
            icon="/sprites.svg#icon-search"
          />
          <TwitSearch
            inline
            placeHolder="Search twitleague"
            onSearch={onSearch}
          />
        </div>
      </div>
      {children}
      <div className="right-bar__right-column__footer">
        <nav className="right-bar__right-column__footer__nav">
          <Link href="/" className="right-bar__right-column__footer__nav__item">
            Terms of Service
          </Link>
          <Link className="right-bar__right-column__footer__nav__item" href="/">
            Privacy Policy
          </Link>
          <Link className="right-bar__right-column__footer__nav__item" href="/">
            Cookie Policy
          </Link>
          <Link className="right-bar__right-column__footer__nav__item" href="/">
            Ads info
          </Link>
          <Link className="right-bar__right-column__footer__nav__item" href="/">
            More
          </Link>
          <span className="right-bar__right-column__footer__nav__copyright">
            &copy; {new Date().getFullYear()} twitleague
          </span>
        </nav>
      </div>
    </div>
  );
}

export default RightColumn;
