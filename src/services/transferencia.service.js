/*const transferenciaRepository =
    require('../repositories/transferencia.repository');

const obtenerTodas = async () => {
    return await transferenciaRepository.find();
};

const obtenerPorId = async (id) => {
    return await transferenciaRepository.findOneBy({
        ID_Transferencia: id
    });
};

const crear = async (datos) => {
    const transferencia =
        transferenciaRepository.create(datos);

    return await transferenciaRepository.save(transferencia);
};

const actualizar = async (id, datos) => {
    const transferencia = await obtenerPorId(id);

    if (!transferencia) {
        return null;
    }

    Object.assign(transferencia, datos);

    return await transferenciaRepository.save(transferencia);
};

const eliminar = async (id) => {
    const transferencia = await obtenerPorId(id);

    if (!transferencia) {
        return null;
    }

    await transferenciaRepository.remove(transferencia);

    return transferencia;
};

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};*/

/*const transferenciaRepository =
    require('../repositories/transferencia.repository');

const sucursalRepository =
    require('../repositories/sucursal.repository');

const usuarioRepository =
    require('../repositories/usuario.repository');

const detalleTransferenciaRepository =
    require('../repositories/detalleTransferencia.repository');
*/

const AppDataSource =
    require('../config/database');

const transferenciaRepository =
    require('../repositories/transferencia.repository');

const sucursalRepository =
    require('../repositories/sucursal.repository');

const usuarioRepository =
    require('../repositories/usuario.repository');

const detalleTransferenciaRepository =
    require('../repositories/detalleTransferencia.repository');

const inventarioRepository =
    require('../repositories/inventario.repository');

const medicamentoRepository =
    require('../repositories/medicamento.repository');

async function obtenerTodas() {

    return await transferenciaRepository.find({
        relations: {
            sucursalOrigen: true,
            sucursalDestino: true,
            usuario: true,
            detalles: {
                medicamento: true
            }
        }
    });
}


async function obtenerPorId(id) {

    return await transferenciaRepository.findOne({
        where: {
            ID_Transferencia: id
        },
        relations: {
            sucursalOrigen: true,
            sucursalDestino: true,
            usuario: true,
            detalles: {
                medicamento: true
            }
        }
    });
}


async function crear(datos) {

    // Verificar sucursal origen
    const sucursalOrigen =
        await sucursalRepository.findOneBy({
            ID_Sucursal: datos.ID_Sucursal_Origen
        });

    if (!sucursalOrigen) {
        throw new Error(
            'La sucursal de origen no existe.'
        );
    }


    // Verificar sucursal destino
    const sucursalDestino =
        await sucursalRepository.findOneBy({
            ID_Sucursal: datos.ID_Sucursal_Destino
        });

    if (!sucursalDestino) {
        throw new Error(
            'La sucursal de destino no existe.'
        );
    }


    // Una sucursal no puede transferirse a sí misma
    if (
        Number(datos.ID_Sucursal_Origen) ===
        Number(datos.ID_Sucursal_Destino)
    ) {
        throw new Error(
            'La sucursal de origen y destino deben ser diferentes.'
        );
    }


    // Verificar usuario
    const usuario =
        await usuarioRepository.findOneBy({
            ID_Usuario: datos.ID_Usuario
        });

    if (!usuario) {
        throw new Error(
            'El usuario indicado no existe.'
        );
    }


    // Validar fecha
    if (!datos.Fecha_Transferencia) {
        throw new Error(
            'La fecha de transferencia es obligatoria.'
        );
    }

    const fecha = new Date(datos.Fecha_Transferencia);

    if (isNaN(fecha.getTime())) {
        throw new Error(
            'La fecha de transferencia no es válida.'
        );
    }


    const transferencia =
        transferenciaRepository.create({
            ID_Sucursal_Origen:
                datos.ID_Sucursal_Origen,

            ID_Sucursal_Destino:
                datos.ID_Sucursal_Destino,

            ID_Usuario:
                datos.ID_Usuario,

            Fecha_Transferencia:
                fecha
        });


    return await transferenciaRepository.save(
        transferencia
    );
}

