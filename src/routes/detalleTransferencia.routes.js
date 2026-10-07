const express = require('express');

const detalleTransferenciaController =
    require('../controllers/detalleTransferencia.controller');

const validarDetalleTransferencia =
    require('../middleware/detalleTransferencia.validation');

const router = express.Router();

router.get(
    '/',
    detalleTransferenciaController.obtenerTodos
);

router.get(
    '/:id',
    detalleTransferenciaController.obtenerPorId
);

router.post(
    '/',
    validarDetalleTransferencia,
    detalleTransferenciaController.crear
);

router.put(
    '/:id',
    validarDetalleTransferencia,
    detalleTransferenciaController.actualizar
);

router.delete(
    '/:id',
    detalleTransferenciaController.eliminar
);

module.exports = router;