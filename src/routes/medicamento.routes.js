const express = require('express');

const medicamentoController =
    require('../controllers/medicamento.controller');

const validarMedicamento =
    require('../middleware/medicamento.validation');

const router = express.Router();

router.get(
    '/',
    medicamentoController.obtenerTodos
);

router.get(
    '/:id',
    medicamentoController.obtenerPorId
);

router.post(
    '/',
    validarMedicamento,
    medicamentoController.crear
);

router.put(
    '/:id',
    validarMedicamento,
    medicamentoController.actualizar
);

router.delete(
    '/:id',
    medicamentoController.eliminar
);

module.exports = router;