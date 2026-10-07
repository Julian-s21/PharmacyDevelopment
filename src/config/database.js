require('reflect-metadata');

const { DataSource } = require('typeorm');
require('dotenv').config();

// Modelos
const Sucursal = require('../models/sucursal.model');
const Usuario = require('../models/usuario.model');
const CategoriaMedicamento = require('../models/categoriaMedicamento.model');
const Medicamento = require('../models/medicamento.model');
const Inventario = require('../models/inventario.model');
const MovimientoInventario = require('../models/movimientoInventario.model');
const Transferencia = require('../models/transferencia.model');
const DetalleTransferencia = require('../models/detalleTransferencia.model');
const Distribucion = require('../models/distribucion.model');
const DetalleDistribucion = require('../models/detalleDistribucion.model');
const MovimientoFinanciero = require('../models/movimientoFinanciero.model');
const GastoPlanilla = require('../models/gastoPlanilla.model');
const ActivoFijo = require('../models/activoFijo.model');
const FlujoEfectivo = require('../models/flujoEfectivo.model');

const walletOptions = process.env.ORACLE_WALLET_DIR
    ? {
        configDir: process.env.ORACLE_WALLET_DIR,
        walletLocation: process.env.ORACLE_WALLET_DIR,
        ...(process.env.ORACLE_WALLET_PASSWORD
            ? { walletPassword: process.env.ORACLE_WALLET_PASSWORD }
            : {})
    }
    : {};

const AppDataSource = new DataSource({
    type: 'oracle',

    username: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,

    connectString: process.env.ORACLE_CONNECT_STRING,
    extra: walletOptions,

    entities: [
        Sucursal,
        Usuario,
        CategoriaMedicamento,
        Medicamento,
        Inventario,
        MovimientoInventario,
        Transferencia,
        DetalleTransferencia,
        Distribucion,
        DetalleDistribucion,
        MovimientoFinanciero,
        GastoPlanilla,
        ActivoFijo,
        FlujoEfectivo
    ],

    migrations: [
    __dirname + '/../migrations/*.js'
    ],
    
    synchronize: false,

    logging: true
});

module.exports = AppDataSource;

/*const AppDataSource = new DataSource({
    type: 'oracle',
    username: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING,

    entities: [
        Sucursal,
        Usuario,
        CategoriaMedicamento,
        Medicamento,
        Inventario,
        MovimientoInventario,
        Transferencia,
        DetalleTransferencia,
        Distribucion,
        DetalleDistribucion,
        MovimientoFinanciero,
        GastoPlanilla,
        ActivoFijo,
        FlujoEfectivo
    ],

    migrations: [
        __dirname + '/../migrations/*.{js,ts}'
    ],

    synchronize: false,

    logging: true
});*/
