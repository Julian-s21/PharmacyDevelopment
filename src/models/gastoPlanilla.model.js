const { EntitySchema } = require('typeorm');

const GastoPlanilla = new EntitySchema({
    name: 'GastoPlanilla',
    tableName: 'GASTO_PLANILLA',

    columns: {
        ID_Gasto_Planilla: {
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

        Salario_Planilla: {
            type: 'decimal',
            precision: 12,
            scale: 2,
            nullable: false
        },

        Deducciones_Planilla: {
            type: 'decimal',
            precision: 12,
            scale: 2,
            nullable: true
        },

        Total_Planilla: {
            type: 'decimal',
            precision: 12,
            scale: 2,
            nullable: false
        },

        Fecha_Planilla: {
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

module.exports = GastoPlanilla;