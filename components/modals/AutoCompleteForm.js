import React, {useState, useEffect, useRef} from "react";
import Form from 'react-bootstrap/Form';
import {useFormik} from "formik";
import Link from "next/link";
import {connect} from "react-redux";

import AutoCompleteInput from "./AutoCompleteInput";
import TwitItem from "../TwitItem";
import {fetchTeamAndTeamPosts} from "../../actions";
import backend from "../../lib/backend";

function AutoCompleteForm(props) {

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
        console.log("click")
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
    }

    const renderTeamOptions = () => {
        if(!options.teams || options.teams.length === 0){
            return null;
        }
        return options.teams.map(option => {
            return (
                    <Link passHref href={"/team/" + option.teamAbbrev.substring(1)} key={option._id}>
                        <TwitItem title={option.teamAbbrev.substring(1)} subtitle={option.teamName} image={option.image}/>
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
                        <TwitItem title={option.username} subtitle={option.username} image={option.image}/>
                    </Link>
                    );
        });
    }

console.log(options);
        return (
            <div ref={ref}>
                <Form inline={props.inline} onSubmit={formik.handleSubmit}>
                    <AutoCompleteInput
                        onChange={onChange}
                        value={formik.values.search}
                        name="search" 
                        type="text" 
                        placeholder={props.placeHolder} 
                        className="mr-sm-2" 
                        autoComplete="off"
                        show={show}
                        teamOptions={renderTeamOptions()}
                        teamHeader="Team"
                        peopleOptions={renderPeopleOptions()}
                        peopleHeader="People"
                    /> 
                    {props.children}
                </Form>
            </div>
          
            
        );
    }

export default connect(null,{fetchTeamAndTeamPosts})(AutoCompleteForm);