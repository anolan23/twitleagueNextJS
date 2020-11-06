import Head from 'next/head';
import {useRouter} from "next/router";
import {initializeStore} from "../../redux/store";

import MainBody from "../../components/MainBody"
import TeamComponent from "../../components/Team";
import {User, Team, League} from "../../db/connect";

function TeamPage(props) {
  console.log("props.initialReduxState", props.initialReduxState)
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  return (
    <MainBody>
      <TeamComponent teamData={props.initialReduxState.team}/>
    </MainBody>
  )
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  const reduxStore = initializeStore();
  const {dispatch} = reduxStore;

    const teamAbbrev = "$" + context.params.teamAbbrev;
    console.log(teamAbbrev);
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

    dispatch({type:"FETCH_TEAM", payload: JSON.parse(JSON.stringify(teamData))})
    
    return {
        revalidate: 1,
        props: {
          initialReduxState: reduxStore.getState()
        } // will be passed to the page component as props
    }  

  }

  export default TeamPage;
