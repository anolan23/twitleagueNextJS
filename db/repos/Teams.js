import { saveTeamImages } from "../../actions";
import pool  from "../pool";

class Teams {

    static async create(team) {
        let results;
        await (async () => {
            const client = await pool.connect()
            try {
                await client.query('BEGIN')
                const teamId = await pool.query(
                    `
                    INSERT INTO teams (owner_id, team_name, abbrev, city, state)
                    VALUES
                    ($1, $2, $3, $4, $5)
                    RETURNING id
                    `, [team.owner, team.teamName, team.teamAbbrev, team.city, team.state]);
                
                const leagueData = await client.query(
                    `
                    SELECT id, owner_id
                    FROM leagues
                    WHERE league_name = $1
                    `, [team.league]
                )                 
                
                const payload = JSON.stringify({
                    message: `${team.teamAbbrev} wants to join ${team.league}`,
                    team_id: teamId.rows[0].id,
                    league_id: leagueData.rows[0].id
                });

                const notification = await client.query(
                    `
                    INSERT INTO notifications (user_id, type, payload)
                    VALUES 
                    ($1, 'Join League Request', $2 )
                    `, [leagueData.rows[0].owner_id, payload]
                )

                await client.query('COMMIT')
              
            } catch (e) {
              await client.query('ROLLBACK')
              throw e
            } finally {
              client.release()
            }

          })().catch(e => console.error(e.stack))
    }

    static async findOne(abbrev) {
        const team = await pool.query(`
        SELECT teams.id, team_name, abbrev, teams.avatar, banner, teams.created_at, username AS head_coach, league_id, league_name
        FROM teams
        JOIN users ON teams.owner_id = users.id
        LEFT JOIN leagues ON teams.league_id = leagues.id
        WHERE abbrev = $1`, [abbrev]);
        return team.rows[0];
    }

    static async findByOwnerId(ownerId) {
        const teams = await pool.query(`
        SELECT *
        FROM teams
        WHERE owner_id = $1`, [ownerId]);
        return teams.rows;
    }

    static async find() {
        const teams = await pool.query(`
        SELECT *
        FROM teams
        `);
        return teams.rows;
    }
}

export default Teams;