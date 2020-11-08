import React from "react";
import {connect} from "react-redux";

import Notification from "./Notification";

class Notifications extends React.Component {

   renderNotifications = () => {
       if(this.props.notifications){
        return this.props.notifications.map((notification, index) => {
            console.log(this.props.notifications);
            return <Notification key={index} data={notification.data} type={notification.type} index={index}/>
        }
       )
       
       }
       else{
        return (
            <div>
                You have no notifications
            </div>
        );
        }
       
   }

    render(){
        
        return (
            <div >
                Notifications
                {this.renderNotifications()}
            </div>
        );

        
    };
}

const mapStateToProps = (state) => {
    return {notifications: state.user.notifications}
}

export default connect(mapStateToProps)(Notifications);