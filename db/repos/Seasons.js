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

  static async find() {
    const { rows } = await pool.query(`
        SELECT *
        FROM seasons
        `);

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

    return rows[0];
  }
}

export default Seasons;
