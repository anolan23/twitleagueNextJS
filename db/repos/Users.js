import pool from "../pool";

class Users {

    static async create(user) {
        const {name,email,username,password} = user;
        // await pool.connect();
        const {rows} = await pool.query(`
            INSERT INTO users (name, email, username, password)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [name,email,username,password]);
        // 
        return rows[0];
    }

    static async find() {
        const {rows} = await pool.query('SELECT * FROM users');
        
        return rows;
    }

    static async findOne(username) {
        const {rows} = await pool.query(`
            SELECT * 
            FROM users
            WHERE username = $1`, [username]);
        
        return rows[0];
    }

    static async update(userId, values) {
        const {rows} = await pool.query(`
        UPDATE users
        SET avatar = $2
        WHERE id = $1
        RETURNING *`, [userId, values.avatar]);
        
        return rows[0];
    }

    static async search(search) {
        const {rows} = await pool.query(`
        SELECT *
        FROM users
        WHERE (LOWER(username) LIKE $1)
        LIMIT 10;`, [`%${search}%`]);
        
        return rows;
    }

    static async findSuggested(num) {
        const teams = await pool.query(`
        SELECT *
        FROM users
        ORDER BY avatar, RANDOM()
        LIMIT $1
        `, [num]);
        
        return teams.rows;
    }

}

export default Users;