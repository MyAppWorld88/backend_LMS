const express = require('express');

const router = express.Router();

const {authenticate} = require('../middleware/auth.middleware');
const {registerLibrary,login,getProfile} = require('../controllers/auth');

router.post('/register-library', registerLibrary);
router.post('/login', login);
router.get('/profile',authenticate,getProfile);


module.exports = router;