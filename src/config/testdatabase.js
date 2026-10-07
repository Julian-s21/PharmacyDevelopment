const AppDataSource = require('./database');

AppDataSource.initialize()
    .then(() => {
        console.log('=================================');
        console.log('Conexión a Oracle exitosa');
        console.log('TypeORM está funcionando correctamente');
        console.log('=================================');
    })
    .catch((error) => {
        console.error('=================================');
        console.error('Error al conectar con Oracle');
        console.error(error);
        console.error('=================================');
    });