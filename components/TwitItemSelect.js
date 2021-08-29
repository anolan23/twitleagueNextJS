import { useState, useEffect, useRef } from "react";
import twitItemSelect from "../sass/components/TwitItemSelect.module.scss";
import TwitDropdown from "./TwitDropdown";
import TwitDropdownItem from "./TwitDropdownItem";
import TwitIcon from "./TwitIcon";
import TwitItem from "./TwitItem";
import TwitSpinner from "./TwitSpinner";

function TwitItemSelect({ id, options, defaultValue, onSelect, disabled }) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const ref = useRef();

  const onClick = () => {
    if (disabled) {
      return;
    }
    setShow(!show);
  };

  useEffect(() => {
    document.body.addEventListener("click", clickOutsideDropdownButton);
    return () => {
      document.body.removeEventListener("click", clickOutsideDropdownButton);
    };
  }, []);

  const clickOutsideDropdownButton = (event) => {
    if (!ref.current) {
      return;
    }
    if (ref.current.contains(event.target)) {
      return;
    }
    setShow(false);
  };

  const renderOptions = () => {
    if (!options) {
      return <TwitSpinner size={30} />;
    }
    return options.map((option, index) => {
      const { avatar, title, subtitle } = option;
      return (
        <TwitItem
          key={index}
          avatar={avatar}
          title={title}
          subtitle={subtitle}
          onClick={() => onOptionClick(option)}
          small
        />
      );
    });
  };

  const onOptionClick = (option) => {
    if (onSelect) {
      onSelect(option);
    }
    setValue(option);
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`${twitItemSelect["twit-select"]} ${
        disabled ? twitItemSelect["twit-select__disabled"] : ""
      }`}
      ref={ref}
    >
      <TwitItem
        small
        avatar={value ? value.avatar : null}
        title={value ? value.title : null}
        subtitle={value ? value.subtitle : null}
      />
      <TwitIcon
        className={twitItemSelect["twit-select__icon"]}
        icon="/sprites.svg#icon-chevron-down"
      />
      <div className={twitItemSelect["twit-select__dropdown"]}>
        <TwitDropdown
          show={show}
          className={twitItemSelect["twit-select__dropdown__expanded"]}
        >
          {renderOptions()}
        </TwitDropdown>
      </div>
    </div>
  );
}

export default TwitItemSelect;
