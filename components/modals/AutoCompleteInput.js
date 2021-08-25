import React from "react";

import autoCompleteInput from "../../sass/components/AutoCompleteInput.module.scss";
import TwitDropdown from "../TwitDropdown";

function AutoCompleteInput({
  id,
  onChange,
  onBlur,
  value,
  name,
  type,
  placeHolder,
  className,
  autoComplete,
  show,
  children,
  dropdownRef,
}) {
  return (
    <React.Fragment>
      <input
        id={id}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        name={name}
        type={type}
        placeholder={placeHolder}
        className={
          className ? className : autoCompleteInput["auto-complete-input"]
        }
        autoComplete={autoComplete}
      />
      <div className={autoCompleteInput["auto-complete-input__dropdown"]}>
        <TwitDropdown show={show} dropdownRef={dropdownRef}>
          {children}
        </TwitDropdown>
      </div>
    </React.Fragment>
  );
}

export default AutoCompleteInput;
