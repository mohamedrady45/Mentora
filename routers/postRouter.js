const express = require('express');

const postController = require('../controllers/postController');

const isAuth = require('../middlewares/isAuth');
const upload=require('../middlewares/uploadFile')
const router = express.Router();

router.post('/addPost',isAuth,  upload.array('files'), postController.addPost );
router.put('/:id',isAuth, postController.updatePost);
router.delete('/:id',isAuth, postController.deletePost);
router.post('/:id/reactPost', isAuth, postController.reactPost);
router.post('/:id/sharePost', isAuth, postController.sharePost);
router.post('/:id/savePosts', isAuth, postController.savePosts);

//Comment
router.post('/:id/addComment', isAuth, upload.array('files'), postController.addComment);
router.put('/updateComment/:id', isAuth, postController.updateComment);
router.delete('/:id/deleteComment', isAuth, postController.deleteComment);
router.post('/:id/reactComment', isAuth, postController.reactComment);
//Reply
router.post('/:postId/:commentId/replyComment', isAuth, upload.array('files'), postController.replyComment);
router.post('/:commentId/:replyId/reactReply', isAuth, postController.reactReply);
router.delete('/:commentId/:replyId/deleteReply', isAuth, postController.deleteRely);

module.exports = router;