const express = require('express');

const flujoEfectivoController =
    require('../controllers/flujoEfectivo.controller');

const validarFlujoEfectivo =
    require('../middleware/flujoEfectivo.validation');

const router = express.Router();

router.get(
    '/',
    flujoEfectivoController.obtenerTodos
);

router.get(
    '/:id',
    flujoEfectivoController.obtenerPorId
);

router.post(
    '/',
    validarFlujoEfectivo,
    flujoEfectivoController.crear
);

router.put(
    '/:id',
    validarFlujoEfectivo,
    flujoEfectivoController.actualizar
);

router.delete(
    '/:id',
    flujoEfectivoController.eliminar
);

module.exports = router;