import React, {useState, useEffect, useRef} from "react"

import twitDropdownButton from "../sass/components/TwitDropdownButton.module.scss";
import TwitButton from "./TwitButton";
import TwitDropdown from "./TwitDropdown";

function TwitDropdownButton(props){
    const ref = useRef();

    const [show, setShow] = useState(false);

    useEffect(() => {
        document.body.addEventListener("click", clickOutsideDropdownButton);
        return () => {
            document.body.removeEventListener("click", clickOutsideDropdownButton);
          }
    }, [])

    const clickOutsideDropdownButton = (event) => {
        if(!ref.current){
            return;
        }
        if(ref.current.contains(event.target)){
            return;
        }
        setShow(false);
    }

    return (
        <div className={twitDropdownButton["twit-dropdown-button"]} ref={ref}>
            <TwitButton onClick={() => setShow(!show)} color="twit-button--primary">{props.actionText}</TwitButton>
            <div className={twitDropdownButton["twit-dropdown-button__dropdown"]}>
                <TwitDropdown show={show}>
                {props.children}
                </TwitDropdown>
            </div>
        </div>
    )
}

export default TwitDropdownButton;