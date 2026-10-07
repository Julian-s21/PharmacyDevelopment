const express = require('express');

const usuarioController = require('../controllers/usuario.controller');
const validarUsuario = require('../middleware/usuario.validation');

const router = express.Router();

router.get('/', usuarioController.obtenerTodos);

router.get('/:id', usuarioController.obtenerPorId);

router.post(
    '/',
    validarUsuario,
    usuarioController.crear
);

router.put(
    '/:id',
    validarUsuario,
    usuarioController.actualizar
);

router.delete(
    '/:id',
    usuarioController.eliminar
);

module.exports = router;