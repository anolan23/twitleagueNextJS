import { useEffect } from "react";
import Link from "next/link";

import twitAlert from "../sass/components/TwitAlert.module.scss";

function TwitAlert({ href, message, actionText, show, onHide, duration }) {
  if (!show) {
    return null;
  }
  useEffect(() => {
    console.log("twitalert mount");
    const timeId = setTimeout(() => onHide(), duration);

    return () => {
      clearTimeout(timeId);
    };
  }, []);

  const renderMessage = () => {
    return (
      <div className={twitAlert["twit-alert__message"]}>
        <span className={twitAlert["twit-alert__text"]}>{message}</span>
        <Link passHref href={href}>
          <a className={twitAlert["twit-alert__action-text"]}>{actionText}</a>
        </Link>
      </div>
    );
  };

  return <div className={twitAlert["twit-alert"]}>{renderMessage()}</div>;
}

export default TwitAlert;
