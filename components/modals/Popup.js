import React from "react";

import popup from "../../sass/components/Popup.module.scss";

function Popup(props){

    const show = () => {
        if(props.show){
            return popup["popup__show"];
        }
        else{
            return null;
        }
    }

    return(
        <div className={`${popup["popup"]} ${show()}`}>
            <div className={popup["popup__window"]}>
                <div className={popup["popup__window__heading"]}>
                    <svg onClick={props.onHide} className={popup["popup__window__icon"]}>
                        <use xlinkHref="/sprites.svg#icon-home"/>
                    </svg>
                    {props.heading}
                </div>
                <div className={popup["popup__window__body"]}>
                    {props.body}
                </div>
            </div>
        </div>
    )
}

export default Popup;