const express = require('express');

const postController = require('../controllers/postController');

const isAuth = require('../middlewares/isAuth');
const upload=require('../middlewares/uploadFile')
const router = express.Router();
// https://mentora-5s1z.onrender.com/api/post/addpost
router.post('/addPost',isAuth,  upload.array('files'), postController.addPost );
router.put('/:postId/updatePost',isAuth, postController.updatePost);
router.delete('/:postId/deletePost',isAuth, postController.deletePost);
router.post('/:postId/reactPost', isAuth, postController.reactPost);
router.post('/:postI/sharePost', isAuth, postController.sharePost);
router.post('/:postId/savePosts', isAuth, postController.savePosts);
router.get('/:postId', postController.getPostById);
//Comment
router.get('/:postId/getPostComments' , isAuth, postController.getPostComments)
router.post('/:postId/addComment', isAuth,upload.array('files'), postController.addComment);
router.put('/:postId/:commentId/updateComment', isAuth, postController.updateComment);
router.delete('/:postId/:commentId/deleteComment', isAuth, postController.deleteComment);
router.post('/:postId/commentId/reactComment', isAuth, postController.reactComment);
//Reply
router.post('/:postId/:commentId/replyComment', isAuth,upload.array('files'), postController.replyComment);
router.post('/:postId/:commentId/:replyId/reactReply', isAuth, postController.reactReply);
router.delete('/:postId/:commentId/:replyId/deleteReply', isAuth, postController.deleteReply);
router.get('/:postId/comments/:commentId/replies' , isAuth , postController.getCommentReplies)

module.exports = router;