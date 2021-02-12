import React, {useState, useEffect} from "react";
import {connect} from "react-redux";

import suggested from "../sass/components/Suggested.module.scss";
import {followTeam, unFollowTeam} from "../actions";
import TwitItem from "./TwitItem";
import TopBar from "./TopBar";
import TwitTabs from "./TwitTabs";
import TwitTab from "./TwitTab";
import Post from "./Post";
import Empty from "./Empty";
import backend from "../lib/backend";

function Suggested(props) {
    const [tab, setTab] = useState("teams");
    const [suggestions, setSuggestions] = useState(null);

    useEffect(() => {
        getSuggestedTeams();
    }, [])

    const getSuggestedTeams = async () => {
        const teams = await backend.get("/api/teams/suggested",{
            params:{
                userId: props.userId,
                num: 50
            }
        });
        setSuggestions(teams.data);
     }

    const getSuggestedUsers = async () => {
        const users = await backend.get("/api/users/suggested",{
            params:{
                userId: props.userId,
                num: 50
            }
        });
        setSuggestions(users.data);
     }

    const onFollowToggleClick = (team) => {
        team.following = !team.following;
        const teams = suggestions.map(suggestion => {
            if(suggestion.id === team.id){
                return team
            }
            return suggestion
        })
        setSuggestions(teams);

        if(team.following){
            followTeam(props.userId, team.id);
        }
        else if(!team.following){
            unFollowTeam(props.userId, team.id);
        }
    }

    const renderContent = () => {
        if(suggestions === null){
            return;
        }
        if(suggestions.length > 0){
            return suggestions.map((suggestion, index) => {
                if(suggestion.team_name){
                    return (
                        <TwitItem 
                          key={index}
                          href={`/teams/${suggestion.abbrev.substring(1)}`}
                          avatar={suggestion.avatar}
                          title={suggestion.team_name}
                          subtitle={`${suggestion.abbrev} · ${suggestion.league_name}`}
                          actionText={suggestion.following ? "Unfollow" : "Follow"}
                          onActionClick={() => onFollowToggleClick(suggestion)}
                          />
                      );
                }
                else if(suggestion.username){
                    return (
                        <TwitItem 
                          key={index}
                          href={`/users/${suggestion.username}`}
                          avatar={suggestion.avatar}
                          title={suggestion.name}
                          subtitle={`@${suggestion.username}`}
                          actionText="Scout"
                          />
                      );
                }
                
              });
        }
    
        else if(suggestions.length === 0){
            return (
                <Empty
                    main="There are no suggestions for you"
                    sub="Come back in a litte bit"
                />
            )
        } 
     }

    const onTeamsClick = (event) => {   
        setTab(event.target.id);
        getSuggestedTeams();
    }

    const onUsersClick = (event) => {   
        setTab(event.target.id)
        getSuggestedUsers();
    }
        return (
            <div className={suggested["suggested"]}>
                <TopBar main="Suggested for you"/>
                <TwitTabs>
                    <TwitTab 
                        onClick={onTeamsClick}
                        id={"teams"} 
                        title="Teams" 
                        active={tab === "teams" ? true : false}

                        />
                    <TwitTab 
                        onClick={onUsersClick}
                        id={"users"} 
                        title="Users"
                        active={tab === "users" ? true : false}
                        />
                </TwitTabs>
                {renderContent()}
            </div>
        );
    }

const mapStateToProps = (state) => {
    return {
        userId: state.user.id
    }
}

export default connect(mapStateToProps)(Suggested);