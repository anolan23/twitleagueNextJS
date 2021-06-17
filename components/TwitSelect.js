import { useState, useEffect, useRef } from "react";
import twitSelect from "../sass/components/TwitSelect.module.scss";
import TwitDropdown from "./TwitDropdown";
import TwitDropdownItem from "./TwitDropdownItem";
import TwitIcon from "./TwitIcon";

function TwitSelect({ options, defaultValue, onSelect }) {
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
        <TwitDropdownItem
          key={index}
          value={option.id}
          id={option.id}
          onClick={onOptionClick}
        >
          {option.text}
        </TwitDropdownItem>
      );
    });
  };

  const onOptionClick = (event) => {
    console.log(event.target.value);
    const value = event.target.textContent;
    const optionId = event.target.id;
    onSelect(optionId);
    setValue(value);
  };

  return (
    <div onClick={onClick} className={twitSelect["twit-select"]} ref={ref}>
      <div className={twitSelect["twit-select__value"]}>{value}</div>
      <TwitIcon
        className={twitSelect["twit-select__icon"]}
        icon="/sprites.svg#icon-chevron-down"
      />
      <div className={twitSelect["twit-select__dropdown"]}>
        <TwitDropdown show={show}>{renderOptions()}</TwitDropdown>
      </div>
    </div>
  );
}

export default TwitSelect;
