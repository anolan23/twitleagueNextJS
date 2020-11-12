import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Link from "next/link";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import {connect} from "react-redux";

import TwitCard from "./TwitCard";
import TwitCardBody from "./TwitCardBody";
import TwitItem from "./TwitItem";
import {toggleCreateTeamModal,toggleCreateLeagueModal, fetchTeam, fetchTeamAndTeamPosts,fetchLeague} from "../actions";
import styles from "../styles/FeedHolder.module.css";

class WatchListCard extends React.Component {

  state = {activeLink: "first"}

  onTeamClick = (team) => {
    this.props.fetchTeamAndTeamPosts(team._id);
}

  onLeagueClick = (league) => {
      this.props.fetchLeague(league._id);
  }

  renderWatchListTeams = () => {
      if(!this.props.watchListTeams){
          return
      }
      return this.props.watchListTeams.map(watchListTeam => {
          return (
                  <Link passHref href={"/team/" + watchListTeam.teamAbbrev.substring(1)} key={watchListTeam._id}>
                      <TwitItem title={watchListTeam.teamAbbrev.substring(1)} subtitle={watchListTeam.teamName} image={watchListTeam.image}/>
                  </Link>
            
          );
      }); 
  }

  renderTeams = () => {
      if(!this.props.teams){
          return
      }
      return this.props.teams.map(team => {
          return (
                  <Link passHref href={"/team/" + team.teamAbbrev.substring(1)} key={team._id}>
                      <TwitItem title={team.teamAbbrev.substring(1)} subtitle={team.teamName} image={team.image}/>
                  </Link>
            
          );
      }); 
  }

  renderLeagues = () => {
      if(!this.props.leagues){
          return
      }
      return this.props.leagues.map(league => {
          return (
                  <Link passHref href={"/league/"+league.leagueName} onClick={() => this.onLeagueClick(league)}>
                    <TwitItem title={league.leagueName} subtitle={league.sport} image={null}/>
                  </Link>
          );
      }); 
  }

  renderCardBodies = () => {
      if(this.state.activeLink === "first"){
          return (
              <TwitCardBody 
                  category={this.props.watchListTeams}
                  title="Add teams to your Watchlist"
                  content={this.renderWatchListTeams()}
                  onClick={this.props.toggleCreateTeamModal}
                  buttonText="Create Team"
              />
          );
      }
      else if(this.state.activeLink === "second"){
          return (
              <TwitCardBody 
                  category={this.props.teams}
                  title="Create or join an existing team."
                  content={this.renderTeams()}
                  onClick={this.props.toggleCreateTeamModal}
                  buttonText="Create Team"
              />
          );
      }
      else if(this.state.activeLink === "third"){
          return (
              <TwitCardBody 
                  category={this.props.leagues}
                  title="Create your own league."
                  content={this.renderLeagues()}
                  onClick={this.props.toggleCreateLeagueModal}
                  buttonText="Create League"
              />
          );
      }                
  }

  renderBody = () => {
    return (
      <Tab.Content>
        <Tab.Pane eventKey="first">
        {this.renderCardBodies()}
        </Tab.Pane>
        <Tab.Pane eventKey="second">
        {this.renderCardBodies()}
        </Tab.Pane>
        <Tab.Pane eventKey="third">
        {this.renderCardBodies()}
        </Tab.Pane>
      </Tab.Content>
    );
  }

  render(){
    return (
        <React.Fragment>
            <TwitCard body={this.renderBody()}>
              <Nav className={styles["nav-style"] + " justify-content-center"}>
                <Nav.Item>
                <Nav.Link eventKey="first" onSelect={(k) => this.setState({activeLink:k})}>
                    <div className={this.state.activeLink === "first" ? styles["link-active"] : styles["link-inactive"] + " " + styles["twit-link"]}>
                    <span className="span-block">Watchlist</span>
                    </div>
                </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                <Nav.Link eventKey="second" onSelect={(k) => this.setState({activeLink:k})}>
                    <div className={this.state.activeLink === "second" ? styles["link-active"] : styles["link-inactive"] + " " + styles["twit-link"]}>
                    <span className="span-block">My Teams</span>
                    </div>
                </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                <Nav.Link eventKey="third" onSelect={(k) => this.setState({activeLink:k})}>
                    <div className={this.state.activeLink === "third" ? styles["link-active"] : styles["link-inactive"] + " " + styles["twit-link"]}>
                    <span className="span-block">My Leagues</span>
                    </div>
                </Nav.Link>
                </Nav.Item>
              </Nav>
            </TwitCard>
        </React.Fragment>
    );
  }

}

const mapStateToProps= (state) => {
  return {
      teams: state.user.teams ? Object.values(state.user.teams) : null,
      leagues: state.user.leagues ? Object.values(state.user.leagues) : null,
      watchListTeams: state.user.watchListTeams ? state.user.watchListTeams : null
  }
}

export default connect(mapStateToProps, {toggleCreateTeamModal, toggleCreateLeagueModal, fetchTeam, fetchTeamAndTeamPosts, fetchLeague})(WatchListCard);
