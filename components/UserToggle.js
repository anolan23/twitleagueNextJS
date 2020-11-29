import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

import Avatar from "./Avatar";
import styles from "../sass/components/UserToggle.module.scss"

function UserToggle(){

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <div className={styles["user-toggle"]}
            ref={ref}
            onClick={(e) => {
            e.preventDefault();
            onClick(e);
            }}
        >
          {children}
          <i className="fas fa-chevron-down"></i>
        </div>
        
      ));
      
      
    return(
        <Dropdown>
            <Dropdown.Toggle as={CustomToggle}>
                    <Avatar roundedCircle style={{width: "40px"}}/>
                    <div className="flex-column" style={{margin: "0 10px"}}>
                        <span style={{fontWeight:"900"}}>aaron</span>
                        <span className="muted">@anolan23</span>
                    </div>
            </Dropdown.Toggle>

            <Dropdown.Menu>
            <Dropdown.Item eventKey="1">
                <div className={styles["user-toggle"]}>
                    <Avatar roundedCircle style={{width: "40px"}}/>
                    <div className="flex-column" style={{margin: "0 10px"}}>
                        <span style={{fontWeight:"900"}}>aaron</span>
                        <span className="muted">@anolan23</span>
                    </div>
                </div>
            </Dropdown.Item>
            <Dropdown.Item eventKey="2">Log out @anolan23</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default UserToggle;