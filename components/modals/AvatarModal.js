import React from "react";
import {connect} from "react-redux";
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import {useFormik} from "formik";

import TwitFormModal from "./TwitFormModal";
import {toggleAvatarModal, saveTeamImages} from "../../actions";
import styles from "../../styles/AvatarModal.module.css"

function AvatarModal(props) {
    
    const formik = useFormik({
        initialValues: {
            teamImageUrl: "",
            bannerImageUrl: ""
        },
        onSubmit: () => {
            props.saveTeamImage(formik.values.teamImageUrl, formik.values.bannerImageUrl);
            console.log("saved image");
        }

    });

    const renderForm = () => {
        return (
            <React.Fragment>
                <Image rounded className={styles["avatar-image"]} src={formik.values.teamImageUrl}/>
                <Form.Group>
                    <Form.Label>
                        Team Image url
                    </Form.Label>
                    <Form.Control name="teamImageUrl" onChange={formik.handleChange} value={formik.values.teamImageUrl} type="url" placeholder="Enter url" />
                </Form.Group>
                <Form.Group>
                    <Form.File id="exampleFormControlFile1" label="Example file input" />
                </Form.Group>
                <Image rounded className={styles["avatar-image"]} src={formik.values.bannerImageUrl}/>
                <Form.Group>
                    <Form.Label>
                        Banner Image url
                    </Form.Label>
                    <Form.Control name="bannerImageUrl" onChange={formik.handleChange} value={formik.values.bannerImageUrl} type="url" placeholder="Enter url" />
                </Form.Group>
                <Form.Group>
                    <Form.File id="exampleFormControlFile1" label="Example file input" />
                </Form.Group>
            </React.Fragment>
            
        );
    }


    const renderActions = () => {
        return(
            <React.Fragment>
                <Button variant="secondary" onClick={props.toggleAvatarModal}>
                    Close
                </Button>
                <Button variant="primary" type="submit">
                    Save
                </Button>
          </React.Fragment>
        );
    }

    return (
        <TwitFormModal
            show={props.showAvatarModal}
            onHide={props.toggleAvatarModal}
            title="Choose Image"
            form={renderForm()}
            actions={renderActions()}
            onSubmit={formik.handleSubmit}
        />
    );
}

const mapStateToProps = (state) => {
    return {showAvatarModal: state.modals.showAvatarModal}
}

export default connect(mapStateToProps, {toggleAvatarModal, saveTeamImage: saveTeamImages})(AvatarModal);