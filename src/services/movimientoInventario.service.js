

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



        const inventario =
            await inventarioRepository.findOneBy({
                ID_Inventario: datos.ID_Inventario
            });

        if (!inventario) {
            throw new Error(
                'El inventario indicado no existe.'
            );
        }



        const usuario =
            await usuarioRepository.findOneBy({
                ID_Usuario: datos.ID_Usuario
            });

        if (!usuario) {
            throw new Error(
                'El usuario indicado no existe.'
            );
        }



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




        const existenciaActual =
            Number(
                inventario.Cantidad_Inventario
            );


        if (isNaN(existenciaActual)) {
            throw new Error(
                'La cantidad actual del inventario no es válida.'
            );
        }



        if (
            tipo === 'SALIDA' &&
            cantidad > existenciaActual
        ) {
            throw new Error(
                'No hay suficiente existencia para realizar la salida.'
            );
        }



        let nuevaExistencia;


        if (tipo === 'ENTRADA') {

            nuevaExistencia =
                existenciaActual + cantidad;

        } else {

            nuevaExistencia =
                existenciaActual - cantidad;
        }



        inventario.Cantidad_Inventario =
            nuevaExistencia;


        await inventarioRepository.save(
            inventario
        );



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
