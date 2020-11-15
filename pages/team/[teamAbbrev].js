import React, {useEffect} from "react";
import Head from 'next/head';
import {useRouter} from "next/router";
import {initializeStore} from "../../redux/store";
import Figure from "react-bootstrap/Figure"

import MainBody from "../../components/MainBody"
import TeamComponent from "../../components/Team";
import {User, Team, League, Post} from "../../db/connect";

function TeamPage(props) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if(!props.initialReduxState){
    return <div>no initial redux state</div>
  }
    console.log("props.initialReduxState.posts", props.initialReduxState.posts)
    return (
      <React.Fragment>
        <MainBody>
          <TeamComponent 
            team={props.initialReduxState.team} 
            posts={props.initialReduxState.posts}
          />
        </MainBody>
      </React.Fragment>
      
    )
  }

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  const reduxStore = initializeStore();
  const {dispatch} = reduxStore;

    const teamAbbrev = "$" + context.params.teamAbbrev;
    const foundTeam = await Team.findOne({teamAbbrev: teamAbbrev});
    const rosterDecoded = await User.find({_id: {$in: foundTeam.roster}});
    const opponentIds = foundTeam.events.map(event => event.opponent); //array of opponent team ids
    const eventOpponents =await Team.find({ _id: { $in: opponentIds}});
    const eventsDecoded = foundTeam.events.map(_event => {
        const v = eventOpponents.find(eventOpponent => eventOpponent._id == _event.opponent);
        return {..._event, opponent: v};
      });
    const foundLeague = await League.findOne({leagueName:foundTeam.league});
    const leagueTeams = await Team.find({ _id: { $in: foundLeague.teams}});
    const foundUser = await User.findById(foundTeam.owner);

    const teamData = {
        ...foundTeam._doc,
        roster: rosterDecoded,
        events: eventsDecoded,
        opponents: leagueTeams, 
        headCoach: foundUser.username
      }

    const posts = await Post.find({teamAbbrevs: teamAbbrev}).sort({ _id: -1 }).limit(10);
    const mapped = posts.map(post => ({ [post._id]: post }));
    const newObj = Object.assign({}, ...mapped );

    await dispatch({type:"FETCH_TEAM", payload: JSON.parse(JSON.stringify(teamData))})
    await dispatch({type:"FETCH_TEAM_POSTS", payload: JSON.parse(JSON.stringify(newObj))})
    const newStore = reduxStore.getState();
    console.log("newStore", newStore)
    return {
        revalidate: 1,
        props: {
          initialReduxState: newStore
        } // will be passed to the page component as props
    }  

  }

  export default TeamPage;
