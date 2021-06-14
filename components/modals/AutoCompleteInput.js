import React from "react";

import autoCompleteInput from "../../sass/components/AutoCompleteInput.module.scss";
import TwitDropdown from "../TwitDropdown";

function AutoCompleteInput({
  id,
  onChange,
  value,
  name,
  type,
  placeHolder,
  className,
  autoComplete,
  show,
  children,
}) {
  //   const renderTeams = () => {
  //     if (!teamOptions) {
  //       return null;
  //     } else {
  //       return (
  //         <React.Fragment>
  //           <div className={autoCompleteInput["auto-complete-input__header"]}>
  //             <span
  //               className={autoCompleteInput["auto-complete-input__header__text"]}
  //             >
  //               Teams
  //             </span>
  //           </div>
  //           {teamOptions}
  //         </React.Fragment>
  //       );
  //     }
  //   };

  //   const renderLeagues = () => {
  //     if (!leagueOptions) {
  //       return null;
  //     } else {
  //       return (
  //         <React.Fragment>
  //           <div className={autoCompleteInput["auto-complete-input__header"]}>
  //             <span
  //               className={autoCompleteInput["auto-complete-input__header__text"]}
  //             >
  //               Leagues
  //             </span>
  //           </div>
  //           {leagueOptions}
  //         </React.Fragment>
  //       );
  //     }
  //   };

  //   const renderUsers = () => {
  //     if (!peopleOptions) {
  //       return null;
  //     } else {
  //       return (
  //         <React.Fragment>
  //           <div className={autoCompleteInput["auto-complete-input__header"]}>
  //             <span
  //               className={autoCompleteInput["auto-complete-input__header__text"]}
  //             >
  //               Users
  //             </span>
  //           </div>
  //           {peopleOptions}
  //         </React.Fragment>
  //       );
  //     }
  //   };

  return (
    <React.Fragment>
      <input
        id={id}
        onChange={onChange}
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
        <TwitDropdown show={show}>{children}</TwitDropdown>
      </div>
    </React.Fragment>
  );
}

export default AutoCompleteInput;
