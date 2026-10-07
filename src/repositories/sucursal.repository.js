const AppDataSource = require('../config/database');

const Sucursal = require('../models/sucursal.model');

const sucursalRepository = AppDataSource.getRepository(Sucursal);

module.exports = sucursalRepository;