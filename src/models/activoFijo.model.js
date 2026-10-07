const { EntitySchema } = require('typeorm');

const ActivoFijo = new EntitySchema({
    name: 'ActivoFijo',
    tableName: 'ACTIVO_FIJO',

    columns: {
        ID_Activo: {
            type: Number,
            primary: true,
            generated: true
        },

        ID_Sucursal: {
            type: Number,
            nullable: false
        },

        Nombre_Activo: {
            type: String,
            length: 150,
            nullable: false
        },

        Descripcion_Activo: {
            type: String,
            length: 500,
            nullable: true
        },

        Precio_Adquisicion_Activo: {
            type: 'decimal',
            precision: 12,
            scale: 2,
            nullable: false
        },

        Vida_Util_Activo: {
            type: Number,
            nullable: true
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

module.exports = ActivoFijo;