import React, {useState, useEffect} from "react"
import {connect} from "react-redux"
import Link from "next/link";

import suggestedTeams from "../sass/components/SuggestedTeams.module.scss";
import TwitCard from "./TwitCard";
import TwitItem from "./TwitItem";
import backend from "../lib/backend";
import {followTeam, unFollowTeam} from "../actions";
import Empty from "./Empty";

function SuggestedUsers(props){

    const [users, setUsers] = useState(null); 

    useEffect(() => {
        fetchSuggestedUsers(3);
    }, [])

    const fetchSuggestedUsers = async (num) => {
        const users = await backend.get("/api/users/suggested", {
            params: {
                num
            }
        });
        setUsers(users.data);
    }

    // const onScoutToggleClick = (user) => {
    //     user.following = !user.following;
    //     const suggestedUsers = users.map(suggestedUser => {
    //         if(suggestedUser.id === user.id){
    //             return user
    //         }
    //         return suggestedUser
    //     })
    //     setUsers(suggestedUsers);

    //     if(user.following){
    //         followTeam(props.userId, user.id);
    //     }
    //     else if(!user.following){
    //         unFollowTeam(props.userId, user.id);
    //     }
    // }

    const renderFooter = () => {
        return(
            <Link href="/suggested">
                <div className={suggestedTeams["suggested-teams__footer"]}>
                    <span className={suggestedTeams["suggested-teams__footer__text"]}>Show more</span>
                </div>
            </Link>    
        )
    }

    const renderSuggestedUsers = () => {
        if(!users){
            return <div className="">spinner</div>
        }
        else if(users.length === 0){
            return <Empty main="No suggested teams" sub="Try again once more teams are created"/>
        }
        else{
            return users.map((suggestedUser, index) => {
                return (
                    <TwitItem 
                        key={index}
                        avatar={suggestedUser.avatar}
                        title={suggestedUser.name} 
                        subtitle={`@${suggestedUser.username}`}
                        actionText={suggestedUser.following?"Scout":"Unscout"}
                        href={`/users/${suggestedUser.username}`}
                    />
                )
            });
        }
        
    }

    return (
            <TwitCard title="Players to scout" footer={renderFooter()}>
                {renderSuggestedUsers()}
            </TwitCard>
    )
}

const mapStateToProps = (state) => {
    return {userId: state.user.id}
}

export default connect(mapStateToProps)(SuggestedUsers);