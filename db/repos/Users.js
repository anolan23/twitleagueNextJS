import pool from "../pool";

class Users {
  static async create(user) {
    const { name, email, username, password } = user;
    // await pool.connect();
    const { rows } = await pool.query(
      `
            INSERT INTO users (name, email, username, password)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `,
      [name, email, username, password]
    );
    //
    return rows[0];
  }

  static async find() {
    const { rows } = await pool.query("SELECT * FROM users");

    return rows;
  }

  static async findOne(username, userId) {
    const { rows } = await pool.query(
      `
        SELECT *,
            (SELECT count(*) FROM scouts WHERE scouted_user_id = users.id) AS scouts,
            (SELECT count(*) FROM scouts WHERE scout_user_id = users.id) AS scouting,
            (SELECT count(*) FROM followers WHERE user_id = users.id) AS following,
            (SELECT count(*) FROM notifications WHERE user_id = users.id) AS notification_count,
        EXISTS (SELECT 1 FROM scouts WHERE scout_user_id = $2 AND users.id = scouted_user_id) AS scouted
        FROM users
        WHERE username = $1`,
      [username, userId]
    );

    return rows[0];
  }

  static async update(userId, values) {
    const { rows } = await pool.query(
      `
        UPDATE users
        SET avatar = $2
        WHERE id = $1
        RETURNING *`,
      [userId, values.avatar]
    );

    return rows[0];
  }

  static async findLike(username) {
    const { rows } = await pool.query(
      `
        SELECT *
        FROM users
        WHERE (LOWER(username) LIKE $1) OR (LOWER(name) LIKE $1)
        ORDER BY username
        LIMIT 10;`,
      [`%${username}%`]
    );

    return rows;
  }

  static async findSuggested(userId, num) {
    const teams = await pool.query(
      `
        SELECT *,
        EXISTS (SELECT 1 FROM scouts WHERE scout_user_id = $1 AND users.id = scouted_user_id) AS scouted
        FROM users
        ORDER BY avatar, RANDOM()
        LIMIT $2
        `,
      [userId, num]
    );

    return teams.rows;
  }
}

export default Users;
