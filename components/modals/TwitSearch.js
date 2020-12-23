import React, {useState, useEffect, useRef} from "react";
import {useFormik} from "formik";
import Link from "next/link";

import AutoCompleteInput from "./AutoCompleteInput";
import TwitItem from "../TwitItem";
import backend from "../../lib/backend";

function TwitSearch(props) {

    const [options, setOptions] = useState([]);
    const [show, setShow] = useState(false);
    const ref = useRef();

    const formik = useFormik({
        initialValues: {search: ""}
    });

    useEffect(() => {
        document.body.addEventListener("click", clickOutsideInput);
        return () => {
            document.body.removeEventListener("click", clickOutsideInput);
          }
    }, [])

    const clickOutsideInput = (event) => {
        if(ref.current.contains(event.target)){
            return;
        }
        setShow(false);
    }

    const onChange = (event) => {
        formik.handleChange(event);
        
        const search = async () => {
            const {data} = await backend.get("api/search", {
                params: {searchTerm: event.target.value}
            });

        setOptions(data);
        event.target.value ? setShow(true) : setShow(false);
        }
        search();
        console.log(event.target.value)
    }

    const renderTeamOptions = () => {
        if(!options.teams || options.teams.length === 0){
            return null;
        }
        return options.teams.map((option, index) => {
            return (
                    <Link passHref href={"/teams/" + option.abbrev.substring(1)} key={index}>
                        <TwitItem title={option.team_name} subtitle={option.abbrev.substring(1)} image={option.avatar}/>
                    </Link>
                    );
        });
    }

    const renderPeopleOptions = () => {
        if(!options.users || options.users.length === 0){
            return null;
        }
        return options.users.map((option, index) => {
            return (
                    <Link passHref href={"/users/"+option.username} key={index}>
                        <TwitItem title={option.name} subtitle={option.username} image={option.avatar}/>
                    </Link>
                    );
        });
    }

        return (
            <div ref={ref} style={{width:"100%", position:"relative"}}>
                <AutoCompleteInput
                    onChange={onChange}
                    value={formik.values.search}
                    name="search" 
                    type="text" 
                    placeholder={props.placeHolder}  
                    autoComplete="off"
                    show={show}
                    teamOptions={renderTeamOptions()}
                    teamHeader="Team"
                    peopleOptions={renderPeopleOptions()}
                    peopleHeader="People"
                /> 
            </div>
          
            
        );
    }

export default TwitSearch;