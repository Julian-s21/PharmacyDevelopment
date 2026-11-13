

const express = require('express');
const sucursalController = require('../controllers/sucursal.controller');
const validarSucursal = require('../middleware/sucursal.validation');

const router = express.Router();

router.get('/', sucursalController.obtenerTodas);

router.get('/:id', sucursalController.obtenerPorId);

router.post(
    '/',
    validarSucursal,
    sucursalController.crear
);

router.put(
    '/:id',
    validarSucursal,
    sucursalController.actualizar
);

router.delete('/:id', sucursalController.eliminar);

module.exports = router;