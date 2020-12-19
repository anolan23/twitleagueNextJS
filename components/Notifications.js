import React from "react";
import {connect} from "react-redux";

import notifications from "../sass/components/Notifications.module.scss";
import Notification from "./Notification";
import TopBar from "./TopBar";

function Notifications(props) {

   const renderNotifications = () => {
       if(props.notifications.length > 0){
        return props.notifications.map((notification, index) => {
            console.log(props.notifications);
            return <Notification key={index} data={notification.data} type={notification.type} index={index}/>
        }
       );
       
       }
       else{
        return (
            <div className="u-empty">
                You have no notifications.
            </div>
        );
        }    
   }
        return (
            <div className={notifications["notifications"]}>
                <TopBar main="Notifications"/>
                <div className={notifications["notifications__holder"]}>
                    {renderNotifications()}
                </div>
            </div>
        );
    }

const mapStateToProps = (state) => {
    return {notifications: state.user.notifications ? state.user.notifications : []}
}

export default connect(mapStateToProps)(Notifications);