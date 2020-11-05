import Head from 'next/head'

import MainBody from "../../components/MainBody"
import TeamComponent from "../../components/Team";
import {User, Team, League} from "../../db/connect";

function TeamPage(props) {
  return (
    <MainBody>
      <TeamComponent teamData={props}/>
    </MainBody>
  )
}

export async function getServerSideProps(context) {
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
      console.log("teamData", teamData)
    
    return {
        props: JSON.parse(JSON.stringify(teamData)) // will be passed to the page component as props
    }  

  }

  export default TeamPage;
