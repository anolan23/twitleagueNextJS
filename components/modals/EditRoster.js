import React, {useState, useEffect} from "react";
import {useFormik} from "formik";
import {connect} from "react-redux";

import {toggleEditRosterPopup, sendJoinTeamInvite} from "../../actions";
import backend from "../../lib/backend";
import editRoster from "../../sass/components/EditRoster.module.scss";
import Popup from "./Popup";
import TwitTabs from "../TwitTabs";
import TwitTab from "../TwitTab";
import TwitItem from "../TwitItem";
import Input from "../Input";
import Empty from "../Empty";

function EditRoster(props){

    const [activeLink, setActiveLink] = useState("roster")
    const [roster, setRoster] = useState(null);
    const [users, setUsers] = useState(null);

    useEffect(() => {
        console.log("render")
        const getRoster = async () => {
            const response = await backend.get("api/teams/rosters", {
                params: {
                    teamId: props.teamId
                }
            });
            setRoster(response.data);
        }
        getRoster();
        
    }, [props.teamId])


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
                            title={`Roster(${roster?roster.length:0})`}
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
            if(!roster){
                return null;
            }
            else if(roster.length === 0){
                return (
                    <Empty
                        main="No players"
                        sub="There are no players on this team"
                    />
                )
            }
            else{
                return roster.map(player => {
                    return (
                        <TwitItem
                            avatar={player.avatar}
                            title={player.name}
                            subtitle={`@${player.username}`}
                            actionText="Scout"
                        />
                    )
                });
            }
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
            return <Empty main="Search" sub="search above for players to add to your roster" actionText="Search"/>
        }
        else{
            return users.map(user => {
                return (
                    <TwitItem
                        title={user.name}
                        subtitle={user.username}
                        actionText="Invite"
                        onClick={() => props.sendJoinTeamInvite(user.id, props.teamId)}
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

export default connect(mapStateToProps, {toggleEditRosterPopup, sendJoinTeamInvite})(EditRoster);