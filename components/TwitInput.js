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
  isError,
  errors,
  children,
  autocomplete = "off",
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

  function renderErrors() {
    if (!isError) return null;
    else {
      return (
        <div className={twitInput["twit-input__error-message"]}>{errors}</div>
      );
    }
  }

  if (select) {
    return (
      <select
        id={id}
        type={type}
        autoComplete={autocomplete}
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
          autoComplete={autocomplete}
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
      <React.Fragment>
        <input
          id={id}
          type={type}
          autoComplete={autocomplete}
          className={`${twitInput["twit-input"]} ${
            isError ? twitInput["twit-input--error"] : null
          }`}
          placeholder={placeHolder}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          name={name}
        />
        {renderErrors()}
      </React.Fragment>
    );
  }
}

export default TwitInput;
