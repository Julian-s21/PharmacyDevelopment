const { EntitySchema } = require('typeorm');

const Sucursal = new EntitySchema({
    name: 'Sucursal',

    tableName: 'SUCURSAL',

    columns: {
        ID_Sucursal: {
            type: Number,
            primary: true,
            generated: true
        },

        Nombre_Sucursal: {
            type: String,
            length: 100,
            nullable: false
        },

        Direccion_Sucursal: {
            type: String,
            length: 200,
            nullable: false
        },

        Telefono_Sucursal: {
            type: String,
            length: 20,
            nullable: false
        }
    },

    relations: {
    usuarios: {
        type: 'one-to-many',
        target: 'Usuario',
        inverseSide: 'sucursal'
    },

    inventarios: {
        type: 'one-to-many',
        target: 'Inventario',
        inverseSide: 'sucursal'
    },

    transferenciasOrigen: {
        type: 'one-to-many',
        target: 'Transferencia',
        inverseSide: 'sucursalOrigen'
    },

    transferenciasDestino: {
        type: 'one-to-many',
        target: 'Transferencia',
        inverseSide: 'sucursalDestino'
    },

    distribuciones: {
    type: 'one-to-many',
    target: 'Distribucion',
    inverseSide: 'sucursal'
    },

    movimientosFinancieros: {
    type: 'one-to-many',
    target: 'MovimientoFinanciero',
    inverseSide: 'sucursal'
    },

    gastosPlanilla: {
    type: 'one-to-many',
    target: 'GastoPlanilla',
    inverseSide: 'sucursal'
    },

    activosFijos: {
    type: 'one-to-many',
    target: 'ActivoFijo',
    inverseSide: 'sucursal'
    },

    flujosEfectivo: {
    type: 'one-to-many',
    target: 'FlujoEfectivo',
    inverseSide: 'sucursal'
    }

}
});

module.exports = Sucursal;