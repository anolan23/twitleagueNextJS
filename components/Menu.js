import React from "react";

import useUser from "../lib/useUser";
import menuStyle from "../sass/components/Menu.module.scss";

function Menu({ children }) {
  const { user } = useUser();

  return <div className={menuStyle["menu"]}>{children}</div>;
}

export default Menu;
