import React , {useState} from "react";
import {useRouter} from "next/router";
import {useFormik} from "formik";
import * as Yup from "yup";

import useUser from "../lib/useUser";
import twitForm from "../sass/components/TwitForm.module.scss";
import TopBar from "./TopBar";
import TwitButton from "./TwitButton";
import AutoCompleteInput from "../components/modals/AutoCompleteInput";
import TwitDropdownItem from "../components/TwitDropdownItem";
import {createTeam} from "../actions";
import backend from "../lib/backend";

function CreateTeam(props){

    const { user } = useUser();
    const [options, setOptions] = useState([]);
    const [show, setShow] = useState(false);
    const router = useRouter();


    const validationSchema = Yup.object({
        teamName: Yup.string().required("Required").min(3).max(30),
        abbrev: Yup.string().required("Required").max(6),
        city: Yup.string().required("Required"),
        state: Yup.string().required("Required"),
        leagueName: Yup.string().required("Required")
    });
 
    const validate = async values => {
        let errors ={};
        return backend.get(`/api/leagues/${values.leagueName}`).then((results) => {
            if (Object.keys(results.data).length === 0) {
                errors.leagueName = "You must join an active league";
            }
            return errors;
        });
    };

    const formik = useFormik({
        initialValues: {
          teamName:"",
          abbrev:"",
          leagueName:"",
          city:"",
          state:""
          },
        onSubmit: values => { 
          onSubmit(values);
        },
        validate,
        validationSchema
    });

    const onSubmit = async (values) => {
        await createTeam(user.id, values);
        router.push(`/teams/${values.abbrev.substring(1)}`)
    }

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
        formik.setFieldValue("leagueName", option.league_name);
        setShow(false);
        
      }
    
      const renderOptions = () => {
          return options.map((option, index) => {
              return (
                <TwitDropdownItem onClick={() => onDropdownItemClick(option)}>{option.league_name}</TwitDropdownItem>
              );
          });
      }  


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
                      value={formik.values.abbrev} 
                      name="abbrev" 
                      type="text" 
                      
                      autoComplete="off"  
                      className={formik.errors.abbrev && formik.touched.abbrev ? twitForm["twit-form__input--errors"] : twitForm["twit-form__input"]}
                  />
                  {formik.errors.abbrev && formik.touched.abbrev ? <div className={twitForm["twit-form__errors"]}>{formik.errors.abbrev}</div> : null}
              </div>
              <div className={twitForm["twit-form__group"]}>
                  <label for="leagueName" className={twitForm["twit-form__label"]}>League</label>
                  <AutoCompleteInput 
                    show={show}
                    name="leagueName"
                    id= "leagueName" 
                    type="text" 
                    placeholder="Search leagues" 
                    autoComplete="off"
                    onChange={onAutoCompleteChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.leagueName}
                    header="Active Leagues"
                    leagueOptions={renderOptions()}
                    className={formik.errors.leagueName && formik.touched.leagueName ? twitForm["twit-form__input--errors"] : twitForm["twit-form__input"]}
                    isValid={formik.touched.leagueName && !formik.errors.leagueName}
                  />
                  {formik.errors.leagueName && formik.touched.leagueName ? <div className={twitForm["twit-form__errors"]}>{formik.errors.leagueName}</div> : null}
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

export default CreateTeam;