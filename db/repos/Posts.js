import pool from "../pool";

class Posts {
    static async create(post, abbrevs) {
        let results;
        await (async () => {
            // note: we don't try/catch this because if connecting throws an exception
            // we don't need to dispose of the client (it will be undefined)
            const client = await pool.connect()
            try {
                await client.query('BEGIN')
                results = await client.query(
                  `INSERT INTO posts (author_id, body, gif, outlook)
                  VALUES
                  ($1, $2, $3, $4)
                  RETURNING *`, [post.userId, post.body, post.gif, post.outlook]
                )

                await client.query(
                    `UPDATE posts
                    SET conversation_id = $1
                    WHERE id = $1
                    `, [results.rows[0].id]
                )
    
              if(abbrevs){
                  abbrevs.forEach(async abbrev => {
                      const team = await client.query(
                          `SELECT id
                          FROM teams
                          WHERE abbrev = $1`, [abbrev]
                      )
                      const insertTeamMention = await client.query(
                          `INSERT INTO team_mentions (team_id, post_id)
                          VALUES ($1, $2)`, [team.rows[0].id, results.rows[0].id]
                      )
                  });
              }
              await client.query('COMMIT')
              
            } catch (e) {
              await client.query('ROLLBACK')
              throw e
            } finally {
              client.release()
            }

          })().catch(e => console.error(e.stack))
          return results.rows[0]
    }

    static async findByTeamId(teamId) {
        const {rows} = await pool.query(`
        SELECT posts.id, posts.created_at, conversation_id, in_reply_to_post_id, author_id, users.name, users.username, body, gif, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS likes 
        FROM team_mentions
        JOIN posts ON team_mentions.post_id = posts.id
        JOIN users ON posts.author_id = users.id
        WHERE team_id = $1`, [teamId]);
        return rows;
    }

    static async findByLeagueId(leagueId) {
        const {rows} = await pool.query(`
        SELECT posts.id, posts.created_at, conversation_id, in_reply_to_post_id, author_id, users.name, users.username, body, gif, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS likes
        FROM posts
        JOIN (
        SELECT DISTINCT post_id
        FROM team_mentions
        WHERE team_id IN (
            SELECT id 
            FROM teams
            WHERE league_id = $1
        )
        ) AS p1 ON p1.post_id = posts.id
        JOIN users ON posts.author_id = users.id`, [leagueId]);
        return rows;
    }

    static async findByConversationId(conversation_id) {
        const {rows} = await pool.query(`
        SELECT posts.id, posts.created_at, conversation_id, in_reply_to_post_id, author_id, users.name, users.username, body, gif, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS likes
        FROM posts
        JOIN users ON posts.author_id = users.id
        WHERE conversation_id = $1
        ORDER BY created_at`, [conversation_id]);
        return rows;
    }

    static async reply(reply, abbrevs) {
        let results;
        const {userId, body, gif, outlook, conversation_id, in_reply_to_post_id} = reply;
        await (async () => {
            const client = await pool.connect()
            try {
                await client.query('BEGIN')
                results = await client.query(
                  `INSERT INTO posts (author_id, body, gif, outlook, conversation_id, in_reply_to_post_id)
                  VALUES
                  ($1, $2, $3, $4, $5, $6)
                  RETURNING *`, [userId, body, gif, outlook, conversation_id, in_reply_to_post_id]
              )

              if(abbrevs){
                  abbrevs.forEach(async abbrev => {
                      const team = await client.query(
                          `SELECT id
                          FROM teams
                          WHERE abbrev = $1`, [abbrev]
                      )
                      const insertTeamMention = await client.query(
                          `INSERT INTO team_mentions (team_id, post_id)
                          VALUES ($1, $2)`, [team.rows[0].id, results.rows[0].id]
                      )
                  });
              }
              await client.query('COMMIT')
              
            } catch (e) {
              await client.query('ROLLBACK')
              throw e
            } finally {
              client.release()
            }

          })().catch(e => console.error(e.stack))
          return results.rows[0]
    }

    static async like(post_id, user_id) {
        const {rows} = await pool.query(`
        INSERT INTO likes (post_id, user_id)
        VALUES ($1, $2)
        RETURNING id`, [post_id, user_id]);
        return rows;
    }


}

export default Posts;