import pool from "../pool";

class Posts {
  static async create(post, teamMentions, userMentions) {
    const { userId, body, media, outlook } = post;
    let createdPost;
    await (async () => {
      const client = await pool.connect();

      try {
        await client.query("BEGIN");
        createdPost = await client.query(
          `WITH inserted_post AS (
              INSERT INTO posts (author_id, body, media, outlook, conversation_id)
              VALUES
              ($1, $2, $3, $4, lastval())
              RETURNING *
            )
            
            SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, media, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
            CASE 
            WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') THEN (to_char(now() - p1.created_at, 'FMHHh'))
            WHEN (now() - p1.created_at < '1 Hour') THEN (to_char(now() - p1.created_at, 'FMMIm'))
            ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
            END AS date,
            EXISTS (SELECT 1 FROM likes WHERE likes.user_id = NULL AND p1.id = likes.post_id ) AS liked
            FROM inserted_post AS p1
            JOIN users ON p1.author_id = users.id`,
          [userId, body, media, outlook]
        );

        if (teamMentions) {
          teamMentions.forEach(async (teamMention) => {
            await client.query(
              `WITH team AS (
                  SELECT id
                  FROM teams
                  WHERE abbrev = $1
                )
                INSERT INTO team_mentions (team_id, post_id)
                VALUES ((SELECT id FROM team), $2)`,
              [teamMention, createdPost.rows[0].id]
            );
          });
        }

        if (userMentions) {
          userMentions.forEach(async (userMention) => {
            const mention = userMention.substring(1);
            await client.query(
              `WITH user_mentioned AS (
                  SELECT id
                  FROM users
                  WHERE username = $1
                )
                INSERT INTO user_mentions (user_id, post_id)
                VALUES ((SELECT id FROM user_mentioned), $2)`,
              [mention, createdPost.rows[0].id]
            );
          });
        }

        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
    })().catch((e) => console.error(e.stack));
    return createdPost.rows[0];
  }

  static async findByUserId(targetUserId, userId, num, offset) {
    const { rows } = await pool.query(
      `
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
      OFFSET $4`,
      [targetUserId, userId, num, offset]
    );

    return rows;
  }

  static async findByUsername(username, userId, offset, limit) {
    const { rows } = await pool.query(
      `
      SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, media, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
        CASE 
        WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') THEN (to_char(now() - p1.created_at, 'FMHHh'))
        WHEN (now() - p1.created_at < '1 Hour') THEN (to_char(now() - p1.created_at, 'FMMIm'))
        ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
        END AS date,
        EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $2 AND p1.id = likes.post_id ) AS liked
      FROM posts AS p1
      JOIN users ON p1.author_id = users.id
      WHERE users.username = $1 AND p1.id = p1.conversation_id
      ORDER BY created_at DESC
      OFFSET $3
      LIMIT $4`,
      [username, userId, offset, limit]
    );

    return rows;
  }

  static async findByUsernameWithMedia(username, userId, offset, limit) {
    const { rows } = await pool.query(
      `
      SELECT p1.*, 
        users.avatar, users.name, users.username, 
        (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, 
        (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
        EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $2 AND p1.id = likes.post_id ) AS liked
      FROM posts AS p1
      JOIN users ON p1.author_id = users.id
      WHERE users.username = $1 AND p1.id = p1.conversation_id AND p1.media IS NOT NULL
      ORDER BY p1.created_at DESC
      OFFSET $3
      LIMIT $4`,
      [username, userId, offset, limit]
    );

    return rows;
  }

  static async findLikedByUsername(username, userId, offset, limit) {
    const { rows } = await pool.query(
      `
      SELECT p1.*,
        u1.avatar, u1.name, u1.username, 
        (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, 
        (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
        EXISTS (SELECT 1 FROM likes AS l2 WHERE l2.user_id = $2 AND p1.id = l2.post_id ) AS liked
      FROM likes AS l1
      JOIN posts AS p1 ON p1.id = l1.post_id
      JOIN users AS u1 ON u1.id = p1.author_id
      JOIN users AS u2 ON u2.id = l1.user_id
      WHERE u2.username = $1
      ORDER BY p1.created_at DESC
      OFFSET $3
      LIMIT $4`,
      [username, userId, offset, limit]
    );

    return rows;
  }

  static async findUserMentioned(userId, num, offset) {
    const { rows } = await pool.query(
      `
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
    OFFSET $3`,
      [userId, num, offset]
    );

    return rows;
  }

  static async findTeamMentions(abbrev, userId, offset, limit) {
    const { rows } = await pool.query(
      `
      SELECT posts.*, users.name, users.username, users.avatar,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS likes, 
        (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = posts.id) AS replies,
        EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $2 AND posts.id = likes.post_id ) AS liked
      FROM team_mentions
      JOIN posts ON posts.id = team_mentions.post_id
      JOIN teams ON teams.id = team_mentions.team_id
      JOIN users ON users.id = posts.author_id 
      WHERE teams.abbrev = $1
      ORDER BY posts.created_at DESC
      OFFSET $3
      LIMIT $4
        `,
      [abbrev, userId, offset, limit]
    );

    return rows;
  }

  static async findTeamMedia(abbrev, userId, offset, limit) {
    const { rows } = await pool.query(
      `
      SELECT posts.*, users.name, users.username, users.avatar,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS likes, 
        (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = posts.id) AS replies,
        EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $2 AND posts.id = likes.post_id ) AS liked
      FROM team_mentions
      JOIN posts ON posts.id = team_mentions.post_id
      JOIN teams ON teams.id = team_mentions.team_id
      JOIN users ON users.id = posts.author_id 
      WHERE teams.abbrev = $1 AND posts.media IS NOT NULL
      ORDER BY posts.created_at DESC
      OFFSET $3
      LIMIT $4
        `,
      [abbrev, userId, offset, limit]
    );

    return rows;
  }

  static async findByLeagueName(leagueName, userId, offset, limit) {
    const { rows } = await pool.query(
      `
      WITH league_mentions AS (
        SELECT p1.*, users.name, users.username, users.avatar, users.bio,
          (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, 
          (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
          (SELECT COUNT(*) FROM scouts WHERE scouted_user_id = p1.author_id) AS scouts,
          (SELECT COUNT(*) FROM followers WHERE user_id = p1.author_id) AS following,
          EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $2 AND p1.id = likes.post_id ) AS liked,
          EXISTS (SELECT 1 FROM scouts WHERE scouted_user_id = p1.author_id AND scout_user_id = $2 ) AS scouted,
          ROW_NUMBER() OVER(PARTITION BY post_id) AS row_number
        FROM team_mentions
        JOIN teams ON teams.id = team_id
        JOIN leagues ON leagues.id = teams.league_id
        JOIN posts AS p1 ON p1.id = post_id
        JOIN users ON users.id = p1.author_id
        WHERE leagues.league_name = $1
        ORDER BY p1.created_at DESC
        OFFSET $3
        LIMIT $4
      )

      SELECT *
      FROM league_mentions
      WHERE row_number = 1`,
      [leagueName, userId, offset, limit]
    );

    return rows;
  }

  static async findLeagueMedia(leagueName, userId, offset, limit) {
    const { rows } = await pool.query(
      `
      WITH league_mentions AS (
        SELECT p1.*, users.name, users.username, users.avatar, users.bio,
          (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, 
          (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
          (SELECT COUNT(*) FROM scouts WHERE scouted_user_id = p1.author_id) AS scouts,
          (SELECT COUNT(*) FROM followers WHERE user_id = p1.author_id) AS following,
          EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $2 AND p1.id = likes.post_id ) AS liked,
          EXISTS (SELECT 1 FROM scouts WHERE scouted_user_id = p1.author_id AND scout_user_id = $2 ) AS scouted,
          ROW_NUMBER() OVER(PARTITION BY post_id) AS row_number
        FROM team_mentions
        JOIN teams ON teams.id = team_id
        JOIN leagues ON leagues.id = teams.league_id
        JOIN posts AS p1 ON p1.id = post_id
        JOIN users ON users.id = p1.author_id
        WHERE leagues.league_name = $1 AND p1.media IS NOT NULL
        ORDER BY p1.created_at DESC
        OFFSET $3
        LIMIT $4
      )

      SELECT *
      FROM league_mentions
      WHERE row_number = 1`,
      [leagueName, userId, offset, limit]
    );

    return rows;
  }

  static async findByEventConversationId(event_conversation_id, userId) {
    const { rows } = await pool.query(
      `
      SELECT p1.*, avatar, users.name, users.username,
        (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, 
        (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
        CASE 
          WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') 
          THEN (to_char(now() - p1.created_at, 'FMHHh'))
          WHEN (now() - p1.created_at < '1 Hour') 
          THEN (to_char(now() - p1.created_at, 'FMMIm'))
          ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
        END AS date,
        EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $2 AND p1.id = likes.post_id ) AS liked
      FROM posts AS p1
      JOIN users ON p1.author_id = users.id
      WHERE event_conversation_id = $1 AND in_reply_to_post_id IS NULL
      ORDER BY p1.created_at DESC
      `,
      [event_conversation_id, userId]
    );

    return rows;
  }

  static async findThreadReplies(threadId, userId, offset, limit) {
    const { rows } = await pool.query(
      `
      SELECT posts.*, users.name, users.username, users.avatar,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS likes, 
        (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = posts.id) AS replies,
        EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $2 AND posts.id = likes.post_id ) AS liked
      FROM posts
      JOIN users ON posts.author_id = users.id
      WHERE in_reply_to_post_id = $1
      ORDER BY likes DESC, replies DESC, posts.created_at DESC
      OFFSET $3
      LIMIT $4
    `,
      [threadId, userId, offset, limit]
    );

    return rows;
  }

  static async findThreadHistory(threadId, userId) {
    const { rows } = await pool.query(
      `
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
      END AS date,
      EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $2 AND p1.id = likes.post_id ) AS liked
    FROM history AS p1
    JOIN users ON p1.author_id = users.id
    ORDER BY p1.created_at
  `,
      [threadId, userId]
    );

    return rows;
  }

  static async findByPostId(userId, postId) {
    let activePost;
    let posts;
    let post;
    let previousPostsObtained = false;
    await (async () => {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        activePost = await client.query(
          `
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
                  ORDER BY created_at DESC`,
          [postId, userId]
        );

        posts = activePost.rows;
        post = activePost.rows[0];

        const getPreviousPost = async (in_reply_to_post_id) => {
          const previousPost = await client.query(
            `
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
                  ORDER BY created_at DESC`,
            [in_reply_to_post_id, userId]
          );
          return previousPost.rows[0];
        };

        while (!previousPostsObtained) {
          if (!post.in_reply_to_post_id) {
            previousPostsObtained = true;
            break;
          }
          let previousPost = await getPreviousPost(post.in_reply_to_post_id);
          post = previousPost;
          posts = [previousPost, ...posts];
          if (post.id === post.conversation_id) {
            previousPostsObtained = true;
          }
        }

        const replies = await client.query(
          `
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
                  ORDER BY created_at DESC`,
          [activePost.rows[0].id, userId]
        );

        posts = [...posts, ...replies.rows];

        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        await client.release();
      }
    })().catch((e) => console.error(e.stack));
    return posts;
  }

