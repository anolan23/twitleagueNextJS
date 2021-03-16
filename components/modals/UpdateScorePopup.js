import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {useFormik} from "formik";

import Popup from "./Popup";
import Avatar from "../Avatar";
import TwitButton from "../TwitButton";
import {toggleUpdateScorePopup, updateEvent, sendAwaitingEventApprovalNotification} from "../../actions";
import updateScorePopup from "../../sass/components/UpdateScorePopup.module.scss";
import TwitInputGroup from "../TwitInputGroup";
import TwitInput from "../TwitInput";

function UpdateScorePopup(props) {
    const {_event} = props;

    useEffect(() => {
        formik.setFieldValue("points", _event.points ? _event.points : 0);
        formik.setFieldValue("opponent_points", _event.opponent_points ? _event.opponent_points : 0);
        formik.setFieldValue("play_period", _event.play_period ? _event.play_period : "");

    }, [props._event.id])
    
    const formik = useFormik({
        initialValues: {
            points: _event.points,
            opponent_points: _event.opponent_points,
            play_period: _event.play_period
        },
        onSubmit: (values) => {
            if(values.play_period === "Final"){
                props.updateEvent(_event.id, values);
                props.sendAwaitingEventApprovalNotification(_event.owner_id, _event.id);
            }
            else{
                props.updateEvent(_event.id, values);
                console.log("updating score...")
            }
            
        }

    });

    const renderHeading = () => {
        return (
            <div className={updateScorePopup["update-score-popup__heading"]}>
                <TwitButton form="update-score-form" color="twit-button--primary">Update</TwitButton>
            </div>
        )
    }

    const renderBody = () => {
        if(_event === null){
            return <div>Loading...</div>
        }
        else{
            return (
                <form className={updateScorePopup["update-score-popup"]} id="update-score-form" onSubmit={formik.handleSubmit}>
                    <div className={updateScorePopup["update-score-popup__teams"]}>
                        <div className={updateScorePopup["update-score-popup__teams__team"]}>
                            <Avatar className={updateScorePopup["update-score-popup__teams__team__avatar"]} src={_event.avatar}/>
                            <span className={updateScorePopup["update-score-popup__teams__team__name"]}>{_event.team_name}</span>
                        </div>
                        <div className={updateScorePopup["update-score-popup__teams__score"]}>
                            <input 
                                className={updateScorePopup["update-score-popup__teams__score__points"]} 
                                type="number" 
                                min={0} 
                                max={999}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                name="points"
                                id="points"
                                value={formik.values.points}
                                />
                            <span className={updateScorePopup["update-score-popup__teams__score__dash"]}>-</span>
                            <input 
                                className={updateScorePopup["update-score-popup__teams__score__points"]} 
                                type="number" 
                                min={0} 
                                max={999}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                name="opponent_points"
                                id="opponent_points"
                                value={formik.values.opponent_points}
                            />
                        </div>
                        <div className={updateScorePopup["update-score-popup__teams__team"]}>
                            <Avatar className={updateScorePopup["update-score-popup__teams__team__avatar"]} src={_event.opponent_avatar}/>
                            <span className={updateScorePopup["update-score-popup__teams__team__name"]}>{_event.opponent_team_name}</span>
                        </div>
                    </div>
                    <TwitInputGroup labelText="Play period">
                        <TwitInput 
                            select 
                            value={formik.values.play_period} 
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur}
                            name="play_period"
                            id="play_period"
                            >

                            <option defaultValue value={null}>Start</option> 
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

    console.log(formik.values);

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
        showUpdateScorePopup: state.modals.showUpdateScorePopup,
        _event: state.event
        }
}

export default connect(mapStateToProps, {toggleUpdateScorePopup, updateEvent, sendAwaitingEventApprovalNotification})(UpdateScorePopup);