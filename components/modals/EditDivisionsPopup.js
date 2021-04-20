import React, {useState, useEffect} from "react";
import {useFormik} from "formik";
import {connect} from "react-redux";

import {toggleEditDivisionsPopup} from "../../actions";
import backend from "../../lib/backend";
import editDivisionsPopup from "../../sass/components/EditDivisionsPopup.module.scss";
import twitForm from "../../sass/components/TwitForm.module.scss";
import Popup from "./Popup";
import TwitButton from "../TwitButton";
import TwitInputGroup from "../TwitInputGroup";
import TwitInput from "../TwitInput";
import Empty from "../Empty";
import {groupBy} from "../../lib/twit-helpers";
import StandingsDivision from "../StandingsDivision";

function EditDivisionsPopup(props){
    const [divisions, setDivisions] = useState(null);
    const [team, setTeam] = useState(null);

    useEffect(() => {
        setTeam(null);
        getDivisions();
    }, [props.showEditDivisionsPopup]);

    const getDivisions = async () => {
        const response = await backend.get(`/api/leagues/${props.league.league_name}/standings`);
        console.log(response.data)
        const groupByDivisionName = groupBy('division_name');
        let divisions = groupByDivisionName(response.data);
        divisions = Object.values(divisions);   
        setDivisions(divisions);
    }
        
    const formik = useFormik({
        initialValues: {
            type: "game",
            opponent: null,
            location: null,
            eventDate: null,
            notes: null,
            isHomeTeam: null
        },
        onSubmit: values => { 
            
          }
    });

    const createDivision = () => {
        let newDivisions = [...divisions, []];
        setDivisions(newDivisions)
    }

    const onTeamClick = (clickedTeam) => {
        if(team){
            setTeam(null);
        }
        else{
            setTeam(clickedTeam);
        }
        console.log(clickedTeam)
    }

    const onDivisionClick = (clickedDivision, index) => {
        if(!team || clickedDivision.some(t => t.id === team.id)){
            setTeam(null);
            return;
        }
        else{
            let newDivisions = [...divisions]
            newDivisions = newDivisions.map(newDivision => newDivision.filter(t => t.id !== team.id))
            let newDivision = [...clickedDivision, team];
            newDivision = newDivision.sort((a, b) => {
                return a.place - b.place;
            });
            newDivisions[index] = newDivision;

            setDivisions(newDivisions);
            setTeam(null);
        }
        console.log(clickedDivision)
        console.log(index)
    }

    const renderHeading = () => {
            return (
                <div className={editDivisionsPopup["edit-divisions-popup__heading"]}>
                    <h1 className={editDivisionsPopup["edit-divisions-popup__heading__title"]}>Divisions</h1>
                    <div className={editDivisionsPopup["edit-divisions-popup__heading__actions"]}>
                        <TwitButton onClick={createDivision} color="twit-button--primary">Create</TwitButton>
                        <TwitButton form="add-event-form" color="twit-button--primary">Done</TwitButton>
                    </div>
                </div>
            )
    }

    const renderDivisions = () => {
        if(!divisions){
            return <div>loading</div>;
        }
        else if(divisions.length === 0){
            return null
        }
        else{
            return divisions.map((division, index) => {
                return <StandingsDivision key={index} division={division} onTeamClick={onTeamClick} team={team} onDivisionClick={() => onDivisionClick(division, index)}/>
            })
        }
    }

    const renderBody = () => {
        return (
            <div className={editDivisionsPopup["edit-divisions-popup__body"]}>
                {renderDivisions()}
            </div>
        );
    }


    return(
        <Popup 
            show={props.showEditDivisionsPopup}
            heading={renderHeading()} 
            body={renderBody()} 
            onHide={props.toggleEditDivisionsPopup}/>
        
    );
}

const mapStateToProps = (state) => {
    return {
        showEditDivisionsPopup: state.modals.showEditDivisionsPopup,
        league: state.league
    }
}

export default connect(mapStateToProps, {toggleEditDivisionsPopup})(EditDivisionsPopup);