import pool from "../pool";

class Rosters {
  static async create(teamId, userId) {
    const { rows } = await pool.query(
      `
        INSERT INTO rosters (team_id, user_id)
        VALUES ($1, $2)
        RETURNING *`,
      [teamId, userId]
    );
    pool.end();

    return rows[0];
  }

  static async find(teamId) {
    const { rows } = await pool.query(
      `
        SELECT rosters.*, users.name, users.username, users.avatar
        FROM rosters
        JOIN teams ON teams.id = team_id
        JOIN users ON users.id = user_id
        WHERE team_id = $1`,
      [teamId]
    );
    pool.end();

    return rows;
  }

  static async findByAbbrev(abbrev) {
    const { rows } = await pool.query(
      `
        SELECT rosters.*, users.name, users.username, users.avatar
        FROM rosters
        JOIN teams ON teams.id = team_id
        JOIN users ON users.id = user_id
        WHERE abbrev = $1`,
      [`$${abbrev}`]
    );
    pool.end();

    return rows;
  }
}

export default Rosters;
