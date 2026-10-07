const { EntitySchema } = require('typeorm');

const Inventario = new EntitySchema({
    name: 'Inventario',
    tableName: 'INVENTARIO',

    columns: {
        ID_Inventario: {
            type: Number,
            primary: true,
            generated: true
        },

        ID_Sucursal: {
            type: Number,
            nullable: false
        },

        ID_Medicamento: {
            type: Number,
            nullable: false
        },

        Cantidad_Inventario: {
            type: Number,
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

    medicamento: {
        type: 'many-to-one',
        target: 'Medicamento',
        joinColumn: {
            name: 'ID_Medicamento',
            referencedColumnName: 'ID_Medicamento'
        },
        nullable: false
    },

    movimientos: {
        type: 'one-to-many',
        target: 'MovimientoInventario',
        inverseSide: 'inventario'
    }
}
    
});

module.exports = Inventario;