import React, {useState, useEffect} from "react";
import {useFormik} from "formik";
import {connect} from "react-redux";

import useUser from "../../lib/useUser";
import {toggleEditDivisionsPopup, updateTeamById, createDivision} from "../../actions";
import backend from "../../lib/backend";
import editDivisionsPopup from "../../sass/components/EditDivisionsPopup.module.scss";
import twitForm from "../../sass/components/TwitForm.module.scss";
import Popup from "./Popup";
import TwitButton from "../TwitButton";
import TwitInputGroup from "../TwitInputGroup";
import TwitInput from "../TwitInput";
import Empty from "../Empty";
import StandingsDivision from "../StandingsDivision";
import useSWR from "swr";

function EditDivisionsPopup(props){
    const { user } = useUser();
    const [team, setTeam] = useState(null);
    const [unassignedTeams, setUnassignedTeams] = useState(null);
    const getDivisions = async (url) => {
        const response = await backend.get(url);   
        return response.data;
    }
    const { data: divisions, mutate: mutateDivisions } = useSWR(`/api/leagues/${props.league.league_name}/standings`, getDivisions, {revalidateOnMount:true});
    useEffect(() => {
        setTeam(null);

    }, [props.showEditDivisionsPopup]);

    useEffect(() => {
        getUnassignedTeams()

    }, [divisions]);

    const getUnassignedTeams = async () => {
        const teams = await backend.get(`/api/leagues/${props.league.league_name}/teams`);
        filterTeams(teams.data);
    }

    const filterTeams = (teams) => {
        const filteredTeams = teams.filter((team => team.division_id === null));
        setUnassignedTeams(filteredTeams);
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

    const create = async () => {
        await createDivision(props.league.id);
        mutateDivisions();
    }

    const onTeamClick = (clickedTeam) => {
        if(team){
            setTeam(null);
        }
        else{
            setTeam(clickedTeam);
        }
    }

    const onDivisionClick = async (clickedDivision, index) => {
        if(!team){
            setTeam(null);
            return;
        }
        else{
            await updateTeamById(team.id, {division_id: clickedDivision.division.id});
            mutateDivisions();
            setTeam(null);
        }

    }

    const onDelete = async () => {
        mutateDivisions();
    }

    const renderHeading = () => {
            return (
                <div className={editDivisionsPopup["edit-divisions-popup__heading"]}>
                    <h1 className={editDivisionsPopup["edit-divisions-popup__heading__title"]}>Divisions</h1>
                    <div className={editDivisionsPopup["edit-divisions-popup__heading__actions"]}>
                        <TwitButton onClick={create} color="twit-button--primary">Create</TwitButton>
                    </div>
                </div>
            )
    }

    const renderUnassignedTeams = () => {
        if(!unassignedTeams){
            return null;
        }
        else if(unassignedTeams.length === 0){
            return null;
        }
        return <StandingsDivision division={{division_name: 'Unassigned teams', teams: unassignedTeams}} onTeamClick={onTeamClick} team={team} onDivisionClick={null}/>
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
                return (
                    <StandingsDivision 
                        key={index} 
                        division={division.division} 
                        onTeamClick={onTeamClick} 
                        team={team} 
                        onDivisionClick={() => onDivisionClick(division, index)}
                        onDelete={onDelete}
                        editable={user.id === props.league.owner_id}
                    />
                )
            })
        }
    }

    const renderBody = () => {
        return (
            <div className={editDivisionsPopup["edit-divisions-popup__body"]}>
                {renderUnassignedTeams()}
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