const express = require('express');

const movimientoFinancieroController =
    require('../controllers/movimientoFinanciero.controller');

const validarMovimientoFinanciero =
    require('../middleware/movimientoFinanciero.validation');

const router = express.Router();

router.get(
    '/',
    movimientoFinancieroController.obtenerTodos
);

router.get(
    '/:id',
    movimientoFinancieroController.obtenerPorId
);

router.post(
    '/',
    validarMovimientoFinanciero,
    movimientoFinancieroController.crear
);

router.put(
    '/:id',
    validarMovimientoFinanciero,
    movimientoFinancieroController.actualizar
);

router.delete(
    '/:id',
    movimientoFinancieroController.eliminar
);

module.exports = router;