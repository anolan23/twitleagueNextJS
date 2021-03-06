import React, { useState } from "react";
import Head from "next/head";
import index from "../sass/pages/Index.module.scss";
import Link from "next/link";

import useUser from "../lib/useUser";
import SignupPopup from "../components/modals/SignupPopup";
import TwitButton from "../components/TwitButton";
import NavBar from "../components/NavBar";

function IndexPage() {
  const { user } = useUser({ redirectIfFound: true, redirectTo: "/home" });
  const [showSignupPopup, setShowSignupPopup] = useState(false);

  if (!user) {
    return <div>...Loading user</div>;
  } else if (user.isSignedIn) {
    return <div>redirecting...</div>;
  }

  return (
    <div className={index["index"]}>
      <NavBar title="twitleague">
        <div className={index["index__navbar__actions"]}>
          <TwitButton href="/login" color="primary" outline="primary">
            Login
          </TwitButton>
          <TwitButton onClick={() => setShowSignupPopup(true)} color="primary">
            Sign up
          </TwitButton>
        </div>
      </NavBar>
      <div className={index["index__main"]}>
        <div className={index["index__main__content"]}>
          <div className={index["index__main__content__title"]}>
            Social media for recreational sports leagues
          </div>
          <div className={index["index__main__content__sub-title"]}>
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
          <div className={index["index__main__content__check"]}>
            <span className={index["index__main__content__check__text"]}>
              Already have an account?
            </span>
            &nbsp;
            <Link passHref href="/login">
              <a className="twit-link">Login</a>
            </Link>
          </div>
        </div>
        <div className={index["index__main__showcase"]}>
          <div className={index["index__main__showcase__content"]}>
            <div className={index["index__main__showcase__content__video-box"]}>
              <video
                className={
                  index["index__main__showcase__content__video-box__video"]
                }
                loop
                autoPlay
                muted
              >
                <source
                  src="https://s3.amazonaws.com/st-assets/production/new-web/home-animation.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
        </div>
      </div>
      <SignupPopup
        show={showSignupPopup}
        onHide={() => setShowSignupPopup(false)}
      />
    </div>
  );
}

export default IndexPage;
