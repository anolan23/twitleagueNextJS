import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';

import autoCompleteInput from "../../sass/components/AutoCompleteInput.module.scss"

function AutoCompleteInput(props) {

    const renderTeamOptions = () => {

        if(!props.teamOptions){
            return null
        }
        else {
            return (
                <React.Fragment>
                    <Dropdown.Header>{props.teamHeader}</Dropdown.Header>
                    {props.teamOptions}
                </React.Fragment>
            );
        }
        
    }

    const renderLeagueOptions = () => {

        if(!props.leagueOptions){
            return null
        }
        else {
            return (
                <React.Fragment>
                    <Dropdown.Header className={autoCompleteInput["auto-complete-input__header"]}>Existing Leagues</Dropdown.Header>
                    {props.leagueOptions}
                </React.Fragment>
            );
        }
        
    }

    const renderPeopleOptions = () => {

        if(!props.peopleOptions){
            return null
        }
        else {
            return (
                <React.Fragment>
                    <Dropdown.Header>{props.peopleHeader}</Dropdown.Header>
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
            <Dropdown.Menu show={props.show  && (props.peopleOptions || props.teamOptions || props.leagueOptions)} className={autoCompleteInput["auto-complete-input__dropdown"]}>
                {renderTeamOptions()}
                {renderPeopleOptions()}
                {renderLeagueOptions()}

            </Dropdown.Menu>
        </React.Fragment>
        
    );
}

export default AutoCompleteInput;