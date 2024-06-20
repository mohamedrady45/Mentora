const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Account
 *   description: Authentication related endpoints
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *     RegisterRequest:
 *       type: object
 *       required:
 *        - firstName
 *        - lastName
 *        - email
 *        - password
 *        - dateOfBirth
 *        - gender
 *        - country
 *        - bio
 *        - profilePicture
 *        - languages
 *        - interests
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *         country:
 *           type: string
 *         bio:
 *           type: string
 *         profilePicture:
 *           type: string
 *         languages:
 *           type: array
 *           items:
 *              type: string
 *         interests:
 *           type: array
 *           items:
 *              type: string
 *     VerifyOTPRequest:
 *       type: object
 *       required:
 *         - inputOtp
 *       properties:
 *         inputOtp:
 *           type: string
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *     SetNewPasswordRequest:
 *       type: object
 *       required:
 *         - newPassword
 *         - email
 *       properties:
 *         newPassword:
 *           type: string
 *         email:
 *           type: string
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 */

/**
 * @swagger
 * /api/user/getAll:
 *   get:
 *     summary: Get all users
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get('/getAll', authController.getAllUsers);

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/user/verifyRegisterOTP:
 *   post:
 *     summary: Verify registration OTP
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOTPRequest'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */
router.post('/verifyRegisterOTP', authController.verifyRegisterOTP);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/user/resetPassword:
 *   post:
 *     summary: Reset password
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post('/resetPassword', authController.resetPassword);

/**
 * @swagger
 * /api/user/verifyPasswordResetOTP:
 *   post:
 *     summary: Verify password reset OTP
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOTPRequest'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */
router.post('/verifyPasswordResetOTP', authController.verifyPasswordResetOTP);

/**
 * @swagger
 *  /api/user/setNewPassword:
 *   post:
 *     summary: Set new password
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SetNewPasswordRequest'
 *     responses:
 *       200:
 *         description: New password set successfully
 */
router.post('/setNewPassword', authController.setNewPassword);

/**
 * @swagger
 *  /api/user/refreshToken:
 *   post:
 *     summary: Refresh authentication token
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.post('/refreshToken', authController.refreshToken);

module.exports = router;
