import React, { useState } from "react";
import Link from "next/link";

import TwitNav from "./TwitNav";
import UserToggle from "./UserToggle";
import TwitButton from "./TwitButton";
import TwitPostCircle from "./TwitPostCircle";
import Avatar from "./Avatar";
import useUser from "../lib/useUser";
import PopupCompose from "./modals/PopupCompose";

function LeftColumn({ initialValue, onSubmit, children }) {
  const { user } = useUser();
  const [showPopupCompose, setShowPopupCompose] = useState(false);

  return (
    <div className="header__left-column">
      <Link href="/home" passHref>
        <a className="header__logo heading-1 u-margin-bottom-small u-margin-top-small">
          twitleague
        </a>
      </Link>
      <TwitNav />
      <TwitButton
        onClick={() => setShowPopupCompose(true)}
        color="primary"
        size="large"
        collapse
        expanded
        icon="/sprites.svg#icon-edit"
      >
        New Post
      </TwitButton>
      <TwitPostCircle onClick={() => setShowPopupCompose(true)} />
      <UserToggle />
      <Avatar className="header__avatar" src={user ? user.avatar : null} />
      <PopupCompose
        show={showPopupCompose}
        onHide={() => setShowPopupCompose(false)}
        initialValue={initialValue}
        onSubmit={onSubmit}
        user={user}
      />
    </div>
  );
}

export default LeftColumn;
