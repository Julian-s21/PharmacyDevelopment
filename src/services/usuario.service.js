/*const usuarioRepository = require('../repositories/usuario.repository');

const obtenerTodos = async () => {
    return await usuarioRepository.find();
};

const obtenerPorId = async (id) => {
    return await usuarioRepository.findOneBy({
        ID_Usuario: id
    });
};

const crear = async (datos) => {
    const usuario = usuarioRepository.create(datos);

    return await usuarioRepository.save(usuario);
};

const actualizar = async (id, datos) => {
    const usuario = await obtenerPorId(id);

    if (!usuario) {
        return null;
    }

    Object.assign(usuario, datos);

    return await usuarioRepository.save(usuario);
};

const eliminar = async (id) => {
    const usuario = await obtenerPorId(id);

    if (!usuario) {
        return null;
    }

    await usuarioRepository.remove(usuario);

    return usuario;
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};*/
const usuarioRepository = require('../repositories/usuario.repository');
const sucursalRepository = require('../repositories/sucursal.repository');
const { hashPassword } = require('./password.service');

async function obtenerTodos() {
    return await usuarioRepository.find({
        relations: {
            sucursal: true
        }
    });
}

async function obtenerPorId(id) {
    return await usuarioRepository.findOne({
        where: {
            ID_Usuario: id
        },
        relations: {
            sucursal: true
        }
    });
}

async function crear(datos) {

    // Verificar que la sucursal exista
    const sucursal = await sucursalRepository.findOneBy({
        ID_Sucursal: datos.ID_Sucursal
    });

    if (!sucursal) {
        throw new Error('La sucursal indicada no existe.');
    }

    // Verificar que el correo no esté registrado
    const usuarioExistente = await usuarioRepository.findOneBy({
        Correo_Usuario: datos.Correo_Usuario
    });

    if (usuarioExistente) {
        throw new Error('Ya existe un usuario con ese correo.');
    }

    const usuario = usuarioRepository.create({
        ID_Sucursal: datos.ID_Sucursal,
        Nombre_Usuario: datos.Nombre_Usuario,
        Apellido_Usuario: datos.Apellido_Usuario,
        Correo_Usuario: datos.Correo_Usuario,
        Contrasena_Usuario: await hashPassword(datos.Contrasena_Usuario)
    });

    return await usuarioRepository.save(usuario);
}

async function actualizar(id, datos) {

    const usuario = await usuarioRepository.findOneBy({
        ID_Usuario: id
    });

    if (!usuario) {
        return null;
    }

    // Si se está cambiando la sucursal, verificar que exista
    if (datos.ID_Sucursal !== undefined) {

        const sucursal = await sucursalRepository.findOneBy({
            ID_Sucursal: datos.ID_Sucursal
        });

        if (!sucursal) {
            throw new Error('La sucursal indicada no existe.');
        }
    }

    // Si se está cambiando el correo, verificar que no esté ocupado
    if (datos.Correo_Usuario !== undefined) {

        const usuarioExistente = await usuarioRepository.findOneBy({
            Correo_Usuario: datos.Correo_Usuario
        });

        if (
            usuarioExistente &&
            usuarioExistente.ID_Usuario !== Number(id)
        ) {
            throw new Error('Ya existe otro usuario con ese correo.');
        }
    }

    // Actualizar únicamente los campos recibidos
    if (datos.ID_Sucursal !== undefined) {
        usuario.ID_Sucursal = datos.ID_Sucursal;
    }

    if (datos.Nombre_Usuario !== undefined) {
        usuario.Nombre_Usuario = datos.Nombre_Usuario;
    }

    if (datos.Apellido_Usuario !== undefined) {
        usuario.Apellido_Usuario = datos.Apellido_Usuario;
    }

    if (datos.Correo_Usuario !== undefined) {
        usuario.Correo_Usuario = datos.Correo_Usuario;
    }

    if (datos.Contrasena_Usuario !== undefined) {
        usuario.Contrasena_Usuario = await hashPassword(datos.Contrasena_Usuario);
    }

    return await usuarioRepository.save(usuario);
}

async function eliminar(id) {

    const usuario = await usuarioRepository.findOneBy({
        ID_Usuario: id
    });

    if (!usuario) {
        return null;
    }

    // Verificar si el usuario tiene registros relacionados
    const tieneMovimientosInventario =
        await usuarioRepository.manager
            .getRepository('MovimientoInventario')
            .count({
                where: {
                    ID_Usuario: id
                }
            });

    const tieneTransferencias =
        await usuarioRepository.manager
            .getRepository('Transferencia')
            .count({
                where: {
                    ID_Usuario: id
                }
            });

    const tieneDistribuciones =
        await usuarioRepository.manager
            .getRepository('Distribucion')
            .count({
                where: {
                    ID_Usuario: id
                }
            });

    const tieneMovimientosFinancieros =
        await usuarioRepository.manager
            .getRepository('MovimientoFinanciero')
            .count({
                where: {
                    ID_Usuario: id
                }
            });

    const tieneGastosPlanilla =
        await usuarioRepository.manager
            .getRepository('GastoPlanilla')
            .count({
                where: {
                    ID_Usuario: id
                }
            });

    if (
        tieneMovimientosInventario > 0 ||
        tieneTransferencias > 0 ||
        tieneDistribuciones > 0 ||
        tieneMovimientosFinancieros > 0 ||
        tieneGastosPlanilla > 0
    ) {
        throw new Error(
            'No se puede eliminar el usuario porque tiene información relacionada.'
        );
    }

    await usuarioRepository.remove(usuario);

    return usuario;
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
