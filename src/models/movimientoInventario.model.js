const { EntitySchema } = require('typeorm');

const MovimientoInventario = new EntitySchema({
    name: 'MovimientoInventario',
    tableName: 'MOVIMIENTO_INVENTARIO',

    columns: {
        ID_Movimiento_Inventario: {
            type: Number,
            primary: true,
            generated: true
        },

        ID_Inventario: {
            type: Number,
            nullable: false
        },

        ID_Usuario: {
            type: Number,
            nullable: false
        },

        Tipo_Movimiento_Inventario: {
            type: String,
            length: 50,
            nullable: false
        },

        Cantidad_Movimiento_Inventario: {
            type: Number,
            nullable: false
        },

        Observacion_Movimiento_Inventario: {
            type: String,
            length: 500,
            nullable: true
        },

        Fecha_Movimiento_Inventario: {
            type: 'timestamp',
            nullable: false
        }
    },

    relations: {
        inventario: {
            type: 'many-to-one',
            target: 'Inventario',
            joinColumn: {
                name: 'ID_Inventario',
                referencedColumnName: 'ID_Inventario'
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
        }
    }
});

module.exports = MovimientoInventario;
