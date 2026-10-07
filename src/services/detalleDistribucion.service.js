/*const detalleDistribucionRepository =
    require('../repositories/detalleDistribucion.repository');

const obtenerTodos = async () => {
    return await detalleDistribucionRepository.find();
};

const obtenerPorId = async (id) => {
    return await detalleDistribucionRepository.findOneBy({
        ID_Detalle_Distribucion: id
    });
};

const crear = async (datos) => {
    const detalleDistribucion =
        detalleDistribucionRepository.create(datos);

    return await detalleDistribucionRepository.save(detalleDistribucion);
};

const actualizar = async (id, datos) => {
    const detalleDistribucion = await obtenerPorId(id);

    if (!detalleDistribucion) {
        return null;
    }

    Object.assign(detalleDistribucion, datos);

    return await detalleDistribucionRepository.save(detalleDistribucion);
};

const eliminar = async (id) => {
    const detalleDistribucion = await obtenerPorId(id);

    if (!detalleDistribucion) {
        return null;
    }

    await detalleDistribucionRepository.remove(detalleDistribucion);

    return detalleDistribucion;
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};*/

const detalleDistribucionRepository =
    require('../repositories/detalleDistribucion.repository');

const distribucionRepository =
    require('../repositories/distribucion.repository');

const medicamentoRepository =
    require('../repositories/medicamento.repository');


async function obtenerTodos() {

    return await detalleDistribucionRepository.find({
        relations: {
            distribucion: true,
            medicamento: true
        }
    });
}


async function obtenerPorId(id) {

    return await detalleDistribucionRepository.findOne({
        where: {
            ID_Detalle_Distribucion: id
        },
        relations: {
            distribucion: true,
            medicamento: true
        }
    });
}


async function crear(datos) {

    // Verificar distribución
    const distribucion =
        await distribucionRepository.findOneBy({
            ID_Distribucion: datos.ID_Distribucion
        });

    if (!distribucion) {
        throw new Error(
            'La distribución indicada no existe.'
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
        Number(datos.Cantidad_Distribucion);

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        throw new Error(
            'La cantidad de distribución debe ser un número entero mayor que cero.'
        );
    }


    // Evitar medicamento duplicado dentro
    // de la misma distribución
    const detalleExistente =
        await detalleDistribucionRepository.findOne({
            where: {
                ID_Distribucion:
                    datos.ID_Distribucion,

                ID_Medicamento:
                    datos.ID_Medicamento
            }
        });

    if (detalleExistente) {
        throw new Error(
            'El medicamento ya está registrado en esta distribución.'
        );
    }


    const detalle =
        detalleDistribucionRepository.create({
            ID_Distribucion:
                datos.ID_Distribucion,

            ID_Medicamento:
                datos.ID_Medicamento,

            Cantidad_Distribucion:
                cantidad
        });


    return await detalleDistribucionRepository.save(
        detalle
    );
}


async function actualizar(id, datos) {

    const detalle =
        await detalleDistribucionRepository.findOneBy({
            ID_Detalle_Distribucion: id
        });

    if (!detalle) {
        return null;
    }


    throw new Error(
        'Los detalles de una distribución no pueden modificarse una vez registrados.'
    );
}


async function eliminar(id) {

    const detalle =
        await detalleDistribucionRepository.findOneBy({
            ID_Detalle_Distribucion: id
        });

    if (!detalle) {
        return null;
    }


    throw new Error(
        'Los detalles de una distribución no pueden eliminarse una vez registrados.'
    );
}


module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};