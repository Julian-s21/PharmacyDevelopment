const express = require('express');

const movimientoInventarioController =
    require('../controllers/movimientoInventario.controller');

const validarMovimientoInventario =
    require('../middleware/movimientoInventario.validation');

const router = express.Router();

router.get(
    '/',
    movimientoInventarioController.obtenerTodos
);

router.get(
    '/:id',
    movimientoInventarioController.obtenerPorId
);

router.post(
    '/',
    validarMovimientoInventario,
    movimientoInventarioController.crear
);

router.put(
    '/:id',
    validarMovimientoInventario,
    movimientoInventarioController.actualizar
);

router.delete(
    '/:id',
    movimientoInventarioController.eliminar
);

module.exports = router;