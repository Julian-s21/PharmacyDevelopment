const AppDataSource = require('../config/database');
const GastoPlanilla = require('../models/gastoPlanilla.model');

const gastoPlanillaRepository =
    AppDataSource.getRepository(GastoPlanilla);

module.exports = gastoPlanillaRepository;