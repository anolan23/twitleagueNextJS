import React from "react";
import {connect} from "react-redux";
import {togglePopupReply} from "../../actions";

import Popup from "./Popup";
import TwitInput from "../TwitInput";
import Post from "../Post";
import {createReply} from "../../actions";

function PopupReply(props){

    const onSubmit = () => {
        const conversation_id = props.trackedPost.conversation_id;
        const in_reply_to_post_id = props.trackedPost.id;
        props.createReply(conversation_id, in_reply_to_post_id);
    }
    
    const renderBody = () => {
        return (
            <React.Fragment>
                <Post post={props.trackedPost}/>
                <TwitInput 
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