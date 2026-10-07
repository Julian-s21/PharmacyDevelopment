const { EntitySchema } = require('typeorm');

const Usuario = new EntitySchema({
    name: 'Usuario',
    tableName: 'USUARIO',

    columns: {
        ID_Usuario: {
            type: Number,
            primary: true,
            generated: true
        },

        ID_Sucursal: {
            type: Number,
            nullable: false
        },

        Nombre_Usuario: {
            type: String,
            length: 100,
            nullable: false
        },

        Apellido_Usuario: {
            type: String,
            length: 100,
            nullable: false
        },

        Correo_Usuario: {
            type: String,
            length: 150,
            nullable: false
        },

        Contrasena_Usuario: {
            type: String,
            length: 255,
            nullable: false
        }
    },

    relations: {
    sucursal: {
        type: 'many-to-one',
        target: 'Sucursal',
        joinColumn: {
            name: 'ID_Sucursal',
            referencedColumnName: 'ID_Sucursal'
        },
        nullable: false
    },

    movimientosInventario: {
        type: 'one-to-many',
        target: 'MovimientoInventario',
        inverseSide: 'usuario'
    },

    transferencias: {
    type: 'one-to-many',
    target: 'Transferencia',
    inverseSide: 'usuario'
    },

    distribuciones: {
    type: 'one-to-many',
    target: 'Distribucion',
    inverseSide: 'usuario'
    },

    movimientosFinancieros: {
    type: 'one-to-many',
    target: 'MovimientoFinanciero',
    inverseSide: 'usuario'
    },

    gastosPlanilla: {
    type: 'one-to-many',
    target: 'GastoPlanilla',
    inverseSide: 'sucursal'
    }
}
});

module.exports = Usuario;