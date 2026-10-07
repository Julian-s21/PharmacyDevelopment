const express = require('express');

const categoriaMedicamentoController =
    require('../controllers/categoriaMedicamento.controller');

const validarCategoriaMedicamento =
    require('../middleware/categoriaMedicamento.validation');

const router = express.Router();

router.get(
    '/',
    categoriaMedicamentoController.obtenerTodas
);

router.get(
    '/:id',
    categoriaMedicamentoController.obtenerPorId
);

router.post(
    '/',
    validarCategoriaMedicamento,
    categoriaMedicamentoController.crear
);

router.put(
    '/:id',
    validarCategoriaMedicamento,
    categoriaMedicamentoController.actualizar
);

router.delete(
    '/:id',
    categoriaMedicamentoController.eliminar
);

module.exports = router;