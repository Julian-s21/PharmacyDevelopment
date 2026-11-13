/*const detalleTransferenciaRepository =
    require('../repositories/detalleTransferencia.repository');

const obtenerTodos = async () => {
    return await detalleTransferenciaRepository.find();
};

const obtenerPorId = async (id) => {
    return await detalleTransferenciaRepository.findOneBy({
        ID_Detalle_Transferencia: id
    });
};

const crear = async (datos) => {
    const detalleTransferencia =
        detalleTransferenciaRepository.create(datos);

    return await detalleTransferenciaRepository.save(detalleTransferencia);
};

const actualizar = async (id, datos) => {
    const detalleTransferencia = await obtenerPorId(id);

    if (!detalleTransferencia) {
        return null;
    }

    Object.assign(detalleTransferencia, datos);

    return await detalleTransferenciaRepository.save(detalleTransferencia);
};

const eliminar = async (id) => {
    const detalleTransferencia = await obtenerPorId(id);

    if (!detalleTransferencia) {
        return null;
    }

    await detalleTransferenciaRepository.remove(detalleTransferencia);

    return detalleTransferencia;
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};*/

const detalleTransferenciaRepository =
    require('../repositories/detalleTransferencia.repository');

const transferenciaRepository =
    require('../repositories/transferencia.repository');

const medicamentoRepository =
    require('../repositories/medicamento.repository');


async function obtenerTodos() {

    return await detalleTransferenciaRepository.find({
        relations: {
            transferencia: true,
            medicamento: true
        }
    });
}


async function obtenerPorId(id) {

    return await detalleTransferenciaRepository.findOne({
        where: {
            ID_Detalle_Transferencia: id
        },
        relations: {
            transferencia: true,
            medicamento: true
        }
    });
}


async function crear(datos) {

    // Verificar transferencia
    const transferencia =
        await transferenciaRepository.findOneBy({
            ID_Transferencia: datos.ID_Transferencia
        });

    if (!transferencia) {
        throw new Error(
            'La transferencia indicada no existe.'
        );
    }


    // Verificar medicamento
    const medicamento =
        await medicamentoRepository.findOneBy({
            ID_Medicamento: datos.ID_Medicamento
        });

    if (!medicamento) {
        throw new Error(
            'El medicamento indicado no existe.'
        );
    }


    // Validar cantidad
    const cantidad =
        Number(datos.Cantidad_Transferencia);

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        throw new Error(
            'La cantidad de transferencia debe ser un número entero mayor que cero.'
        );
    }


    // Evitar que el mismo medicamento aparezca
    // dos veces dentro de la misma transferencia
    const detalleExistente =
        await detalleTransferenciaRepository.findOne({
            where: {
                ID_Transferencia:
                    datos.ID_Transferencia,

                ID_Medicamento:
                    datos.ID_Medicamento
            }
        });

    if (detalleExistente) {
        throw new Error(
            'El medicamento ya está registrado en esta transferencia.'
        );
    }


    const detalle =
        detalleTransferenciaRepository.create({
            ID_Transferencia:
                datos.ID_Transferencia,

            ID_Medicamento:
                datos.ID_Medicamento,

            Cantidad_Transferencia:
                cantidad
        });


    return await detalleTransferenciaRepository.save(
        detalle
    );
}


async function actualizar(id, datos) {

    const detalle =
        await detalleTransferenciaRepository.findOneBy({
            ID_Detalle_Transferencia: id
        });

    if (!detalle) {
        return null;
    }


    // Los detalles forman parte de una transferencia
    // registrada y no deben modificarse directamente.
    throw new Error(
        'Los detalles de una transferencia no pueden modificarse una vez registrados.'
    );
}


async function eliminar(id) {

    const detalle =
        await detalleTransferenciaRepository.findOneBy({
            ID_Detalle_Transferencia: id
        });

    if (!detalle) {
        return null;
    }


    throw new Error(
        'Los detalles de una transferencia no pueden eliminarse una vez registrados.'
    );
}


module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};