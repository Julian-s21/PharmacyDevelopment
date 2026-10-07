const AppDataSource = require('../config/database');
const Inventario = require('../models/inventario.model');

const inventarioRepository =
    AppDataSource.getRepository(Inventario);

module.exports = inventarioRepository;