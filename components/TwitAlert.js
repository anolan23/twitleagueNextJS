import { useEffect } from "react";
import { useRouter } from "next/router";
import ReactDOM from "react-dom";

import { useStore } from "../context/Store";
import { removeAlert } from "../actions";
import twitAlert from "../sass/components/TwitAlert.module.scss";

function TwitAlert({ alert }) {
  const [state, dispatch] = useStore();
  const { index, message, href, duration } = alert;

  const router = useRouter();

  setTimeout(() => {
    dispatch(removeAlert(index));
  }, duration);

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
