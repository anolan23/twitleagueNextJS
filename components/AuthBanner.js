import React from "react";

import { toggleSignUpModal } from "../actions";

import TwitButton from "./TwitButton";
import authBanner from "../sass/components/AuthBanner.module.scss";
import useUser from "../lib/useUser";

function AuthBanner() {
  const { user } = useUser();
  if (!user) {
    return null;
  }

  if (!user.isSignedIn) {
    return (
      <div className={authBanner["auth-banner"]}>
        <div className="auth-banner__text">
          <h1 className="heading-1">Don’t miss what’s happening</h1>
          <h2 className="heading-3">
            People on twitleague are the first to know.
          </h2>
        </div>
        <div className={authBanner["auth-banner__actions"]}>
          <TwitButton href="/login" color="white" outline="white">
            Log in
          </TwitButton>
          <TwitButton onClick={toggleSignUpModal} color="white">
            Sign up
          </TwitButton>
        </div>
      </div>
    );
  } else if (user.isSignedIn) {
    return null;
  }
}

export default AuthBanner;
