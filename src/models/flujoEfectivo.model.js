const { EntitySchema } = require('typeorm');

const FlujoEfectivo = new EntitySchema({
    name: 'FlujoEfectivo',
    tableName: 'FLUJO_EFECTIVO',

    columns: {
        ID_Flujo_Efectivo: {
            type: Number,
            primary: true,
            generated: true
        },

        ID_Sucursal: {
            type: Number,
            nullable: false
        },

        Fecha_Inicio_Flujo: {
            type: 'timestamp',
            nullable: false
        },

        Fecha_Fin_Flujo: {
            type: 'timestamp',
            nullable: false
        },

        Saldo_Flujo: {
            type: 'decimal',
            precision: 12,
            scale: 2,
            nullable: false
        },

        Total_Ingresos_Flujo: {
            type: 'decimal',
            precision: 12,
            scale: 2,
            nullable: false
        },

        Total_Egresos_Flujo: {
            type: 'decimal',
            precision: 12,
            scale: 2,
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
    }
}


});

module.exports = FlujoEfectivo;