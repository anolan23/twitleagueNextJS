import React, {useState} from "react";
import {useFormik} from "formik";
import {connect} from "react-redux";

import {toggleEditRosterPopup, sendJoinTeamRequest} from "../../actions";
import backend from "../../lib/backend";
import editRoster from "../../sass/components/EditRoster.module.scss";
import Popup from "./Popup";
import TwitTabs from "../TwitTabs";
import TwitTab from "../TwitTab";
import TwitItem from "../TwitItem";
import Input from "../Input";
import EmptyPosts from "../EmptyPosts";

function EditRoster(props){

    const [activeLink, setActiveLink] = useState("roster")
    const [users, setUsers] = useState(null)

    const onRosterSelect = (k) => {
        setActiveLink(k.target.id);
    }

    const onInviteSelect = (k) => {
        setActiveLink(k.target.id);
    }
        
    const formik = useFormik({
        initialValues: {
            search: ""
        },
    });

    const onChange = (event) => {
        formik.handleChange(event);
        
        const search = async () => {
            const response = await backend.get("api/search", {
                params: {
                    searchTerm: event.target.value,
                    category: "users"
                }
            });

        setUsers(response.data);
        }
        search();
    }

    const renderHeading = () => {
        return (
            <div className={editRoster["edit-roster__heading"]}>
                {null}
            </div>
            
        )
    }

    const renderBody = () => {
        return (
            <React.Fragment>
                <div className={editRoster["edit-roster__tabs"]}>
                    <TwitTabs>
                        <TwitTab
                            id="roster"
                            onClick={onRosterSelect}
                            title="Roster(5)"
                            active={activeLink === "roster" ? true : false}
                        />
                        <TwitTab
                            id="invite"
                            onClick={onInviteSelect}
                            title="Invite"
                            active={activeLink === "invite" ? true : false}
                        />
                    </TwitTabs>
                </div>
                <div className={editRoster["edit-roster__content"]}>
                    {renderContent()}
                </div>
            </React.Fragment>
        );
    }

    const renderContent = () => {
        if(activeLink === "roster"){
            return (
                <React.Fragment>
                    <TwitItem
                        title="anolan"
                        subtitle="@anolan"
                        actionText="Scout"
                    />
                    <TwitItem
                        title="anolan23"
                        subtitle="@anolan23"
                        actionText="Scout"
                    />
                    <TwitItem
                        title="cranberri12"
                        subtitle="@cranberri12"
                        actionText="Scout"
                    />
                    <TwitItem
                        title="anol1258"
                        subtitle="@anol1258"
                        actionText="Scout"
                    />
                    <TwitItem
                        title="seansi2k"
                        subtitle="@seansi2k"
                        actionText="Scout"
                    />
                    <TwitItem
                        title="caribear"
                        subtitle="@caribear"
                        actionText="Scout"
                    />
                </React.Fragment>
            );
        }
        else if(activeLink === "invite"){
            return (
                <div className={editRoster["edit-roster__content__invite"]}>
                    <div className={editRoster["edit-roster__content__invite__input-holder"]}>
                        <Input 
                            type="text" 
                            placeHolder="Search players"
                            onChange={onChange}
                            
                        />
                    </div>
                    {renderUsers()}
                </div>
            )
        }
    }

    const renderUsers = () => {
        if(!users){
            return <EmptyPosts main="Search" sub="search above for players" actionText="Search"/>
        }
        else{
            return users.map(user => {
                return (
                    <TwitItem
                        title={user.name}
                        subtitle={user.username}
                        actionText="Invite"
                        onClick={() => props.sendJoinTeamRequest(user.id, props.teamId)}
                    />
                )
            })
        }
        
    }
  
    return(
        <Popup 
            show={props.showEditRosterPopup}
            heading={renderHeading()} 
            body={renderBody()} 
            onHide={props.toggleEditRosterPopup}/>
        
    );
}

const mapStateToProps = (state) => {
    return {
        showEditRosterPopup: state.modals.showEditRosterPopup,
        teamId: state.team.id
    }
}

export default connect(mapStateToProps, {toggleEditRosterPopup, sendJoinTeamRequest})(EditRoster);