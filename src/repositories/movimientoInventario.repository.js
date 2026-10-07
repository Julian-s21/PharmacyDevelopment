const AppDataSource = require('../config/database');
const MovimientoInventario = require('../models/movimientoInventario.model');

const movimientoInventarioRepository =
    AppDataSource.getRepository(MovimientoInventario);

module.exports = movimientoInventarioRepository;