const AppDataSource = require('../config/database');
const Medicamento = require('../models/medicamento.model');

const medicamentoRepository =
    AppDataSource.getRepository(Medicamento);

module.exports = medicamentoRepository;