  static async reply(reply, teamMentions, userMentions) {
    let createdPost;
    const {
      userId,
      body,
      media,
      outlook,
      conversation_id,
      in_reply_to_post_id,
    } = reply;
    await (async () => {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        createdPost = await client.query(
          `WITH inserted_post AS (
                    INSERT INTO posts (author_id, body, media, outlook, conversation_id, in_reply_to_post_id)
                    VALUES
                    ($1, $2, $3, $4, $5, $6)
                    RETURNING *
                  )
                  
                  SELECT p1.id, p1.created_at, conversation_id, in_reply_to_post_id, author_id, avatar, users.name, users.username, body, media, outlook, (SELECT COUNT(*) FROM likes WHERE post_id = p1.id) AS likes, (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = p1.id) AS replies,
                  CASE 
                  WHEN (now() - p1.created_at < '1 Day' AND now() - p1.created_at > '1 Hour') THEN (to_char(now() - p1.created_at, 'FMHHh'))
                  WHEN (now() - p1.created_at < '1 Hour') THEN (to_char(now() - p1.created_at, 'FMMIm'))
                  ELSE (to_char(p1.created_at, 'Mon FMDDth, YYYY'))
                  END AS date,
                  EXISTS (SELECT 1 FROM likes WHERE likes.user_id = NULL AND p1.id = likes.post_id ) AS liked
                  FROM inserted_post AS p1
                  JOIN users ON p1.author_id = users.id`,
          [userId, body, media, outlook, conversation_id, in_reply_to_post_id]
        );
        if (teamMentions) {
          teamMentions.forEach(async (teamMention) => {
            await client.query(
              `WITH team AS (
                      SELECT id
                      FROM teams
                      WHERE abbrev = $1
                    )
                    INSERT INTO team_mentions (team_id, post_id)
                    VALUES ((SELECT id FROM team), $2)`,
              [teamMention, createdPost.rows[0].id]
            );
          });
        }
        if (userMentions) {
          userMentions.forEach(async (userMention) => {
            const mention = userMention.substring(1);
            await client.query(
              `WITH user_mentioned AS (
                      SELECT id
                      FROM users
                      WHERE username = $1
                    )
                    INSERT INTO user_mentions (user_id, post_id)
                    VALUES ((SELECT id FROM user_mentioned), $2)`,
              [mention, createdPost.rows[0].id]
            );
          });
        }
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        await client.release();
      }
    })().catch((e) => console.error(e.stack));
    return createdPost.rows[0];
  }

  static async eventReply(reply, teamMentions, userMentions) {
    let createdPost;
    const { userId, body, media, outlook, event_conversation_id } = reply;
    await (async () => {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
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
                JOIN users ON p1.author_id = users.id`,
          [userId, body, media, outlook, event_conversation_id]
        );
        if (teamMentions) {
          teamMentions.forEach(async (teamMention) => {
            await client.query(
              `WITH team AS (
                    SELECT id
                    FROM teams
                    WHERE abbrev = $1
                  )
                  INSERT INTO team_mentions (team_id, post_id)
                  VALUES ((SELECT id FROM team), $2)`,
              [teamMention, createdPost.rows[0].id]
            );
          });
        }
        if (userMentions) {
          userMentions.forEach(async (userMention) => {
            const mention = userMention.substring(1);
            await client.query(
              `WITH user_mentioned AS (
                    SELECT id
                    FROM users
                    WHERE username = $1
                  )
                  INSERT INTO user_mentions (user_id, post_id)
                  VALUES ((SELECT id FROM user_mentioned), $2)`,
              [mention, createdPost.rows[0].id]
            );
          });
        }
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        await client.release();
      }
    })().catch((e) => console.error(e.stack));
    return createdPost.rows[0];
  }

  static async like(postId, userId) {
    const { rows } = await pool.query(
      `
        INSERT INTO likes (post_id, user_id)
        VALUES ($1, $2)
        RETURNING *`,
      [postId, userId]
    );
    return rows;
  }

  static async unLike(postId, userId) {
    const { rows } = await pool.query(
      `
      DELETE FROM likes
      WHERE post_id = $1 AND user_id = $2
      RETURNING *`,
      [postId, userId]
    );
    return rows;
  }

  static async findFollowedTeamsPosts(userId, num, offset) {
    const { rows } = await pool.query(
      `
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
      OFFSET $3`,
      [userId, num, offset]
    );

    return rows;
  }

  static async homeTimeline(userId, offset, limit) {
    const { rows } = await pool.query(
      `
      WITH followed_team_posts AS (
        SELECT posts.*
        FROM posts
        JOIN team_mentions ON posts.id = team_mentions.post_id
        WHERE team_mentions.team_id IN (SELECT team_id FROM followers WHERE followers.user_id = $1)
        ), scouted_user_posts AS (
          SELECT *
          FROM posts
          WHERE author_id IN (SELECT scouted_user_id FROM scouts WHERE scout_user_id = $1)
        ), home_timeline AS (
            SELECT * FROM followed_team_posts
            UNION
            SELECT * FROM scouted_user_posts
          )
      SELECT ht.*, users.name, users.username, users.avatar, users.bio,
        (SELECT COUNT(*) FROM scouts WHERE scouted_user_id = ht.author_id) AS scouts,
        (SELECT COUNT(*) FROM followers WHERE user_id = ht.author_id) AS following,
        (SELECT COUNT(*) FROM likes WHERE post_id = ht.id) AS likes, 
        (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = ht.id) AS replies,
        EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $1 AND ht.id = likes.post_id ) AS liked,
        EXISTS (SELECT 1 FROM scouts WHERE scouted_user_id = ht.author_id AND scout_user_id = $1 ) AS scouted
      FROM home_timeline AS ht
      JOIN users ON users.id = ht.author_id
      ORDER BY ht.created_at DESC
      OFFSET $2
      LIMIT $3`,
      [userId, offset, limit]
    );

    return rows;
  }

  static async findOne(postId, userId) {
    const { rows } = await pool.query(
      `
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
    `,
      [postId, userId]
    );

    return rows[0];
  }

  static async search(query, offset, limit, userId) {
    const { rows } = await pool.query(
      `
      SELECT posts.*, users.name, users.username, users.avatar, 
        (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = posts.id) AS replies,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS likes, 
        EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $4 AND posts.id = likes.post_id ) AS liked
      FROM posts
      JOIN users ON users.id = posts.author_id
      WHERE to_tsvector('simple', body) @@ to_tsquery('simple', $1)
      ORDER BY created_at DESC
      OFFSET $2
      LIMIT $3
      `,
      [query, offset, limit, userId]
    );

    return rows;
  }

  static async searchTop(query, offset, limit, userId) {
    const { rows } = await pool.query(
      `
      SELECT posts.*, users.name, users.username, users.avatar, 
        (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = posts.id) AS replies,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS likes, 
        EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $4 AND posts.id = likes.post_id ) AS liked
      FROM posts
      JOIN users ON users.id = posts.author_id
      WHERE to_tsvector('simple', body) @@ to_tsquery('simple', $1)
      ORDER BY likes DESC
      OFFSET $2
      LIMIT $3
      `,
      [query, offset, limit, userId]
    );

    return rows;
  }

  static async searchLatest(query, offset, limit, userId) {
    const { rows } = await pool.query(
      `
      SELECT posts.*, users.name, users.username, users.avatar, 
        (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = posts.id) AS replies,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS likes, 
        EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $4 AND posts.id = likes.post_id ) AS liked
      FROM posts
      JOIN users ON users.id = posts.author_id
      WHERE to_tsvector('simple', body) @@ to_tsquery('simple', $1)
      ORDER BY created_at DESC
      OFFSET $2
      LIMIT $3
      `,
      [query, offset, limit, userId]
    );

    return rows;
  }

  static async searchMedia(query, offset, limit, userId) {
    const { rows } = await pool.query(
      `
      SELECT posts.*, users.name, users.username, users.avatar, 
        (SELECT COUNT(*) FROM posts AS p2 WHERE in_reply_to_post_id = posts.id) AS replies,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS likes, 
        EXISTS (SELECT 1 FROM likes WHERE likes.user_id = $4 AND posts.id = likes.post_id ) AS liked
      FROM posts
      JOIN users ON users.id = posts.author_id
      WHERE to_tsvector('simple', body) @@ to_tsquery('simple', $1) AND media IS NOT NULL
      ORDER BY likes DESC
      OFFSET $2
      LIMIT $3
      `,
      [query, offset, limit, userId]
    );

    return rows;
  }

  static async findUsersWhoLiked(postId) {
    const { rows } = await pool.query(
      `
    SELECT likes.*, users.name, users.username, users.avatar
    FROM likes
    JOIN users ON users.id = user_id
    WHERE post_id = $1
    `,
      [postId]
    );

    return rows;
  }

  static async delete(postId) {
    const { rows } = await pool.query(
      `
  DELETE FROM posts
  WHERE id = $1
  RETURNING *
  `,
      [postId]
    );

    return rows[0];
  }
}

export default Posts;
