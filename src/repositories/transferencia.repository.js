const AppDataSource = require('../config/database');
const Transferencia = require('../models/transferencia.model');

const transferenciaRepository =
    AppDataSource.getRepository(Transferencia);

module.exports = transferenciaRepository;