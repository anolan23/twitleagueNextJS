import React from "react";
import {connect} from "react-redux";
import {togglePopupCompose, createPost} from "../../actions";

import useUser from "../../lib/useUser";
import Popup from "./Popup";
import MainInput from "../MainInput";

function PopupCompose(props){
    const { user } = useUser();

    const onSubmit = (post) => {
        props.createPost(post, user.id);
    }
    
    const renderBody = () => {
        return (
            <MainInput 
                expanded 
                compose
                placeHolder="$Team or @Username"
                initialValue="" 
                buttonText="Post"
                onSubmit={onSubmit}
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