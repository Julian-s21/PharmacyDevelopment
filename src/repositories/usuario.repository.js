const AppDataSource = require('../config/database');
const Usuario = require('../models/usuario.model');

const usuarioRepository = AppDataSource.getRepository(Usuario);

module.exports = usuarioRepository;