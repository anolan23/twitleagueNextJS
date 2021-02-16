import React, {useEffect} from "react";
import {connect} from "react-redux";
import {useFormik} from "formik";

import Popup from "./Popup";
import Avatar from "../Avatar";
import TwitButton from "../TwitButton";
import {toggleEditTeamPopup, updateTeamProfile} from "../../actions";
import twitForm from "../../sass/components/TwitForm.module.scss";
import editProfilePopup from "../../sass/components/EditProfilePopup.module.scss";
import TwitIcon from "../TwitIcon";
import TwitInputGroup from "../TwitInputGroup";
import TwitInput from "../TwitInput";

function EditTeamPopup(props) {

    useEffect(() => {
        formik.setFieldValue("avatar", props.avatar);
        formik.setFieldValue("banner", props.banner);
        formik.setFieldValue("bio", props.bio);

    }, [props.teamId])
    
    const formik = useFormik({
        initialValues: {
            avatar: props.avatar,
            banner: props.banner,
            bio: props.bio
        },
        onSubmit: (values) => {
            props.updateTeamProfile(values);
        }

    });

    const renderHeading = () => {
        return (
            <div className={editProfilePopup["edit-profile-popup__heading"]}>
                <TwitButton form="edit-team-form" color="twit-button--primary">Save</TwitButton>
            </div>
        )
    }

    const renderForm = () => {
        return (
            <div className={editProfilePopup["edit-profile-popup"]}>
                <div className={editProfilePopup["edit-profile-popup__banner"]}>
                    <img className={editProfilePopup["edit-profile-popup__banner__image"]} src={formik.values.banner}></img>
                    <TwitIcon className={editProfilePopup["edit-profile-popup__banner__icon"]} icon="/sprites.svg#icon-plus-circle"/>
                </div>
                <div className={editProfilePopup["edit-profile-popup__team-avatar"]}>
                    <Avatar className={editProfilePopup["edit-profile-popup__team-avatar__avatar"]} src={formik.values.avatar} alt="edit team profile image"/>
                </div>
                <form id="edit-team-form" onSubmit={formik.handleSubmit} className={twitForm["twit-form"]}>
                    <div className={twitForm["twit-form__group"]}>
                        <label htmlFor="avatar" className={twitForm["twit-form__label"]}>Avatar URL</label>
                        <input 
                            id="avatar" 
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                            value={formik.values.avatar} 
                            name="avatar" 
                            type="text" 
                            autoComplete="off" 
                            className={formik.errors.avatar && formik.touched.avatar ? twitForm["twit-form__input--errors"] : twitForm["twit-form__input"]}
                        />
                        {formik.errors.avatar && formik.touched.avatar ? <div className={twitForm["twit-form__errors"]}>{formik.errors.avatar}</div> : null}
                    </div>
                    <TwitInputGroup id="banner" labelText="Banner URL">
                        <TwitInput
                            id="banner"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.banner}
                            name="banner"
                        />
                    </TwitInputGroup>
                    <div className={twitForm["twit-form__group"]}>
                        <label htmlFor="bio" className={twitForm["twit-form__label"]}>Bio</label>
                        <input 
                            id="bio" 
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                            value={formik.values.bio} 
                            name="bio" 
                            type="text" 
                            autoComplete="off" 
                            className={formik.errors.bio && formik.touched.bio ? twitForm["twit-form__input--errors"] : twitForm["twit-form__input"]}
                        />
                        {formik.errors.bio && formik.touched.bio ? <div className={twitForm["twit-form__errors"]}>{formik.errors.bio}</div> : null}
                    </div>
                </form> 
            </div>
            
        );
    }

    return (
        <Popup
            show={props.showEditTeamPopup}
            onHide={props.toggleEditTeamPopup}
            heading={renderHeading()}
            body={renderForm()}
        />
    );
}

const mapStateToProps = (state) => {
    return {
            showEditTeamPopup: state.modals.showEditTeamPopup,
            avatar: state.team.avatar,
            banner: state.team.banner,
            bio: state.team.bio,
            teamId: state.team.id
        }
}

export default connect(mapStateToProps, {toggleEditTeamPopup, updateTeamProfile})(EditTeamPopup);