import React, {useState, useEffect} from "react"
import Spinner from "react-bootstrap/Spinner";
import {connect} from "react-redux"
import Link from "next/link";

import TwitCard from "../components/TwitCard";
import TwitItem from "../components/TwitItem";
import backend from "../lib/backend";
import {followTeam, unFollowTeam} from "../actions";
import Empty from "./Empty";

function SuggestedTeams(props){

    const [suggestedTeams, setSuggestedTeams] = useState(null); 

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

    const onFollowToggleClick = (team) => {
        team.following = !team.following;
        const teams = suggestedTeams.map(suggestedTeam => {
            if(suggestedTeam.id === team.id){
                return team
            }
            return suggestedTeam
        })
        setSuggestedTeams(teams);

        if(team.following){
            followTeam(props.userId, team.id);
        }
        else if(!team.following){
            unFollowTeam(props.userId, team.id);
        }
    }

    const renderFooter = () => {
        return(
            <Link href="/suggested" passHref>
                <a>Show more</a>
            </Link>
        )
    }

    const renderSuggestedTeams = () => {
        if(!suggestedTeams){
            return <Spinner animation="border" />
        }
        else if(suggestedTeams.length === 0){
            return <Empty main="No suggested teams" sub="Try again once more teams are created"/>
        }
        else{
            return suggestedTeams.map((suggestedTeam, index) => {
                return (
                    <TwitItem 
                        key={index}
                        avatar={suggestedTeam.avatar}
                        title={suggestedTeam.team_name} 
                        subtitle={`${suggestedTeam.abbrev} · ${suggestedTeam.league_name}`}
                        actionText={suggestedTeam.following?"Unfollow":"Follow"}
                        onActionClick={() => onFollowToggleClick(suggestedTeam)}
                        href={`/teams/${suggestedTeam.abbrev.substring(1)}`}
                    />
                )
            });
        }
        
    }

    return (
            <TwitCard title="Teams to follow" footer={renderFooter()}>
                {renderSuggestedTeams()}
            </TwitCard>
    )
}

const mapStateToProps = (state) => {
    return {userId: state.user.id}
}

export default connect(mapStateToProps)(SuggestedTeams);