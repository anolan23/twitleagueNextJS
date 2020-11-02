import React, {useState} from "react";
import Form from 'react-bootstrap/Form';
import {useFormik} from "formik";
import Link from "next/link";
import {connect} from "react-redux";

import AutoCompleteInput from "./AutoCompleteInput";
import TwitItem from "../TwitItem";
import {fetchTeamAndTeamPosts} from "../../actions";

function AutoCompleteForm(props) {

    const [options, setOptions] = useState([]);
    const [show, setShow] = useState(false);


    const formik = useFormik({
        initialValues: {search: ""}
    });

    // const onChange = (event) => {
    //     formik.handleChange(event);
        
    //     const search = async () => {
    //         const {data} = await backend.get("/search", {
    //             params: {searchTerm: event.target.value}
    //         });

    //     setOptions(data);
    //     event.target.value ? setShow(true) : setShow(false);
    //     }
    //     search();
    // }

    const onClick = (team) => {
        props.fetchTeamAndTeamPosts(team._id);
        formik.setFieldValue("search", team.teamAbbrev)
        setShow(false);
    }

    const renderTeamOptions = () => {
        if(!options.teams || options.teams.length === 0){
            return null;
        }
        return options.teams.map(option => {
            return (
                    // <Dropdown.Item onClick={() => formik.setFieldValue("search", option.teamAbbrev)} key={option._id}>{option.teamAbbrev}</Dropdown.Item>
                    <Link to={{pathname:"/team/"+option._id}} onClick={() => onClick(option)} key={option._id}>
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
                    // <Dropdown.Item onClick={() => formik.setFieldValue("search", option.teamAbbrev)} key={option._id}>{option.teamAbbrev}</Dropdown.Item>
                    <Link to={"/users/"+option.username} key={index}>
                        <TwitItem title={option.username} subtitle={option.username} image={option.image}/>
                    </Link>
                    );
        });
    }

console.log(options);
        return (
            <Form inline={props.inline} onSubmit={formik.handleSubmit}>
                    <AutoCompleteInput
                        // onChange={onChange}
                        onBlur={() => setShow(false)}
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
            
        );
    }

export default connect(null,{fetchTeamAndTeamPosts})(AutoCompleteForm);