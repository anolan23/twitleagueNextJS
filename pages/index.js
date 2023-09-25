import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import index from '../sass/pages/Index.module.scss';

import useUser from '../lib/useUser';
import SignupPopup from '../components/modals/SignupPopup';
import TwitButton from '../components/TwitButton';
import NavBar from '../components/NavBar';
import TwitSpinner from '../components/TwitSpinner';

function IndexPage() {
  const { user } = useUser({ redirectIfFound: true, redirectTo: '/home' });
  const [showSignupPopup, setShowSignupPopup] = useState(false);

  return (
    <div className={index['index']}>
      <NavBar title="twitleague">
        <div className={index['index__navbar__actions']}>
          <TwitButton href="/login" color="white">
            Login
          </TwitButton>
          <TwitButton onClick={() => setShowSignupPopup(true)} color="primary">
            Sign up
          </TwitButton>
        </div>
      </NavBar>
      <div className={index['index__main']}>
        <div className={index['index__main__content']}>
          <div className={index['index__main__content__title']}>
            Social media for recreational sports leagues
          </div>
          <div className={index['index__main__content__sub-title']}>
            See what players, coaches, and parents are saying in real time about
            the latest homerun, touchdown, and goal for free.
          </div>
          <TwitButton
            onClick={() => setShowSignupPopup(true)}
            color="primary"
            size="large"
          >
            Sign up
          </TwitButton>
          <div className={index['index__main__content__check']}>
            <span className={index['index__main__content__check__text']}>
              Already have an account?
            </span>
            &nbsp;
            <a href="/login">Login</a>
          </div>
        </div>
        <img
          src="/twit_mobile_mockup.png"
          alt="app mobile mockup"
          className={index['index__main__image']}
        />
      </div>
      <SignupPopup
        show={showSignupPopup}
        onHide={() => setShowSignupPopup(false)}
      />
    </div>
  );
}

export default IndexPage;
