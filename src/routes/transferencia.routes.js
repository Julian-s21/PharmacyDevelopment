const express = require('express');

const transferenciaController =
    require('../controllers/transferencia.controller');

const validarTransferencia =
    require('../middleware/transferencia.validation');

const router = express.Router();

router.get(
    '/',
    transferenciaController.obtenerTodas
);

router.get(
    '/:id',
    transferenciaController.obtenerPorId
);

router.post(
    '/',
    validarTransferencia,
    transferenciaController.crear
);

router.post(
    '/completa',
    transferenciaController.crearTransferenciaCompleta
);

router.put(
    '/:id',
    transferenciaController.actualizar
);

router.delete(
    '/:id',
    transferenciaController.eliminar
);

module.exports = router;
