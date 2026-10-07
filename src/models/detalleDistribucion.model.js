const { EntitySchema } = require('typeorm');

const DetalleDistribucion = new EntitySchema({
    name: 'DetalleDistribucion',
    tableName: 'DETALLE_DISTRIBUCION',

    columns: {
        ID_Detalle_Distribucion: {
            type: Number,
            primary: true,
            generated: true
        },

        ID_Distribucion: {
            type: Number,
            nullable: false
        },

        ID_Medicamento: {
            type: Number,
            nullable: false
        },

        Cantidad_Distribucion: {
            type: Number,
            nullable: false
        }
    },

    relations: {
    distribucion: {
        type: 'many-to-one',
        target: 'Distribucion',
        joinColumn: {
            name: 'ID_Distribucion',
            referencedColumnName: 'ID_Distribucion'
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

module.exports = DetalleDistribucion;