const { EntitySchema } = require('typeorm');

const CategoriaMedicamento = new EntitySchema({
    name: 'CategoriaMedicamento',
    tableName: 'CATEGORIA_MEDICAMENTO',

    columns: {
        ID_Categoria: {
            type: Number,
            primary: true,
            generated: true
        },

        Nombre_Categoria: {
            type: String,
            length: 100,
            nullable: false
        }
    },
    
    relations: {
        medicamentos: {
            type: 'one-to-many',
            target: 'Medicamento',
            inverseSide: 'categoria'
        }
    }
});

module.exports = CategoriaMedicamento;