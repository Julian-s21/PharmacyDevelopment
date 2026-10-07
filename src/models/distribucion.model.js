const { EntitySchema } = require('typeorm');

const Distribucion = new EntitySchema({
    name: 'Distribucion',
    tableName: 'DISTRIBUCION',

    columns: {
        ID_Distribucion: {
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

        Fecha_Distribucion: {
            type: 'timestamp',
            nullable: false
        },

        Estado_Distribucion: {
            type: String,
            length: 50,
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
    },

    detalles: {
        type: 'one-to-many',
        target: 'DetalleDistribucion',
        inverseSide: 'distribucion'
    }
}
});

module.exports = Distribucion;