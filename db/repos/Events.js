import pool  from "../pool";
import Database from "./Database";

class Events {
    static async createEvent(event) {
        const {teamId, type, opponent, eventDate, location, notes, isHomeTeam, seasonId} = event;
        const {rows} = await pool.query(`
        INSERT INTO events (team_id, type, opponent_id, date, location, notes, is_home_team, season_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`
        , [teamId, type, opponent, eventDate, location, notes, isHomeTeam, seasonId]);
        
        return rows[0];
    }

    static async find() {
        const {rows} = await pool.query(`
        SELECT *
        FROM events`, []);
        
        return rows;
    }

    static async findEventsByTeamId(teamId) {
        const {rows} = await pool.query(`
        SELECT events.*, to_char(events.date, 'Mon') AS month, to_char(events.date, 'DD') AS day, 
        to_char(events.date, 'HH12:MIAM') AS time, t1.team_name, t1.abbrev, t1.avatar, t1.owner_id AS team_owner_id, 
        t2.team_name AS opponent_team_name, t2.abbrev AS opponent_abbrev, t2.avatar AS opponent_avatar, 
        t2.owner_id AS opponent_owner_id,
        (SELECT COUNT(*) FROM posts WHERE event_conversation_id = events.id) AS replies,
        EXISTS (SELECT 1 FROM event_likes WHERE event_likes.user_id = $2 AND events.id = event_likes.event_id ) AS liked,
        (SELECT COUNT(*) FROM event_likes WHERE event_id = events.id) AS likes
        FROM events
        LEFT JOIN teams AS t1 ON events.team_id = t1.id
        LEFT JOIN teams AS t2 ON events.opponent_id = t2.id
        WHERE events.team_id = $1 OR events.opponent_id = $1
        ORDER BY date DESC`
        , [teamId]);
        
        return rows;
    }

    static async findEventsByTeamAbbrev(teamAbbrev, userId) {
        const {rows} = await pool.query(`
        SELECT events.*, 
            to_char(events.date, 'HH12:MIAM') AS time, 
            t1.team_name, t1.abbrev, t1.avatar, t1.owner_id AS team_owner_id, 
            t2.team_name AS opponent_team_name, t2.abbrev AS opponent_abbrev, t2.avatar AS opponent_avatar, 
            t2.owner_id AS opponent_owner_id,
            (SELECT COUNT(*) FROM posts WHERE event_conversation_id = events.id) AS replies,
            EXISTS (SELECT 1 FROM event_likes WHERE event_likes.user_id = $2 AND events.id = event_likes.event_id ) AS liked,
            (SELECT COUNT(*) FROM event_likes WHERE event_id = events.id) AS likes
        FROM events
        LEFT JOIN teams AS t1 ON events.team_id = t1.id
        LEFT JOIN teams AS t2 ON events.opponent_id = t2.id
        WHERE t1.abbrev = $1 OR t2.abbrev = $1
        ORDER BY date DESC`
        , [teamAbbrev, userId]);
        
        return rows;
    }

    static async findOneEventById(eventId, userId) {
        const {rows} = await pool.query(`
        SELECT events.*, leagues.league_name, leagues.owner_id,
            to_char(events.date, 'HH12:MIAM') AS time, 
            t1.team_name, t1.abbrev, t1.avatar, t1.owner_id AS team_owner_id,
            t2.team_name AS opponent_team_name, t2.abbrev AS opponent_abbrev, t2.avatar AS opponent_avatar, 
            t2.owner_id AS opponent_owner_id,
            EXISTS (SELECT 1 FROM event_likes WHERE event_likes.user_id = $2 AND events.id = event_likes.event_id ) AS liked,
            (SELECT COUNT(*) FROM event_likes WHERE event_id = events.id) AS likes
        FROM events
        LEFT JOIN teams AS t1 ON events.team_id = t1.id
        LEFT JOIN teams AS t2 ON events.opponent_id = t2.id
        LEFT JOIN leagues ON t1.league_id = leagues.id
        WHERE events.id = $1`
        , [eventId, userId]);
        
        return rows[0];
    }

    

    static async updateEvent(eventId, values) {
        const {rows} = await pool.query(`
        WITH updated_event as
        ( 
            ${Database.updateById(eventId, "events", values)}
        )

        SELECT updated_event.*, leagues.owner_id, leagues.league_name, to_char(updated_event.date, 'Mon') AS month, 
        to_char(updated_event.date, 'DD') AS day, to_char(updated_event.date, 'HH12:MIAM') AS time, 
        t1.team_name, t1.abbrev, t1.avatar, t1.owner_id AS team_owner_id,
        t2.team_name AS opponent_team_name, t2.abbrev AS opponent_abbrev, t2.avatar AS opponent_avatar, 
        t2.owner_id AS opponent_owner_id
        FROM updated_event
        LEFT JOIN teams AS t1 ON updated_event.team_id = t1.id
        LEFT JOIN teams AS t2 ON updated_event.opponent_id = t2.id
        LEFT JOIN leagues ON t1.league_id = leagues.id`, Object.values(values));
        
        return rows[0];
    }

    static async like(eventId, userId) {
        const {rows} = await pool.query(`
        INSERT INTO event_likes (event_id, user_id)
        VALUES ($1, $2)
        RETURNING *`, [eventId, userId]);
        return rows;
    }

    static async unLike(eventId, userId) {
      const {rows} = await pool.query(`
      DELETE FROM event_likes
      WHERE event_id = $1 AND user_id = $2
      RETURNING *`, [eventId, userId]);
      return rows;
  }

  static async findUsersWhoLiked(eventId) {
    const {rows} = await pool.query(`
    SELECT event_likes.*, users.name, users.username, users.avatar
    FROM event_likes
    JOIN users ON users.id = user_id
    WHERE event_id = $1
    `, [eventId]);
    
    return rows;
}
}

export default Events;