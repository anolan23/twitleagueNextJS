import React , {useState} from "react";
import Form from "react-bootstrap/Form";
import {useFormik} from "formik";
import * as Yup from "yup";

import twitForm from "../sass/components/TwitForm.module.scss";
import TopBar from "./TopBar";
import AutoCompleteInput from "../components/modals/AutoCompleteInput";
import {createTeamAndFetchUser} from "../actions";

function CreateTeam(){

    const [options, setOptions] = useState([]);
    const [show, setShow] = useState(false);


    const validationSchema = Yup.object({
        teamName: Yup.string().required("Required").min(3).max(30),
        teamAbbrev: Yup.string().required("Required").max(6),
        league: Yup.string().required("Required"),
        sport: Yup.string().required("Reqiured")
    });

    const validate = values => {
        let errors ={};
        // return backend.get("/leaguesearch", {
        //       params: {league: values.league}
        //   }).then((response) => {
        //     setOptions(response.data.leagues);
        //     if(!response.data.activeLeague){
        //       errors.league = "You must join an active league";
        //     }
      
        //     return errors;
        //   });
        
    }

    const formik = useFormik({
        initialValues: {
          teamName:"",
          teamAbbrev:"",
          league:"",
          city:"",
          state:""
          },
        onSubmit: values => { 
          const formData = {
            teamName: values.teamName,
            teamAbbrev: "$"+values.teamAbbrev,
            league: values.league,
            city: values.city,
            state: values.state
          }
          props.createTeamAndFetchUser(formData);
        },
        validationSchema,
        validate
    });

    const onAutoCompleteChange = (event) => {
        formik.handleChange(event);
        if(event.target.value){
          setShow(true);
        }
        else{
          setShow(false);
        }
        
      }
    
      const renderOptions = () => {
          return options.map(option => {
              return (
                      <Dropdown.Item onClick={() => {formik.setFieldValue("league", option.leagueName); setShow(false);}} key={option._id}>{option.leagueName}</Dropdown.Item>
              );
          });
      }  

    return (
        <div className="create-team">
            <TopBar main="Create team"/>
            <form className={twitForm["twit-form"]}>
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
                      onFocus={(e) => e.target.value = "$"}
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
                      name="league" 
                      type="text" 
                      placeholder="Search leagues" 
                      autoComplete="off"
                      onChange={onAutoCompleteChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.league}
                      header="Active Leagues"
                      options={renderOptions()}
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
            </form>
        </div>
    )
}

export default CreateTeam;