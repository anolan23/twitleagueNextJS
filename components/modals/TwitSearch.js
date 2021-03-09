import React, {useState, useEffect, useRef} from "react";
import {useFormik} from "formik";
import Link from "next/link";
import {useRouter} from "next/router";

import AutoCompleteInput from "./AutoCompleteInput";
import TwitItem from "../TwitItem";
import backend from "../../lib/backend";

function TwitSearch(props) {

    const [options, setOptions] = useState([]);
    const [show, setShow] = useState(false);
    const ref = useRef();
    const router = useRouter();

    const formik = useFormik({
        initialValues: {query: ""},
        onSubmit: values => {
            console.log(values);
            router.push({
                pathname: '/search',
                query: {query: values.query}
            });
            setShow(false);
        }
        
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
        const searchTerm = event.target.value;
        formik.handleChange(event);
        if(searchTerm){
            search(searchTerm);
        }
        else{
            setShow(false);
        }
    }

    const search = async (term) => {
        const {data} = await backend.get("api/search", {
            params: {searchTerm: term}
        });

        setOptions(data);
        setShow(true);
    }

    const renderTeams = () => {
        if(!options.teams || options.teams.length === 0){
            return null;
        }
        return options.teams.map((option, index) => {
            return (
                        <TwitItem 
                            href={`/teams/${option.abbrev.substring(1)}`}
                            avatar={option.avatar}
                            title={option.team_name} 
                            subtitle={option.abbrev.substring(1)}
                            key={index} 
                        />
                    );
        });
    }

    const renderUsers = () => {
        if(!options.users || options.users.length === 0){
            return null;
        }
        return options.users.map((option, index) => {
            return (
                        <TwitItem 
                            href={`/users/${option.username}`}
                            avatar={option.avatar}
                            title={option.name} 
                            subtitle={option.username} 
                            key={index}
                        />
                    );
        });
    }

        return (
            <form ref={ref} onSubmit={formik.handleSubmit} style={{width:"100%", position:"relative"}}>
                <AutoCompleteInput
                    onChange={onChange}
                    value={formik.values.query}
                    name="query" 
                    type="text" 
                    placeholder={props.placeHolder}  
                    autoComplete="off"
                    show={show}
                    teamOptions={renderTeams()}
                    teamHeader="Team"
                    peopleOptions={renderUsers()}
                    peopleHeader="People"
                /> 
            </form>
          
            
        );
    }

export default TwitSearch;