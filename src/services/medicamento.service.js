/*const medicamentoRepository =
    require('../repositories/medicamento.repository');

const obtenerTodos = async () => {
    return await medicamentoRepository.find();
};

const obtenerPorId = async (id) => {
    return await medicamentoRepository.findOneBy({
        ID_Medicamento: id
    });
};

const crear = async (datos) => {
    const medicamento =
        medicamentoRepository.create(datos);

    return await medicamentoRepository.save(medicamento);
};

const actualizar = async (id, datos) => {
    const medicamento = await obtenerPorId(id);

    if (!medicamento) {
        return null;
    }

    Object.assign(medicamento, datos);

    return await medicamentoRepository.save(medicamento);
};

const eliminar = async (id) => {
    const medicamento = await obtenerPorId(id);

    if (!medicamento) {
        return null;
    }

    await medicamentoRepository.remove(medicamento);

    return medicamento;
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};*/

const medicamentoRepository = require('../repositories/medicamento.repository');
const categoriaRepository = require('../repositories/categoriaMedicamento.repository');
const inventarioRepository = require('../repositories/inventario.repository');
const detalleTransferenciaRepository = require('../repositories/detalleTransferencia.repository');
const detalleDistribucionRepository = require('../repositories/detalleDistribucion.repository');


async function obtenerTodos() {
    const medicamentos = await medicamentoRepository.find({
        relations: {
            categoria: true,
            inventarios: true
        }
    });
    return medicamentos.map((medicamento) => ({
        ...medicamento,
        Nombre_Categoria: medicamento.categoria?.Nombre_Categoria,
        Existencia: (medicamento.inventarios || []).reduce(
            (total, inventario) => total + Number(inventario.Cantidad_Inventario || 0), 0
        )
    }));
}


async function obtenerPorId(id) {
    const medicamento = await medicamentoRepository.findOne({
        where: {
            ID_Medicamento: id
        },
        relations: {
            categoria: true,
            inventarios: true
        }
    });
    if (!medicamento) return null;
    return {
        ...medicamento,
        Nombre_Categoria: medicamento.categoria?.Nombre_Categoria,
        Existencia: (medicamento.inventarios || []).reduce(
            (total, inventario) => total + Number(inventario.Cantidad_Inventario || 0), 0
        )
    };
}


async function crear(datos) {

    // Verificar que la categoría exista
    const categoria = await categoriaRepository.findOneBy({
        ID_Categoria: datos.ID_Categoria
    });

    if (!categoria) {
        throw new Error('La categoría indicada no existe.');
    }


    // Verificar que no exista otro medicamento con el mismo nombre
    const medicamentoExistente = await medicamentoRepository.findOneBy({
        Nombre_Medicamento: datos.Nombre_Medicamento
    });

    if (medicamentoExistente) {
        throw new Error('Ya existe un medicamento con ese nombre.');
    }


    // Validar el precio
    if (
        datos.Precio_Medicamento === undefined ||
        Number(datos.Precio_Medicamento) < 0
    ) {
        throw new Error(
            'El precio del medicamento debe ser un valor válido mayor o igual a cero.'
        );
    }


    const medicamento = medicamentoRepository.create({
        ID_Categoria: datos.ID_Categoria,
        Nombre_Medicamento: datos.Nombre_Medicamento,
        Codigo_Medicamento: datos.Codigo_Medicamento || null,
        Presentacion: datos.Presentacion || null,
        Descripcion_Medicamento: datos.Descripcion_Medicamento,
        Precio_Medicamento: datos.Precio_Medicamento
    });

    return await medicamentoRepository.save(medicamento);
}


async function actualizar(id, datos) {

    const medicamento = await medicamentoRepository.findOneBy({
        ID_Medicamento: id
    });

    if (!medicamento) {
        return null;
    }


    // Si se cambia la categoría, verificar que exista
    if (datos.ID_Categoria !== undefined) {

        const categoria = await categoriaRepository.findOneBy({
            ID_Categoria: datos.ID_Categoria
        });

        if (!categoria) {
            throw new Error('La categoría indicada no existe.');
        }

        medicamento.ID_Categoria = datos.ID_Categoria;
    }


    // Si se cambia el nombre, verificar duplicados
    if (datos.Nombre_Medicamento !== undefined) {

        const medicamentoExistente =
            await medicamentoRepository.findOneBy({
                Nombre_Medicamento: datos.Nombre_Medicamento
            });

        if (
            medicamentoExistente &&
            medicamentoExistente.ID_Medicamento !== Number(id)
        ) {
            throw new Error(
                'Ya existe otro medicamento con ese nombre.'
            );
        }

        medicamento.Nombre_Medicamento =
            datos.Nombre_Medicamento;
    }


    // Validar precio si se está actualizando
    if (datos.Precio_Medicamento !== undefined) {

        if (Number(datos.Precio_Medicamento) < 0) {
            throw new Error(
                'El precio del medicamento debe ser mayor o igual a cero.'
            );
        }

        medicamento.Precio_Medicamento =
            datos.Precio_Medicamento;
    }


    if (datos.Descripcion_Medicamento !== undefined) {
        medicamento.Descripcion_Medicamento =
            datos.Descripcion_Medicamento;
    }

    if (datos.Codigo_Medicamento !== undefined) medicamento.Codigo_Medicamento = datos.Codigo_Medicamento;
    if (datos.Presentacion !== undefined) medicamento.Presentacion = datos.Presentacion;


    return await medicamentoRepository.save(medicamento);
}


async function eliminar(id) {

    const medicamento = await medicamentoRepository.findOneBy({
        ID_Medicamento: id
    });

    if (!medicamento) {
        return null;
    }


    // Verificar inventario relacionado
    const inventarios = await inventarioRepository.count({
        where: {
            ID_Medicamento: id
        }
    });


    // Verificar detalles de transferencias relacionados
    const detallesTransferencia =
        await detalleTransferenciaRepository.count({
            where: {
                ID_Medicamento: id
            }
        });


    // Verificar detalles de distribuciones relacionados
    const detallesDistribucion =
        await detalleDistribucionRepository.count({
            where: {
                ID_Medicamento: id
            }
        });


    if (
        inventarios > 0 ||
        detallesTransferencia > 0 ||
        detallesDistribucion > 0
    ) {
        throw new Error(
            'No se puede eliminar el medicamento porque tiene información relacionada.'
        );
    }


    await medicamentoRepository.remove(medicamento);

    return medicamento;
}


module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
