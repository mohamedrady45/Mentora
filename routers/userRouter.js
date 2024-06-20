const express = require('express');
const methodOverride = require('method-override');
const upload = require('../middlewares/uploadFile');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const isAuth = require('../middlewares/isAuth');
const OnlyAdmins = require('../middlewares/OnlyAdmins');

const router = express.Router();
router.use(methodOverride('_method'));

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and administration
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user's profile information
 */
router.get('/', isAuth, userController.getUser);

/**
 * @swagger
 * /api/user/updateUserData:
 *   put:
 *     summary: Update user data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User data updated successfully
 */
router.put('/updateUserData', isAuth, upload.single('image'), userController.editUserData);

/**
 * @swagger
 * /api/user/followUser/{followId}:
 *   put:
 *     summary: Follow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: followId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to follow
 *     responses:
 *       200:
 *         description: User followed successfully
 */
router.put('/followUser/:followId', isAuth, userController.followUser);

/**
 * @swagger
 * /api/user/followers:
 *   get:
 *     summary: Get list of followers
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of followers
 */
router.get('/followers', isAuth, userController.followerList);

/**
 * @swagger
 * /api/user/following:
 *   get:
 *     summary: Get list of users followed
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users followed
 */
router.get('/following', isAuth, userController.followingList);

/**
 * @swagger
 * /api/user/schedule:
 *   get:
 *     summary: Get user's schedule
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's schedule
 */
router.get('/schedule', isAuth, userController.scheduleList);

/**
 * @swagger
 * /api/user/search:
 *   get:
 *     summary: Search for users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of users matching the search query
 */
router.get('/search', isAuth, userController.searchUser);

/**
 * @swagger
 * /api/user/admin/promote/{id}:
 *   patch:
 *     summary: Promote user to admin
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to promote
 *     responses:
 *       200:
 *         description: User promoted to admin successfully
 */
router.patch('/admin/promote/:id', isAuth, OnlyAdmins, adminController.promoteToAdmin);

/**
 * @swagger
 * /api/user/admin/getAllApplications:
 *   get:
 *     summary: Get all admin applications
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admin applications
 */
router.get('/admin/getAllApplications', isAuth, OnlyAdmins, adminController.getAllApplications);

/**
 * @swagger
 * /api/user/admin/acceptRequest/{id}:
 *   post:
 *     summary: Accept user application
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the application to accept
 *     responses:
 *       200:
 *         description: Application accepted successfully
 */
router.post('/admin/acceptRequest/:id', isAuth, OnlyAdmins, adminController.acceptRequest);

/**
 * @swagger
 * /api/user/admin/rejectRequest/{id}:
 *   post:
 *     summary: Reject user application
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the application to reject
 *     responses:
 *       200:
 *         description: Application rejected successfully
 */
router.post('/admin/rejectRequest/:id', isAuth, OnlyAdmins, adminController.rejectRequest);

module.exports = router;
