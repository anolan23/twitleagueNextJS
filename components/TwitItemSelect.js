import { useState, useEffect, useRef } from "react";
import twitSelect from "../sass/components/TwitSelect.module.scss";
import TwitDropdown from "./TwitDropdown";
import TwitDropdownItem from "./TwitDropdownItem";
import TwitIcon from "./TwitIcon";
import TwitItem from "./TwitItem";

function TwitItemSelect({ options, defaultValue, onSelect }) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const ref = useRef();

  const onClick = () => {
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
    return options.map((option, index) => {
      return (
        <TwitItem
          key={index}
          avatar={option.avatar}
          title={option.title}
          subtitle={option.subtitle}
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
    <div onClick={onClick} className={twitSelect["twit-select"]} ref={ref}>
      <TwitItem
        small
        avatar={value.avatar}
        title={value.title}
        subtitle={value.subtitle}
      />
      <TwitIcon
        className={twitSelect["twit-select__icon"]}
        icon="/sprites.svg#icon-chevron-down"
      />
      <div className={twitSelect["twit-select__dropdown"]}>
        <TwitDropdown
          show={show}
          className={twitSelect["twit-select__dropdown__expanded"]}
        >
          {renderOptions()}
        </TwitDropdown>
      </div>
    </div>
  );
}

export default TwitItemSelect;
