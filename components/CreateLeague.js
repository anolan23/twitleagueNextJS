import React , {useState} from "react";
import {connect} from "react-redux";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useRouter} from "next/router";

import twitForm from "../sass/components/TwitForm.module.scss";
import TopBar from "./TopBar";
import TwitButton from "./TwitButton";
import TwitInputGroup from "./TwitInputGroup";
import {createLeague} from "../actions";
import backend from "../lib/backend";
import TwitInput from "./TwitInput";

function CreateLeague(props){
    const router = useRouter();

    const validationSchema = Yup.object({
        sport: Yup.string().required("Required")
    });
 
    const validate = async values => {
        let errors ={};
        if(!values.leagueName){
            return errors.leagueName = "Required";
        }
        return backend.get(`/api/leagues/${values.leagueName}`).then((results) => {
            if (Object.keys(results.data).length > 0) {
                errors.leagueName = "League already exists";
            }
            return errors;
        });
        
    };

    const formik = useFormik({
        initialValues: {
            leagueName: "",
            sport: ""
          },
        onSubmit: values => { 
            props.createLeague(values);
            router.push(`/leagues/${values.leagueName}`)
        },
        validate,
        validationSchema
    });  

    return (
        <div className="create-team">
            <TopBar main="Create league"/>
            <form onSubmit={formik.handleSubmit} className={twitForm["twit-form"]}>
              <div className={twitForm["twit-form__group"]}>
                  <label for="leagueName" className={twitForm["twit-form__label"]}>League Name</label>
                  <input 
                      id="leagueName" 
                      onChange={formik.handleChange} 
                      onBlur={formik.handleBlur} 
                      value={formik.values.leagueName} 
                      name="leagueName" 
                      type="text" 
                      autoComplete="off" 
                      className={formik.errors.leagueName && formik.touched.leagueName ? twitForm["twit-form__input--errors"] : twitForm["twit-form__input"]}
                  />
                  {formik.errors.leagueName && formik.touched.leagueName ? <div className={twitForm["twit-form__errors"]}>{formik.errors.leagueName}</div> : null}
              </div>
              <div className={twitForm["twit-form__group"]}>
                  <label for="sport" className={twitForm["twit-form__label"]}>Sport</label>
                  <select 
                      id="sport" 
                      onChange={formik.handleChange} 
                      onBlur={formik.handleBlur} 
                      value={formik.values.sport} 
                      name="sport" 
                      type="text" 
                      
                      autoComplete="off"  
                      className={formik.errors.sport && formik.touched.sport ? twitForm["twit-form__input--errors"] : twitForm["twit-form__input"]}
                  >
                      <option value={null}>Choose</option>  
                      <option value="baseball">Baseball</option>
                      <option value="basketball">Basketball</option>
                      <option value="cricket">Cricket</option>
                      <option value="football">Football</option>
                      <option value="hockey">Hockey</option>
                      <option value="soccer">Soccer</option>
                      <option value="other">Other</option>
                  </select>
                  {formik.errors.sport && formik.touched.sport ? <div className={twitForm["twit-form__errors"]}>{formik.errors.sport}</div> : null}
              </div>
              <TwitButton square>Create league</TwitButton>
            </form>
        </div>
    )
}

export default connect(null, {createLeague})(CreateLeague);