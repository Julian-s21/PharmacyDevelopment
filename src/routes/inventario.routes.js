const express = require('express');

const inventarioController =
    require('../controllers/inventario.controller');

const validarInventario =
    require('../middleware/inventario.validation');

const router = express.Router();

router.get('/medicamento/:id', inventarioController.obtenerPorMedicamento);

router.get(
    '/',
    inventarioController.obtenerTodos
);

router.get(
    '/:id',
    inventarioController.obtenerPorId
);

router.post(
    '/',
    validarInventario,
    inventarioController.crear
);

router.put(
    '/:id',
    validarInventario,
    inventarioController.actualizar
);

router.delete(
    '/:id',
    inventarioController.eliminar
);

module.exports = router;
