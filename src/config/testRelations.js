/*const AppDataSource = require('./database');

AppDataSource.initialize()
    .then(async () => {

        console.log('=================================');
        console.log('Conexión a Oracle exitosa');
        console.log('Probando relación Sucursal - Usuario');
        console.log('=================================');

        const sucursalRepository = AppDataSource.getRepository('Sucursal');

        const sucursales = await sucursalRepository.find({
            relations: {
                usuarios: true
            }
        });

        console.log(JSON.stringify(sucursales, null, 2));

        await AppDataSource.destroy();
    })
    .catch((error) => {
        console.error('Error:', error);
    });*/
    const AppDataSource = require('./database');

AppDataSource.initialize()
    .then(async () => {

        console.log('=================================');
        console.log('Conexión a Oracle exitosa');
        console.log('Probando relación Sucursal - Usuario');
        console.log('=================================');

        const sucursalRepository =
            AppDataSource.getRepository('Sucursal');

        const usuarioRepository =
            AppDataSource.getRepository('Usuario');

        // Crear una sucursal
        const sucursal = sucursalRepository.create({
            Nombre_Sucursal: 'Farmacia Central',
            Direccion_Sucursal: 'San Marcos',
            Telefono_Sucursal: '12345678'
        });

        await sucursalRepository.save(sucursal);

        console.log('Sucursal creada:');
        console.log(sucursal);

        // Crear un usuario relacionado con la sucursal
        const usuario = usuarioRepository.create({
            ID_Sucursal: sucursal.ID_Sucursal,
            Nombre_Usuario: 'Juan',
            Apellido_Usuario: 'Perez',
            Correo_Usuario: 'juan@pharmacy.com',
            Contrasena_Usuario: '123456'
        });

        await usuarioRepository.save(usuario);

        console.log('Usuario creado:');
        console.log(usuario);

        // Consultar la sucursal incluyendo sus usuarios
        const resultado = await sucursalRepository.find({
            relations: {
                usuarios: true
            }
        });

        console.log('=================================');
        console.log('Resultado de la relación:');
        console.log('=================================');

        console.log(JSON.stringify(resultado, null, 2));
        

        await AppDataSource.destroy();
        
        
    })
    .catch((error) => {

        console.error('=================================');
        console.error('ERROR');
        console.error('=================================');

        console.error(error);
        
    });
    