const AppDataSource = require('../config/database');
const DetalleTransferencia = require('../models/detalleTransferencia.model');

const detalleTransferenciaRepository =
    AppDataSource.getRepository(DetalleTransferencia);

module.exports = detalleTransferenciaRepository;