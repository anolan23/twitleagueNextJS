import pool from "../pool";

class Scouts {
  static async findAllUsersScouter(userId) {
    const client = await pool.connect();

    const { rows } = await client.query(
      `
        SELECT *
        FROM followers
        WHERE user_id = $1`,
      [userId]
    );
    client.release();

    return rows;
  }

  static async scout(scouted_user_id, scout_user_id) {
    const client = await pool.connect();

    const { rows } = await client.query(
      `
        INSERT INTO scouts (scouted_user_id, scout_user_id)
        VALUES ($1, $2)
        RETURNING *`,
      [scouted_user_id, scout_user_id]
    );
    client.release();

    return rows[0];
  }

  static async unScout(scouted_user_id, scout_user_id) {
    const client = await pool.connect();

    const { rows } = await client.query(
      `
        DELETE FROM scouts 
        WHERE scouted_user_id = $1 AND scout_user_id = $2
        RETURNING *`,
      [scouted_user_id, scout_user_id]
    );
    client.release();

    return rows[0];
  }
}

export default Scouts;