async function crearTransferenciaCompleta(datos) {

    return await AppDataSource.transaction(
        async (transactionalEntityManager) => {

            const movimientoInventarioRepo =
                transactionalEntityManager.getRepository(
                    require('../models/movimientoInventario.model')
                );

            const transferenciaRepo =
                transactionalEntityManager.getRepository(
                    require('../models/transferencia.model')
                );

            const detalleRepo =
                transactionalEntityManager.getRepository(
                    require('../models/detalleTransferencia.model')
                );

            const sucursalRepo =
                transactionalEntityManager.getRepository(
                    require('../models/sucursal.model')
                );

            const usuarioRepo =
                transactionalEntityManager.getRepository(
                    require('../models/usuario.model')
                );

            const medicamentoRepo =
                transactionalEntityManager.getRepository(
                    require('../models/medicamento.model')
                );

            const inventarioRepo =
                transactionalEntityManager.getRepository(
                    require('../models/inventario.model')
                );


            // ==========================================
            // 1. Validar sucursal de origen
            // ==========================================

            const sucursalOrigen =
                await sucursalRepo.findOneBy({
                    ID_Sucursal:
                        datos.ID_Sucursal_Origen
                });

            if (!sucursalOrigen) {
                throw new Error(
                    'La sucursal de origen no existe.'
                );
            }


            // ==========================================
            // 2. Validar sucursal destino
            // ==========================================

            const sucursalDestino =
                await sucursalRepo.findOneBy({
                    ID_Sucursal:
                        datos.ID_Sucursal_Destino
                });

            if (!sucursalDestino) {
                throw new Error(
                    'La sucursal de destino no existe.'
                );
            }


            // ==========================================
            // 3. Validar que sean diferentes
            // ==========================================

            if (
                Number(datos.ID_Sucursal_Origen) ===
                Number(datos.ID_Sucursal_Destino)
            ) {
                throw new Error(
                    'La sucursal de origen y destino deben ser diferentes.'
                );
            }


            // ==========================================
            // 4. Validar usuario
            // ==========================================

            const usuario =
                await usuarioRepo.findOneBy({
                    ID_Usuario:
                        datos.ID_Usuario
                });

            if (!usuario) {
                throw new Error(
                    'El usuario indicado no existe.'
                );
            }


            // ==========================================
            // 5. Validar fecha
            // ==========================================

            if (!datos.Fecha_Transferencia) {
                throw new Error(
                    'La fecha de transferencia es obligatoria.'
                );
            }

            const fecha =
                new Date(
                    datos.Fecha_Transferencia
                );

            if (isNaN(fecha.getTime())) {
                throw new Error(
                    'La fecha de transferencia no es válida.'
                );
            }


            // ==========================================
            // 6. Validar detalles
            // ==========================================

            if (
                !Array.isArray(datos.detalles) ||
                datos.detalles.length === 0
            ) {
                throw new Error(
                    'La transferencia debe contener al menos un medicamento.'
                );
            }

            // ==========================================
            // 6.1 Validar medicamentos repetidos
            // ==========================================

            const medicamentos = new Set();

            for (const item of datos.detalles) {

                const idMedicamento =
                    Number(item.ID_Medicamento);

                if (medicamentos.has(idMedicamento)) {
                    throw new Error(
                        `El medicamento ${idMedicamento} está repetido en la transferencia.`
                    );
                }

                medicamentos.add(idMedicamento);
            }


            // ==========================================
            // 7. Crear encabezado
            // ==========================================

            const transferencia =
                transferenciaRepo.create({
                    ID_Sucursal_Origen:
                        datos.ID_Sucursal_Origen,

                    ID_Sucursal_Destino:
                        datos.ID_Sucursal_Destino,

                    ID_Usuario:
                        datos.ID_Usuario,

                    Fecha_Transferencia:
                        fecha
                });


            const transferenciaGuardada =
                await transferenciaRepo.save(
                    transferencia
                );


            // ==========================================
            // 8. Procesar medicamentos
            // ==========================================

            for (const item of datos.detalles) {

                const cantidad =
                    Number(
                        item.Cantidad_Transferencia
                    );


                if (
                    !Number.isInteger(cantidad) ||
                    cantidad <= 0
                ) {
                    throw new Error(
                        'La cantidad de transferencia debe ser un número entero mayor que cero.'
                    );
                }


                // ------------------------------
                // Buscar medicamento
                // ------------------------------

                const medicamento =
                    await medicamentoRepo.findOneBy({
                        ID_Medicamento:
                            item.ID_Medicamento
                    });

                if (!medicamento) {
                    throw new Error(
                        `El medicamento ${item.ID_Medicamento} no existe.`
                    );
                }


                // ------------------------------
                // Buscar inventario origen
                // ------------------------------

                const inventarioOrigen =
                    await inventarioRepo.findOne({
                        where: {
                            ID_Sucursal:
                                datos.ID_Sucursal_Origen,

                            ID_Medicamento:
                                item.ID_Medicamento
                        }
                    });


                if (!inventarioOrigen) {
                    throw new Error(
                        `El medicamento ${item.ID_Medicamento} no tiene inventario registrado en la sucursal de origen.`
                    );
                }


                // ------------------------------
                // Obtener existencia
                // ------------------------------

                const existenciaOrigen =
                    Number(
                        inventarioOrigen.Cantidad_Inventario
                    );


                if (isNaN(existenciaOrigen)) {
                    throw new Error(
                        'La cantidad del inventario de origen no es válida.'
                    );
                }


                // ------------------------------
                // Validar existencia
                // ------------------------------

                if (
                    cantidad >
                    existenciaOrigen
                ) {
                    throw new Error(
                        `No hay suficiente existencia del medicamento ${item.ID_Medicamento} en la sucursal de origen.`
                    );
                }


                // ------------------------------
                // Buscar inventario destino
                // ------------------------------

                let inventarioDestino =
                    await inventarioRepo.findOne({
                        where: {
                            ID_Sucursal:
                                datos.ID_Sucursal_Destino,

                            ID_Medicamento:
                                item.ID_Medicamento
                        }
                    });


                // ------------------------------
                // Descontar origen
                // ------------------------------

                inventarioOrigen.Cantidad_Inventario =
                    existenciaOrigen - cantidad;


                await inventarioRepo.save(
                    inventarioOrigen
                );

                    const movimientoSalida =
                    movimientoInventarioRepo.create({
                        ID_Inventario:
                            inventarioOrigen.ID_Inventario,

                        ID_Usuario:
                            datos.ID_Usuario,

                        Tipo_Movimiento_Inventario:
                            'SALIDA',

                        Cantidad_Movimiento_Inventario:
                            cantidad,

                        Fecha_Movimiento_Inventario:
                            fecha
                    });

                await movimientoInventarioRepo.save(
                    movimientoSalida
                );


                // ------------------------------
                // Crear inventario destino
                // ------------------------------

                if (!inventarioDestino) {

                    inventarioDestino =
                        inventarioRepo.create({
                            ID_Sucursal:
                                datos.ID_Sucursal_Destino,

                            ID_Medicamento:
                                item.ID_Medicamento,

                            Cantidad_Inventario:
                                cantidad
                        });

                } else {

                    const existenciaDestino =
                        Number(
                            inventarioDestino.Cantidad_Inventario
                        );


                    if (isNaN(existenciaDestino)) {
                        throw new Error(
                            'La cantidad del inventario de destino no es válida.'
                        );
                    }


                    inventarioDestino.Cantidad_Inventario =
                        existenciaDestino + cantidad;
                }


                await inventarioRepo.save(
                    inventarioDestino
                );

                const movimientoEntrada =
                movimientoInventarioRepo.create({
                    ID_Inventario:
                        inventarioDestino.ID_Inventario,

                    ID_Usuario:
                        datos.ID_Usuario,

                    Tipo_Movimiento_Inventario:
                        'ENTRADA',

                    Cantidad_Movimiento_Inventario:
                        cantidad,

                    Fecha_Movimiento_Inventario:
                        fecha
                });

            await movimientoInventarioRepo.save(
                movimientoEntrada
            );


                // ------------------------------
                // Crear detalle
                // ------------------------------

                const detalle =
                    detalleRepo.create({
                        ID_Transferencia:
                            transferenciaGuardada.ID_Transferencia,

                        ID_Medicamento:
                            item.ID_Medicamento,

                        Cantidad_Transferencia:
                            cantidad
                    });


                await detalleRepo.save(
                    detalle
                );
            }


            // ==========================================
            // 9. Retornar transferencia
            // ==========================================

            return transferenciaGuardada;
        }
    );
}


