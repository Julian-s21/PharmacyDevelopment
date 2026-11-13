

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


    const transferencia =
        await transferenciaRepository.findOneBy({
            ID_Transferencia: datos.ID_Transferencia
        });

    if (!transferencia) {
        throw new Error(
            'La transferencia indicada no existe.'
        );
    }



    const medicamento =
        await medicamentoRepository.findOneBy({
            ID_Medicamento: datos.ID_Medicamento
        });

    if (!medicamento) {
        throw new Error(
            'El medicamento indicado no existe.'
        );
    }



    const cantidad =
        Number(datos.Cantidad_Transferencia);

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        throw new Error(
            'La cantidad de transferencia debe ser un número entero mayor que cero.'
        );
    }




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