/*const movimientoInventarioRepository =
    require('../repositories/movimientoInventario.repository');

const obtenerTodos = async () => {
    return await movimientoInventarioRepository.find();
};

const obtenerPorId = async (id) => {
    return await movimientoInventarioRepository.findOneBy({
        ID_Movimiento_Inventario: id
    });
};

const crear = async (datos) => {
    const movimiento =
        movimientoInventarioRepository.create(datos);

    return await movimientoInventarioRepository.save(movimiento);
};

const actualizar = async (id, datos) => {
    const movimiento = await obtenerPorId(id);

    if (!movimiento) {
        return null;
    }

    Object.assign(movimiento, datos);

    return await movimientoInventarioRepository.save(movimiento);
};

const eliminar = async (id) => {
    const movimiento = await obtenerPorId(id);

    if (!movimiento) {
        return null;
    }

    await movimientoInventarioRepository.remove(movimiento);

    return movimiento;
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};*/

const movimientoInventarioRepository =
    require('../repositories/movimientoInventario.repository');

const inventarioRepository =
    require('../repositories/inventario.repository');

const usuarioRepository =
    require('../repositories/usuario.repository');


async function obtenerTodos() {

    return await movimientoInventarioRepository.find({
        relations: {
            inventario: {
                medicamento: true,
                sucursal: true
            },
            usuario: true
        }
    });
}


async function obtenerPorId(id) {

    return await movimientoInventarioRepository.findOne({
        where: {
            ID_Movimiento_Inventario: id
        },
        relations: {
            inventario: {
                medicamento: true,
                sucursal: true
            },
            usuario: true
        }
    });
}


/*async function crear(datos) {

    // Verificar inventario
    const inventario = await inventarioRepository.findOneBy({
        ID_Inventario: datos.ID_Inventario
    });

    if (!inventario) {
        throw new Error('El inventario indicado no existe.');
    }


    // Verificar usuario
    const usuario = await usuarioRepository.findOneBy({
        ID_Usuario: datos.ID_Usuario
    });

    if (!usuario) {
        throw new Error('El usuario indicado no existe.');
    }


    // Validar tipo de movimiento
    const tipo = String(datos.Tipo_Movimiento_Inventario)
        .trim()
        .toUpperCase();

    if (tipo !== 'ENTRADA' && tipo !== 'SALIDA') {
        throw new Error(
            'El tipo de movimiento debe ser ENTRADA o SALIDA.'
        );
    }


    // Validar cantidad
    const cantidad = Number(
        datos.Cantidad_Movimiento_Inventario
    );

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        throw new Error(
            'La cantidad del movimiento debe ser un número entero mayor que cero.'
        );
    }


    // Verificar que una salida no deje inventario negativo
    if (
        tipo === 'SALIDA' &&
        cantidad > inventario.Cantidad_Inventario
    ) {
        throw new Error(
            'No hay suficiente existencia para realizar la salida.'
        );
    }


    // Actualizar inventario
    if (tipo === 'ENTRADA') {

        inventario.Cantidad_Inventario += cantidad;

    } else {

        inventario.Cantidad_Inventario -= cantidad;
    }


    // Guardar primero el nuevo inventario
    await inventarioRepository.save(inventario);


    // Crear movimiento
    const movimiento =
        movimientoInventarioRepository.create({
            ID_Inventario: datos.ID_Inventario,
            ID_Usuario: datos.ID_Usuario,
            Tipo_Movimiento_Inventario: tipo,
            Cantidad_Movimiento_Inventario: cantidad,
            Fecha_Movimiento_Inventario:
                datos.Fecha_Movimiento_Inventario
        });


    return await movimientoInventarioRepository.save(movimiento);
}*/

