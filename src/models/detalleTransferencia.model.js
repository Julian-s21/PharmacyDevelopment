const { EntitySchema } = require('typeorm');

const DetalleTransferencia = new EntitySchema({
    name: 'DetalleTransferencia',
    tableName: 'DETALLE_TRANSFERENCIA',

    columns: {
        ID_Detalle_Transferencia: {
            type: Number,
            primary: true,
            generated: true
        },

        ID_Transferencia: {
            type: Number,
            nullable: false
        },

        ID_Medicamento: {
            type: Number,
            nullable: false
        },

        Cantidad_Transferencia: {
            type: Number,
            nullable: false
        }
    },
    relations: {
    transferencia: {
        type: 'many-to-one',
        target: 'Transferencia',
        joinColumn: {
            name: 'ID_Transferencia',
            referencedColumnName: 'ID_Transferencia'
        },
        nullable: false
    },

    medicamento: {
        type: 'many-to-one',
        target: 'Medicamento',
        joinColumn: {
            name: 'ID_Medicamento',
            referencedColumnName: 'ID_Medicamento'
        },
        nullable: false
    }
}
});

module.exports = DetalleTransferencia;