import pool from "../pool";

class Posts {
    static async create(post, teamMentions, userMentions) {
        let createdPost;
        let results;
        await (async () => {
          const client = await pool.connect()
          try {
            await client.query('BEGIN')
            createdPost = await client.query(
              `INSERT INTO posts (author_id, body, media, outlook)
              VALUES
              ($1, $2, $3, $4)
              RETURNING *`, [post.userId, post.body, post.media, post.outlook]
            )
            await client.query(
                `UPDATE posts
                SET conversation_id = $1
                WHERE id = $1
                `, [createdPost.rows[0].id]
            )
            if(teamMentions){
              teamMentions.forEach(async teamMention => {
                await client.query(
                  `WITH team AS (
                    SELECT id
                    FROM teams
                    WHERE abbrev = $1
                  )
                  INSERT INTO team_mentions (team_id, post_id)
                  VALUES ((SELECT id FROM team), $2)`, [teamMention, createdPost.rows[0].id]
                )
              });
            }
            if(userMentions){
              userMentions.forEach(async userMention => {
                const mention = userMention.substring(1);
                console.log(mention)
                await client.query(
                  `WITH user_mentioned AS (
                    SELECT id
                    FROM users
                    WHERE username = $1
                  )
                  INSERT INTO user_mentions (user_id, post_id)
                  VALUES ((SELECT id FROM user_mentioned), $2)`, [mention, createdPost.rows[0].id]
                )
              });
          }
            results = await client.query(
              `SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, media, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
              CASE 
              WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') THEN (to_char(now() - p1.created_at, 'FMHHh'))
              WHEN (now() - p1.created_at < '1 Hour') THEN (to_char(now() - p1.created_at, 'FMMIm'))
              ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
              END AS date,
              EXISTS (SELECT 1 FROM likes WHERE likes.user_id = NULL AND p1.id = likes.post_id ) AS liked
              FROM posts AS p1
              JOIN users ON p1.author_id = users.id
              WHERE p1.id = $1
              `, [createdPost.rows[0].id]
            )

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

    static async findByUserId(targetUserId, userId, num, offset) {
      const {rows} = await pool.query(`
      SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, media, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
        CASE 
        WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') THEN (to_char(now() - p1.created_at, 'FMHHh'))
        WHEN (now() - p1.created_at < '1 Hour') THEN (to_char(now() - p1.created_at, 'FMMIm'))
        ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
        END AS date,
        EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $2 AND p1.id = likes.post_id ) AS liked
      FROM posts AS p1
      JOIN users ON p1.author_id = users.id
      WHERE author_id = $1 AND p1.id = p1.conversation_id
      ORDER BY created_at DESC
      LIMIT $3
      OFFSET $4`, [targetUserId, userId, num, offset]);
      
      return rows;
  }

  static async findUserMentioned(userId, num, offset) {
    const {rows} = await pool.query(`
    SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, media, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
      CASE 
      WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') THEN (to_char(now() - p1.created_at, 'FMHHh'))
      WHEN (now() - p1.created_at < '1 Hour') THEN (to_char(now() - p1.created_at, 'FMMIm'))
      ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
      END AS date,
      EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $1 AND p1.id = likes.post_id ) AS liked
    FROM user_mentions
    JOIN posts AS p1 ON p1.id = user_mentions.post_id
    JOIN users ON users.id = user_mentions.user_id
    WHERE user_mentions.user_id = $1
    ORDER BY created_at DESC
    LIMIT $2
    OFFSET $3`, [userId, num, offset]);
    
    return rows;
}

    static async findByTeamId(userId, teamId) {
        const {rows} = await pool.query(`
        SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, media, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
          CASE 
          WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') THEN (to_char(now() - p1.created_at, 'FMHHh'))
          WHEN (now() - p1.created_at < '1 Hour') THEN (to_char(now() - p1.created_at, 'FMMIm'))
          ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
          END AS date,
          EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $1 AND p1.id = likes.post_id ) AS liked
        FROM team_mentions
        JOIN posts AS p1 ON team_mentions.post_id = p1.id
        JOIN users ON p1.author_id = users.id
        WHERE team_id = $2
        ORDER BY p1.created_at DESC`, [userId, teamId]);
        
        return rows;
    }

    static async findByLeagueId(leagueId) {
        const {rows} = await pool.query(`
        SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, media, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
          CASE 
          WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') THEN (to_char(now() - p1.created_at, 'FMHHh'))
          WHEN (now() - p1.created_at < '1 Hour') THEN (to_char(now() - p1.created_at, 'FMMIm'))
          ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
          END AS date
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
        JOIN users ON p1.author_id = users.id
        ORDER BY p1.created_at DESC`, [leagueId]);
        
        return rows;
    }

    static async findByEventConversationId(event_conversation_id) {
      const {rows} = await pool.query(`
      SELECT p1.*, avatar, users.name, users.username,
        (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, 
        (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
        CASE 
          WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') 
          THEN (to_char(now() - p1.created_at, 'FMHHh'))
          WHEN (now() - p1.created_at < '1 Hour') 
          THEN (to_char(now() - p1.created_at, 'FMMIm'))
          ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
        END AS date
      FROM posts AS p1
      JOIN users ON p1.author_id = users.id
      WHERE event_conversation_id = $1 AND in_reply_to_post_id IS NULL
      ORDER BY p1.created_at DESC
      `, [event_conversation_id]);
      
      return rows;
  }

  static async findThreadReplies(threadId) {
    const {rows} = await pool.query(`
    SELECT p1.*, avatar, users.name, users.username,
      (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, 
      (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
      CASE 
        WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') 
        THEN (to_char(now() - p1.created_at, 'FMHHh'))
        WHEN (now() - p1.created_at < '1 Hour') 
        THEN (to_char(now() - p1.created_at, 'FMMIm'))
        ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
      END AS date
    FROM posts AS p1
    JOIN users ON p1.author_id = users.id
    WHERE in_reply_to_post_id = $1
    ORDER BY likes DESC, replies DESC, p1.created_at DESC
    `, [threadId]);
    
    return rows;
}

static async findThreadHistory(threadId) {
  const {rows} = await pool.query(`
    WITH RECURSIVE history AS (
      SELECT * FROM posts WHERE id = $1
    UNION
      SELECT p.*
      FROM history h, posts p
      WHERE p.id = h.in_reply_to_post_id
    )
  SELECT p1.*, avatar, users.name, users.username,
      (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, 
      (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
      CASE 
        WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') 
        THEN (to_char(now() - p1.created_at, 'FMHHh'))
        WHEN (now() - p1.created_at < '1 Hour') 
        THEN (to_char(now() - p1.created_at, 'FMMIm'))
        ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
      END AS date
    FROM history AS p1
    JOIN users ON p1.author_id = users.id
    ORDER BY likes DESC, replies DESC, p1.created_at DESC
  `, [threadId]);
  
  return rows;
}

    static async findByPostId(userId, postId) {
        let activePost;
        let posts;
        let post;
        let previousPostsObtained = false;
        await (async () => {
            const client = await pool.connect()
            try {
                await client.query('BEGIN')
                activePost = await client.query(`
                  SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, media, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
                    CASE 
                    WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') THEN (to_char(now() - p1.created_at, 'FMHHh'))
                    WHEN (now() - p1.created_at < '1 Hour') THEN (to_char(now() - p1.created_at, 'FMMIm'))
                    ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
                    END AS date,
                    EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $2 AND p1.id = likes.post_id ) AS liked
                  FROM posts AS p1
                  JOIN users ON p1.author_id = users.id
                  WHERE p1.id = $1
                  ORDER BY created_at DESC`, [postId, userId]
              )

              posts = activePost.rows;
              post = activePost.rows[0];
              console.log("post", post);

              const getPreviousPost = async (in_reply_to_post_id) => {
                const previousPost = await client.query(`
                  SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, media, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
                    CASE 
                    WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') THEN (to_char(now() - p1.created_at, 'FMHHh'))
                    WHEN (now() - p1.created_at < '1 Hour') THEN (to_char(now() - p1.created_at, 'FMMIm'))
                    ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
                    END AS date,
                    EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $2 AND p1.id = likes.post_id ) AS liked
                  FROM posts AS p1
                  JOIN users ON p1.author_id = users.id
                  WHERE p1.id = $1
                  ORDER BY created_at DESC`, [in_reply_to_post_id, userId]
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
                  SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, media, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
                    CASE 
                    WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') THEN (to_char(now() - p1.created_at, 'FMHHh'))
                    WHEN (now() - p1.created_at < '1 Hour') THEN (to_char(now() - p1.created_at, 'FMMIm'))
                    ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
                    END AS date,
                    EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $2 AND p1.id = likes.post_id ) AS liked
                  FROM posts AS p1
                  JOIN users ON p1.author_id = users.id
                  WHERE p1.in_reply_to_post_id = $1
                  ORDER BY created_at DESC`, [activePost.rows[0].id, userId]
              )
              
              posts = [...posts, ...replies.rows];

              await client.query('COMMIT')
              
            } catch (e) {
              await client.query('ROLLBACK')
              throw e
            } finally {
              
              await client.release()
            }

          })().catch(e => console.error(e.stack))
          return posts;
    }

    static async reply(reply, abbrevs) {
        let results;
        const {userId, body, media, outlook, conversation_id, in_reply_to_post_id} = reply;
        await (async () => {
            const client = await pool.connect()
            try {
                await client.query('BEGIN')
                results = await client.query(
                  `INSERT INTO posts (author_id, body, media, outlook, conversation_id, in_reply_to_post_id)
                  VALUES
                  ($1, $2, $3, $4, $5, $6)
                  RETURNING *`, [userId, body, media, outlook, conversation_id, in_reply_to_post_id]
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
              
              await client.release()
            }

          })().catch(e => console.error(e.stack))
          return results.rows[0]
    }

    static async eventReply(reply, teamMentions, userMentions) {
      let createdPost;
      const {userId, body, media, outlook, event_conversation_id} = reply;
      await (async () => {
          const client = await pool.connect()
          try {
              await client.query('BEGIN')
              createdPost = await client.query(
                `WITH insert_post AS (
                  INSERT INTO posts (author_id, body, media, outlook, event_conversation_id)
                  VALUES
                  ($1, $2, $3, $4, $5)
                  RETURNING *
                )
                
                SELECT p1.*, avatar, users.name, users.username,
                  (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, 
                  (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
                CASE 
                WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') THEN (to_char(now() - p1.created_at, 'FMHHh'))
                WHEN (now() - p1.created_at < '1 Hour') THEN (to_char(now() - p1.created_at, 'FMMIm'))
                ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
                END AS date
                FROM insert_post AS p1
                JOIN users ON p1.author_id = users.id`, [userId, body, media, outlook, event_conversation_id]
            )
            if(teamMentions){
              teamMentions.forEach(async teamMention => {
                await client.query(
                  `WITH team AS (
                    SELECT id
                    FROM teams
                    WHERE abbrev = $1
                  )
                  INSERT INTO team_mentions (team_id, post_id)
                  VALUES ((SELECT id FROM team), $2)`, [teamMention, createdPost.rows[0].id]
                )
              });
            }
            if(userMentions){
              userMentions.forEach(async userMention => {
                const mention = userMention.substring(1);
                console.log(mention)
                await client.query(
                  `WITH user_mentioned AS (
                    SELECT id
                    FROM users
                    WHERE username = $1
                  )
                  INSERT INTO user_mentions (user_id, post_id)
                  VALUES ((SELECT id FROM user_mentioned), $2)`, [mention, createdPost.rows[0].id]
                )
              });
          }
            await client.query('COMMIT')
            
          } catch (e) {
            await client.query('ROLLBACK')
            throw e
          } finally {
            
            await client.release()
          }

        })().catch(e => console.error(e.stack))
        return createdPost.rows[0]
  }

    static async like(post_id, user_id) {
        const {rows} = await pool.query(`
        INSERT INTO likes (post_id, user_id)
        VALUES ($1, $2)
        RETURNING id`, [post_id, user_id]);
        return rows;
    }

    static async findFollowedTeamsPosts(userId, num, offset) {
      const {rows} = await pool.query(`
      SELECT DISTINCT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, media, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
        CASE 
        WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') THEN (to_char(now() - p1.created_at, 'FMHHh'))
        WHEN (now() - p1.created_at < '1 Hour') THEN (to_char(now() - p1.created_at, 'FMMIm'))
        ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
        END AS date,
        EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $1 AND p1.id = likes.post_id ) AS liked
      FROM posts AS p1
      JOIN users ON p1.author_id = users.id
      JOIN team_mentions ON p1.id = team_mentions.post_id
	    WHERE team_mentions.team_id IN (SELECT team_id FROM followers WHERE followers.user_id = $1)
      ORDER BY created_at DESC
      LIMIT $2
      OFFSET $3`, [userId, num, offset]);
      
      return rows;
  }

  static async findOne(postId, userId) {
    const {rows} = await pool.query(`
    SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, media, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
        CASE 
        WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') THEN (to_char(now() - p1.created_at, 'FMHHh'))
        WHEN (now() - p1.created_at < '1 Hour') THEN (to_char(now() - p1.created_at, 'FMMIm'))
        ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
        END AS date,
        EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $2 AND p1.id = likes.post_id ) AS liked
      FROM posts AS p1
      JOIN users ON p1.author_id = users.id
	  WHERE p1.id = $1
    `, [postId, userId]);
    
    return rows[0];
}

  static async search(query, userId, num, offset) {
    const {rows} = await pool.query(`
      SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, media, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
        CASE 
        WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') THEN (to_char(now() - p1.created_at, 'FMHHh'))
        WHEN (now() - p1.created_at < '1 Hour') THEN (to_char(now() - p1.created_at, 'FMMIm'))
        ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
        END AS date,
        EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $2 AND p1.id = likes.post_id ) AS liked
      FROM posts AS p1
      JOIN users ON p1.author_id = users.id
      WHERE to_tsvector('simple', body) @@ to_tsquery('simple', $1)
      ORDER BY created_at DESC
      LIMIT $3
      OFFSET $4
      `, [query, userId, num, offset]);
    
    return rows;
  }


}

export default Posts;