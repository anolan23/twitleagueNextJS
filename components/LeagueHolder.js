import React from 'react';
import Button from 'react-bootstrap/Button';
import Link from "next/link";
import reactStringReplace from "react-string-replace";

function LeagueHolder(props) {

  const renderOwner = () => {
    const owner = props.league.owner;
    const text = "@" + owner;
    const replacedText = reactStringReplace(text, /@(\w+)/g, (match, i) => (
      <Link passHref key={match + i} href={"/users/" + owner}><a>@{match}</a></Link>
    ));

    return <h3>owner: {replacedText}</h3>
  }



  return (
    <div className="twit-flex-column" style={{flexDirection:"row" , justifyContent:"space-between"}}>
       <div className="twit-flex-column">
        <h3>{props.league.sport}</h3>
        <h1>{props.league.leagueName}</h1>
        <h3>{props.league.numTeams + " teams"}</h3>
        {renderOwner()}
       </div>
       <div className="twit-flex-column">
         <span>43,543 fans</span>
         <Button>Follow</Button>
       </div>
  
    </div>
  );
}

export default LeagueHolder;
