import React from "react"

import divide from "../sass/components/Divide.module.scss";

function Divide(props) {
    return (
        <div className={props.first ? `${divide["divide"]} ${divide["divide__first"]}` : divide["divide"]}>

        </div>
    )
}

export default Divide;