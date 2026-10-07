const AppDataSource = require('./database');

AppDataSource.initialize()
    .then(async () => {

        console.log('=================================');
        console.log('Conexión exitosa');
        console.log('=================================');

        // Usuario actual
        const usuario = await AppDataSource.query(`
            SELECT USER AS USUARIO
            FROM DUAL
        `);

        console.log('Usuario actual:');
        console.log(usuario);

        // Esquema actual
        const esquema = await AppDataSource.query(`
            SELECT SYS_CONTEXT('USERENV', 'CURRENT_SCHEMA') AS ESQUEMA
            FROM DUAL
        `);

        console.log('Esquema actual:');
        console.log(esquema);

        // Todas las tablas del usuario
        const tablas = await AppDataSource.query(`
            SELECT TABLE_NAME
            FROM USER_TABLES
            ORDER BY TABLE_NAME
        `);

        console.log('=================================');
        console.log('Tablas del usuario:');
        console.log('=================================');

        console.log(tablas);

        await AppDataSource.destroy();
    })
    .catch((error) => {
        console.error('Error:', error);
    });