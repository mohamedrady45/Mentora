const express = require('express');

const postController = require('../controllers/postController');

const isAuth = require('../middlewares/isAuth');

const router = express.Router();

router.post('/post', postController.addPost);
router.post('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.post('/:id/reactPost', postController.reactPost);
router.post('/:id/addComment', postController.addComment);
router.post('/:id/reactComment', postController.reactComment);
router.post('/:id/replyComment', postController.replyComment);
router.post('/:id/sharePost', postController.sharePost);
router.post('/:id/savedPosts', postController.savedPosts);
module.exports = router;