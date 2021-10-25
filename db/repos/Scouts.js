import pool from "../pool";

class Scouts {
  static async findAllUsersScouter(userId) {
    const { rows } = await pool.query(
      `
        SELECT *
        FROM followers
        WHERE user_id = $1`,
      [userId]
    );
    pool.end();

    return rows;
  }

  static async scout(scouted_user_id, scout_user_id) {
    const { rows } = await pool.query(
      `
        INSERT INTO scouts (scouted_user_id, scout_user_id)
        VALUES ($1, $2)
        RETURNING *`,
      [scouted_user_id, scout_user_id]
    );
    pool.end();

    return rows[0];
  }

  static async unScout(scouted_user_id, scout_user_id) {
    const { rows } = await pool.query(
      `
        DELETE FROM scouts 
        WHERE scouted_user_id = $1 AND scout_user_id = $2
        RETURNING *`,
      [scouted_user_id, scout_user_id]
    );
    pool.end();

    return rows[0];
  }
}

export default Scouts;
