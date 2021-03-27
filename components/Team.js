import React, {useState, useEffect} from "react";
import {connect} from "react-redux";

import TeamHolder from "./TeamHolder";
import Post from "./Post";
import TwitTab from "./TwitTab";
import TwitTabs from "./TwitTabs";
import Empty from "./Empty";
import {setTeam, createPost, fetchUser, fetchTeamPosts, fetchLeaguePosts, clearPosts, toggleEditRosterPopup, 
    toggleEditEventsPopup, toggleEditTeamPopup, findEventsByTeamAbbrev, findSeasonsByLeagueName} from "../actions";
import {dateString} from "../lib/twit-helpers";
import TopBar from "./TopBar";
import TwitItem from "./TwitItem";
import team from "../sass/components/Team.module.scss"
import Event from "./Event";
import backend from "../lib/backend";
import TwitDropdownButton from "./TwitDropdownButton";
import TwitDropdownItem from "./TwitDropdownItem";
import TwitSelect from "./TwitSelect";

function Team(props) {

    const team = props.team
    const [activeTab, setActiveTab] = useState("team");
    const [roster, setRoster] = useState(null);
    const [events, setEvents] = useState(null);
    const [seasons, setSeasons] = useState(null);
    const [season, setSeason] = useState(null);


    useEffect(() => {
        props.setTeam(props.team)
        setActiveTab("team")
        const start = async () => {
            if(!props.user.isSignedIn){
                await props.fetchUser();
            }
            props.fetchTeamPosts(team.id);
            fetchSeasons();
        }
        start();
    
        return () => {
            props.clearPosts();
        }
      }, [props.team])

      useEffect(() => {
        if(!seasons){
            return;
        }
        setSeason(seasons[seasons.length - 1]);
      }, [seasons])

    const fetchRoster = async () => {
        const response = await backend.get("api/teams/rosters", {
            params: {
                teamId: team.id
            }
        });
        setRoster(response.data);
    }

    const fetchEventsBySeasonId = async (seasonId) => {
        const events = await backend.get(`api/teams/${team.abbrev.substring(1)}/events`, {
            params: {
                seasonId: seasonId
            }
        });
        setEvents(events.data);
    }

    const fetchSeasons = async () => {
        let seasons = await findSeasonsByLeagueName(team.league_name);
        seasons.map((season, index)=> {
            if(season.id === team.season_id){
                season.text = `Current season - ${season.text}`
            }
            else{
                season.text = `Season ${index+1} - ${season.text}`
            }
        })
        setSeasons(seasons);
    }

    const updateTeam = (team) => {
        setTeam(team);
    }

    const renderContent = () => {
        if(activeTab ==="team" || activeTab === "league"){
            if(props.posts === null){
                return;
            }
            else if(props.posts.length === 0){
                return (
                    <Empty
                        main="No posts yet"
                        sub="Be the first to make a post mentioning this team"
                        actionText="Post now"
                        
                    />
                )
            }
            else{
                return props.posts.map((post, index) => {
                    return (
                        <Post 
                        key={index}
                        post={post}
                        />
                    );
                });
            }
        }
        else if(activeTab === "roster"){
            if(!roster){
                return null;
            }
            else if(roster.length === 0){
                if(props.user.id === team.owner_id){
                    return (
                        <Empty 
                            main="No players" 
                            sub="There are no players on this team"
                            actionText="Edit Roster"
                            onActionClick={props.toggleEditRosterPopup}
                            />
                    )
                }
                else{
                    return (
                        <Empty 
                            main="No players" 
                            sub="There are no players on this team"
                            />
                    )
                }
                
            }
            else{
                return roster.map((player, index) => {
                    return (
                        <TwitItem
                            key={index}
                            avatar={player.avatar}
                            title={player.name}
                            subtitle={`@${player.username}`}
                            actionText="Scout"
                        />
                    )
                });
            }
        }

        else if(activeTab === "schedule"){
            if(!events){
                return <div className="">spinner</div>
            }
            else if(events.length === 0){
                if(props.user.id === team.owner_id){
                    return (
                        <React.Fragment>
                            {renderTwitSelect()}
                            <Empty 
                            main="No events" 
                            sub="Nothing scheduled for this season"
                            actionText="Edit Events"
                            onActionClick={props.toggleEditEventsPopup}
                            />
                        </React.Fragment>
                    )
                }
                else{
                    return (
                        <React.Fragment>
                            {renderTwitSelect()}
                            <Empty 
                            main="No events" 
                            sub="Nothing scheduled for this season"
                            />
                        </React.Fragment>
                    )
                }
            }
            else{
                return (
                    <React.Fragment>
                        {renderTwitSelect()}
                        {renderEvents()}
                    </React.Fragment>
                )
            }
        }
      }

      console.log("season", season)

      const renderEvents = () => {
        return events.map((event, index) => {
            return (
                <Event key={index} event={event} teamId={team.id}/>
            )
        });
      }

      const renderButton = () => {
          if(props.user.id === team.owner_id){
              return(
                <TwitDropdownButton actionText="Manage team">
                    <TwitDropdownItem onClick={editTeam}>Edit team page</TwitDropdownItem>
                    <TwitDropdownItem onClick={editRoster}>Edit roster</TwitDropdownItem>
                    <TwitDropdownItem onClick={editEvents}>Edit events</TwitDropdownItem>
                </TwitDropdownButton>
              )
          }
          else{
              return null;
          }
      }

      const renderTwitSelect = () => {
          if(!season){
              return null;
          }
          else{
              return <TwitSelect onSelect={fetchEventsBySeasonId} options={seasons} defaultValue={season.text}/>

          }
      }


        const onTeamSelect = (k) => {
            setActiveTab(k.target.id);
            props.fetchTeamPosts(team.id);
        }

        const onLeagueSelect = async (k) => {
            setActiveTab(k.target.id);
            props.fetchLeaguePosts(team.league_id);
        }

        const onRosterSelect = (k) => {
            setActiveTab(k.target.id);
            fetchRoster();
        }

        const onScheduleClick = (k) => {
            setActiveTab(k.target.id);
            setSeason(seasons[seasons.length - 1]);
            fetchEventsBySeasonId(team.season_id);
        }

        const editTeam = () => {
            if(props.user.id === team.owner_id){
              props.toggleEditTeamPopup();
            }
          }
        
          const editRoster = () => {
            if(props.user.id === team.owner_id){
              props.toggleEditRosterPopup();
            }
          }
        
          const editEvents = () => {
            if(props.user.id === team.owner_id){
              props.toggleEditEventsPopup();
            }
          }
        
      
        return (
            <div >
                <TopBar main={team.team_name} sub={`${team.num_posts} Posts`}>
                    {renderButton()}
                </TopBar>
                <TeamHolder team={team} updateTeam={updateTeam}/>
                <TwitTabs>
                    <TwitTab onClick={onTeamSelect} id={"team"} active={activeTab === "team" ? true : false} title="Team"/>
                    <TwitTab onClick={onLeagueSelect} id={"league"} active={activeTab === "league" ? true : false} title="League"/>
                    <TwitTab onClick={onScheduleClick} id={"schedule"} active={activeTab === "schedule" ? true : false} title="Schedule"/>
                    <TwitTab onClick={onRosterSelect} id={"roster"} active={activeTab === "roster" ? true : false} title="Roster"/>
                    <TwitTab onClick={(k) => setActiveTab(k.target.id)} id={"media"} active={activeTab === "media" ? true : false} title="Media"/>
                </TwitTabs>
                {renderContent()}
            </div>
        );
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        posts: state.posts ? state.posts : null
    
    }
}

export default connect(mapStateToProps, 
    {
        setTeam,
        fetchUser, 
        createPost, 
        fetchTeamPosts, 
        fetchLeaguePosts, 
        clearPosts, 
        toggleEditRosterPopup,
        toggleEditTeamPopup,
        toggleEditEventsPopup
    })(Team);