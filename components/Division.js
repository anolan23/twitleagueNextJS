import {useState, useEffect, useRef} from "react";
import divisionStyle from "../sass/components/Division.module.scss";
import Divide from "../components/Divide";
import Empty from "../components/Empty"

import TwitDropdownItem from "../components/TwitDropdownItem";
import TwitIcon from "../components/TwitIcon";
import TwitDropdown from "../components/TwitDropdown";
import TwitStat from "./TwitStat";
import TwitButton from "./TwitButton";
import backend from "../lib/backend";

function Division(props){

    const ref = useRef();

    const [show, setShow] = useState(false);
    const [mode, setMode] = useState("default");
    const [division, setDivision] = useState(props.division)

    useEffect(() => {
        setDivision(props.division);
    }, [props.division])

    useEffect(() => {
        document.body.addEventListener("click", clickOutsideDropdownButton);
        return () => {
            document.body.removeEventListener("click", clickOutsideDropdownButton);
          }
    }, [])

    const clickOutsideDropdownButton = (event) => {
            if(!ref.current){
                return;
            }
            if(ref.current.contains(event.target)){
                return;
            }
            setShow(false);
    }

    const addTeamsClick = () => {
        setMode("addTeams")
        props.addTeams(division)
        setShow(false);
    }

    const removeTeamsClick = () => {
        setMode("removeTeams")
        props.removeTeams(division)
        setShow(false);
    }

    const editDivisionNameClick = () => {
        setMode("editDivisionName");
        props.editName(division);
        setShow(false);
        
    }

    const onEditDivisionNameBlur = (event) => {
        onEditDivisionNameSubmit(event);
    }

    const onEditDivisionNameSubmit = (event) => {
        const newDivisionName = event.target.value;
        let newDivision = {...division, division_name: newDivisionName};
        setDivision(newDivision);
        props.updateDivisions(newDivision);
        setMode("default")
        console.log("submit");
        backend.patch("/api/leagues/divisions", {
            divisionId: division.id,
            newDivisionName
        })

    }

    const onRemoveButtonClick = (team) => {
        let teams = division.teams.filter(_team => _team.id !== team.id);
        let newDivision = {...division, teams}
        setDivision(newDivision);
        props.updateDivisions(newDivision);
        backend.patch("/api/teams", {
            teamId: team.id,
            values: {divisionId: null}
        })
    }

    const renderDivisionName = () => {
        if(mode !== "editDivisionName"){
            return <span className={divisionStyle["division__header__text"]}>{division.division_name}</span>
        }
        else if(mode === "editDivisionName"){
            return (
                <form onSubmit={onEditDivisionNameSubmit} className={divisionStyle["division__header__form"]}>
                    <input 
                        type="text" 
                        defaultValue={division.division_name} 
                        className={divisionStyle["division__header__form__input"]}
                        placeholder="Enter division name"
                        onBlur={onEditDivisionNameBlur}
                        />
                </form>
            )
        }
    }

    const renderTeamButton = (team) => {
        if(mode === "removeTeams"){
            return <TwitButton size="twit-button--primary--small" onClick={() => onRemoveButtonClick(team)} color="twit-button--primary">Remove</TwitButton>

        }
        else{
            return null;
        }
    }

    const renderBody = () => {
        if(!division.teams || division.teams.length === 0){
            return <Empty main="No teams" sub={props.editable ? "Add teams to this division" : "No teams currently in this division"}/>
        }
        else{
            return division.teams.map((team, index) => {
                return (
                    <TwitStat 
                     key={index} 
                     avatar={team.avatar}
                     text={team.team_name}
                     href={`/teams/${team.abbrev.substring(1)}`}
                     >
                        {renderTeamButton(team)}
                     </TwitStat> 
             );
            })
        }
    }

    const renderEditIcon = () => {
        if(props.editable){
            return <TwitIcon onClick={() => setShow(true)} className={divisionStyle["division__icon-holder__icon"]} icon="/sprites.svg#icon-more-horizontal"/>
        }
        else{
            return null;
        }
    }

    return(
        <div className={divisionStyle["division"]}>
            <div className={divisionStyle["division__header"]}>
                {renderDivisionName()}
                <div className={divisionStyle["division__actions"]}>
                    <div className={divisionStyle["division__icon-holder"]} ref={ref}>
                        {renderEditIcon()}
                        <div className={divisionStyle["division__icon-holder__dropdown"]}>
                            <TwitDropdown show={show}>
                                <TwitDropdownItem onClick={addTeamsClick}>Add teams</TwitDropdownItem>
                                <TwitDropdownItem onClick={removeTeamsClick}>Remove teams</TwitDropdownItem>
                                <TwitDropdownItem onClick={editDivisionNameClick}>Edit division name</TwitDropdownItem>
                                <TwitDropdownItem>Delete division</TwitDropdownItem>
                            </TwitDropdown>
                        </div>
                    </div>
                </div>
            </div>
            <div className={divisionStyle["division__body"]}>
                {renderBody()}
            </div>
            <Divide/>
        </div>
    )
}

export default Division;