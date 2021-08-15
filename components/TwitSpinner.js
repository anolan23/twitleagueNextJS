import { css } from "@emotion/react";
import MoonLoader from "react-spinners/MoonLoader";
import twitSpinner from "../sass/components/TwitSpinner.module.scss";

function TwitSpinner({ style, size }) {
  const override = css`
    display: block;
    border-width: 4px;
  `;

  return (
    <div className={twitSpinner["twit-spinner"]} style={style}>
      <MoonLoader
        loading={true}
        color="#1da1f2"
        size={size}
        override={override}
      />
    </div>
  );
}
export default TwitSpinner;
