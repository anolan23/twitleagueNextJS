import pool from "../pool";

class Playoffs {
  static async create(seasonId, playoffs) {
    const { bracket, seeds, in_progress } = playoffs;
    const { rows } = await pool.query(
      `
      INSERT INTO playoffs (season_id, bracket, seeds, in_progress)
      VALUES ($1, $2, $3, $4)
      RETURNING *
        `,
      [seasonId, bracket, seeds, in_progress]
    );

    return rows[0];
  }

  static async delete(seasonId) {
    const { rows } = await pool.query(
      `
      DELETE FROM  playoffs
      WHERE season_id = $1
      RETURNING *
        `,
      [seasonId]
    );

    return rows[0];
  }

  static async find() {
    const { rows } = await pool.query(
      `
        SELECT *
        FROM playoffs
        `,
      []
    );

    return rows;
  }

  static async findOne(seasonId) {
    const { rows } = await pool.query(
      `
      SELECT 
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
        ) AS teams,
		    (
        SELECT jsonb_agg(nested_season)
        FROM (
          SELECT *
          FROM seasons
          WHERE league_id = leagues.id
        ) AS nested_season
        ) AS seasons
        FROM leagues 
        WHERE id = seasons.league_id
        ) AS league
        ),
        playoffs.*
      FROM playoffs
      JOIN seasons ON seasons.id = playoffs.season_id
      WHERE playoffs.season_id = $1
        `,
      [seasonId]
    );

    return rows[0];
  }

  static async update(seasonId, columns) {
    const sqlQuery = () => {
      var query = [`UPDATE playoffs`];
      query.push("SET");
      var set = [];
      Object.keys(columns).forEach((column, index) => {
        set.push(column + " = ($" + (index + 1) + ")");
      });
      query.push(set.join(", "));
      query.push("WHERE season_id = " + seasonId);
      query.push("RETURNING *");

      return query.join(" ");
    };

    const { rows } = await pool.query(sqlQuery(), Object.values(columns));

    return rows[0];
  }
}

export default Playoffs;
