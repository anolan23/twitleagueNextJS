import React, {useState, useEffect} from "react"

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
        return suggestedTeams.map(suggestedTeam => {
            return (
                <TwitCardItem 
                    avatar={suggestedTeam.avatar}
                    href={`/teams/${suggestedTeam.abbrev.substring(1)}`}
                    mainText={suggestedTeam.team_name} 
                    subText={suggestedTeam.league_name}
                    actionText="Follow"
                    />
            )
        })
    }

    return (
            <TwitCard title="Teams to follow" footer="Show more">
                {renderSuggestedTeams()}
            </TwitCard>
    )
}
export default SuggestedTeams;