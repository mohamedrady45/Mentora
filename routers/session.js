const express = require('express');
const router = express.Router();

const sessionController = require('../controllers/SessionController');

const isAuth = require("../middlewares/isAuth");
const upload=require('../middlewares/uploadFile')


router.post('/:reqId', isAuth , sessionController.createSession );  
router.put('/:sessionId', isAuth , sessionController.confirmSession );
router.post('/uploadMatrial/:sessionId', isAuth ,upload.array('Attachment') , sessionController.addMatrial );  
router.get('/getMentorSessions', isAuth , sessionController.getMentorSessions );
router.get('/getMenteeSessions', isAuth , sessionController.getMenteeSessions );
router.get('/getSession/:sessionId', isAuth , sessionController.getSession);

module.exports = router;