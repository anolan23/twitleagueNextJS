import React from "react";

import TwitEventCard from "./TwitEventCard";

function TwitEventDeck(){

    const today = new Date()
    const newDate = new Date()
    const day= new Array(7);
    day[1]="Mon";
    day[2]="Tue";
    day[3]="Wed";
    day[4]="Thu";
    day[5]="Fri";
    day[6]="Sat";
    day[0]="Sun";

    const increaseDate = numDays => {
        newDate.setDate(today.getDate() + numDays)
        let dayOfWeek = day[newDate.getDay()];
        if(numDays === 0)
            dayOfWeek = "Today";
        return {
            month: newDate.getMonth(),
            date: newDate.getDate(),
            day: dayOfWeek,
            ISOdate: newDate.toISOString().slice(0,10)
        }
        
    }

    return (
        <div className="twit-card-deck">
            <TwitEventCard 
                date={increaseDate(0)}
                
            />
            <TwitEventCard 
                date={increaseDate(1)}
                
            />
            <TwitEventCard 
                date={increaseDate(2)}
                
            />
            <TwitEventCard 
                date={increaseDate(3)}
                
            />
            <TwitEventCard 
                date={increaseDate(4)}
                
            />
            <TwitEventCard 
                date={increaseDate(5)}
                
            />
            <TwitEventCard 
                date={increaseDate(6)}
                
            />
        </div>
    );
}
export default TwitEventDeck;