async function revertirDetallesTransferencia({
    id,
    detalles,
    transferencia,
    inventarioRepo,
    movimientoInventarioRepo
}) {
    const usuario = transferencia.ID_Usuario;
    const fecha = new Date();

    for (const detalle of detalles) {
        const medicamento = Number(detalle.ID_Medicamento);
        const cantidad = Number(detalle.Cantidad_Transferencia);
        const inventarioOrigen = await inventarioRepo.findOne({
            where: {
                ID_Sucursal: transferencia.ID_Sucursal_Origen,
                ID_Medicamento: medicamento
            }
        });
        const inventarioDestino = await inventarioRepo.findOne({
            where: {
                ID_Sucursal: transferencia.ID_Sucursal_Destino,
                ID_Medicamento: medicamento
            }
        });

        if (!inventarioOrigen || !inventarioDestino) {
            throw new Error(`No se pudo encontrar el inventario de ${medicamento} para revertir la transferencia.`);
        }

        const existenciaDestino = Number(inventarioDestino.Cantidad_Inventario);
        const existenciaOrigen = Number(inventarioOrigen.Cantidad_Inventario);
        if (!Number.isFinite(existenciaOrigen) || existenciaOrigen < 0) {
            throw new Error(`La existencia del medicamento ${medicamento} en la sucursal de origen no es válida.`);
        }
        if (!Number.isFinite(existenciaDestino) || existenciaDestino < cantidad) {
            throw new Error(`No se puede revertir: la sucursal destino ya no dispone de ${cantidad} unidades del medicamento ${medicamento}.`);
        }

        inventarioOrigen.Cantidad_Inventario = existenciaOrigen + cantidad;
        inventarioDestino.Cantidad_Inventario = existenciaDestino - cantidad;
        await inventarioRepo.save([inventarioOrigen, inventarioDestino]);

        const referencia = `Reversión de transferencia #${id}`;
        await movimientoInventarioRepo.save([
            movimientoInventarioRepo.create({
                ID_Inventario: inventarioOrigen.ID_Inventario,
                ID_Usuario: usuario,
                Tipo_Movimiento_Inventario: 'ENTRADA',
                Cantidad_Movimiento_Inventario: cantidad,
                Observacion_Movimiento_Inventario: referencia,
                Fecha_Movimiento_Inventario: fecha
            }),
            movimientoInventarioRepo.create({
                ID_Inventario: inventarioDestino.ID_Inventario,
                ID_Usuario: usuario,
                Tipo_Movimiento_Inventario: 'SALIDA',
                Cantidad_Movimiento_Inventario: cantidad,
                Observacion_Movimiento_Inventario: referencia,
                Fecha_Movimiento_Inventario: fecha
            })
        ]);
    }

}

