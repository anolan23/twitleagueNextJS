import pool  from "../pool";

class Events {
    static async createEvent(event) {
        const {rows} = await pool.query(`
        INSERT INTO events (team_id, type, opponent_id, date, location, notes, is_home_team)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`
        , [event.teamId, event.type, event.opponent, event.eventDate, event.location, event.notes, event.isHomeTeam]);
        
        return rows[0];
    }

    static async findEventsByTeamId(teamId) {
        const {rows} = await pool.query(`
        SELECT events.*, to_char(events.date, 'Mon') AS month, to_char(events.date, 'DD') AS day, to_char(events.date, 'HH12:MIAM') AS time, t1.team_name, t1.abbrev, t1.avatar, t2.team_name AS opponent_team_name, t2.abbrev AS opponent_abbrev, t2.avatar AS opponent_avatar
        FROM events
        LEFT JOIN teams AS t1 ON events.team_id = t1.id
        LEFT JOIN teams AS t2 ON events.opponent_id = t2.id
        WHERE events.team_id = $1 OR events.opponent_id = $1
        ORDER BY date DESC`
        , [teamId]);
        
        return rows;
    }

    static async findOneEventById(eventId) {
        const {rows} = await pool.query(`
        SELECT events.*, leagues.league_name, to_char(events.date, 'Mon') AS month, to_char(events.date, 'DD') AS day, to_char(events.date, 'HH12:MIAM') AS time, t1.team_name, t1.abbrev, t1.avatar, t2.team_name AS opponent_team_name, t2.abbrev AS opponent_abbrev, t2.avatar AS opponent_avatar
        FROM events
        LEFT JOIN teams AS t1 ON events.team_id = t1.id
        LEFT JOIN teams AS t2 ON events.opponent_id = t2.id
        LEFT JOIN leagues ON t1.league_id = leagues.id
        WHERE events.id = $1`
        , [eventId]);
        
        return rows[0];
    }

    static async updateEvent(eventId, values) {
        const {points, opponent_points, play_period} = values;
        const {rows} = await pool.query(`
        WITH updated_event as
        ( 
            UPDATE events
            SET 
                points = $1,
                opponent_points = $2,
                play_period = $3
            WHERE id = $4
            RETURNING *
        )

        SELECT updated_event.*, leagues.league_name, to_char(updated_event.date, 'Mon') AS month, to_char(updated_event.date, 'DD') AS day, to_char(updated_event.date, 'HH12:MIAM') AS time, t1.team_name, t1.abbrev, t1.avatar, t2.team_name AS opponent_team_name, t2.abbrev AS opponent_abbrev, t2.avatar AS opponent_avatar
        FROM updated_event
        LEFT JOIN teams AS t1 ON updated_event.team_id = t1.id
        LEFT JOIN teams AS t2 ON updated_event.opponent_id = t2.id
        LEFT JOIN leagues ON t1.league_id = leagues.id`, [points, opponent_points, play_period, eventId]);
        
        return rows[0];
    }
}

export default Events;