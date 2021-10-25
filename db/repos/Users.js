import pool from "../pool";

class Users {
  static async create(user) {
    const { name, email, username, password } = user;
    const { rows } = await pool.query(
      `
            INSERT INTO users (name, email, username, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id, created_at, updated_at, name, email, username, dob, avatar, bio;
        `,
      [name, email, username, password]
    );
    pool.end();
    return rows[0];
  }

  static async find() {
    const { rows } = await pool.query(
      `SELECT id, created_at, updated_at, name, email, username, dob, avatar, bio 
      FROM users`
    );
    pool.end();
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
    pool.end();
    return rows[0];
  }

  static async update(userId, values) {
    const { rows } = await pool.query(
      `
        UPDATE users
        SET avatar = $2
        WHERE id = $1
        RETURNING id, created_at, updated_at, name, email, username, dob, avatar, bio`,
      [userId, values.avatar]
    );
    pool.end();
    return rows[0];
  }

  static async findAllLike(query, offset, limit) {
    const { rows } = await pool.query(
      `
        SELECT id, created_at, updated_at, name, email, username, dob, avatar, bio
        FROM users
        WHERE (LOWER(username) LIKE $1) OR (LOWER(name) LIKE $1)
        ORDER BY username
        OFFSET $2
        LIMIT $3;`,
      [`%${query}%`, offset, limit]
    );
    pool.end();
    return rows;
  }

  static async findSuggested(userId, offset, limit) {
    const results = await pool.query(
      `
        SELECT id, created_at, updated_at, name, email, username, dob, avatar, bio,
        EXISTS (SELECT 1 FROM scouts WHERE scout_user_id = $1 AND users.id = scouted_user_id) AS scouted
        FROM users
        ORDER BY avatar, RANDOM()
        OFFSET $2
        LIMIT $3
        `,
      [userId, offset, limit]
    );
    pool.end();
    return results.rows;
  }

  static async findUserScoutings(username, userId, offset, limit) {
    const results = await pool.query(
      `
      SELECT u1.id, u1.created_at, u1.updated_at, u1.name, u1.email, u1.username, u1.dob, u1.avatar, u1.bio,
        EXISTS (
          SELECT 1 
          FROM scouts 
          WHERE scouted_user_id = u1.id AND scout_user_id = $2
        ) AS scouted
      FROM scouts
      JOIN users AS u1 ON u1.id = scouts.scouted_user_id
      JOIN users AS u2 ON u2.id = scouts.scout_user_id
      WHERE u2.username = $1
      OFFSET $3
      LIMIT $4`,
      [username, userId, offset, limit]
    );
    pool.end();
    return results.rows;
  }

  static async findUserScouts(username, userId, offset, limit) {
    const results = await pool.query(
      `
      SELECT u1.id, u1.created_at, u1.updated_at, u1.name, u1.email, u1.username, u1.dob, u1.avatar, u1.bio,,
        EXISTS (
          SELECT 1 
          FROM scouts 
          WHERE scouted_user_id = u1.id AND scout_user_id = $2
        ) AS scouted
      FROM scouts
      JOIN users AS u1 ON u1.id = scout_user_id
      JOIN users AS u2 ON u2.id = scouted_user_id
      WHERE u2.username = $1
      OFFSET $3
      LIMIT $4`,
      [username, userId, offset, limit]
    );
    pool.end();
    return results.rows;
  }

  static async findUserFollowings(username, userId, offset, limit) {
    const results = await pool.query(
      `
      SELECT teams.*,
        EXISTS (
          SELECT 1 
          FROM followers 
          WHERE team_id = teams.id AND user_id = $2
        ) AS followed
      FROM followers
      JOIN teams ON teams.id = followers.team_id
      JOIN users ON users.id = followers.user_id
      WHERE users.username = $1
      OFFSET $3
      LIMIT $4`,
      [username, userId, offset, limit]
    );
    pool.end();
    return results.rows;
  }
}

export default Users;
