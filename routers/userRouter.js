const express = require('express');
const methodOverride = require('method-override');

const userController = require('../controllers/userController');
const isAuth = require("../middlewares/isAuth");
const upload=require('../middlewares/uploadFile')
const adminController = require('../controllers/adminController');
const OnlyAdmins = require('../middlewares/OnlyAdmins');

const router = express.Router();
router.use(methodOverride('_method'));


router.get('/:userId',isAuth,userController.getUser);
router.put('/updateUserData',isAuth,upload.single('image'),userController.editUserData);
router.put('/followUser/:followId',isAuth,userController.followUser);
router.get('/followers',isAuth,userController.followerList);
router.get('/following',isAuth,userController.followingList);
router.get('/schedule',isAuth,userController.scheduleList);
router.get('/search', isAuth,userController.searchUser);
router.patch('/admin/promote/:id',isAuth , OnlyAdmins, adminController.promoteToAdmin);
router.get('/admin/getAllApplications' , isAuth,OnlyAdmins , adminController.getAllApplications);
router.post('/admin/acceptRequest/:id' , isAuth,OnlyAdmins , adminController.acceptRequest);
router.post('/admin/rejectRequest/:id' , isAuth,OnlyAdmins , adminController.rejectRequest);

module.exports = router;

