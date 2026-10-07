const { EntitySchema } = require('typeorm');

const Medicamento = new EntitySchema({
    name: 'Medicamento',
    tableName: 'MEDICAMENTO',

    columns: {
        ID_Medicamento: {
            type: Number,
            primary: true,
            generated: true
        },

        ID_Categoria: {
            type: Number,
            nullable: false
        },

        Nombre_Medicamento: {
            type: String,
            length: 150,
            nullable: false
        },

        Codigo_Medicamento: {
            type: String,
            length: 100,
            nullable: true
        },

        Presentacion: {
            type: String,
            length: 150,
            nullable: true
        },

        Descripcion_Medicamento: {
            type: String,
            length: 500,
            nullable: true
        },

        Precio_Medicamento: {
            type: 'decimal',
            precision: 10,
            scale: 2,
            nullable: false
        }
    },

    relations: {
    categoria: {
        type: 'many-to-one',
        target: 'CategoriaMedicamento',
        joinColumn: {
            name: 'ID_Categoria',
            referencedColumnName: 'ID_Categoria'
        },
        nullable: false
    },

    inventarios: {
        type: 'one-to-many',
        target: 'Inventario',
        inverseSide: 'medicamento'
    },

    detallesTransferencia: {
    type: 'one-to-many',
    target: 'DetalleTransferencia',
    inverseSide: 'medicamento'
    },

    detallesDistribucion: {
    type: 'one-to-many',
    target: 'DetalleDistribucion',
    inverseSide: 'medicamento'
    }
}
});

module.exports = Medicamento;
