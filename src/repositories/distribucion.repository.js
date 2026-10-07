const AppDataSource = require('../config/database');
const Distribucion = require('../models/distribucion.model');

const distribucionRepository =
    AppDataSource.getRepository(Distribucion);

module.exports = distribucionRepository;