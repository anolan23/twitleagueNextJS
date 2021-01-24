import React, {useState, useEffect} from "react"
import Spinner from "react-bootstrap/Spinner";
import {connect} from "react-redux"

import TwitCard from "../components/TwitCard";
import TwitCardItem from "../components/TwitCardItem";
import backend from "../lib/backend";
import {followTeam} from "../actions";

function SuggestedTeams(props){

    const [suggestedTeams, setSuggestedTeams] = useState([]); 

    useEffect(() => {
        fetchSuggestedTeams(props.userId, 3);
    }, [])

    const fetchSuggestedTeams = async (userId, num) => {
        const response = await backend.get("/api/teams/suggested", {
            params: {
                userId,
                num
            }
        });
        setSuggestedTeams(response.data);
    }

    const onFollowClick = (userId, teamId) => {
        const teams = suggestedTeams.map(suggestedTeam => {
            if(suggestedTeam.id === teamId){
                suggestedTeam.following = !suggestedTeam.following;
            }
            return suggestedTeam;
        });
        setSuggestedTeams(teams);
        if(userId && teamId){
            backend.patch("/api/follow/team", {userId,teamId});
        }
    }

    const renderSuggestedTeams = () => {
        if(suggestedTeams.length > 0){
            return suggestedTeams.map((suggestedTeam, index) => {
                console.log(suggestedTeam.following)
                return (
                    <TwitCardItem 
                        key={index}
                        avatar={suggestedTeam.avatar}
                        href={`/teams/${suggestedTeam.abbrev.substring(1)}`}
                        mainText={suggestedTeam.team_name} 
                        subText={suggestedTeam.league_name}
                        actionText={suggestedTeam.following?"Unfollow":"Follow"}
                        onActionClick={() => onFollowClick(props.userId, suggestedTeam.id)}
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

const mapStateToProps = (state) => {
    return {userId: state.user.id}
}

export default connect(mapStateToProps, {followTeam})(SuggestedTeams);