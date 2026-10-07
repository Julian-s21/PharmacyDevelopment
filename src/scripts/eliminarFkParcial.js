const AppDataSource = require('../config/database');

async function eliminarFkParcial() {
    try {
        await AppDataSource.initialize();

        console.log('\n=== ELIMINAR FK PARCIAL ===\n');

        const nombreFk = 'FK_951a64f31b65ef3003fc268f362';

        // Verificar que la FK exista
        const fk = await AppDataSource.query(`
            SELECT
                constraint_name,
                table_name
            FROM user_constraints
            WHERE constraint_name = :1
              AND constraint_type = 'R'
        `, [nombreFk]);

        if (fk.length === 0) {
            console.log(`✓ La FK ${nombreFk} no existe.`);
            return;
        }

        console.log(`FK encontrada: ${nombreFk}`);
        console.log(`Tabla: ${fk[0].TABLE_NAME}`);

        // Eliminar únicamente la FK parcial
        await AppDataSource.query(`
            ALTER TABLE "MEDICAMENTO"
            DROP CONSTRAINT "${nombreFk}"
        `);

        console.log(`✓ FK ${nombreFk} eliminada correctamente.`);

        console.log('\n=== PROCESO FINALIZADO ===\n');

    } catch (error) {
        console.error('\n❌ Error:', error);

    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

eliminarFkParcial();
