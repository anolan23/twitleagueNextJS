import React from "react";
import {connect} from "react-redux";
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import {useFormik} from "formik";

import TwitFormModal from "./TwitFormModal";
import {toggleAvatarModal, saveTeamImage} from "../../actions";
import styles from "../../styles/AvatarModal.module.css"

function AvatarModal(props) {
    
    const formik = useFormik({
        initialValues: {
            imageUrl: ""
        },
        onSubmit: () => {
            console.log("saved image");
        }

    });

    const renderForm = () => {
        return (
            <React.Fragment>
                <Image rounded className={styles["avatar-image"]} src={formik.values.imageUrl}/>
                <Form.Group controlId="date">
                    <Form.Label>
                        Image url
                    </Form.Label>
                    <Form.Control name="imageUrl" onChange={formik.handleChange} value={formik.values.imageUrl} type="url" placeholder="Enter url" />
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
                <Button onClick={() => props.saveTeamImage(formik.values.imageUrl)} variant="primary" type="submit">
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

export default connect(mapStateToProps, {toggleAvatarModal, saveTeamImage})(AvatarModal);