async function crear(datos) {

    const dataSource = movimientoInventarioRepository.manager.connection;

    return await dataSource.transaction(async (transactionalEntityManager) => {

        const inventarioRepository =
            transactionalEntityManager.getRepository(
                require('../models/inventario.model')
            );

        const movimientoRepository =
            transactionalEntityManager.getRepository(
                require('../models/movimientoInventario.model')
            );

        const usuarioRepository =
            transactionalEntityManager.getRepository(
                require('../models/usuario.model')
            );


        // Buscar inventario
        const inventario =
            await inventarioRepository.findOneBy({
                ID_Inventario: datos.ID_Inventario
            });

        if (!inventario) {
            throw new Error(
                'El inventario indicado no existe.'
            );
        }


        // Buscar usuario
        const usuario =
            await usuarioRepository.findOneBy({
                ID_Usuario: datos.ID_Usuario
            });

        if (!usuario) {
            throw new Error(
                'El usuario indicado no existe.'
            );
        }


        // Validar tipo
        const tipo =
            String(
                datos.Tipo_Movimiento_Inventario
            )
            .trim()
            .toUpperCase();


        if (
            tipo !== 'ENTRADA' &&
            tipo !== 'SALIDA'
        ) {
            throw new Error(
                'El tipo de movimiento debe ser ENTRADA o SALIDA.'
            );
        }


        // Validar cantidad
        const cantidad =
            Number(
                datos.Cantidad_Movimiento_Inventario
            );


        if (
            !Number.isInteger(cantidad) ||
            cantidad <= 0
        ) {
            throw new Error(
                'La cantidad del movimiento debe ser un número entero mayor que cero.'
            );
        }


        // Validar fecha
        if (!datos.Fecha_Movimiento_Inventario) {
            throw new Error(
                'La fecha del movimiento es obligatoria.'
            );
        }


        const fecha =
            new Date(
                datos.Fecha_Movimiento_Inventario
            );


        if (isNaN(fecha.getTime())) {
            throw new Error(
                'La fecha del movimiento no es válida.'
            );
        }


        // IMPORTANTE:
        // Oracle puede devolver NUMBER como string.
        const existenciaActual =
            Number(
                inventario.Cantidad_Inventario
            );


        if (isNaN(existenciaActual)) {
            throw new Error(
                'La cantidad actual del inventario no es válida.'
            );
        }


        // Validar salida
        if (
            tipo === 'SALIDA' &&
            cantidad > existenciaActual
        ) {
            throw new Error(
                'No hay suficiente existencia para realizar la salida.'
            );
        }


        // Calcular nueva existencia
        let nuevaExistencia;


        if (tipo === 'ENTRADA') {

            nuevaExistencia =
                existenciaActual + cantidad;

        } else {

            nuevaExistencia =
                existenciaActual - cantidad;
        }


        // Actualizar inventario
        inventario.Cantidad_Inventario =
            nuevaExistencia;


        await inventarioRepository.save(
            inventario
        );


        // Crear movimiento
        const movimiento =
            movimientoRepository.create({
                ID_Inventario:
                    datos.ID_Inventario,

                ID_Usuario:
                    datos.ID_Usuario,

                Tipo_Movimiento_Inventario:
                    tipo,

                Cantidad_Movimiento_Inventario:
                    cantidad,

                Observacion_Movimiento_Inventario:
                    datos.Observacion_Movimiento_Inventario || null,

                Fecha_Movimiento_Inventario:
                    fecha
            });


        // Guardar historial
        const movimientoGuardado =
            await movimientoRepository.save(
                movimiento
            );


        return movimientoGuardado;
    });
}

async function actualizar(id, datos) {

    const movimiento =
        await movimientoInventarioRepository.findOneBy({
            ID_Movimiento_Inventario: id
        });

    if (!movimiento) {
        return null;
    }


    // No permitimos modificar un movimiento histórico
    // porque ya afectó el inventario.
    throw new Error(
        'Los movimientos de inventario no pueden modificarse una vez registrados.'
    );
}


async function eliminar(id) {

    const movimiento =
        await movimientoInventarioRepository.findOneBy({
            ID_Movimiento_Inventario: id
        });

    if (!movimiento) {
        return null;
    }


    // No eliminamos movimientos porque forman parte
    // del historial de auditoría.
    throw new Error(
        'Los movimientos de inventario no pueden eliminarse porque forman parte del historial de auditoría.'
    );
}


module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
