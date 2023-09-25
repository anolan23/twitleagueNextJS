import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import twitNavItem from '../sass/components/TwitNavItem.module.scss';

function TwitNavItem({ className, href, children, title }) {
  const router = useRouter();
  const { asPath } = router;

  const active = () => {
    if (asPath.includes(href)) {
      return twitNavItem['twit-nav-item__holder--active'];
    } else {
      return null;
    }
  };

  return (
    <div className={`${className} ${twitNavItem['twit-nav-item']}`}>
      <Link
        href={href}
        className={`${twitNavItem['twit-nav-item__holder']} ${active()}`}
      >
        {children}
        <div className={twitNavItem['twit-nav-item__text-holder']}>
          <span className={twitNavItem['twit-nav-item__text']}>{title}</span>
        </div>
      </Link>
    </div>
  );
}

export default TwitNavItem;
