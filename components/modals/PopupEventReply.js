import React from "react";
import {connect} from "react-redux";

import {togglePopupEventReply, sendEventReply} from "../../actions";
import Popup from "./Popup";
import MainInput from "../MainInput";
import Matchup from "../Matchup";

function PopupReply(props){

    const onSubmit = (values) => {
        let reply = {...values, event_conversation_id: props.event.id}
        props.sendEventReply(reply);
    }
    
    const renderBody = () => {
        return (
            <React.Fragment>
                <Matchup event={props.event}/>
                <MainInput 
                    onSubmit={onSubmit} 
                    buttonText="Reply" 
                    expanded 
                    placeHolder="Post your reply" 
                    initialValue=""
                />       
            </React.Fragment>
        )
    }
    
    return (
        <Popup
            show={props.showPopupEventReply}
            onHide={props.togglePopupEventReply}
            body={renderBody()}
        />
    )
}

const mapStateToProps = (state) => {
    return {
        showPopupEventReply: state.modals.showPopupEventReply,
        event: state.event
    }
}

export default connect(mapStateToProps, {togglePopupEventReply, sendEventReply})(PopupReply);