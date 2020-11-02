import React from "react";
import Image from 'react-bootstrap/Image';

import styles from "../styles/GifThumb.module.css"

function GifThumb(props) {

    return (
        <Image className={styles["gif-thumb"]} src={props.src} alt="gif"/>
    );
}

export default GifThumb;