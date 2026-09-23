const express = require('express');
const { getDatabase } = require('../config/database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
const postSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  content: Joi.string().min(1).required(),
  image_url: Joi.string().uri().optional().allow(''),
  tags: Joi.array().items(Joi.string().max(50)).max(5).optional()
});

const commentSchema = Joi.object({
  content: Joi.string().min(1).max(2000).required()
});

// Helper function to execute database queries
const executeQuery = async (query, params = []) => {
  const db = getDatabase();
  const dbType = process.env.DB_TYPE || 'sqlite';
  
  if (dbType === 'sqlite') {
    return new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  } else {
    const [rows] = await db.execute(query, params);
    return rows;
  }
};

const executeQuerySingle = async (query, params = []) => {
  const db = getDatabase();
  const dbType = process.env.DB_TYPE || 'sqlite';
  
  if (dbType === 'sqlite') {
    return new Promise((resolve, reject) => {
      db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  } else {
    const [rows] = await db.execute(query, params);
    return rows[0];
  }
};

const executeInsert = async (query, params = []) => {
  const db = getDatabase();
  const dbType = process.env.DB_TYPE || 'sqlite';
  
  if (dbType === 'sqlite') {
    return new Promise((resolve, reject) => {
      db.run(query, params, function(err) {
        if (err) reject(err);
        else resolve({ insertId: this.lastID });
      });
    });
  } else {
    const [result] = await db.execute(query, params);
    return result;
  }
};

// POST /api/community/posts - Create a new post
router.post('/posts', authenticateToken, async (req, res) => {
  try {
    const { error, value } = postSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message }
      });
    }

    const { title, content, image_url, tags } = value;
    const userId = req.user.id;

    const result = await executeInsert(
      'INSERT INTO posts (user_id, title, content, image_url, tags) VALUES (?, ?, ?, ?, ?)',
      [userId, title, content, image_url || null, tags ? JSON.stringify(tags) : null]
    );

    // Get the created post with user info
    const post = await executeQuerySingle(`
      SELECT p.*, u.username, u.email, u.role,
             COUNT(DISTINCT c.id) as comment_count,
             COUNT(DISTINCT l.id) as like_count
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN comments c ON p.id = c.post_id AND c.is_deleted = FALSE
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE p.id = ?
      GROUP BY p.id
    `, [result.insertId]);

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        ...post,
        tags: post.tags ? JSON.parse(post.tags) : [],
        is_liked: false // Will be updated if user is authenticated
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      error: { message: 'Failed to create post' }
    });
  }
});

// GET /api/community/posts - Get all posts with pagination
router.get('/posts', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'created_at';
    const order = req.query.order || 'DESC';
    const tag = req.query.tag;

    let whereClause = 'WHERE p.is_deleted = FALSE';
    let params = [];

    if (tag) {
      whereClause += ' AND JSON_EXTRACT(p.tags, "$") LIKE ?';
      params.push(`%"${tag}"%`);
    }

    // Validate sortBy to prevent SQL injection
    const allowedSortFields = ['created_at', 'updated_at', 'like_count', 'comment_count'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const query = `
      SELECT p.*, u.username, u.email, u.role,
             COUNT(DISTINCT c.id) as comment_count,
             COUNT(DISTINCT l.id) as like_count
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN comments c ON p.id = c.post_id AND c.is_deleted = FALSE
      LEFT JOIN likes l ON p.id = l.post_id
      ${whereClause}
      GROUP BY p.id, p.user_id, p.title, p.content, p.image_url, p.created_at, p.updated_at, u.username, u.email, u.role
      ORDER BY p.${sortField} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);

    const posts = await executeQuery(query, params);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM posts p
      ${whereClause}
    `;
    const countParams = tag ? [`%"${tag}"%`] : [];
    const countResult = await executeQuerySingle(countQuery, countParams);
    const totalPosts = countResult.total;

    // Add like status for authenticated users
    const postsWithLikeStatus = posts.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
      is_liked: false // Will be updated if user is authenticated
    }));

    // If user is authenticated, check which posts they've liked
    if (req.user) {
      const likedPostIds = await executeQuery(
        'SELECT post_id FROM likes WHERE user_id = ?',
        [req.user.id]
      );
      const likedIds = new Set(likedPostIds.map(like => like.post_id));
      
      postsWithLikeStatus.forEach(post => {
        post.is_liked = likedIds.has(post.id);
      });
    }

    res.json({
      posts: postsWithLikeStatus,
      pagination: {
        page,
        limit,
        total: totalPosts,
        pages: Math.ceil(totalPosts / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      error: { message: 'Failed to fetch posts' }
    });
  }
});

