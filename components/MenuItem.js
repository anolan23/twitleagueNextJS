import React from "react";

import menuItemStyle from "../sass/components/MenuItem.module.scss";

function MenuItem({ disabled, children, onClick }) {
  function onMenuItemClick() {
    if (disabled) {
      return;
    }
    onClick();
  }

  return (
    <div
      className={`${menuItemStyle["menu-item"]} ${
        disabled ? menuItemStyle["menu-item--disabled"] : ""
      }`}
      onClick={onMenuItemClick}
    >
      {children}
    </div>
  );
}

export default MenuItem;
