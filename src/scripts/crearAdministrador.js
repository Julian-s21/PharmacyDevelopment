const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const bcrypt = require('bcrypt');
const AppDataSource = require('../config/database');
const Usuario = require('../models/usuario.model');
const Sucursal = require('../models/sucursal.model');

async function crearAdministrador() {
    const correo = (process.env.ADMIN_EMAIL || process.env.INITIAL_USER_EMAIL)?.trim();
    const contrasena = process.env.ADMIN_PASSWORD || process.env.INITIAL_USER_PASSWORD;

    if (!correo || !contrasena) {
        throw new Error('Configura ADMIN_EMAIL y ADMIN_PASSWORD (o INITIAL_USER_EMAIL y INITIAL_USER_PASSWORD) en el .env de la raíz del proyecto.');
    }
    if (contrasena.length < 8) {
        throw new Error('ADMIN_PASSWORD debe tener al menos 8 caracteres.');
    }
    try {
        await AppDataSource.initialize();
        console.log('Conectado a Oracle.');

        const usuarioRepository = AppDataSource.getRepository(Usuario);
        const sucursalRepository = AppDataSource.getRepository(Sucursal);

        let [sucursal] = await sucursalRepository.find({
            order: { ID_Sucursal: 'ASC' },
            take: 1
        });

        if (!sucursal) {
            sucursal = sucursalRepository.create({
                Nombre_Sucursal: 'Sucursal principal',
                Direccion_Sucursal: 'Dirección pendiente de registrar',
                Telefono_Sucursal: '0000000000'
            });
            sucursal = await sucursalRepository.save(sucursal);
            console.log('No había sucursales; se creó una sucursal principal con datos pendientes.');
        }

        const existente = await usuarioRepository.createQueryBuilder('usuario')
            .where('LOWER(usuario.Correo_Usuario) = :correo', { correo: correo.toLowerCase() })
            .getOne();

        if (existente) {
            console.log(`Ya existe una cuenta con el correo ${correo}; no se realizaron cambios.`);
            return;
        }

        const hash = await bcrypt.hash(contrasena, 12);
        const administrador = usuarioRepository.create({
            ID_Sucursal: sucursal.ID_Sucursal,
            Nombre_Usuario: (process.env.ADMIN_FIRST_NAME || process.env.INITIAL_USER_NAME)?.trim() || 'Administrador',
            Apellido_Usuario: (process.env.ADMIN_LAST_NAME || process.env.INITIAL_USER_LAST_NAME)?.trim() || 'Sistema',
            Correo_Usuario: correo,
            Contrasena_Usuario: hash
        });

        await usuarioRepository.save(administrador);

        console.log('Cuenta de administrador creada en Oracle.');
        console.log(`Correo: ${correo}`);
        console.log(`Sucursal: ${sucursal.Nombre_Sucursal || sucursal.ID_Sucursal}`);
        console.log('La contraseña se guardó con bcrypt.');
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

if (require.main === module) {
    crearAdministrador().catch((error) => {
        console.error('No se pudo crear el administrador:', error.message || error);
        process.exitCode = 1;
    });
}

module.exports = crearAdministrador;
