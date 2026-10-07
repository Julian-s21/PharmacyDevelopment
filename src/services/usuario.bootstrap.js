const usuarioRepository = require('../repositories/usuario.repository');
const sucursalRepository = require('../repositories/sucursal.repository');
const { hashPassword } = require('./password.service');

async function asegurarUsuarioInicial() {
    const cantidadUsuarios = await usuarioRepository.count();
    if (cantidadUsuarios > 0) return;

    const correo = process.env.INITIAL_USER_EMAIL?.trim();
    const contrasena = process.env.INITIAL_USER_PASSWORD;
    const idSucursal = Number(process.env.INITIAL_USER_BRANCH_ID);
    const nombre = process.env.INITIAL_USER_NAME?.trim();
    const apellido = process.env.INITIAL_USER_LAST_NAME?.trim();

    if (!correo || !contrasena || !Number.isInteger(idSucursal) || idSucursal < 1 || !nombre || !apellido) {
        throw new Error(
            'No hay usuarios registrados. Configura INITIAL_USER_EMAIL, INITIAL_USER_PASSWORD, INITIAL_USER_BRANCH_ID, INITIAL_USER_NAME e INITIAL_USER_LAST_NAME para crear la primera cuenta.'
        );
    }

    const sucursal = await sucursalRepository.findOneBy({ ID_Sucursal: idSucursal });
    if (!sucursal) {
        throw new Error(`No existe la sucursal ${idSucursal} indicada para el usuario inicial.`);
    }

    const usuario = usuarioRepository.create({
        ID_Sucursal: idSucursal,
        Nombre_Usuario: nombre,
        Apellido_Usuario: apellido,
        Correo_Usuario: correo,
        Contrasena_Usuario: await hashPassword(contrasena)
    });
    await usuarioRepository.save(usuario);
    console.log(`Cuenta inicial creada para ${correo}.`);
}

module.exports = asegurarUsuarioInicial;
