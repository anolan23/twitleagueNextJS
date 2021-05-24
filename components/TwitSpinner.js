import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import twitSpinner from "../sass/components/TwitSpinner.module.scss";

function TwitSpinner() {
  const override = css`
    display: block;
    border-width: 4px;
  `;

  return (
    <div className={twitSpinner["twit-spinner"]}>
      <ClipLoader loading={true} color="#1da1f2" css={override} size={30} />
    </div>
  );
}
export default TwitSpinner;
