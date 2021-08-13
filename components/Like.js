import TwitIcon from "./TwitIcon";
import likeStyle from "../sass/components/Like.module.scss";
function Like({ liked, className }) {
  function renderLike() {
    if (liked) {
      return (
        <TwitIcon className={className} icon="/SVG/heart-filled.svg#svg1424" />
      );
    } else {
      return <TwitIcon className={className} icon="/sprites.svg#icon-heart" />;
    }
  }

  return <div className={likeStyle["like"]}>{renderLike()}</div>;
}
export default Like;
