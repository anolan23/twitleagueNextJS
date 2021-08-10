import topBarSearch from "../sass/components/TopBarSearch.module.scss";
import TwitSearch from "./TwitSearch";
import TwitIcon from "../components/TwitIcon";

function TopBarSearch(props) {
  return (
    <div className={topBarSearch["top-bar-search"]}>
      <div className={topBarSearch["top-bar-search__search-holder"]}>
        <TwitIcon
          className={topBarSearch["top-bar-search__search-holder__back-icon"]}
          icon="/sprites.svg#icon-arrow-left"
        />
        <div
          className={topBarSearch["top-bar-search__search-holder__search-bar"]}
        >
          <TwitIcon
            className={topBarSearch["top-bar-search__icon"]}
            icon="/sprites.svg#icon-search"
          />
          <TwitSearch inline placeHolder="Search" />
        </div>
        <TwitIcon
          className={topBarSearch["top-bar-search__search-holder__more-icon"]}
          icon="/sprites.svg#icon-more-horizontal"
        />
      </div>

      <div className={topBarSearch["top-bar-search__tabs"]}>
        {props.children}
      </div>
    </div>
  );
}

export default TopBarSearch;
