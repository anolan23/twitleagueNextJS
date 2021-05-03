import pool  from "../pool";

class Leagues {

    static async create(leagueData) {
        const {ownerId, leagueName, sport} = leagueData;
        const {rows} = await pool.query(`
        INSERT INTO leagues (owner_id, league_name, sport)
        VALUES
        ($1, $2, $3)`, [ownerId, leagueName, sport]);
        
    }

    static async findOne(leagueName) {
        const {rows} = await pool.query(`
        SELECT *,
            (SELECT count(*) FROM teams WHERE teams.league_id = leagues.id) AS team_count
        FROM leagues
        WHERE league_name = $1;`, [leagueName]);
        
        return rows[0];
    }

    static async findByOwnerId(ownerId) {
        const leagues = await pool.query(`
        SELECT *
        FROM leagues
        WHERE owner_id = $1`, [ownerId]);
        
        return leagues.rows;
    }

    static async findOneByLeagueId(leagueId) {
        const {rows} = await pool.query(`
        SELECT *
        FROM leagues
        WHERE id = $1`, [leagueId]);
        
        return rows[0];
    }

    static async find() {
        const leagues = await pool.query(`
        SELECT *
        FROM leagues
        `);
        
        return leagues.rows;
    }

    static async findAllLike(leagueName) {
        if(!leagueName)
        {
            return []
        }
        const search = leagueName.toLowerCase();
        const {rows} = await pool.query(`
        SELECT *
        FROM leagues
        WHERE (LOWER(league_name) LIKE $1);`, [`%${search}%`]);
        
        return rows;
    }

    static async createDivision(leagueId) {
        const division = await pool.query(`
        INSERT INTO divisions (league_id)
        VALUES ($1)
        RETURNING *
        `, [leagueId]);
        
        return division.rows[0];
    }

    static async deleteDivision(divisionId) {
        const division = await pool.query(`
        DELETE FROM divisions
        WHERE id = $1
        RETURNING *
        `, [divisionId]);
        
        return division.rows[0];
    }

    static async updateDivisionName(divisionId, newDivisionName) {
        const division = await pool.query(`
        UPDATE divisions
        SET division_name = $2
        WHERE id = $1
        RETURNING *
        `, [divisionId, newDivisionName]);
        
        return division.rows[0];
    }

    static async findDivisions(leagueId) {
        const division = await pool.query(`
        SELECT row_to_json(final) AS division
        FROM (
            SELECT
                *,
                (
                    SELECT jsonb_agg(nested_team)
                    FROM (
                        SELECT
                            teams.*	
                        FROM teams
                        WHERE teams.division_id = divisions.id
                    ) AS nested_team
                ) AS teams
            FROM divisions
            WHERE divisions.league_id = $1
        ) AS final;
        `, [leagueId]);
        
        return division.rows;
    }

    static async standings(leagueName, seasonId) {
        const {rows} = await pool.query(`
        WITH results AS (
            SELECT team_id as team_id, 
                CASE 
                    WHEN points > opponent_points THEN 'W' 
                    WHEN points < opponent_points THEN 'L'
                    ELSE NULL 
                    END 
                AS outcome, 
                season_id, points, opponent_points, league_approved FROM events 
                UNION ALL
            SELECT opponent_id as team_id, 
                CASE 
                    WHEN opponent_points > points THEN 'W' 
                    WHEN opponent_points < points THEN 'L'
                    ELSE NULL 
                    END 
                AS outcome, 
                season_id, points, opponent_points, league_approved FROM events
        ), records AS (
            SELECT results.season_id, team_id, division_id,
                count(*) AS total_games,
                count(case when outcome = 'W' then 1 else null end) AS wins,
                count(case when outcome = 'L' then 0 else null end) AS losses
            FROM results
            JOIN teams ON teams.id = results.team_id
            JOIN leagues ON leagues.id = teams.league_id
            WHERE league_approved = true AND leagues.league_name = $1 AND results.season_id = $2
            GROUP BY results.season_id, team_id, division_id
        )
        SELECT teams.*,
            divisions.division_name,
            total_games, wins, losses,
            to_char(wins/total_games::float, '0.999') AS win_percentage,
            RANK() OVER(PARTITION BY teams.division_id ORDER BY wins/total_games::float DESC NULLS LAST) AS place
        FROM teams
        FULL JOIN records ON records.team_id = teams.id
        FULL JOIN divisions ON divisions.id = teams.division_id
        FULL JOIN leagues ON leagues.id = teams.league_id
        WHERE leagues.league_name = $1
        `, [leagueName, seasonId]);
        
        return rows;
    }

    static async currentSeasonStandings(leagueName) {
        const {rows} = await pool.query(`
        WITH results AS (
            SELECT team_id as team_id, 
                CASE 
                    WHEN points > opponent_points THEN 'W' 
                    WHEN points < opponent_points THEN 'L'
                    WHEN points = opponent_points THEN 'T'
                    ELSE NULL 
                    END 
                AS outcome, 
                season_id, points, opponent_points, league_approved 
                FROM events 
                UNION ALL
            SELECT opponent_id as team_id, 
                CASE 
                    WHEN opponent_points > points THEN 'W' 
                    WHEN opponent_points < points THEN 'L'
                    WHEN points = opponent_points THEN 'T'
                    ELSE NULL 
                    END 
                AS outcome, 
                season_id, points, opponent_points, league_approved 
                FROM events
        ), records AS (
            SELECT results.season_id, team_id, division_id,
                count(*) AS total_games,
                count(case when outcome = 'W' then 1 else null end) AS wins,
                count(case when outcome = 'L' then 0 else null end) AS losses
            FROM results
            JOIN teams ON teams.id = results.team_id
            JOIN leagues ON leagues.id = teams.league_id
            WHERE league_approved = true AND leagues.league_name = $1 AND results.season_id = leagues.season_id
            GROUP BY results.season_id, team_id, division_id
        )
		
        SELECT row_to_json(final) AS division
        FROM (
            SELECT
                divisions.*,
                (
                    SELECT jsonb_agg(nested_team)
                    FROM (
                        SELECT
                            teams.*, 
							total_games, wins, losses,
            				RANK() OVER(PARTITION BY teams.division_id ORDER BY wins/total_games::float DESC NULLS LAST) AS place
                        FROM teams
						FULL JOIN records ON records.team_id = teams.id
                        WHERE teams.division_id = divisions.id
                    ) AS nested_team
                ) AS teams
            FROM divisions
			JOIN leagues ON leagues.id = divisions.league_id
            WHERE leagues.league_name = $1
        ) AS final;
        `, [leagueName]);
        
        return rows;
    }

    static async updateByLeagueName(leagueName, columns) {
        const sqlQuery = () => {
            var query = [`UPDATE leagues`];
            query.push('SET');

            var set = [];
            Object.keys(columns).forEach((column, index) => {
                set.push(column + ' = ($' + (index + 1) + ')'); 
            });
            query.push(set.join(', '));

            // Add the WHERE statement to look up by id
            query.push(`WHERE league_name = '${leagueName}'`  );
            query.push('RETURNING *');

            // Return a complete query string
            return query.join(' ');
        }

        const {rows} = await pool.query(sqlQuery(), Object.values(columns));
        
        return rows[0];
    }
}

export default Leagues;