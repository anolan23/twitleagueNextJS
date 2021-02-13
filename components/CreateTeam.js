import React , {useState} from "react";
import {useRouter} from "next/router";
import {connect} from "react-redux";
import {useFormik} from "formik";
import * as Yup from "yup";

import twitForm from "../sass/components/TwitForm.module.scss";
import TopBar from "./TopBar";
import TwitButton from "./TwitButton";
import AutoCompleteInput from "../components/modals/AutoCompleteInput";
import TwitDropdownItem from "../components/TwitDropdownItem";
import {createTeam} from "../actions";
import backend from "../lib/backend";

function CreateTeam(props){

    const [options, setOptions] = useState([]);
    const [show, setShow] = useState(false);
    const router = useRouter();


    const validationSchema = Yup.object({
        teamName: Yup.string().required("Required").min(3).max(30),
        teamAbbrev: Yup.string().required("Required").max(6),
        city: Yup.string().required("Required"),
        state: Yup.string().required("Required"),
        league: Yup.string().required("Required")
    });

    // const validate = async values => {
    //     let errors ={};
    //     const results = await backend.get(`/api/league/${values.league}`);
    //     console.log(results.data)
    //     console.log("Object.keys(results.data).length", Object.keys(results.data).length)
    //     if(Object.keys(results.data).length === 0){
    //         errors.league = "You must join an active league";
    //     }
    //     console.log("errors", errors)
    //     return errors;       
    // }
 
    const validate = async values => {
        let errors ={};
        return backend.get(`/api/leagues/${values.league}`).then((results) => {
            console.log("results.data", results.data);
            console.log("Object.keys(results.data).length", Object.keys(results.data).length);
            if (Object.keys(results.data).length === 0) {
                errors.league = "You must join an active league";
            }
            console.log("errors", errors);
            return errors;
        });
    };

    const formik = useFormik({
        initialValues: {
          teamName:"",
          teamAbbrev:"",
          league:"",
          city:"",
          state:""
          },
        onSubmit: values => { 
          props.createTeam(values);
          router.push(`/teams/${values.teamAbbrev.substring(1)}`)
        },
        validate,
        validationSchema
    });

    const onAutoCompleteChange = async (event) => {
        formik.handleChange(event);
        const results = await backend.get("/api/leagues", {
            params: {leagueName: event.target.value}
        })
        setOptions(results.data);

        if(results.data.length > 0 && event.target.value){
          setShow(true);
        }

        else{
          setShow(false);
        }
      }

      const onDropdownItemClick = (option) => {
        formik.setFieldValue("league", option.league_name);
        setShow(false);
        
      }
    
      const renderOptions = () => {
          return options.map((option, index) => {
              return (
                <TwitDropdownItem onClick={() => onDropdownItemClick(option)}>{option.league_name}</TwitDropdownItem>
              );
          });
      }  

    console.log("formik.errors", formik.errors)

    return (
        <div className="create-team">
            <TopBar main="Create team"/>
            <form onSubmit={formik.handleSubmit} className={twitForm["twit-form"]}>
              <div className={twitForm["twit-form__group"]}>
                  <label for="team-name" className={twitForm["twit-form__label"]}>Team Name</label>
                  <input 
                      id="team-name" 
                      onChange={formik.handleChange} 
                      onBlur={formik.handleBlur} 
                      value={formik.values.teamName} 
                      name="teamName" 
                      type="text" 
                      autoComplete="off" 
                      className={formik.errors.teamName && formik.touched.teamName ? twitForm["twit-form__input--errors"] : twitForm["twit-form__input"]}
                  />
                  {formik.errors.teamName && formik.touched.teamName ? <div className={twitForm["twit-form__errors"]}>{formik.errors.teamName}</div> : null}
              </div>
              <div className={twitForm["twit-form__group"]}>
                  <label for="team-abbreviation" className={twitForm["twit-form__label"]}>Team Abbreviation</label>
                  <input 
                      id="team-abbreviation" 
                      onChange={formik.handleChange} 
                      onBlur={formik.handleBlur} 
                      value={formik.values.teamAbbrev} 
                      name="teamAbbrev" 
                      type="text" 
                      
                      autoComplete="off"  
                      className={formik.errors.teamAbbrev && formik.touched.teamAbbrev ? twitForm["twit-form__input--errors"] : twitForm["twit-form__input"]}
                  />
                  {formik.errors.teamAbbrev && formik.touched.teamAbbrev ? <div className={twitForm["twit-form__errors"]}>{formik.errors.teamAbbrev}</div> : null}
              </div>
              <div className={twitForm["twit-form__group"]}>
                  <label for="league" className={twitForm["twit-form__label"]}>League</label>
                  <AutoCompleteInput 
                    show={show}
                    name="league"
                    id= "league" 
                    type="text" 
                    placeholder="Search leagues" 
                    autoComplete="off"
                    onChange={onAutoCompleteChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.league}
                    header="Active Leagues"
                    leagueOptions={renderOptions()}
                    className={formik.errors.league && formik.touched.league ? twitForm["twit-form__input--errors"] : twitForm["twit-form__input"]}
                    isValid={formik.touched.league && !formik.errors.league}
                  />
                  {formik.errors.league && formik.touched.league ? <div className={twitForm["twit-form__errors"]}>{formik.errors.league}</div> : null}
              </div>
              <div className={twitForm["twit-form__group"]}>
                  <label for="city" className={twitForm["twit-form__label"]}>City</label>
                  <input 
                      id="city" 
                      onChange={formik.handleChange} 
                      onBlur={formik.handleBlur} 
                      value={formik.values.city} 
                      name="city" 
                      type="text" 
                      autoComplete="off" 
                      className={formik.errors.city && formik.touched.city ? twitForm["twit-form__input--errors"] : twitForm["twit-form__input"]}
                  />
                  {formik.errors.city && formik.touched.city ? <div className={twitForm["twit-form__errors"]}>{formik.errors.city}</div> : null}
              </div>
              <div className={twitForm["twit-form__group"]}>
                  <label for="state" className={twitForm["twit-form__label"]}>State</label>
                  <input 
                      id="state" 
                      onChange={formik.handleChange} 
                      onBlur={formik.handleBlur} 
                      value={formik.values.state} 
                      name="state" 
                      type="text" 
                      autoComplete="off" 
                      className={formik.errors.state && formik.touched.state ? twitForm["twit-form__input--errors"] : twitForm["twit-form__input"]}
                  />
                  {formik.errors.state && formik.touched.state ? <div className={twitForm["twit-form__errors"]}>{formik.errors.state}</div> : null}
              </div>
              <TwitButton square>Create team</TwitButton>
            </form>
        </div>
    )
}

export default connect(null, {createTeam})(CreateTeam);