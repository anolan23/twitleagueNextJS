import React from "react";
import {connect} from "react-redux";

import "../styles/TwitCard.css";
import Avatar from "./Avatar";
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"

function TwitPlayerCard(props){

    const renderText = () => {
        return <Button className="twit-small-button" variant="primary" size="sm">Scout</Button>;
    }

    return (
        <div className="twit-card">
            <div className="twit-card-body player-card">
                <Card.Title className="twit-title">Quarterback</Card.Title>
                <div className="player">
                    <Avatar roundedCircle className="player-image"/>
                    <span className="twit-link" style={{marginRight:"0"}}>@anol1258</span>
                </div>
                <div className="scout">
                {renderText()}
                </div>
            </div>  
        </div>
    );
}

export default connect(null)(TwitPlayerCard);