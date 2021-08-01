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
    <button
      className={menuItemStyle["menu-item"]}
      onClick={onMenuItemClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default MenuItem;
