const AppDataSource = require('../config/database');
const MovimientoFinanciero = require('../models/movimientoFinanciero.model');

const movimientoFinancieroRepository =
    AppDataSource.getRepository(MovimientoFinanciero);

module.exports = movimientoFinancieroRepository;