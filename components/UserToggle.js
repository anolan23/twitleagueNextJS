import React, {useState, useEffect,useRef} from "react";
import {useRouter} from "next/router";

import Avatar from "./Avatar";
import {connect} from "react-redux";
import {logOutUser} from "../actions";
import userToggle from "../sass/components/UserToggle.module.scss"
import TwitDropdown from "../components/TwitDropdown";
import TwitDropdownItem from "../components/TwitDropdownItem";
import TwitItem from "../components/TwitItem";

function UserToggle(props){
    const router = useRouter();
    const ref = useRef();

    const [show, setShow] = useState(false);
    
    const logOut = async () => {
        await props.logOutUser();
        router.push("/")
    }

    useEffect(() => {
        document.body.addEventListener("click", clickOutsideDropdownButton);
        return () => {
            document.body.removeEventListener("click", clickOutsideDropdownButton);
          }
    }, [])

    const clickOutsideDropdownButton = (event) => {
        if(ref.current.contains(event.target)){
            return;
        }
        setShow(false);
}

    if(!props.user.isSignedIn){
        return null;
    }
    else{
        return(
            <div className={userToggle["user-toggle"]} onClick={() => setShow(true)} ref={ref}>
                <Avatar roundedCircle className={userToggle["user-toggle__image"]} src={props.user.avatar}/>
                <div className={userToggle["user-toggle__textbox"]}>
                    <span className={userToggle["user-toggle__username"]}>{props.user.name}</span>
                    <span className="muted">{`@${props.user.username}`}</span>
                </div>
                <div className={userToggle["user-toggle__dropdown"]}>
                    <TwitDropdown show={show} >
                        <TwitItem  avatar={props.user.avatar} title={props.user.name} subtitle={`@${props.user.username}`}/>
                        <TwitDropdownItem onClick={logOut}>Log out</TwitDropdownItem>
                    </TwitDropdown>
                </div>
            </div>
            
        );
    }
}

const mapStateToProps = (state) => {
    return {user: state.user};
}

export default connect(mapStateToProps, {logOutUser})(UserToggle);