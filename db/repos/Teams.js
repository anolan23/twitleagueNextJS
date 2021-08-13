import pool from "../pool";

class Teams {
  static async create(userId, team) {
    const { teamName, abbrev, city, state, leagueName } = team;
    const results = await pool.query(
      `
        WITH created_team AS (
            INSERT INTO teams (owner_id, team_name, abbrev, city, state)
            VALUES
            ($1, $2, $3, $4, $5)
            RETURNING id
            ), league_data AS (
                SELECT id, owner_id
                FROM leagues
                WHERE league_name = $6
            )
            
        INSERT INTO notifications (user_id, type, team_id, league_id)
        VALUES 
        ((SELECT owner_id FROM league_data), 'Join League Request', (SELECT id FROM created_team), (SELECT id FROM league_data))`,
      [userId, teamName, abbrev, city, state, leagueName]
    );

    return results.rows[0];
  }

  static async findOne(abbrev, userId) {
    const team = await pool.query(
      `
      SELECT teams.*,
      (
        SELECT row_to_json(league) AS league
        FROM (
        SELECT *,
        (
          SELECT jsonb_agg(nested_team)
          FROM (
			  SELECT *
			  FROM teams
			  WHERE teams.league_id = leagues.id
          ) AS nested_team
        ) AS teams,
		(
          SELECT jsonb_agg(nested_seasons_team)
          FROM (
			  SELECT *
			  FROM season_teams
			  WHERE season_id = leagues.season_id
          ) AS nested_seasons_team
        ) AS current_season_teams
        FROM leagues
        WHERE id = teams.league_id
        ) AS league
      ),
      (
        SELECT row_to_json(division) AS division
        FROM (
        SELECT *
        FROM divisions
        WHERE id = teams.division_id
        ) AS division
      ), 
      (
        SELECT row_to_json(current_season) AS current_season
        FROM (
        SELECT *
        FROM seasons
        WHERE id = leagues.season_id
        ) AS current_season
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
        SELECT jsonb_agg(nested_player)
        FROM (
        SELECT users.*
        FROM rosters
        JOIN users ON users.id = user_id
        WHERE team_id = teams.id
        ) AS nested_player
      ) AS roster,
      (SELECT COUNT(*) AS num_posts FROM team_mentions WHERE team_id = teams.id),
      (SELECT count(*) AS followers FROM followers WHERE team_id = teams.id),
      (SELECT count(*) AS players FROM rosters WHERE team_id = teams.id),
      EXISTS (SELECT 1 FROM followers WHERE followers.user_id = $2 AND teams.id = followers.team_id ) AS following
      FROM teams
      LEFT JOIN leagues ON teams.league_id = leagues.id
      LEFT JOIN divisions ON teams.division_id = divisions.id
      WHERE abbrev = $1`,
      [abbrev, userId]
    );

    return team.rows[0];
  }

  static async findByOwnerId(ownerId) {
    const teams = await pool.query(
      `
        SELECT teams.abbrev, teams.team_name, teams.avatar, teams.city, leagues.league_name
        FROM teams
        FULL JOIN leagues ON teams.league_id = leagues.id
        WHERE teams.owner_id = $1`,
      [ownerId]
    );

    return teams.rows;
  }

  static async findByUsername(username) {
    const teams = await pool.query(
      `
        SELECT teams.*, leagues.league_name
        FROM teams
        JOIN users ON users.id = teams.owner_id
        FULL JOIN leagues ON leagues.id = teams.league_id
        WHERE users.username = $1
        ORDER BY team_name
        `,
      [username]
    );

    return teams.rows;
  }

  static async findByLeagueId(leagueId) {
    const teams = await pool.query(
      `
        SELECT *
        FROM teams
        WHERE teams.league_id = $1`,
      [leagueId]
    );

    return teams.rows;
  }

  static async findByLeagueName(leagueName) {
    const teams = await pool.query(
      `
        SELECT teams.*
        FROM teams
        JOIN leagues ON leagues.id = teams.league_id
        WHERE leagues.league_name = $1`,
      [leagueName]
    );

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
    const teams = await pool.query(
      `
        SELECT teams.id, teams.avatar, team_name, abbrev, league_name,
        EXISTS (SELECT 1 FROM followers WHERE followers.user_id = $1 AND teams.id = followers.team_id ) AS following
        FROM teams
        JOIN leagues ON leagues.id = teams.league_id
        WHERE teams.avatar IS NOT NULL
        ORDER BY RANDOM()
        LIMIT $2
        `,
      [userId, num]
    );

    return teams.rows;
  }

  static async findTrending() {
    const teams = await pool.query(`
        SELECT teams.*, count
            FROM (
                SELECT team_id, count(*)
                FROM team_mentions
                JOIN posts ON posts.id = post_id
                WHERE posts.created_at > current_timestamp - interval '20 day'
                GROUP BY team_id
                ORDER BY count DESC
                LIMIT 3
                ) AS popular_teams
            JOIN teams ON teams.id = popular_teams.team_id;
        `);

    return teams.rows;
  }

  static async joinLeague(leagueId, teamId) {
    const team = await pool.query(
      `
        UPDATE teams
        SET league_id = $1
        WHERE id = $2`,
      [leagueId, teamId]
    );

    return team.rows;
  }

  static async update(teamId, values) {
    if (values.avatar || values.banner || values.bio) {
      const { rows } = await pool.query(
        `
            UPDATE teams
            SET avatar = $2,
            banner = $3,
            bio = $4
            WHERE id = $1
            RETURNING *`,
        [teamId, values.avatar, values.banner, values.bio]
      );

      return rows[0];
    } else if (values.divisionId || values.divisionId === null) {
      const { rows } = await pool.query(
        `
            UPDATE teams
            SET division_id = $2
            WHERE id = $1
            RETURNING *`,
        [teamId, values.divisionId]
      );

      return rows[0];
    }
  }

  static async findEventsByTeamId(teamId) {
    const { rows } = await pool.query(
      `
        SELECT events.*, to_char(events.date, 'Mon') AS month, to_char(events.date, 'DD') AS day, to_char(events.date, 'HH12:MIAM') AS time, t1.team_name, t1.abbrev, t1.avatar, t2.team_name AS opponent_team_name, t2.abbrev AS opponent_abbrev, t2.avatar AS opponent_avatar
        FROM events
        LEFT JOIN teams AS t1 ON events.team_id = t1.id
        LEFT JOIN teams AS t2 ON events.opponent_id = t2.id
        WHERE events.team_id = $1 OR events.opponent_id = $1`,
      [teamId]
    );

    return rows;
  }

  static async findAllLike(query, offset, limit) {
    const { rows } = await pool.query(
      `
        SELECT teams.*, leagues.league_name
        FROM teams
        FULL JOIN leagues ON leagues.id = teams.league_id
        WHERE (LOWER(teams.abbrev) LIKE $1) OR (LOWER(teams.team_name) LIKE $1)
        ORDER BY team_name
        OFFSET $2
        LIMIT $3;`,
      [`%${query}%`, offset, limit]
    );

    return rows;
  }
}

export default Teams;
