import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Avatar from "./Avatar";

import { logOutUser } from "../actions";
import userToggle from "../sass/components/UserToggle.module.scss";
import TwitDropdown from "../components/TwitDropdown";
import TwitDropdownItem from "../components/TwitDropdownItem";
import TwitItem from "../components/TwitItem";
import TwitIcon from "./TwitIcon";
import useUser from "../lib/useUser";

function UserToggle() {
  const { user, mutateUser } = useUser();
  const router = useRouter();
  const ref = useRef();

  const [show, setShow] = useState(false);

  const logOut = async () => {
    await logOutUser();
    mutateUser();
    // router.push("/");
  };

  useEffect(() => {
    document.body.addEventListener("click", clickOutsideDropdownButton);
    return () => {
      document.body.removeEventListener("click", clickOutsideDropdownButton);
    };
  }, []);

  const clickOutsideDropdownButton = (event) => {
    if (!ref.current) {
      return;
    }
    if (ref.current.contains(event.target)) {
      return;
    }
    setShow(false);
  };

  if (user === undefined || !user.isSignedIn) {
    return null;
  } else {
    return (
      <div
        className={userToggle["user-toggle"]}
        onClick={() => setShow(true)}
        ref={ref}
      >
        <Avatar
          roundedCircle
          className={userToggle["user-toggle__image"]}
          src={user.avatar}
        />
        <div className={userToggle["user-toggle__textbox"]}>
          <span className={userToggle["user-toggle__username"]}>
            {user.name}
          </span>
          <span className="muted">{`@${user.username}`}</span>
        </div>
        <TwitIcon
          className={userToggle["user-toggle__icon"]}
          icon="/sprites.svg#icon-chevron-down"
        />
        <div className={userToggle["user-toggle__dropdown"]}>
          <TwitDropdown show={show}>
            <TwitItem
              avatar={user.avatar}
              title={user.name}
              subtitle={`@${user.username}`}
              onClick={() => router.push(`/users/${user.username}`)}
            />
            <TwitDropdownItem onClick={logOut}>Log out</TwitDropdownItem>
          </TwitDropdown>
        </div>
      </div>
    );
  }
}

export default UserToggle;
