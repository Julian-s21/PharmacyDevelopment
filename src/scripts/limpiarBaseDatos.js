require('reflect-metadata');
require('dotenv').config();

const AppDataSource = require('../config/database');

const tablas = [
    'DETALLE_TRANSFERENCIA',
    'DETALLE_DISTRIBUCION',
    'MOVIMIENTO_INVENTARIO',
    'INVENTARIO',
    'TRANSFERENCIA',
    'DISTRIBUCION',
    'MOVIMIENTO_FINANCIERO',
    'GASTO_PLANILLA',
    'ACTIVO_FIJO',
    'FLUJO_EFECTIVO',
    'MEDICAMENTO',
    'CATEGORIA_MEDICAMENTO',
    'USUARIO',
    'SUCURSAL'
];

async function limpiarBaseDatos() {
    try {
        await AppDataSource.initialize();

        console.log('Conectado a Oracle.');

        const queryRunner = AppDataSource.createQueryRunner();

        for (const tabla of tablas) {
            try {
                await queryRunner.query(`DROP TABLE "${tabla}" CASCADE CONSTRAINTS`);
                console.log(`Tabla eliminada: ${tabla}`);
            } catch (error) {
                console.log(`No se pudo eliminar ${tabla}: ${error.message}`);
            }
        }

        await queryRunner.release();
        await AppDataSource.destroy();

        console.log('\nBase de datos limpiada correctamente.');
    } catch (error) {
        console.error('Error:', error);
    }
}

limpiarBaseDatos();