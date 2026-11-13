const AppDataSource = require('../config/database');

async function limpiarInventarioHuerfano() {
    try {
        await AppDataSource.initialize();

        console.log('\n=== LIMPIEZA DE INVENTARIO HUÉRFANO ===\n');

        // Buscar el inventario problemático
        const inventarios = await AppDataSource.query(`
            SELECT
                i."ID_Inventario" AS "ID_INVENTARIO",
                i."ID_Sucursal" AS "ID_SUCURSAL",
                i."ID_Medicamento" AS "ID_MEDICAMENTO",
                i."Cantidad_Inventario" AS "CANTIDAD"
            FROM "INVENTARIO" i
            LEFT JOIN "SUCURSAL" s
                ON i."ID_Sucursal" = s."ID_Sucursal"
            LEFT JOIN "MEDICAMENTO" m
                ON i."ID_Medicamento" = m."ID_Medicamento"
            WHERE s."ID_Sucursal" IS NULL
               OR m."ID_Medicamento" IS NULL
        `);

        if (inventarios.length === 0) {
            console.log('✓ No existen inventarios huérfanos.');
            return;
        }

        console.log('Inventarios huérfanos encontrados:');
        console.table(inventarios);

        for (const inventario of inventarios) {

            const idInventario = inventario.ID_INVENTARIO;

            // Verificar movimientos asociados
            const movimientos = await AppDataSource.query(`
                SELECT "ID_Movimiento_Inventario"
                FROM "MOVIMIENTO_INVENTARIO"
                WHERE "ID_Inventario" = :1
            `, [idInventario]);

            if (movimientos.length > 0) {
                console.log(
                    `⚠ No se eliminará el inventario ${idInventario} porque tiene movimientos asociados.`
                );
                continue;
            }

            // Eliminar únicamente el inventario huérfano
            await AppDataSource.query(`
                DELETE FROM "INVENTARIO"
                WHERE "ID_Inventario" = :1
            `, [idInventario]);

            console.log(
                `✓ Inventario ${idInventario} eliminado correctamente.`
            );
        }

        console.log('\n=== LIMPIEZA FINALIZADA ===\n');

    } catch (error) {
        console.error('\n❌ Error durante la limpieza:', error);

    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

limpiarInventarioHuerfano();