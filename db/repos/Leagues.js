import pool from "../pool";

class Leagues {
  static async create(leagueData) {
    const { ownerId, leagueName, sport } = leagueData;
    const { rows } = await pool.query(
      `
        INSERT INTO leagues (owner_id, league_name, sport)
        VALUES
        ($1, $2, $3)`,
      [ownerId, leagueName, sport]
    );
  }

  static async findOne(leagueName) {
    const { rows } = await pool.query(
      `
      SELECT
        leagues.*,
        (
        SELECT row_to_json(season) AS current_season
          FROM (
            SELECT *
            FROM seasons 
            WHERE id = leagues.season_id
          ) AS season
        ),
        (
        SELECT jsonb_agg(nested_season)
          FROM (
            SELECT *
            FROM seasons
            WHERE league_id = leagues.id
          ) AS nested_season
        ) AS seasons,
        (
        SELECT jsonb_agg(nested_team)
          FROM (
            SELECT teams.*, divisions.division_name
            FROM teams
            FULL JOIN divisions ON divisions.id = teams.division_id
            WHERE teams.league_id = leagues.id
          ) AS nested_team
        ) AS teams,
        (
          SELECT jsonb_agg(nested_division)
            FROM (
              SELECT *
              FROM divisions
              WHERE divisions.league_id = leagues.id AND divisions.season_id IS NOT DISTINCT FROM leagues.season_id
              ORDER BY division_name
            ) AS nested_division
          ) AS divisions
      FROM leagues
      WHERE leagues.league_name = $1`,
      [leagueName]
    );

    return rows[0];
  }

  static async getLeaguePlayoff(leagueName, seasonId) {
    const { rows } = await pool.query(
      `
      SELECT
        leagues.*,
        (
        SELECT row_to_json(season) AS current_season
          FROM (
          SELECT *
          FROM seasons 
          WHERE id = leagues.season_id
          ) AS season
        ),
        (
          SELECT row_to_json(playoffs) AS playoffs
          FROM (
            SELECT *
            FROM playoffs 
            WHERE playoffs.season_id = $2
          ) AS playoffs
        ),
        (
        SELECT jsonb_agg(nested_season)
          FROM (
          SELECT *
          FROM seasons
          WHERE league_id = leagues.id
          ) AS nested_season
        ) AS seasons,
        (
        SELECT jsonb_agg(nested_team)
          FROM (
          SELECT *
          FROM teams
          WHERE league_id = leagues.id
          ) AS nested_team
        ) AS teams
      FROM leagues
      WHERE leagues.league_name = $1`,
      [leagueName, seasonId]
    );

    return rows[0];
  }

  static async findByOwnerId(ownerId) {
    const leagues = await pool.query(
      `
        SELECT *
        FROM leagues
        WHERE owner_id = $1`,
      [ownerId]
    );

    return leagues.rows;
  }

  static async findOneByLeagueId(leagueId) {
    const { rows } = await pool.query(
      `
        SELECT *
        FROM leagues
        WHERE id = $1`,
      [leagueId]
    );

    return rows[0];
  }

  static async find() {
    const leagues = await pool.query(`
        SELECT *
        FROM leagues
        `);

    return leagues.rows;
  }

  static async findAllLike(query, offset, limit) {
    const { rows } = await pool.query(
      `
        SELECT *
        FROM leagues
        WHERE (LOWER(league_name) LIKE $1)
        ORDER BY league_name
        OFFSET $2
        LIMIT $3;`,
      [`%${query}%`, offset, limit]
    );

    return rows;
  }

  static async createDivision(leagueId, seasonId) {
    const division = await pool.query(
      `
        INSERT INTO divisions (league_id, season_id)
        VALUES ($1, $2)
        RETURNING *
        `,
      [leagueId, seasonId]
    );

    return division.rows[0];
  }

  static async deleteDivision(divisionId) {
    const division = await pool.query(
      `
        DELETE FROM divisions
        WHERE id = $1
        RETURNING *
        `,
      [divisionId]
    );

    return division.rows[0];
  }

  static async updateDivisionName(divisionId, newDivisionName) {
    const division = await pool.query(
      `
        UPDATE divisions
        SET division_name = $2
        WHERE id = $1
        RETURNING *
        `,
      [divisionId, newDivisionName]
    );

    return division.rows[0];
  }

  static async findDivisions(leagueId) {
    const division = await pool.query(
      `
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
        `,
      [leagueId]
    );

    return division.rows;
  }

  static async getFormat(leagueName, seasonId) {
    const format = await pool.query(
      `
      WITH league_data AS (
        SELECT id
        FROM leagues
        WHERE league_name = $1
        )
      SELECT
        divisions.*,
        (
           SELECT jsonb_agg(nested_team)
           FROM (
             SELECT *
             FROM teams
             WHERE teams.division_id = divisions.id
           ) AS nested_team
        ) AS teams
        FROM divisions
        WHERE divisions.league_id = (SELECT id FROM league_data) AND divisions.season_id IS NOT DISTINCT FROM $2
        `,
      [leagueName, seasonId]
    );

    return format.rows;
  }

