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
    pool.end();

    return rows[0];
  }

  static async search(query, offset, limit, userId) {
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
          SELECT id, created_at, updated_at, name, email, username, dob, avatar, bio
          FROM users
          WHERE (LOWER(username) LIKE $1)
      ) AS nested_user
      ) AS users,
	   (
      SELECT jsonb_agg(nested_post)
      FROM (
        SELECT posts.*, users.name, users.username, users.avatar, 
        (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = posts.id) AS replies,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS likes, 
        EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $4 AND posts.id = likes.post_id ) AS liked
        FROM posts
        JOIN users ON users.id = posts.author_id
        WHERE to_tsvector('simple', body) @@ to_tsquery('simple', $1)
        ORDER BY created_at DESC
        OFFSET $2
        LIMIT $3
      ) AS nested_post
      ) AS posts
        `,
      [`%${query}%`, offset, limit, userId]
    );
    pool.end();

    return rows[0];
  }
}

export default Database;
