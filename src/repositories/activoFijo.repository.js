const AppDataSource = require('../config/database');
const ActivoFijo = require('../models/activoFijo.model');

const activoFijoRepository =
    AppDataSource.getRepository(ActivoFijo);

module.exports = activoFijoRepository;