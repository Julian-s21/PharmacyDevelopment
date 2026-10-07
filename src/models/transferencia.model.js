const { EntitySchema } = require('typeorm');

const Transferencia = new EntitySchema({
    name: 'Transferencia',
    tableName: 'TRANSFERENCIA',

    columns: {
        ID_Transferencia: {
            type: Number,
            primary: true,
            generated: true
        },

        ID_Sucursal_Origen: {
            type: Number,
            nullable: false
        },

        ID_Sucursal_Destino: {
            type: Number,
            nullable: false
        },

        ID_Usuario: {
            type: Number,
            nullable: false
        },

        Fecha_Transferencia: {
            type: 'timestamp',
            nullable: false
        }
    },

    relations: {
    sucursalOrigen: {
        type: 'many-to-one',
        target: 'Sucursal',
        joinColumn: {
            name: 'ID_Sucursal_Origen',
            referencedColumnName: 'ID_Sucursal'
        },
        nullable: false
    },

    sucursalDestino: {
        type: 'many-to-one',
        target: 'Sucursal',
        joinColumn: {
            name: 'ID_Sucursal_Destino',
            referencedColumnName: 'ID_Sucursal'
        },
        nullable: false
    },

    usuario: {
        type: 'many-to-one',
        target: 'Usuario',
        joinColumn: {
            name: 'ID_Usuario',
            referencedColumnName: 'ID_Usuario'
        },
        nullable: false
    },

    detalles: {
        type: 'one-to-many',
        target: 'DetalleTransferencia',
        inverseSide: 'transferencia'
    }
}
});

module.exports = Transferencia;