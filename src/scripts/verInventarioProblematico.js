const AppDataSource = require('../config/database');

async function verificarInventarioProblematico() {
    try {
        await AppDataSource.initialize();

        console.log('\n=== INVENTARIO PROBLEMÁTICO ===\n');

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
            console.log('✓ No existen inventarios problemáticos.');
            return;
        }

        console.log('⚠ Inventarios con referencias inexistentes:\n');
        console.table(inventarios);

        for (const inventario of inventarios) {

            const idInventario = inventario.ID_INVENTARIO;

            console.log(
                `\n--- Movimientos del inventario ${idInventario} ---`
            );

            const movimientos = await AppDataSource.query(`
                SELECT
                    "ID_Movimiento_Inventario" AS "ID_MOVIMIENTO",
                    "ID_Inventario" AS "ID_INVENTARIO",
                    "ID_Usuario" AS "ID_USUARIO",
                    "Tipo_Movimiento_Inventario" AS "TIPO_MOVIMIENTO",
                    "Cantidad_Movimiento_Inventario" AS "CANTIDAD",
                    "Fecha_Movimiento_Inventario" AS "FECHA"
                FROM "MOVIMIENTO_INVENTARIO"
                WHERE "ID_Inventario" = :1
            `, [idInventario]);

            if (movimientos.length === 0) {
                console.log('✓ No tiene movimientos asociados.');
            } else {
                console.table(movimientos);
            }
        }

        console.log('\n=== FIN DE LA VERIFICACIÓN ===\n');

    } catch (error) {
        console.error('\n❌ Error:', error);

    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

verificarInventarioProblematico();