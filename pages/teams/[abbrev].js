import React, {useState, useEffect} from "react";
import Head from 'next/head';
import {useRouter} from "next/router";
import {connect} from "react-redux";
import useSWR from "swr";

import MainBody from "../../components/MainBody"
import backend from "../../lib/backend";
import AuthBanner from "../../components/AuthBanner";
import useUser from "../../lib/useUser";
import TeamProfile from "../../components/TeamProfile";
import Post from "../../components/Post";
import TwitTab from "../../components/TwitTab";
import TwitTabs from "../../components/TwitTabs";
import Empty from "../../components/Empty";
import {setTeam, createPost, fetchTeamPosts, fetchLeaguePosts, clearPosts, toggleEditRosterPopup, 
    toggleEditEventsPopup, toggleEditTeamPopup, findSeasonsByLeagueName} from "../../actions";
import TopBar from "../../components/TopBar";
import TwitItem from "../../components/TwitItem";
import team from "../../sass/components/Team.module.scss";
import Event from "../../components/Event";
import TwitDropdownButton from "../../components/TwitDropdownButton";
import TwitDropdownItem from "../../components/TwitDropdownItem";
import TwitSelect from "../../components/TwitSelect";
import LeftColumn from "../../components/LeftColumn";
import RightColumn from "../../components/RightColumn";
import StandingsCard from "../../components/StandingsCard";
import Teams from "../../db/repos/Teams";
import EditTeamPopup from "../../components/modals/EditTeamPopup";



function Team(props) {
  const router = useRouter()
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("team");
  const [roster, setRoster] = useState(null);
  const [events, setEvents] = useState(null);
  const [seasons, setSeasons] = useState(null);
  const [season, setSeason] = useState(null);
  const [showEditTeamPopup, setShowEditTeamPopup] = useState(false);

  
  const getTeam = async (url) => {
    const response = await backend.get(url, {
        params:{
            userId: user.id
        }
    });
    return response.data;
  }

  const { data: team } = useSWR(props.team && user ? `/api/teams/${props.team.abbrev.substring(1)}` : null, getTeam, {initialData: props.team, revalidateOnMount:true});

  useEffect(() => {
      if(!team){
        return;
      }
      props.setTeam(team)
      setActiveTab("mentions")
      props.fetchTeamPosts(team.id);
      fetchSeasons();
      
      return () => {
          props.clearPosts();
      }
    }, [team])

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
              seasonId: seasonId,
              userId: user.id
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
      if(activeTab === "mentions"){
          if(props.posts === null){
              return;
          }
          else if(props.posts.length === 0){
              return (
                  <Empty
                      main="No team mentions yet"
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
              if(user.id === team.owner_id){
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
              if(user.id === team.owner_id){
                  return (
                      <React.Fragment>
                          {renderTwitSelect()}
                          <Empty 
                          main="No events" 
                          sub="Nothing scheduled for this season"
                          actionText="Create event"
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


    const renderEvents = () => {
      return events.map((event, index) => {
          return (
              <Event key={index} event={event} teamId={team.id}/>
          )
      });
    }

    const renderButton = () => {
        if(!user){
          return null;
        }
        if(user.id === team.owner_id){
            return(
              <TwitDropdownButton actionText="Manage team">
                  <TwitDropdownItem onClick={() => setShowEditTeamPopup(true)}>Edit team page</TwitDropdownItem>
                  <TwitDropdownItem onClick={editRoster}>Edit roster</TwitDropdownItem>
                  <TwitDropdownItem onClick={editEvents}>Create event</TwitDropdownItem>
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
          if(user.id === team.owner_id){
            props.toggleEditTeamPopup();
          }
        }
      
      const editRoster = () => {
        if(user.id === team.owner_id){
          props.toggleEditRosterPopup();
        }
      }
    
      const editEvents = () => {
        if(user.id === team.owner_id){
          props.toggleEditEventsPopup();
        }
      }
 
  if (router.isFallback) {
    return <div>Loading...</div>
  }

    return (
      <React.Fragment>
        <div className="twit-container">
            <header className="header">
                <LeftColumn/>
            </header>
            <main className="main">
                <TopBar main={team.team_name} sub={`${team.num_posts} Posts`}>
                {renderButton()}
                </TopBar>
                <TeamProfile team={team} onAvatarClick={() => setShowEditTeamPopup(true)}/>
                <TwitTabs>
                    <TwitTab onClick={onTeamSelect} id={"mentions"} active={activeTab === "mentions" ? true : false} title="Mentions"/>
                    <TwitTab onClick={onScheduleClick} id={"schedule"} active={activeTab === "schedule" ? true : false} title="Schedule"/>
                    <TwitTab onClick={onRosterSelect} id={"roster"} active={activeTab === "roster" ? true : false} title="Roster"/>
                    <TwitTab onClick={(k) => setActiveTab(k.target.id)} id={"media"} active={activeTab === "media" ? true : false} title="Media"/>
                </TwitTabs>
                {renderContent()}
            </main>
            <div className="right-bar">
                <RightColumn>
                    <StandingsCard league={{league_name: team.league_name}}/>
                </RightColumn>
            </div>
        </div>
        <AuthBanner/>
        <EditTeamPopup show={showEditTeamPopup} onHide={() => setShowEditTeamPopup(false)} team={team}/>
      </React.Fragment>
      
    )
  }

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
    let team = await Teams.findOne(`$${context.params.abbrev}`, null);
    team = JSON.parse(JSON.stringify(team));


    return {
        revalidate: 1,
        props: {
          team
        }
    }  

  }


const mapStateToProps = (state) => {
  return {
      posts: state.posts ? state.posts : null
  }
}

  export default connect(mapStateToProps, 
    {
        setTeam,
        createPost, 
        fetchTeamPosts, 
        fetchLeaguePosts, 
        clearPosts, 
        toggleEditRosterPopup,
        toggleEditTeamPopup,
        toggleEditEventsPopup
    })(Team);
