import React, {useState, useEffect} from "react"
import Spinner from "react-bootstrap/Spinner";

import TwitCard from "../components/TwitCard";
import TwitCardItem from "../components/TwitCardItem";
import backend from "../lib/backend";


function SuggestedTeams(){

    const [suggestedTeams, setSuggestedTeams] = useState([]); 

    useEffect(() => {
        fetchSuggestedTeams(3);
    }, [])

    const fetchSuggestedTeams = async (num) => {
        const response = await backend.get("/api/teams/suggested", {
            params: {
                num
            }
        });
        setSuggestedTeams(response.data);
    }

    const renderSuggestedTeams = () => {
        if(suggestedTeams.length > 0){
            return suggestedTeams.map((suggestedTeam, index) => {
                return (
                    <TwitCardItem 
                        key={index}
                        avatar={suggestedTeam.avatar}
                        href={`/teams/${suggestedTeam.abbrev.substring(1)}`}
                        mainText={suggestedTeam.team_name} 
                        subText={suggestedTeam.league_name}
                        actionText="Follow"
                        />
                )
            });
        }
        else{
            return <Spinner animation="border" />
        }
        
    }

    return (
            <TwitCard title="Teams to follow" footer="Show more">
                {renderSuggestedTeams()}
            </TwitCard>
    )
}
export default SuggestedTeams;