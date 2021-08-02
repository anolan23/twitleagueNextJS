import React from "react";

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
  const onPromptClick = (event) => {
    event.stopPropagation();
    onHide();
  };

  if (show) {
    return (
      <div
        className={`${prompt["prompt"]} ${prompt["prompt__show"]}`}
        onClick={onPromptClick}
      >
        <div className={prompt["prompt__window"]}>
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
      </div>
    );
  } else {
    return null;
  }
}

export default Prompt;
