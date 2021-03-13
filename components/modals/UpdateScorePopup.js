import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {useFormik} from "formik";

import Popup from "./Popup";
import Avatar from "../Avatar";
import TwitButton from "../TwitButton";
import {toggleUpdateScorePopup} from "../../actions";
import updateScorePopup from "../../sass/components/UpdateScorePopup.module.scss";
import TwitInputGroup from "../TwitInputGroup";
import TwitInput from "../TwitInput";

function UpdateScorePopup(props) {
    const [_event, setEvent] = useState(null);

    useEffect(() => {
        document.addEventListener("update-score", onUpdateScoreClick);
    }, [])
    
    const formik = useFormik({
        initialValues: {
            
        },
        onSubmit: (values) => {
            
        }

    });

    const onUpdateScoreClick = (event) => {
        console.log("event.detail.event", event.detail.event);
        setEvent(event.detail.event)
    }

    const renderHeading = () => {
        return (
            <div className={updateScorePopup["update-score-popup__heading"]}>
                <TwitButton form="edit-team-form" color="twit-button--primary">Save</TwitButton>
            </div>
        )
    }

    const renderBody = () => {
        if(_event === null){
            return <div>Loading...</div>
        }
        else{
            return (
                <form className={updateScorePopup["update-score-popup"]}>
                    <div className={updateScorePopup["update-score-popup__teams"]}>
                        <div className={updateScorePopup["update-score-popup__teams__team"]}>
                            <Avatar className={updateScorePopup["update-score-popup__teams__team__avatar"]} src={_event.avatar}/>
                            <span className={updateScorePopup["update-score-popup__teams__team__name"]}>{_event.team_name}</span>
                        </div>
                        <div className={updateScorePopup["update-score-popup__teams__score"]}>
                            <input className={updateScorePopup["update-score-popup__teams__score__points"]} type="number" min={0} max={999}/>
                            <span className={updateScorePopup["update-score-popup__teams__score__dash"]}>-</span>
                            <input className={updateScorePopup["update-score-popup__teams__score__points"]} type="number" min={0} max={999}/>
                        </div>
                        <div className={updateScorePopup["update-score-popup__teams__team"]}>
                            <Avatar className={updateScorePopup["update-score-popup__teams__team__avatar"]} src={_event.opponent_avatar}/>
                            <span className={updateScorePopup["update-score-popup__teams__team__name"]}>{_event.opponent_team_name}</span>
                        </div>
                    </div>
                    <TwitInputGroup labelText="Play period">
                        <TwitInput select>
                            <option selected value={null}>Start</option> 
                            <option>1st Half</option> 
                            <option>1st Half</option>
                            <option>2nd Half</option>
                            <option>1st Quarter</option>
                            <option>2nd Quarter</option>
                            <option>3rd Quarter</option>
                            <option>4th Quarter</option>
                            <option>1st Period</option>
                            <option>2nd Period</option>
                            <option>3rd Period</option>
                            <option>1st Inning</option>
                            <option>2nd Inning</option>
                            <option>3rd Inning</option>
                            <option>4th Inning</option>
                            <option>5th Inning</option>
                            <option>6th Inning</option>
                            <option>7th Inning</option>
                            <option>8th Inning</option>
                            <option>9th Inning</option>
                            <option>Delayed</option>
                            <option>Final</option>
                            <option>Postponed</option>
                        </TwitInput>
                    </TwitInputGroup>
                </form>
                
            );
        }
        
    }

    return (
        <Popup
            show={props.showUpdateScorePopup}
            onHide={props.toggleUpdateScorePopup}
            heading={renderHeading()}
            body={renderBody()}
        />
    );
}

const mapStateToProps = (state) => {
    return {
        showUpdateScorePopup: state.modals.showUpdateScorePopup
        }
}

export default connect(mapStateToProps, {toggleUpdateScorePopup})(UpdateScorePopup);