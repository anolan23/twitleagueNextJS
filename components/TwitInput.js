import React, { useState } from "react";
import twitInput from "../sass/components/TwitInput.module.scss";
import TwitDropdown from "./TwitDropdown";

function TwitInput({
  id,
  type,
  placeHolder,
  onBlur,
  value,
  name,
  select,
  autoComplete,
  onChange,
  children,
}) {
  const [show, setShow] = useState(false);

  const handleChange = (event) => {
    onChange(event);
    if (!show) {
      setShow(true);
    }
    if (!event.target.value) {
      setShow(false);
    }
  };

  if (select) {
    return (
      <select
        id={id}
        type={type}
        autoComplete="off"
        className={twitInput["twit-input"]}
        placeholder={placeHolder}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        name={name}
      >
        {children}
      </select>
    );
  } else if (autoComplete) {
    return (
      <React.Fragment>
        <input
          id={id}
          type={type}
          autoComplete="off"
          className={twitInput["twit-input"]}
          placeholder={placeHolder}
          onChange={handleChange}
          onBlur={onBlur}
          value={value}
          name={name}
        />
        <TwitDropdown show={show}>{children}</TwitDropdown>
      </React.Fragment>
    );
  } else {
    return (
      <input
        id={id}
        type={type}
        autoComplete="off"
        className={twitInput["twit-input"]}
        placeholder={placeHolder}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        name={name}
      />
    );
  }
}

export default TwitInput;
