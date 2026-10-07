const express = require('express');

const gastoPlanillaController =
    require('../controllers/gastoPlanilla.controller');

const validarGastoPlanilla =
    require('../middleware/gastoPlanilla.validation');

const router = express.Router();

router.get(
    '/',
    gastoPlanillaController.obtenerTodos
);

router.get(
    '/:id',
    gastoPlanillaController.obtenerPorId
);

router.post(
    '/',
    validarGastoPlanilla,
    gastoPlanillaController.crear
);

router.put(
    '/:id',
    validarGastoPlanilla,
    gastoPlanillaController.actualizar
);

router.delete(
    '/:id',
    gastoPlanillaController.eliminar
);

module.exports = router;