// GET /api/community/posts/:id - Get single post with comments
router.get('/posts/:id', optionalAuth, async (req, res) => {
  try {
    const postId = req.params.id;

    // Get post details
    const post = await executeQuerySingle(`
      SELECT p.*, u.username, u.email, u.role,
             COUNT(DISTINCT c.id) as comment_count,
             COUNT(DISTINCT l.id) as like_count
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN comments c ON p.id = c.post_id AND c.is_deleted = FALSE
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE p.id = ? AND p.is_deleted = FALSE
      GROUP BY p.id
    `, [postId]);

    if (!post) {
      return res.status(404).json({
        error: { message: 'Post not found' }
      });
    }

    // Get comments for this post
    const comments = await executeQuery(`
      SELECT c.*, u.username, u.email, u.role,
             COUNT(DISTINCT cl.id) as like_count
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN comment_likes cl ON c.id = cl.comment_id
      WHERE c.post_id = ? AND c.is_deleted = FALSE
      GROUP BY c.id
      ORDER BY c.created_at ASC
    `, [postId]);

    // Check if user liked the post
    let isLiked = false;
    if (req.user) {
      const like = await executeQuerySingle(
        'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
        [postId, req.user.id]
      );
      isLiked = !!like;
    }

    res.json({
      post: {
        ...post,
        tags: post.tags ? JSON.parse(post.tags) : [],
        is_liked: isLiked
      },
      comments: comments.map(comment => ({
        ...comment,
        is_doctor_verified: comment.role === 'doctor',
        is_pharmacist_verified: comment.role === 'pharmacist',
        is_liked: false // Will be updated if user is authenticated
      }))
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      error: { message: 'Failed to fetch post' }
    });
  }
});

// POST /api/community/posts/:id/comments - Add comment to post
router.post('/posts/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { error, value } = commentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: { message: error.details[0].message }
      });
    }

    const postId = req.params.id;
    const { content } = value;
    const userId = req.user.id;

    // Verify post exists
    const post = await executeQuerySingle(
      'SELECT id FROM posts WHERE id = ? AND is_deleted = FALSE',
      [postId]
    );

    if (!post) {
      return res.status(404).json({
        error: { message: 'Post not found' }
      });
    }

    const result = await executeInsert(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [postId, userId, content]
    );

    // Get the created comment with user info
    const comment = await executeQuerySingle(`
      SELECT c.*, u.username, u.email, u.role
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [result.insertId]);

    res.status(201).json({
      message: 'Comment added successfully',
      comment: {
        ...comment,
        is_doctor_verified: comment.role === 'doctor'
      }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      error: { message: 'Failed to add comment' }
    });
  }
});

// GET /api/community/posts/:id/comments - Get comments for a post
router.get('/posts/:id/comments', optionalAuth, async (req, res) => {
  try {
    const postId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Verify post exists
    const post = await executeQuerySingle(
      'SELECT id FROM posts WHERE id = ? AND is_deleted = FALSE',
      [postId]
    );

    if (!post) {
      return res.status(404).json({
        error: { message: 'Post not found' }
      });
    }

    const comments = await executeQuery(`
      SELECT c.*, u.username, u.email, u.role,
             COUNT(DISTINCT cl.id) as like_count
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN comment_likes cl ON c.id = cl.comment_id
      WHERE c.post_id = ? AND c.is_deleted = FALSE
      GROUP BY c.id
      ORDER BY c.created_at ASC
      LIMIT ? OFFSET ?
    `, [postId, limit, offset]);

    // Get total count for pagination
    const countResult = await executeQuerySingle(
      'SELECT COUNT(*) as total FROM comments WHERE post_id = ? AND is_deleted = FALSE',
      [postId]
    );

    res.json({
      comments: comments.map(comment => ({
        ...comment,
        is_doctor_verified: comment.role === 'doctor'
      })),
      pagination: {
        page,
        limit,
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      error: { message: 'Failed to fetch comments' }
    });
  }
});

// POST /api/community/posts/:id/like - Like/unlike a post
router.post('/posts/:id/like', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Verify post exists
    const post = await executeQuerySingle(
      'SELECT id FROM posts WHERE id = ? AND is_deleted = FALSE',
      [postId]
    );

    if (!post) {
      return res.status(404).json({
        error: { message: 'Post not found' }
      });
    }

    // Check if user already liked this post
    const existingLike = await executeQuerySingle(
      'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    if (existingLike) {
      // Unlike the post
      await executeQuery(
        'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );
      
      res.json({
        message: 'Post unliked successfully',
        liked: false
      });
    } else {
      // Like the post
      await executeInsert(
        'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
        [postId, userId]
      );
      
      res.json({
        message: 'Post liked successfully',
        liked: true
      });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      error: { message: 'Failed to like/unlike post' }
    });
  }
});

// GET /api/community/tags - Get popular tags
router.get('/tags', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    // This is a simplified version - in production you might want a separate tags table
    const tags = await executeQuery(`
      SELECT DISTINCT JSON_EXTRACT(tags, '$') as tag_array
      FROM posts 
      WHERE tags IS NOT NULL AND is_deleted = FALSE
      LIMIT ?
    `, [limit]);

    const allTags = [];
    tags.forEach(row => {
      if (row.tag_array) {
        const tagArray = JSON.parse(row.tag_array);
        allTags.push(...tagArray);
      }
    });

    // Count tag frequency
    const tagCount = {};
    allTags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });

    // Sort by frequency and return top tags
    const popularTags = Object.entries(tagCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }));

    res.json({
      tags: popularTags
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      error: { message: 'Failed to fetch tags' }
    });
  }
});

// DELETE /api/community/posts/:id - Delete a post
router.delete('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Verify post exists and belongs to user
    const post = await executeQuerySingle(
      'SELECT id, user_id FROM posts WHERE id = ? AND is_deleted = FALSE',
      [postId]
    );

    if (!post) {
      return res.status(404).json({
        error: { message: 'Post not found' }
      });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({
        error: { message: 'You can only delete your own posts' }
      });
    }

    // Soft delete the post
    await executeQuery(
      'UPDATE posts SET is_deleted = TRUE, updated_at = datetime("now") WHERE id = ?',
      [postId]
    );

    res.json({
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      error: { message: 'Failed to delete post' }
    });
  }
});

module.exports = router;


