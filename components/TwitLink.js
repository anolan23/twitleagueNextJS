import { useState, useEffect } from "react";
import twitLink from "../sass/components/TwitLink.module.scss";
import Link from "next/link";

import Infogram from "./Infogram";
import useUser from "../lib/useUser";

import FollowButton from "./FollowButton";
import ScoutButton from "./ScoutButton";

function TwitLink({ href, children, className, getInfo, type, ...props }) {
  const { user } = useUser();
  const [info, setInfo] = useState(props.info);

  const onMouseEnter = async (event) => {
    
    if (!info) {
      const info = await getInfo();
      setInfo(info);
    }
  };

  const renderAction = () => {
    switch (type) {
      case "team":
        if (!info) {
          return null;
        } else {
          return <FollowButton team={info} />;
        }
      case "user":
        if (!info) {
          return null;
        } else {
          if (user.username === info.username) {
            return null;
          } else {
            return <ScoutButton user={info} />;
          }
        }

      default:
        return null;
    }
  };

  const renderInfogram = () => {
    switch (type) {
      case "team":
        return (
          <Infogram
            action={renderAction()}
            info={
              info
                ? { ...info, main: info.team_name, secondary: info.abbrev }
                : null
            }
            href={href}
          />
        );

      case "user":
        return (
          <Infogram
            action={renderAction()}
            info={
              info
                ? { ...info, main: info.name, secondary: info.username }
                : null
            }
            href={href}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={twitLink["twit-link"]} onMouseEnter={onMouseEnter}>
      <Link href={href} passHref>
        <a className={className} onClick={(e) => e.stopPropagation()}>
          {children}
        </a>
      </Link>
      {renderInfogram()}
    </div>
  );
}
export default TwitLink;
