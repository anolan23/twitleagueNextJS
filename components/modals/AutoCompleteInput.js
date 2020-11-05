import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';

import styles from "../../styles/AutoCompleteForm.module.css"

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
        <div>
            <FormControl 
                onChange={props.onChange}
                onBlur={props.onBlur}
                // value={props.value}
                name={props.name}
                type={props.type}
                placeholder={props.placeholder} 
                className={props.className} 
                autoComplete={props.autoComplete}
                isValid={props.isValid}
                 />
            <Dropdown.Menu show={props.show  && (props.peopleOptions || props.teamOptions)} className={styles.dropdown}>
                {renderTeamOptions()}
                {renderPeopleOptions()}
            </Dropdown.Menu>
        </div>
    );
}

export default AutoCompleteInput;