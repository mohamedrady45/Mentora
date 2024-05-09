const express = require('express');

const authController = require('../controllers/authController');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

router.get('/getAll', authController.getAllUsers);
router.post('/register', authController.register);
router.post('/verifyRegisterOTP', authController.verifyRegisterOTP);
router.post('/login', authController.login);
router.post('/resetPassword', authController.resetPassword);
router.post('/verifyPasswordResetOTP', authController.verifyPasswordResetOTP);
router.post('/verifyPasswordResetOTP', authController.setNewPassword);

/*router.post('/facebooklogin', authController.facebookLogin); 
router.post('/googlelogin', authController.googleLogin);*/

router.post('/refreshToken',authController.refreshToken);



module.exports = router;
