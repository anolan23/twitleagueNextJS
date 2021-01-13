import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import {useRouter} from "next/router";

import Avatar from "./Avatar";
import {connect} from "react-redux";
import {logOutUser} from "../actions";
import userToggle from "../sass/components/UserToggle.module.scss"

function UserToggle(props){
    const router = useRouter();
    
    const logOut = async () => {
        await props.logOutUser();
        router.push("/")
    }

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <div className={userToggle["user-toggle"]}
            ref={ref}
            onClick={(e) => {
            e.preventDefault();
            onClick(e);
            }}
        >
          {children}
          <i className={"fas fa-chevron-down " + userToggle["user-toggle__icon"]}></i>
        </div>
        
      ));

    if(!props.user.isSignedIn){
        return null;
    }
    else{
        return(
            <Dropdown className={userToggle["user-toggle__dropdown"]}>
                <Dropdown.Toggle as={CustomToggle}>
                        <Avatar roundedCircle className={userToggle["user-toggle__image"]} src={props.user.avatar}/>
                        <div className={userToggle["user-toggle__textbox"]}>
                            <span className={userToggle["user-toggle__username"]}>{props.user.username}</span>
                            <span className="muted">{`@${props.user.username}`}</span>
                        </div>
                </Dropdown.Toggle>
    
                <Dropdown.Menu className={userToggle["user-toggle__menu"]}>
                <Dropdown.Item eventKey="1">
                    <div className={userToggle["user-toggle"]}>
                        <Avatar roundedCircle className={userToggle["user-toggle__image"]} src={props.user.avatar}/>
                        <div className={userToggle["user-toggle__textbox"]}>
                            <span className={userToggle["user-toggle__username"]}>{props.user.username}</span>
                            <span className="muted">{`@${props.user.username}`}</span>
                        </div>
                    </div>
                </Dropdown.Item>
                <Dropdown.Item onClick={logOut} className={userToggle["user-toggle__item"]}>{`Log out @${props.user.username}`}</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

const mapStateToProps = (state) => {
    return {user: state.user};
}

export default connect(mapStateToProps, {logOutUser})(UserToggle);