const AppDataSource = require('../config/database');
const CategoriaMedicamento = require('../models/categoriaMedicamento.model');

const categoriaMedicamentoRepository =
    AppDataSource.getRepository(CategoriaMedicamento);

module.exports = categoriaMedicamentoRepository;