import { useEffect } from "react";
import { useRouter } from "next/router";
import ReactDOM from "react-dom";

import twitAlert from "../sass/components/TwitAlert.module.scss";

function TwitAlert({ href, message, show, onHide, duration, color }) {
  if (!show) {
    return null;
  }
  const router = useRouter();

  useEffect(() => {
    const timeId = setTimeout(() => onHide(), duration);

    return () => {
      clearTimeout(timeId);
    };
  }, []);

  function onAlertClick(event) {
    if (!href) {
      return null;
    }
    event.stopPropagation();
    router.push(href);
  }

  return ReactDOM.createPortal(
    <div className={twitAlert["twit-alert"]} onClick={onAlertClick}>
      <div className={twitAlert["twit-alert__message"]}>
        <span className={twitAlert["twit-alert__text"]}>{message}</span>
      </div>
    </div>,
    document.getElementById("alerts")
  );
}

export default TwitAlert;
