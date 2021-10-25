import pool from "../pool";

class Seasons {
  static async create(leagueId) {
    const { rows } = await pool.query(
      `
        WITH insert AS (
            INSERT INTO seasons (league_id)
            VALUES ($1)
            RETURNING *
        )
        
        UPDATE leagues
        SET season_id = (SELECT id FROM insert)
        WHERE id = $1
        RETURNING *
        `,
      [leagueId]
    );
    pool.end();

    return rows[0];
  }

  static async start(leagueId) {
    const { rows } = await pool.query(
      `
      WITH insert_season AS(
        INSERT INTO seasons (league_id)
        VALUES ($1)
        RETURNING id
      ), update_league AS (
        UPDATE leagues
        SET season_id = (SELECT id FROM insert_season)
        WHERE id = $1
      ), league_teams AS(
        SELECT *
        FROM teams
        WHERE league_id = $1
      )
      
      INSERT INTO season_teams(season_id, team_id, owner_id, league_id, team_name, abbrev, avatar, banner, city, state, bio)
      SELECT (SELECT id FROM insert_season), league_teams.id, owner_id, league_id, team_name, abbrev, avatar, banner, city, state, bio
      FROM league_teams
      RETURNING *`,
      [leagueId]
    );
    pool.end();

    return rows[0];
  }

  static async end(leagueId) {
    const { rows } = await pool.query(
      `
        WITH league AS (
            SELECT season_id
            FROM leagues
            WHERE id = $1
            ),
            league_update AS (
                UPDATE leagues
                SET season_id = NULL
                WHERE id = $1
            )
        
        UPDATE seasons
        SET end_date = CURRENT_TIMESTAMP
        WHERE id = (SELECT season_id FROM league)
        RETURNING *
        `,
      [leagueId]
    );
    pool.end();

    return rows[0];
  }

  // static async create(leagueId) {
  //     let season;
  //     await (async () => {
  //         const client = await pool.connect()
  //         try {
  //             await client.query('BEGIN')
  //             season = await client.query(
  //               `INSERT INTO seasons (league_id)
  //               VALUES ($1)
  //               RETURNING *`, [leagueId]
  //             )

  //             const league = await client.query(
  //                 `UPDATE leagues
  //                 SET season_id = $1
  //                 WHERE id = $2
  //                 RETURNING *`, [season.rows[0].id, leagueId]
  //               )

  //           await client.query('COMMIT')

  //         } catch (e) {
  //           await client.query('ROLLBACK')
  //           throw e
  //         } finally {
  //           await client.release()
  //         }

  //       })().catch(e => console.error(e.stack))
  //       return season.rows[0]
  // }

  static async findOne(seasonId) {
    const { rows } = await pool.query(
      `
        SELECT *
        FROM seasons
        WHERE id = $1`,
      [seasonId]
    );
    pool.end();

    return rows[0];
  }

  static async find() {
    const { rows } = await pool.query(`
        SELECT *
        FROM seasons
        `);
    pool.end();

    return rows;
  }

  static async findByLeagueName(leagueName) {
    const { rows } = await pool.query(
      `
        SELECT seasons.*
        FROM seasons
        JOIN leagues ON leagues.id = seasons.league_id
        WHERE leagues.league_name = $1
        ORDER BY created_at DESC`,
      [leagueName]
    );
    pool.end();

    return rows;
  }

  static async findById(seasonId) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM seasons
      JOIN leagues ON leagues.id = seasons.league_id
      WHERE seasons.id = $1`,
      [seasonId]
    );
    pool.end();

    return rows[0];
  }

  static async addPlayoffSeed(seasonId, seed) {
    const { rows } = await pool.query(
      `
        INSERT INTO playoff_teams (season_id, seed)
        VALUES
        ($1, $2)
        RETURNING *`,
      [seasonId, seed]
    );
    pool.end();

    return rows[0];
  }

  static async deletePlayoffSeed(seasonId, seed) {
    const { rows } = await pool.query(
      `
        DELETE FROM playoff_teams
        WHERE season_id = $1 AND seed = $2
        RETURNING *`,
      [seasonId, seed]
    );
    pool.end();

    return rows[0];
  }

  static async assignToPlayoffSeed(teamId, seasonId, seed) {
    const { rows } = await pool.query(
      `
        UPDATE playoff_teams
        SET team_id = $1
        WHERE season_id = $2 AND seed = $3
        RETURNING *`,
      [teamId, seasonId, seed]
    );
    pool.end();

    return rows[0];
  }

  static async findPlayoffsById(seasonId) {
    const { rows } = await pool.query(
      `
      SELECT *,
      (
      SELECT row_to_json(league) AS league
        FROM (
        SELECT *,
        (
        SELECT jsonb_agg(nested_team)
        FROM (
          SELECT *
          FROM teams
          WHERE league_id = leagues.id
        ) AS nested_team
        ) AS teams
        FROM leagues 
        WHERE id = seasons.league_id
        ) AS league
      ),
      (
      SELECT jsonb_agg(nested_team)
        FROM (
        SELECT playoff_teams.seed, teams.*
        FROM playoff_teams
        FULL JOIN teams ON teams.id = playoff_teams.team_id
        WHERE season_id = seasons.id
        ORDER BY seed 
        ) AS nested_team
      ) AS playoff_teams
      FROM seasons
      WHERE id = $1
      `,
      [seasonId]
    );
    pool.end();

    return rows[0];
  }
}

export default Seasons;
