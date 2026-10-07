const AppDataSource = require('../config/database');

AppDataSource.initialize()
    .then(async () => {

        console.log('\n=== FOREIGN KEYS EXISTENTES EN ORACLE ===\n');

        const resultado = await AppDataSource.query(`
            SELECT
                a.table_name AS tabla,
                a.constraint_name AS constraint_name,
                c_pk.table_name AS tabla_referenciada,
                b.column_name AS columna
            FROM user_constraints a
            JOIN user_constraints c_pk
                ON a.r_constraint_name = c_pk.constraint_name
            JOIN user_cons_columns b
                ON a.constraint_name = b.constraint_name
            WHERE a.constraint_type = 'R'
            ORDER BY a.table_name, a.constraint_name
        `);

        resultado.forEach((fk) => {
            console.log(
                `${fk.TABLA}.${fk.COLUMNA} -> ${fk.TABLA_REFERENCIADA} (${fk.CONSTRAINT_NAME})`
            );
        });

        await AppDataSource.destroy();
    })
    .catch((error) => {
        console.error('Error:', error);
    });