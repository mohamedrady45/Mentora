const express = require('express');

const postController = require('../controllers/postController');

const isAuth = require('../middlewares/isAuth');
const upload=require('../middlewares/uploadFile')
const router = express.Router();

router.post('/',isAuth,  upload.array('files'), postController.addPost );
router.put('/:id',isAuth, postController.updatePost);
router.delete('/:id',isAuth, postController.deletePost);
router.post('/:id/reactPost',isAuth, postController.reactPost);
router.post('/:id/addComment',isAuth,upload.array('files'), postController.addComment);
router.delete('/:id/deleteComment',isAuth, postController.deleteComment);
router.post('/:id/reactComment', isAuth,postController.reactComment);
router.post('/:id/replyComment', isAuth,postController.replyComment);
router.post('/:id/sharePost',isAuth, postController.sharePost);
router.post('/:id/savePosts',isAuth, postController.savePosts);


module.exports = router;