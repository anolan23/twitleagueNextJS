import React from "react";

import autoCompleteInput from "../../sass/components/AutoCompleteInput.module.scss"
import TwitDropdown from "../TwitDropdown";

function AutoCompleteInput(props) {

    const renderTeams = () => {

        if(!props.teamOptions){
            return null
        }
        else {
            return (
                <React.Fragment>
                    <div className={autoCompleteInput["auto-complete-input__header"]}>
                        <span className={autoCompleteInput["auto-complete-input__header__text"]}>Teams</span>
                    </div>
                    {props.teamOptions}
                </React.Fragment>
            );
        }
        
    }

    const renderLeagues = () => {

        if(!props.leagueOptions){
            return null
        }
        else {
            return (
                <React.Fragment>
                    <div className={autoCompleteInput["auto-complete-input__header"]}>
                        <span className={autoCompleteInput["auto-complete-input__header__text"]}>Leagues</span>
                    </div>
                    {props.leagueOptions}
                </React.Fragment>
            );
        }
        
    }

    const renderUsers = () => {

        if(!props.peopleOptions){
            return null
        }
        else {
            return (
                <React.Fragment>
                    <div className={autoCompleteInput["auto-complete-input__header"]}>
                        <span className={autoCompleteInput["auto-complete-input__header__text"]}>Users</span>
                    </div>
                    {props.peopleOptions}
                </React.Fragment>
            );
        }
        
    }

    return (
        <React.Fragment>
            <input 
                id = {props.id}
                onChange={props.onChange}
                value={props.value}
                name={props.name}
                type={props.type}
                placeholder={props.placeholder} 
                className={props.className?props.className:autoCompleteInput["auto-complete-input"]} 
                autoComplete={props.autoComplete}
            />
            <div className={autoCompleteInput["auto-complete-input__dropdown"]}>
                <TwitDropdown show={props.show  && (props.peopleOptions || props.teamOptions || props.leagueOptions)}>
                    {renderTeams()}
                    {renderUsers()}
                    {renderLeagues()}
                </TwitDropdown>
            </div>
        </React.Fragment>
        
    );
}

export default AutoCompleteInput;