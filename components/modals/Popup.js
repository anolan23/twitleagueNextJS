import React from "react";

import popup from "../../sass/components/Popup.module.scss";

function Popup({ show, onHide, heading, body }) {
  if (!show) {
    return null;
  } else {
    return (
      <div className={`${popup["popup"]} ${popup["popup__show"]}`}>
        <div className={popup["popup__window"]}>
          <div className={popup["popup__window__heading"]}>
            <svg onClick={onHide} className={popup["popup__window__icon"]}>
              <use xlinkHref="/sprites.svg#icon-x" />
            </svg>
            {heading}
          </div>
          <div className={popup["popup__window__body"]}>{body}</div>
        </div>
      </div>
    );
  }
}

export default Popup;
