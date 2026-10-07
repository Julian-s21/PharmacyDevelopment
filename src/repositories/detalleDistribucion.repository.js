const AppDataSource = require('../config/database');
const DetalleDistribucion = require('../models/detalleDistribucion.model');

const detalleDistribucionRepository =
    AppDataSource.getRepository(DetalleDistribucion);

module.exports = detalleDistribucionRepository;