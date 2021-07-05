import pool from "../pool";

class Playoffs {
  static async create(seasonId) {
    const { rows } = await pool.query(
      `
      INSERT INTO playoffs (season_id)
      VALUES ($1)
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
        ) AS teams
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
