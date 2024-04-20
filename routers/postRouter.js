const express = require('express');

const postController = require('../controllers/postController');
const upload = require('../middlewares/uploadFile')
const router = express.Router();

//http://localhost:4000/api/post
//Post
router.post('/',  upload.array('files'), postController.addPost );
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.post('/:id/reactPost', postController.reactPost);
router.get('/getAllPosts', postController.getAllPosts);
router.post('/:id/sharePost', postController.sharePost);
//comment
router.post('/:id/addComment',upload.array('files'), postController.addComment);
router.put('/updateComment/:id', postController.updateComment);
router.delete('/:postId/:commentId/deleteComment', postController.deleteComment);
router.post('/:id/reactComment', postController.reactComment);
//reply
router.post('/:postId/:commentId/replyComment',upload.array('files'), postController.replyComment);
router.post('/:commentId/:replyId/reactReply',postController.reactReply);
router.delete('/:commentId/:replyId/deleteReply', postController.deleteRely);

router.post('/:id/savePosts', postController.savePosts);


module.exports = router;