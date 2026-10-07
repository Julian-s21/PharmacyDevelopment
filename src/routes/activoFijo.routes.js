const express = require('express');

const activoFijoController =
    require('../controllers/activoFijo.controller');

const validarActivoFijo =
    require('../middleware/activoFijo.validation');

const router = express.Router();

router.get(
    '/',
    activoFijoController.obtenerTodos
);

router.get(
    '/:id',
    activoFijoController.obtenerPorId
);

router.post(
    '/',
    validarActivoFijo,
    activoFijoController.crear
);

router.put(
    '/:id',
    validarActivoFijo,
    activoFijoController.actualizar
);

router.delete(
    '/:id',
    activoFijoController.eliminar
);

module.exports = router;