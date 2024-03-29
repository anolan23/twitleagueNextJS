import React, { useRef } from "react";
import ReactDOM from "react-dom";

import popup from "../../sass/components/Popup.module.scss";

function Popup({ show, onHide, heading, title, body }) {
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

  function renderTitle() {
    if (!title) {
      return null;
    } else {
      return (
        <div className={popup["popup__window__heading__title"]}>{title}</div>
      );
    }
  }

  return ReactDOM.createPortal(
    <div
      className={`${popup["popup"]} ${popup["popup__show"]}`}
      onClick={onBackgroundClick}
    >
      <div className={popup["popup__window"]} ref={windowRef}>
        <div className={popup["popup__window__heading"]}>
          <svg onClick={onHide} className={popup["popup__window__icon"]}>
            <use xlinkHref="/sprites.svg#icon-x" />
          </svg>
          {renderTitle()}
          {heading}
        </div>
        <div className={popup["popup__window__body"]}>{body}</div>
      </div>
    </div>,
    document.getElementById("portal")
  );
}

export default Popup;
