const { EntitySchema } = require('typeorm');

const MovimientoFinanciero = new EntitySchema({
    name: 'MovimientoFinanciero',
    tableName: 'MOVIMIENTO_FINANCIERO',

    columns: {
        ID_Movimiento_Financiero: {
            type: Number,
            primary: true,
            generated: true
        },

        ID_Sucursal: {
            type: Number,
            nullable: false
        },

        ID_Usuario: {
            type: Number,
            nullable: false
        },

        Tipo_Movimiento_Financiero: {
            type: String,
            length: 50,
            nullable: false
        },

        Concepto_Movimiento_Financiero: {
            type: String,
            length: 250,
            nullable: false
        },

        Monto_Movimiento_Financiero: {
            type: 'decimal',
            precision: 12,
            scale: 2,
            nullable: false
        },

        Fecha_Movimiento_Financiero: {
            type: 'timestamp',
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

module.exports = MovimientoFinanciero;