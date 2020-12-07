import React from "react";
import {connect} from "react-redux";
import {togglePopupCompose} from "../../actions";

import Popup from "./Popup";
import TwitInput from "../TwitInput";

function PopupCompose(props){
    
    const renderBody = () => {
        return <TwitInput placeHolder="What's happening?" initialValue=""/>
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

export default connect(mapStateToProps, {togglePopupCompose})(PopupCompose);