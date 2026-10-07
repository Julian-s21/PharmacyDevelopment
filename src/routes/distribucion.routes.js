const express = require('express');

const distribucionController =
    require('../controllers/distribucion.controller');

const validarDistribucion =
    require('../middleware/distribucion.validation');

const router = express.Router();

router.get(
    '/',
    distribucionController.obtenerTodas
);

router.get(
    '/:id',
    distribucionController.obtenerPorId
);

router.post(
    '/',
    validarDistribucion,
    distribucionController.crear
);

router.put(
    '/:id',
    validarDistribucion,
    distribucionController.actualizar
);
router.post(
    '/completa',
    distribucionController.crearDistribucionCompleta
);
router.delete(
    '/:id',
    distribucionController.eliminar
);

module.exports = router;