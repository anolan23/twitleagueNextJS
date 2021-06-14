import pool from "../pool";

class Database {
  static async updateById(id, table, columns) {
    const sqlQuery = () => {
      var query = [`UPDATE ${table}`];
      query.push("SET");

      var set = [];
      Object.keys(columns).forEach((column, index) => {
        set.push(column + " = ($" + (index + 1) + ")");
      });
      query.push(set.join(", "));

      // Add the WHERE statement to look up by id
      query.push("WHERE id = " + id);
      query.push("RETURNING *");

      // Return a complete query string
      return query.join(" ");
    };

    const { rows } = await pool.query(sqlQuery(), Object.values(columns));

    return rows[0];
  }

  static async searchAllLike(query) {
    const { rows } = await pool.query(
      `
      SELECT 
      (
      SELECT jsonb_agg(nested_league)
      FROM (
          SELECT *
          FROM leagues
          WHERE (LOWER(league_name) LIKE $1)
      ) AS nested_league
      ) AS leagues,
      (
      SELECT jsonb_agg(nested_team)
      FROM (
          SELECT *
          FROM teams
          WHERE (LOWER(team_name) LIKE $1)
      ) AS nested_team
      ) AS teams,
      (
      SELECT jsonb_agg(nested_user)
      FROM (
          SELECT *
          FROM users
          WHERE (LOWER(username) LIKE $1)
      ) AS nested_user
      ) AS users
        `,
      [`%${query}%`]
    );

    return rows[0];
  }
}

export default Database;
