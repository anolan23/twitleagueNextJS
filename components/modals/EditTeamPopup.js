import React, {useEffect} from "react";
import {connect} from "react-redux";
import {useFormik} from "formik";

import Popup from "./Popup";
import Avatar from "../Avatar";
import TwitButton from "../TwitButton";
import {toggleEditTeamPopup, updateTeamProfile} from "../../actions";
import twitForm from "../../sass/components/TwitForm.module.scss";
import editProfilePopup from "../../sass/components/EditProfilePopup.module.scss";

function EditTeamPopup(props) {

    useEffect(() => {
        formik.setFieldValue("avatar", props.avatar);
    }, [props.avatar])
    
    const formik = useFormik({
        initialValues: {
            avatar: "",
            bio: ""
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
            <form id="edit-team-form" onSubmit={formik.handleSubmit} className={twitForm["twit-form"]}>
                <Avatar rounded className={editProfilePopup["edit-profile-popup__avatar"]} src={formik.values.avatar}/>
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
            avatar: state.team.avatar
        }
}

export default connect(mapStateToProps, {toggleEditTeamPopup, updateTeamProfile})(EditTeamPopup);