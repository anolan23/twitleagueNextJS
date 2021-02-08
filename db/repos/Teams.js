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

                const notification = await client.query(
                    `
                    INSERT INTO notifications (user_id, type, team_id, league_id)
                    VALUES 
                    ($1, 'Join League Request', $2, $3)
                    `, [leagueData.rows[0].owner_id, teamId.rows[0].id, leagueData.rows[0].id]
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
        SELECT teams.id, teams.team_name, abbrev, teams.avatar, banner, teams.created_at, 
            teams.owner_id, username AS owner, league_id, league_name, 
                (SELECT COUNT(*) AS num_posts
                FROM team_mentions
                WHERE team_id = (SELECT id FROM teams WHERE abbrev = $1))
        FROM teams
        JOIN users ON teams.owner_id = users.id
        LEFT JOIN leagues ON teams.league_id = leagues.id
        WHERE abbrev = $1`, [abbrev]);
        return team.rows[0];
    }

    static async findByOwnerId(ownerId) {
        const teams = await pool.query(`
        SELECT teams.abbrev, teams.team_name, teams.avatar, teams.city, leagues.league_name
        FROM teams
        FULL JOIN leagues ON teams.league_id = leagues.id
        WHERE teams.owner_id = $1`, [ownerId]);
        return teams.rows;
    }

    static async findByLeagueId(leagueId) {
        const teams = await pool.query(`
        SELECT *
        FROM teams
        WHERE teams.league_id = $1`, [leagueId]);
        return teams.rows;
    }

    static async find() {
        const teams = await pool.query(`
        SELECT *
        FROM teams
        `);
        return teams.rows;
    }

    static async findSuggested(userId, num) {
        const teams = await pool.query(`
        SELECT teams.id, avatar, team_name, abbrev, league_name,
        EXISTS (SELECT 1 FROM followers WHERE followers.user_id = $1 AND teams.id = followers.team_id ) AS following
        FROM teams
        JOIN leagues ON leagues.id = teams.league_id
        WHERE teams.avatar IS NOT NULL AND teams.id NOT IN (
            SELECT team_id
            FROM followers
            WHERE user_id = $1)
        ORDER BY RANDOM()
        LIMIT $2
        `, [userId, num]);
        return teams.rows;
    }

    static async joinLeague(leagueId, teamId) {
        const team = await pool.query(`
        UPDATE teams
        SET league_id = $1
        WHERE id = $2`, [leagueId, teamId]);
        return team.rows;
    }

    static async update(teamId, values) {
        const {rows} = await pool.query(`
        UPDATE teams
        SET avatar = $2
        WHERE id = $1
        RETURNING *`, [teamId, values.avatar]);
        return rows[0];
    }

    static async createEvent(event) {
        const {rows} = await pool.query(`
        INSERT INTO events (team_id, type, opponent_id, date, location, notes)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`
        , [event.teamId, event.type, event.opponent, event.eventDate, event.location, event.notes]);
        return rows[0];
    }

    static async findEventsByTeamId(teamId) {
        const {rows} = await pool.query(`
        SELECT events.*, to_char(events.date, 'Mon') AS month, to_char(events.date, 'DD') AS day, to_char(events.date, 'HH12:MIAM') AS time, t1.team_name, t1.abbrev, t1.avatar, t2.team_name AS opponent_team_name, t2.abbrev AS opponent_abbrev, t2.avatar AS opponent_avatar
        FROM events
        LEFT JOIN teams AS t1 ON events.team_id = t1.id
        LEFT JOIN teams AS t2 ON events.opponent_id = t2.id
        WHERE events.team_id = $1`
        , [teamId]);
        return rows;
    }

    static async search(search) {
        const {rows} = await pool.query(`
        SELECT teams.*, leagues.league_name
        FROM teams
        JOIN leagues ON leagues.id = teams.league_id
        WHERE (LOWER(teams.abbrev) LIKE $1) OR (LOWER(teams.team_name) LIKE $1)
        LIMIT 10;`, [`%${search}%`]);
        return rows;
    }
}

export default Teams;