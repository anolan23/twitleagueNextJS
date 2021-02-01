import React from "react";
import {connect} from "react-redux";
import {togglePopupCompose, createPost} from "../../actions";

import Popup from "./Popup";
import MainInput from "../MainInput";

function PopupCompose(props){
    
    const renderBody = () => {
        return (
            <MainInput 
                expanded 
                placeHolder="What's happening?" 
                initialValue="" 
                buttonText="Post"
                onSubmit={props.createPost}
                />
        )
    }
    
    return (
        <Popup
            show={props.showPopupCompose}
            onHide={props.togglePopupCompose}
            body={renderBody()}
        />
    )
}

const mapStateToProps = (state) => {
    return {
        showPopupCompose: state.modals.showPopupCompose
    }
}

export default connect(mapStateToProps, {togglePopupCompose, createPost})(PopupCompose);