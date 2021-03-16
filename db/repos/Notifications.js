import pool from "../pool";

class Notifications {
    
    static async findByUserId(userId) {
        const notifications = await pool.query(`
        SELECT notifications.*, username, t.team_name, t.abbrev, t.avatar AS team_avatar, l1.league_name, 
        t2.team_name, t2.abbrev, t2.avatar, t3.team_name AS opponent_team_name, t3.abbrev AS opponent_abbrev, 
        t3.avatar AS opponent_avatar, events.points, events.opponent_points, events.play_period, events.is_home_team, 
        l2.league_name AS events_league_name
        FROM notifications
        LEFT JOIN users ON users.id = notifications.user_id
        LEFT JOIN leagues AS l1 ON l1.id = notifications.league_id 
        LEFT JOIN events ON events.id = notifications.event_id
        LEFT JOIN teams AS t ON t.id = notifications.team_id
        LEFT JOIN teams AS t2 ON t2.id = events.team_id
        LEFT JOIN teams AS t3 ON t3.id = events.opponent_id
        LEFT JOIN leagues AS l2 ON l2.id = t2.league_id
        WHERE notifications.user_id = $1
        ORDER BY notifications.created_at DESC`, [userId]);
        
        return notifications.rows;
    }

    static async sendJoinTeamInvite(joinTeamInvite) {
        const {userId, type, teamId} = joinTeamInvite;
        const notification = await pool.query(`
        INSERT INTO notifications (user_id, type, team_id)
        VALUES ($1, $2, $3)
        RETURNING *`, [userId, type, teamId]);
        
        return notification.rows[0];
    }

    static async sendAwaitingEventApproval(notification) {
        const {userId, type, eventId} = notification;
        const createdNotification = await pool.query(`
        INSERT INTO notifications (user_id, type, event_id)
        VALUES ($1, $2, $3)
        RETURNING *`, [userId, type, eventId]);
        
        return createdNotification.rows[0];
    }

    static async delete(notificationId) {
        const notifications = await pool.query(`
        DELETE FROM notifications
        WHERE id = $1`, [notificationId]);
        
        return notifications.rows;
    }
}

export default Notifications;