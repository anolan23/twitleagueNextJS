import React from "react";
import TwitFormModal from "./TwitFormModal";
import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import Form from 'react-bootstrap/Form';
import {useFormik} from "formik";
import {connect} from "react-redux";

import {toggleGifModal, saveCurrentPostGif} from "../../actions";

function GifModal(props){
        
    const formik = useFormik({
        initialValues: {
            search: "sports"
        },
    })
    
    // use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
    const gf = new GiphyFetch("G2kN8IH9rTIuaG2IZGKO9il0kWamzKmX")
    // configure your fetch: fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
    // const fetchGifs = (offset) => gf.trending({ offset, limit: 10 })
    // Render the React Component and pass it your fetchGifs as a prop
    const fetchGifs = (offset) => {
        return gf.search(formik.values.search, { offset, limit: 10 });
    }

    const onGifClick = (gif, event) => {
        event.preventDefault();
        props.saveCurrentPostGif(gif);
        props.toggleGifModal();
      }

    const renderSearch = () => {
        return (
            <Form.Control onChange={formik.handleChange} value={formik.values.search} name="search" type="text" placeholder="Search" />
        );
        
    }

    const renderGifs = () => {
        return (
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", overflowY: "scroll",overflowX: "hidden", height: "400px"}}>
                <Grid width="450" columns={3} fetchGifs={fetchGifs} key={formik.values.search} onGifClick={onGifClick} />
            </div>
        );
    }
  
    return(
        <TwitFormModal show={props.showGifModal} form={renderGifs()} title={renderSearch()} onHide={props.toggleGifModal}/>
        
    );
}

const mapStateToProps = (state) => {
    return {showGifModal: state.modals.showGifModal}
}

export default connect(mapStateToProps,{toggleGifModal, saveCurrentPostGif})(GifModal);

