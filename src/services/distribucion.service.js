



const AppDataSource =
    require('../config/database');

const distribucionRepository =
    require('../repositories/distribucion.repository');

const sucursalRepository =
    require('../repositories/sucursal.repository');

const usuarioRepository =
    require('../repositories/usuario.repository');

const detalleDistribucionRepository =
    require('../repositories/detalleDistribucion.repository');

const medicamentoRepository =
    require('../repositories/medicamento.repository');


async function obtenerTodos() {

    return await distribucionRepository.find({
        relations: {
            sucursal: true,
            usuario: true,
            detalles: {
                medicamento: true
            }
        }
    });
}


async function obtenerPorId(id) {

    return await distribucionRepository.findOne({
        where: {
            ID_Distribucion: id
        },
        relations: {
            sucursal: true,
            usuario: true,
            detalles: {
                medicamento: true
            }
        }
    });
}


async function crear(datos) {


    const sucursal =
        await sucursalRepository.findOneBy({
            ID_Sucursal: datos.ID_Sucursal
        });

    if (!sucursal) {
        throw new Error(
            'La sucursal indicada no existe.'
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



    if (!datos.Fecha_Distribucion) {
        throw new Error(
            'La fecha de distribución es obligatoria.'
        );
    }

    const fecha =
        new Date(datos.Fecha_Distribucion);

    if (isNaN(fecha.getTime())) {
        throw new Error(
            'La fecha de distribución no es válida.'
        );
    }



    if (!datos.Estado_Distribucion) {
        throw new Error(
            'El estado de distribución es obligatorio.'
        );
    }


    const estado =
        String(datos.Estado_Distribucion).trim();

    if (estado.length > 50) {
        throw new Error(
            'El estado de distribución no puede superar los 50 caracteres.'
        );
    }


    const distribucion =
        distribucionRepository.create({
            ID_Sucursal:
                datos.ID_Sucursal,

            ID_Usuario:
                datos.ID_Usuario,

            Fecha_Distribucion:
                fecha,

            Estado_Distribucion:
                estado
        });


    return await distribucionRepository.save(
        distribucion
    );
}

async function crearDistribucionCompleta(datos) {

    return await AppDataSource.transaction(
        async (transactionalEntityManager) => {

            const distribucionRepo =
                transactionalEntityManager.getRepository(
                    require('../models/distribucion.model')
                );

            const detalleRepo =
                transactionalEntityManager.getRepository(
                    require('../models/detalleDistribucion.model')
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






            const sucursal =
                await sucursalRepo.findOneBy({
                    ID_Sucursal:
                        datos.ID_Sucursal
                });

            if (!sucursal) {
                throw new Error(
                    'La sucursal indicada no existe.'
                );
            }






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






            if (!datos.Fecha_Distribucion) {
                throw new Error(
                    'La fecha de distribución es obligatoria.'
                );
            }

            const fecha =
                new Date(
                    datos.Fecha_Distribucion
                );

            if (isNaN(fecha.getTime())) {
                throw new Error(
                    'La fecha de distribución no es válida.'
                );
            }






            if (!datos.Estado_Distribucion) {
                throw new Error(
                    'El estado de distribución es obligatorio.'
                );
            }

            const estado =
                String(
                    datos.Estado_Distribucion
                )
                .trim()
                .toUpperCase();


            const estadosPermitidos = [
                'PENDIENTE',
                'EN PROCESO',
                'COMPLETADA',
                'CANCELADA'
            ];


            if (!estadosPermitidos.includes(estado)) {
                throw new Error(
                    'El estado de distribución no es válido.'
                );
            }






            if (
                !Array.isArray(datos.detalles) ||
                datos.detalles.length === 0
            ) {
                throw new Error(
                    'La distribución debe contener al menos un medicamento.'
                );
            }






            const medicamentos =
                new Set();


            for (const item of datos.detalles) {

                const idMedicamento =
                    Number(
                        item.ID_Medicamento
                    );


                if (medicamentos.has(idMedicamento)) {
                    throw new Error(
                        `El medicamento ${idMedicamento} está repetido en la distribución.`
                    );
                }


                medicamentos.add(
                    idMedicamento
                );
            }






            const distribucion =
                distribucionRepo.create({
                    ID_Sucursal:
                        datos.ID_Sucursal,

                    ID_Usuario:
                        datos.ID_Usuario,

                    Fecha_Distribucion:
                        fecha,

                    Estado_Distribucion:
                        estado
                });


            const distribucionGuardada =
                await distribucionRepo.save(
                    distribucion
                );






            for (const item of datos.detalles) {

                const cantidad =
                    Number(
                        item.Cantidad_Distribucion
                    );


                if (
                    !Number.isInteger(cantidad) ||
                    cantidad <= 0
                ) {
                    throw new Error(
                        'La cantidad de distribución debe ser un número entero mayor que cero.'
                    );
                }


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


                const detalle =
                    detalleRepo.create({
                        ID_Distribucion:
                            distribucionGuardada.ID_Distribucion,

                        ID_Medicamento:
                            item.ID_Medicamento,

                        Cantidad_Distribucion:
                            cantidad
                    });


                await detalleRepo.save(
                    detalle
                );
            }






            return distribucionGuardada;
        }
    );
}

async function actualizar(id, datos) {

    const distribucion =
        await distribucionRepository.findOneBy({
            ID_Distribucion: id
        });

    if (!distribucion) {
        return null;
    }




    throw new Error(
        'Las distribuciones no pueden modificarse una vez registradas.'
    );
}


async function eliminar(id) {

    const distribucion =
        await distribucionRepository.findOneBy({
            ID_Distribucion: id
        });

    if (!distribucion) {
        return null;
    }


    const detalles =
        await detalleDistribucionRepository.count({
            where: {
                ID_Distribucion: id
            }
        });


    if (detalles > 0) {
        throw new Error(
            'No se puede eliminar la distribución porque tiene medicamentos asociados.'
        );
    }


    throw new Error(
        'Las distribuciones registradas forman parte del historial y no deben eliminarse.'
    );
}


module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    crearDistribucionCompleta,
    actualizar,
    eliminar
};