async function aplicarDetallesTransferencia({
    id,
    detalles,
    transferencia,
    inventarioRepo,
    medicamentoRepo,
    movimientoInventarioRepo
}) {
    const fecha = new Date();

    for (const detalle of detalles) {
        const idMedicamento = Number(detalle.ID_Medicamento);
        const cantidad = Number(detalle.Cantidad_Transferencia);
        if (!Number.isInteger(idMedicamento) || !Number.isInteger(cantidad) || cantidad <= 0) {
            throw new Error('Cada medicamento debe tener una cantidad entera mayor que cero.');
        }

        const medicamento = await medicamentoRepo.findOneBy({ ID_Medicamento: idMedicamento });
        if (!medicamento) throw new Error(`El medicamento ${idMedicamento} no existe.`);

        const inventarioOrigen = await inventarioRepo.findOne({
            where: { ID_Sucursal: transferencia.ID_Sucursal_Origen, ID_Medicamento: idMedicamento }
        });
        if (!inventarioOrigen || !Number.isFinite(Number(inventarioOrigen.Cantidad_Inventario)) || Number(inventarioOrigen.Cantidad_Inventario) < cantidad) {
            throw new Error(`No hay suficiente existencia del medicamento ${idMedicamento} en la sucursal de origen.`);
        }

        let inventarioDestino = await inventarioRepo.findOne({
            where: { ID_Sucursal: transferencia.ID_Sucursal_Destino, ID_Medicamento: idMedicamento }
        });
        inventarioOrigen.Cantidad_Inventario = Number(inventarioOrigen.Cantidad_Inventario) - cantidad;
        if (inventarioDestino) {
            inventarioDestino.Cantidad_Inventario = Number(inventarioDestino.Cantidad_Inventario) + cantidad;
        } else {
            inventarioDestino = inventarioRepo.create({
                ID_Sucursal: transferencia.ID_Sucursal_Destino,
                ID_Medicamento: idMedicamento,
                Cantidad_Inventario: cantidad
            });
        }

        await inventarioRepo.save([inventarioOrigen, inventarioDestino]);
        const referencia = `Ajuste de transferencia #${id}`;
        await movimientoInventarioRepo.save([
            movimientoInventarioRepo.create({
                ID_Inventario: inventarioOrigen.ID_Inventario,
                ID_Usuario: transferencia.ID_Usuario,
                Tipo_Movimiento_Inventario: 'SALIDA',
                Cantidad_Movimiento_Inventario: cantidad,
                Observacion_Movimiento_Inventario: referencia,
                Fecha_Movimiento_Inventario: fecha
            }),
            movimientoInventarioRepo.create({
                ID_Inventario: inventarioDestino.ID_Inventario,
                ID_Usuario: transferencia.ID_Usuario,
                Tipo_Movimiento_Inventario: 'ENTRADA',
                Cantidad_Movimiento_Inventario: cantidad,
                Observacion_Movimiento_Inventario: referencia,
                Fecha_Movimiento_Inventario: fecha
            })
        ]);
    }
}

