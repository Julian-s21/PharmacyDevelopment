const AppDataSource = require('../config/database');

async function verificarHuerfanos() {
    try {
        await AppDataSource.initialize();

        console.log('\n=== DATOS HUÉRFANOS ===\n');

        const consultas = [
            {
                nombre: 'INVENTARIO → SUCURSAL',
                sql: `
                    SELECT i."ID_Inventario", i."ID_Sucursal"
                    FROM "INVENTARIO" i
                    LEFT JOIN "SUCURSAL" s
                        ON i."ID_Sucursal" = s."ID_Sucursal"
                    WHERE s."ID_Sucursal" IS NULL
                `
            },
            {
                nombre: 'INVENTARIO → MEDICAMENTO',
                sql: `
                    SELECT i."ID_Inventario", i."ID_Medicamento"
                    FROM "INVENTARIO" i
                    LEFT JOIN "MEDICAMENTO" m
                        ON i."ID_Medicamento" = m."ID_Medicamento"
                    WHERE m."ID_Medicamento" IS NULL
                `
            },
            {
                nombre: 'MOVIMIENTO_INVENTARIO → INVENTARIO',
                sql: `
                    SELECT m."ID_Movimiento_Inventario", m."ID_Inventario"
                    FROM "MOVIMIENTO_INVENTARIO" m
                    LEFT JOIN "INVENTARIO" i
                        ON m."ID_Inventario" = i."ID_Inventario"
                    WHERE i."ID_Inventario" IS NULL
                `
            },
            {
                nombre: 'MOVIMIENTO_INVENTARIO → USUARIO',
                sql: `
                    SELECT m."ID_Movimiento_Inventario", m."ID_Usuario"
                    FROM "MOVIMIENTO_INVENTARIO" m
                    LEFT JOIN "USUARIO" u
                        ON m."ID_Usuario" = u."ID_Usuario"
                    WHERE u."ID_Usuario" IS NULL
                `
            },
            {
                nombre: 'MEDICAMENTO → CATEGORIA_MEDICAMENTO',
                sql: `
                    SELECT m."ID_Medicamento", m."ID_Categoria"
                    FROM "MEDICAMENTO" m
                    LEFT JOIN "CATEGORIA_MEDICAMENTO" c
                        ON m."ID_Categoria" = c."ID_Categoria"
                    WHERE c."ID_Categoria" IS NULL
                `
            }
        ];

        for (const consulta of consultas) {
            console.log(`--- ${consulta.nombre} ---`);

            const resultados = await AppDataSource.query(consulta.sql);

            if (resultados.length === 0) {
                console.log('✓ No hay datos huérfanos.\n');
            } else {
                console.log(`⚠ Se encontraron ${resultados.length} registros huérfanos:`);
                console.table(resultados);
                console.log('');
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

verificarHuerfanos();