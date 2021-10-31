import React, { useState } from "react";

import TwitButton from "./TwitButton";
import styles from "../sass/components/AuthBanner.module.scss";
import useUser from "../lib/useUser";
import SignupPopup from "./modals/SignupPopup";
import TwitIcon from "./TwitIcon";

function AuthBanner() {
  const { user } = useUser();
  const [showSignupPopup, setShowSignupPopup] = useState(false);

  if (!user) {
    return null;
  }

  if (!user.isSignedIn) {
    return (
      <div className={styles["auth-banner"]}>
        {/* <TwitIcon
          icon="/sprites.svg#icon-x"
          className={styles["auth-banner__close-icon"]}
        /> */}
        <div className={styles["auth-banner__text"]}>
          <h1 className="heading-1">Don’t miss what’s happening</h1>
          <h2 className="heading-3">
            People on twitleague are the first to know.
          </h2>
        </div>
        <div className={styles["auth-banner__actions"]}>
          <TwitButton
            href="/login"
            color="white"
            outline="white"
            expanded
            size="large"
          >
            Log in
          </TwitButton>
          <TwitButton
            onClick={() => setShowSignupPopup(true)}
            color="white"
            expanded
          >
            Sign up
          </TwitButton>
        </div>
        <SignupPopup
          show={showSignupPopup}
          onHide={() => setShowSignupPopup(false)}
        />
      </div>
    );
  } else if (user.isSignedIn) {
    return null;
  }
}

export default AuthBanner;