async function actualizar(id, datos) {
    if (!Array.isArray(datos.detalles) || datos.detalles.length === 0) {
        throw new Error('La transferencia debe contener al menos un medicamento.');
    }
    const idsMedicamentos = datos.detalles.map((detalle) => Number(detalle.ID_Medicamento));
    if (new Set(idsMedicamentos).size !== idsMedicamentos.length) {
        throw new Error('Cada medicamento debe aparecer una sola vez.');
    }

    return AppDataSource.transaction(async (manager) => {
        const transferenciaRepo = manager.getRepository(require('../models/transferencia.model'));
        const detalleRepo = manager.getRepository(require('../models/detalleTransferencia.model'));
        const inventarioRepo = manager.getRepository(require('../models/inventario.model'));
        const medicamentoRepo = manager.getRepository(require('../models/medicamento.model'));
        const movimientoInventarioRepo = manager.getRepository(require('../models/movimientoInventario.model'));
        const transferencia = await transferenciaRepo.findOneBy({ ID_Transferencia: Number(id) });
        if (!transferencia) return null;

        const detallesAnteriores = await detalleRepo.findBy({ ID_Transferencia: Number(id) });
        if (!detallesAnteriores.length) throw new Error('La transferencia no tiene medicamentos para editar.');
        await revertirDetallesTransferencia({ id, detalles: detallesAnteriores, transferencia, inventarioRepo, movimientoInventarioRepo });
        await aplicarDetallesTransferencia({ id, detalles: datos.detalles, transferencia, inventarioRepo, medicamentoRepo, movimientoInventarioRepo });

        await detalleRepo.delete({ ID_Transferencia: Number(id) });
        await detalleRepo.save(datos.detalles.map((detalle) => detalleRepo.create({
            ID_Transferencia: Number(id),
            ID_Medicamento: Number(detalle.ID_Medicamento),
            Cantidad_Transferencia: Number(detalle.Cantidad_Transferencia)
        })));

        return transferenciaRepo.findOne({
            where: { ID_Transferencia: Number(id) },
            relations: { sucursalOrigen: true, sucursalDestino: true, usuario: true, detalles: { medicamento: true } }
        });
    });
}

async function eliminar(id) {
    return AppDataSource.transaction(async (manager) => {
        const transferenciaRepo = manager.getRepository(require('../models/transferencia.model'));
        const detalleRepo = manager.getRepository(require('../models/detalleTransferencia.model'));
        const inventarioRepo = manager.getRepository(require('../models/inventario.model'));
        const movimientoInventarioRepo = manager.getRepository(require('../models/movimientoInventario.model'));
        const transferencia = await transferenciaRepo.findOneBy({ ID_Transferencia: Number(id) });
        if (!transferencia) return null;

        const detalles = await detalleRepo.findBy({ ID_Transferencia: Number(id) });
        await revertirDetallesTransferencia({ id, detalles, transferencia, inventarioRepo, movimientoInventarioRepo });
        await detalleRepo.delete({ ID_Transferencia: Number(id) });
        await transferenciaRepo.delete({ ID_Transferencia: Number(id) });
        return transferencia;
    });
}


module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    crearTransferenciaCompleta,
    actualizar,
    eliminar
};
