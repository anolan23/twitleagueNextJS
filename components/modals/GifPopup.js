import React from "react";
import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import {useFormik} from "formik";
import {connect} from "react-redux";

import {toggleGifPopup, setMedia} from "../../actions";
import twitForm from "../../sass/components/TwitForm.module.scss";
import gifPopup from "../../sass/components/GifPopup.module.scss";
import Popup from "./Popup";

function GifPopup(props){
        
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
        props.toggleGifPopup();
        const gifClickEvent = new CustomEvent('gif-click', {
            detail: {gif: gif}
          });
        document.dispatchEvent(gifClickEvent)
      }

    const renderHeading = () => {
        return (
            <div className={gifPopup["gif-popup__search"]}>
                <input 
                    id="search" 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} 
                    value={formik.values.search} 
                    name="search" 
                    type="text" 
                    autoComplete="off" 
                    className={twitForm["twit-form__input"]}
                />
            </div>
            
        )
    }

    const renderGifs = () => {
        return (
            <div className={gifPopup["gif-popup"]}>
                <Grid width="450" columns={2} fetchGifs={fetchGifs} key={formik.values.search} onGifClick={onGifClick} />
            </div>
        );
    }
  
    return(
        <Popup 
            show={props.showGifPopup}
            heading={renderHeading()} 
            body={renderGifs()} 
            onHide={props.toggleGifPopup}/>
        
    );
}

const mapStateToProps = (state) => {
    return {showGifPopup: state.modals.showGifPopup}
}

export default connect(mapStateToProps,{toggleGifPopup, saveCurrentPostGif: setMedia})(GifPopup);

