const express = require('express');
const postController = require('../controllers/postController');
const isAuth = require('../middlewares/isAuth');
const upload = require('../middlewares/uploadFile');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: APIs for managing posts and their related actions
 */

/**
 * @swagger
 * /api/post/addPost:
 *   post:
 *     summary: Add a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Post added successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.post('/addPost', isAuth, upload.array('files'), postController.addPost);

/**
 * @swagger
 * /api/post/{postId}/updatePost:
 *   put:
 *     summary: Update an existing post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Post not found
 */
router.put('/:postId/updatePost', isAuth, postController.updatePost);

/**
 * @swagger
 * /api/post/{postId}/deletePost:
 *   delete:
 *     summary: Delete an existing post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Post not found
 */
router.delete('/:postId/deletePost', isAuth, postController.deletePost);

/**
 * @swagger
 * /api/post/{postId}/reactPost:
 *   post:
 *     summary: React to a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to react to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reaction:
 *                 type: string
 *                 enum: [like, love, haha, wow, sad, angry]
 *     responses:
 *       200:
 *         description: Reaction added successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Post not found
 */
router.post('/:postId/reactPost', isAuth, postController.reactPost);

/**
 * @swagger
 * /api/post/{postId}/sharePost:
 *   post:
 *     summary: Share a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to share
 *     responses:
 *       200:
 *         description: Post shared successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Post not found
 */
router.post('/:postId/sharePost', isAuth, postController.sharePost);

/**
 * @swagger
 * /api/post/{postId}/savePosts:
 *   post:
 *     summary: Save a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to save
 *     responses:
 *       200:
 *         description: Post saved successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Post not found
 */
router.post('/:postId/savePosts', isAuth, postController.savePosts);

/**
 * @swagger
 * /api/post/{postId}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to retrieve
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *       404:
 *         description: Post not found
 */
router.get('/:postId', postController.getPostById);
/**
 * @swagger
 * /api/post/:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *       404:
 *         description: Posts not found
 */
router.get('/' , isAuth , postController.getAllPosts);

/**
 * @swagger
 * /api/post/{postId}/getPostComments:
 *   get:
 *     summary: Get all comments of a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to retrieve comments for
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Post not found
 */
router.get('/:postId/getPostComments', isAuth, postController.getPostComments);

/**
 * @swagger
 * /api/post/{postId}/addComment:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment added successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Post not found
 */
router.post('/:postId/addComment', isAuth, upload.array('files'), postController.addComment);

/**
 * @swagger
 * /api/post/{postId}/{commentId}/updateComment:
 *   put:
 *     summary: Update a comment on a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Comment not found
 */
router.put('/:postId/:commentId/updateComment', isAuth, postController.updateComment);

/**
 * @swagger
 * /api/post/{postId}/{commentId}/deleteComment:
 *   delete:
 *     summary: Delete a comment on a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Comment not found
 */
router.delete('/:postId/:commentId/deleteComment', isAuth, postController.deleteComment);

/**
 * @swagger
 * /api/post/{postId}/{commentId}/reactComment:
 *   post:
 *     summary: React to a comment on a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment to react to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reaction:
 *                 type: string
 *                 enum: [like, love, haha, wow, sad, angry]
 *     responses:
 *       200:
 *         description: Reaction added successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Comment not found
 */
router.post('/:postId/:commentId/reactComment', isAuth, postController.reactComment);

/**
 * @swagger
 * /api/post/{postId}/{commentId}/replyComment:
 *   post:
 *     summary: Reply to a comment on a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment to reply to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reply added successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Comment not found
 */
router.post('/:postId/:commentId/replyComment', isAuth, upload.array('files'), postController.replyComment);

/**
 * @swagger
 * /api/post/{postId}/{commentId}/{replyId}/reactReply:
 *   post:
 *     summary: React to a reply on a comment
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment
 *       - in: path
 *         name: replyId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the reply to react to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reaction:
 *                 type: string
 *                 enum: [like, love, haha, wow, sad, angry]
 *     responses:
 *       200:
 *         description: Reaction added successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Reply not found
 */
router.post('/:postId/:commentId/:replyId/reactReply', isAuth, postController.reactReply);

/**
 * @swagger
 * /api/post/{postId}/{commentId}/{replyId}/deleteReply:
 *   delete:
 *     summary: Delete a reply on a comment
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment
 *       - in: path
 *         name: replyId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the reply to delete
 *     responses:
 *       200:
 *         description: Reply deleted successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Reply not found
 */
router.delete('/:postId/:commentId/:replyId/deleteReply', isAuth, postController.deleteReply);

/**
 * @swagger
 * /api/post/{postId}/comments/{commentId}/replies:
 *   get:
 *     summary: Get all replies to a comment
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment to retrieve replies for
 *     responses:
 *       200:
 *         description: Replies retrieved successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Comment not found
 */
router.get('/:postId/comments/:commentId/replies', isAuth, postController.getCommentReplies);

module.exports = router;
