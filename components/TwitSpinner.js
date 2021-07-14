import { css } from "@emotion/react";
import BounceLoader from "react-spinners/BounceLoader";
import twitSpinner from "../sass/components/TwitSpinner.module.scss";

function TwitSpinner({ style, size }) {
  // const override = css`
  //   display: block;
  //   border-width: 4px;
  // `;

  return (
    <div className={twitSpinner["twit-spinner"]} style={style}>
      <BounceLoader loading={true} color="#1da1f2" size={size} />
    </div>
  );
}
export default TwitSpinner;
