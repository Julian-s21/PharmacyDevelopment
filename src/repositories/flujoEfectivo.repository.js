const AppDataSource = require('../config/database');
const FlujoEfectivo = require('../models/flujoEfectivo.model');

const flujoEfectivoRepository =
    AppDataSource.getRepository(FlujoEfectivo);

module.exports = flujoEfectivoRepository;