import pool from "../pool";

class Notifications {
    
    static async findByUserId(userId) {
        const notifications = await pool.query(`
        SELECT *
        FROM notifications
        WHERE user_id = $1`, [userId]);
        return notifications.rows;
    }
}

export default Notifications;