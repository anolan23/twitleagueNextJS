import React from "react";
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';

import styles from "../styles/TwitCard.module.css";

function TwitCard(props) {

    return (
        <Card>
            <Tab.Container id="feedHolder" defaultActiveKey="first">
                <Card.Header className={styles.cardHeader}>
                    {props.children}
                </Card.Header>
                <Card.Body>
                    {props.body}
                </Card.Body>
            </Tab.Container>
        </Card>
    );
}

export default TwitCard;
