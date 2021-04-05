import React from "react";
import {connect} from "react-redux";
import {togglePopupReply} from "../../actions";

import Popup from "./Popup";
import MainInput from "../MainInput";
import Post from "../Post";
import {createReply} from "../../actions";

function PopupReply(props){

    const onSubmit = (values) => {
        const conversation_id = props.trackedPost.conversation_id;
        const in_reply_to_post_id = props.trackedPost.id;
        const reply = {...values, conversation_id, in_reply_to_post_id}
        props.createReply(reply);
    }
    
    const renderBody = () => {
        return (
            <React.Fragment>
                <Post post={props.trackedPost} history/>
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
            show={props.showPopupReply}
            onHide={props.togglePopupReply}
            body={renderBody()}
        />
    )
}

const mapStateToProps = (state) => {
    return {
        showPopupReply: state.modals.showPopupReply,
        trackedPost: state.trackedPost
    }
}

export default connect(mapStateToProps, {togglePopupReply, createReply})(PopupReply);