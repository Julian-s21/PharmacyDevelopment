const express = require('express');

const detalleDistribucionController =
    require('../controllers/detalleDistribucion.controller');

const validarDetalleDistribucion =
    require('../middleware/detalleDistribucion.validation');

const router = express.Router();

router.get(
    '/',
    detalleDistribucionController.obtenerTodos
);

router.get(
    '/:id',
    detalleDistribucionController.obtenerPorId
);

router.post(
    '/',
    validarDetalleDistribucion,
    detalleDistribucionController.crear
);

router.put(
    '/:id',
    validarDetalleDistribucion,
    detalleDistribucionController.actualizar
);

router.delete(
    '/:id',
    detalleDistribucionController.eliminar
);

module.exports = router;