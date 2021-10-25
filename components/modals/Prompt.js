import React, { useRef } from "react";
import ReactDOM from "react-dom";

import prompt from "../../sass/components/Prompt.module.scss";
import TwitButton from "../../components/TwitButton";

function Prompt({
  main,
  sub,
  show,
  onSecondaryActionClick,
  onPrimaryActionClick,
  primaryActionText,
  secondaryActionText,
  onHide,
}) {
  if (!show) {
    return null;
  }

  const windowRef = useRef(null);

  function onBackgroundClick(event) {
    event.stopPropagation();
    if (!windowRef.current) {
      return;
    }
    if (windowRef.current.contains(event.target)) {
      return;
    }
    onHide();
  }

  return ReactDOM.createPortal(
    <div
      className={`${prompt["prompt"]} ${prompt["prompt__show"]}`}
      onClick={onBackgroundClick}
    >
      <div className={prompt["prompt__window"]} ref={windowRef}>
        <span className={prompt["prompt__window__main"]}>{main}</span>
        <p className={prompt["prompt__window__sub"]}>{sub}</p>
        <div className={prompt["prompt__window__actions"]}>
          <TwitButton
            onClick={onSecondaryActionClick}
            color={"primary"}
            size="large"
            outline="primary"
            expanded
          >
            {secondaryActionText}
          </TwitButton>
          <TwitButton
            onClick={onPrimaryActionClick}
            color={"primary"}
            size="large"
            expanded
          >
            {primaryActionText}
          </TwitButton>
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
}

export default Prompt;
