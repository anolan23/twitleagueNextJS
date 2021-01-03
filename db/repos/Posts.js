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

    static async findByUserId(userId, num, offset) {
      const {rows} = await pool.query(`
      SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, gif, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies
      FROM posts AS p1
      JOIN users ON p1.author_id = users.id
      WHERE author_id = $1 AND p1.id = p1.conversation_id
      ORDER BY created_at DESC
      LIMIT $2
      OFFSET $3`, [userId, num, offset]);
      return rows;
  }

    static async findByTeamId(teamId) {
        const {rows} = await pool.query(`
        SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, gif, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies
        FROM team_mentions
        JOIN posts AS p1 ON team_mentions.post_id = p1.id
        JOIN users ON p1.author_id = users.id
        WHERE team_id = $1`, [teamId]);
        return rows;
    }

    static async findByLeagueId(leagueId) {
        const {rows} = await pool.query(`
        SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, gif, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies
        FROM posts AS p1
        JOIN (
        SELECT DISTINCT post_id
        FROM team_mentions
        WHERE team_id IN (
            SELECT id 
            FROM teams
            WHERE league_id = $1
        )
        ) AS t1 ON t1.post_id = p1.id
        JOIN users ON p1.author_id = users.id`, [leagueId]);
        return rows;
    }

    static async findByPostId(postId) {
        let activePost;
        let posts;
        let post;
        let previousPostsObtained = false;
        await (async () => {
            const client = await pool.connect()
            try {
                await client.query('BEGIN')
                activePost = await client.query(`
                  SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, gif, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies
                  FROM posts AS p1
                  JOIN users ON p1.author_id = users.id
                  WHERE p1.id = $1
                  ORDER BY created_at`, [postId]
              )

              posts = activePost.rows;
              post = activePost.rows[0];
              console.log("post", post);

              const getPreviousPost = async (in_reply_to_post_id) => {
                const previousPost = await client.query(`
                  SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, gif, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies
                  FROM posts AS p1
                  JOIN users ON p1.author_id = users.id
                  WHERE p1.id = $1
                  ORDER BY created_at`, [in_reply_to_post_id]
              )
              return previousPost.rows[0];
              }

              while(!previousPostsObtained){
                if(!post.in_reply_to_post_id){
                  previousPostsObtained = true;
                  break;
                }
                let previousPost = await getPreviousPost(post.in_reply_to_post_id);
                post = previousPost;
                posts = [previousPost, ...posts];
                if(post.id === post.conversation_id){
                  previousPostsObtained = true;
                }
              }

              const replies = await client.query(`
                  SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, gif, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies
                  FROM posts AS p1
                  JOIN users ON p1.author_id = users.id
                  WHERE p1.in_reply_to_post_id = $1
                  ORDER BY created_at`, [activePost.rows[0].id]
              )
              
              posts = [...posts, ...replies.rows];

              await client.query('COMMIT')
              
            } catch (e) {
              await client.query('ROLLBACK')
              throw e
            } finally {
              client.release()
            }

          })().catch(e => console.error(e.stack))
          return posts;
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

    static async find(num, offset) {
      const {rows} = await pool.query(`
      SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, gif, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies
      FROM posts AS p1
      JOIN users ON p1.author_id = users.id
      ORDER BY created_at DESC
      LIMIT $1
      OFFSET $2`, [num, offset]);
      return rows;
  }


}

export default Posts;