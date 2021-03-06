import pool from "../pool";

class Notifications {
  static async findByUserId(userId) {
    const notifications = await pool.query(
      `
      SELECT notifications.*, u1.username, t.team_name, t.abbrev, t.avatar AS team_avatar, l1.league_name, 
        t2.team_name, t2.abbrev AS team_abbrev, t2.avatar, t3.team_name AS opponent_team_name, t3.abbrev AS opponent_abbrev, 
        t3.avatar AS opponent_avatar, events.points, events.opponent_points, events.play_period, events.is_home_team, 
        l2.league_name AS events_league_name,
        u2.username AS sender_username
      FROM notifications
      LEFT JOIN users AS u1 ON u1.id = notifications.user_id
      LEFT JOIN users AS u2 ON u2.id = notifications.sender_id
      LEFT JOIN leagues AS l1 ON l1.id = notifications.league_id 
      LEFT JOIN events ON events.id = notifications.event_id
      LEFT JOIN teams AS t ON t.id = notifications.team_id
      LEFT JOIN teams AS t2 ON t2.id = events.team_id
      LEFT JOIN teams AS t3 ON t3.id = events.opponent_id
      LEFT JOIN leagues AS l2 ON l2.id = t2.league_id
      WHERE notifications.user_id = $1
      ORDER BY notifications.created_at DESC`,
      [userId]
    );

    return notifications.rows;
  }

  static async sendJoinTeamRequest(notification) {
    const { userId, type, payload } = notification;
    const results = await pool.query(
      `
        INSERT INTO notifications (user_id, type, team_id)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [userId, type, payload.teamId]
    );

    return results.rows[0];
  }

  static async sendUserRequestsJoinTeam(notification) {
    const { userId, type, payload } = notification;
    const results = await pool.query(
      `
        INSERT INTO notifications (user_id, type, team_id, sender_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
      [userId, type, payload.teamId, payload.senderId]
    );

    return results.rows[0];
  }

  static async sendAwaitingEventApproval(notification) {
    const { userId, type, payload } = notification;
    const results = await pool.query(
      `
        INSERT INTO notifications (user_id, type, event_id)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [userId, type, payload.eventId]
    );

    return results.rows[0];
  }

  static async delete(notificationId) {
    const notifications = await pool.query(
      `
        DELETE FROM notifications
        WHERE id = $1`,
      [notificationId]
    );

    return notifications.rows;
  }
}

export default Notifications;
