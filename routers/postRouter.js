const express = require('express');

const postController = require('../controllers/postController');

const isAuth = require('../middlewares/isAuth');
const upload=require('../middlewares/uploadFile')
const router = express.Router();

router.post('/',  upload.array('files'), postController.addPost );
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.post('/:id/reactPost', postController.reactPost);
router.post('/:id/addComment',upload.array('files'), postController.addComment);
router.delete('/:id/deleteComment', postController.deleteComment);
router.post('/:id/reactComment', postController.reactComment);
router.post('/:id/replyComment', postController.replyComment);
router.post('/:id/sharePost', postController.sharePost);
router.post('/:id/savePosts', postController.savePosts);


module.exports = router;