  static async findStandings(leagueName, seasonId) {
    const { rows } = await pool.query(
      `
      WITH league_data AS (
        SELECT id
        FROM leagues
        WHERE league_name = $1
        ), results AS (
           (
           SELECT home_season_team_id as team_id, 
           CASE 
             WHEN home_team_points > away_team_points THEN 'W' 
             WHEN home_team_points < away_team_points THEN 'L'
             WHEN home_team_points = away_team_points THEN 'T'
             ELSE NULL 
          END 
           AS outcome, 
           events.season_id, home_team_points, away_team_points, league_approved,
           leagues.id AS league_id,
           season_teams.division_id
           FROM events
           JOIN season_teams ON season_teams.id = home_season_team_id
           JOIN leagues ON leagues.id = season_teams.league_id
           WHERE league_id = (SELECT id FROM league_data)
           )
           UNION ALL
           (
           SELECT away_season_team_id AS team_id, 
           CASE 
             WHEN away_team_points > home_team_points THEN 'W' 
             WHEN away_team_points < home_team_points THEN 'L'
             WHEN away_team_points = home_team_points THEN 'T'
             ELSE NULL 
             END 
           AS outcome, 
           events.season_id, home_team_points, away_team_points, league_approved,
           leagues.id AS league_id,
           season_teams.division_id
           FROM events
           JOIN season_teams ON season_teams.id = away_season_team_id
           JOIN leagues ON leagues.id = season_teams.league_id
           WHERE league_id = (SELECT id FROM league_data)
           )
      
        ), records AS (
           SELECT results.season_id, team_id, division_id,
           count(*) AS total_games,
           count(case when outcome = 'W' then 1 else null end) AS wins,
           count(case when outcome = 'L' then 0 else null end) AS losses
           FROM results
           WHERE league_approved = true AND results.season_id = $2
           GROUP BY results.season_id, team_id, division_id
        )
        
       SELECT
         (
          SELECT jsonb_agg(nested_division)
          FROM (
            SELECT *
            FROM divisions
            WHERE season_id = $2 AND league_id = (SELECT id FROM league_data)
          ) AS nested_division
         ) AS divisions,
         (
          SELECT jsonb_agg(nested_team)
          FROM (
            SELECT
              season_teams.*, 
              total_games, wins, losses,
            RANK() OVER(PARTITION BY season_teams.division_id ORDER BY wins/total_games::float DESC, team_name NULLS LAST) AS place
            FROM season_teams
            FULL JOIN records ON records.team_id = season_teams.id
            WHERE season_teams.season_id = $2 AND league_id = (SELECT id FROM league_data)
          ) AS nested_team
         ) AS teams
        `,
      [leagueName, seasonId]
    );

    return rows[0];
  }

  static async currentSeasonStandings(leagueName) {
    const { rows } = await pool.query(
      `
      WITH league_data AS (
        SELECT *
        FROM leagues
        WHERE league_name = $1
        ), results AS (
           (
           SELECT home_season_team_id as team_id, 
             CASE 
               WHEN home_team_points > away_team_points THEN 'W' 
               WHEN home_team_points < away_team_points THEN 'L'
               WHEN home_team_points = away_team_points THEN 'T'
               ELSE NULL 
            END 
             AS outcome, 
             events.season_id, home_team_points, away_team_points, league_approved,
             leagues.id AS league_id,
             season_teams.division_id
           FROM events
           JOIN season_teams ON season_teams.id = home_season_team_id
           JOIN leagues ON leagues.id = season_teams.league_id
           WHERE league_id = (SELECT id FROM league_data)
           )
           UNION ALL
           (
           SELECT away_season_team_id AS team_id, 
             CASE 
               WHEN away_team_points > home_team_points THEN 'W' 
               WHEN away_team_points < home_team_points THEN 'L'
               WHEN away_team_points = home_team_points THEN 'T'
               ELSE NULL 
               END 
             AS outcome, 
             events.season_id, home_team_points, away_team_points, league_approved,
             leagues.id AS league_id,
             season_teams.division_id
           FROM events
           JOIN season_teams ON season_teams.id = away_season_team_id
           JOIN leagues ON leagues.id = season_teams.league_id
           WHERE league_id = (SELECT id FROM league_data)
           )
      
        ), records AS (
           SELECT results.season_id, team_id, division_id,
             count(*) AS total_games,
             count(case when outcome = 'W' then 1 else null end) AS wins,
             count(case when outcome = 'L' then 0 else null end) AS losses
           FROM results
           WHERE league_approved = true AND results.season_id = (SELECT season_id FROM league_data)
           GROUP BY results.season_id, team_id, division_id
        )
      
      SELECT
        divisions.*,
        (
           SELECT jsonb_agg(nested_team)
           FROM (
             SELECT
                season_teams.*, 
               total_games, wins, losses,
               RANK() OVER(PARTITION BY season_teams.division_id ORDER BY wins/total_games::float DESC NULLS LAST) AS place
             FROM season_teams
             FULL JOIN records ON records.team_id = season_teams.id
             WHERE season_teams.season_id = divisions.season_id AND season_teams.division_id = divisions.id
           ) AS nested_team
        ) AS teams
        FROM divisions
        WHERE divisions.league_id = (SELECT id FROM league_data) AND divisions.season_id = (SELECT season_id FROM league_data)
        `,
      [leagueName]
    );

    return rows;
  }

  static async updateByLeagueName(leagueName, columns) {
    const sqlQuery = () => {
      var query = [`UPDATE leagues`];
      query.push("SET");

      var set = [];
      Object.keys(columns).forEach((column, index) => {
        set.push(column + " = ($" + (index + 1) + ")");
      });
      query.push(set.join(", "));

      // Add the WHERE statement to look up by id
      query.push(`WHERE league_name = '${leagueName}'`);
      query.push("RETURNING *");

      // Return a complete query string
      return query.join(" ");
    };

    const { rows } = await pool.query(sqlQuery(), Object.values(columns));

    return rows[0];
  }

  static async findPlayoffsById(seasonId) {
    const leagues = await pool.query(`
        SELECT *
        FROM leagues
        `);

    return leagues.rows;
  }
}

export default Leagues;
