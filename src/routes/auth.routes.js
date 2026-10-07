const express = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/login', authController.iniciarSesion);
router.get('/session', authenticate, authController.obtenerSesion);
router.post('/logout', authController.cerrarSesion);

module.exports = router;
