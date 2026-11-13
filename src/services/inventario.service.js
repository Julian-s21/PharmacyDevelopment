/*const inventarioRepository =
    require('../repositories/inventario.repository');

const obtenerTodos = async () => {
    return await inventarioRepository.find();
};

const obtenerPorId = async (id) => {
    return await inventarioRepository.findOneBy({
        ID_Inventario: id
    });
};

const crear = async (datos) => {
    const inventario =
        inventarioRepository.create(datos);

    return await inventarioRepository.save(inventario);
};

const actualizar = async (id, datos) => {
    const inventario = await obtenerPorId(id);

    if (!inventario) {
        return null;
    }

    Object.assign(inventario, datos);

    return await inventarioRepository.save(inventario);
};

const eliminar = async (id) => {
    const inventario = await obtenerPorId(id);

    if (!inventario) {
        return null;
    }

    await inventarioRepository.remove(inventario);

    return inventario;
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};*/
const inventarioRepository = require('../repositories/inventario.repository');
const sucursalRepository = require('../repositories/sucursal.repository');
const medicamentoRepository = require('../repositories/medicamento.repository');
const movimientoInventarioRepository = require('../repositories/movimientoInventario.repository');

async function obtenerTodos() {
    return await inventarioRepository.find({
        relations: {
            sucursal: true,
            medicamento: true
        }
    });
}

async function obtenerPorId(id) {
    return await inventarioRepository.findOne({
        where: {
            ID_Inventario: id
        },
        relations: {
            sucursal: true,
            medicamento: true
        }
    });
}

async function obtenerPorMedicamento(id) {
    return await inventarioRepository.find({
        where: { ID_Medicamento: Number(id) },
        relations: { sucursal: true, movimientos: true }
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

    // Verificar que el medicamento exista
    const medicamento = await medicamentoRepository.findOneBy({
        ID_Medicamento: datos.ID_Medicamento
    });

    if (!medicamento) {
        throw new Error('El medicamento indicado no existe.');
    }

    // Verificar que no exista ya el medicamento
    // en el inventario de esa sucursal
    const inventarioExistente =
        await inventarioRepository.findOne({
            where: {
                ID_Sucursal: datos.ID_Sucursal,
                ID_Medicamento: datos.ID_Medicamento
            }
        });

    if (inventarioExistente) {
        throw new Error(
            'El medicamento ya tiene un inventario registrado en esta sucursal.'
        );
    }

    // Validar cantidad
    const cantidad = Number(datos.Cantidad_Inventario);

    if (!Number.isInteger(cantidad) || cantidad < 0) {
        throw new Error(
            'La cantidad del inventario debe ser un número entero mayor o igual a cero.'
        );
    }

    const inventario = inventarioRepository.create({
        ID_Sucursal: datos.ID_Sucursal,
        ID_Medicamento: datos.ID_Medicamento,
        Cantidad_Inventario: cantidad
    });

    return await inventarioRepository.save(inventario);
}

async function actualizar(id, datos) {

    const inventario = await inventarioRepository.findOneBy({
        ID_Inventario: id
    });

    if (!inventario) {
        return null;
    }

    // Si se cambia la sucursal
    if (datos.ID_Sucursal !== undefined) {

        const sucursal = await sucursalRepository.findOneBy({
            ID_Sucursal: datos.ID_Sucursal
        });

        if (!sucursal) {
            throw new Error('La sucursal indicada no existe.');
        }

        inventario.ID_Sucursal = datos.ID_Sucursal;
    }

    // Si se cambia el medicamento
    if (datos.ID_Medicamento !== undefined) {

        const medicamento = await medicamentoRepository.findOneBy({
            ID_Medicamento: datos.ID_Medicamento
        });

        if (!medicamento) {
            throw new Error('El medicamento indicado no existe.');
        }

        inventario.ID_Medicamento = datos.ID_Medicamento;
    }

    // Verificar combinación duplicada
    const inventarioExistente =
        await inventarioRepository.findOne({
            where: {
                ID_Sucursal: inventario.ID_Sucursal,
                ID_Medicamento: inventario.ID_Medicamento
            }
        });

    if (
        inventarioExistente &&
        inventarioExistente.ID_Inventario !== Number(id)
    ) {
        throw new Error(
            'Ya existe otro inventario para ese medicamento en esa sucursal.'
        );
    }

    // Actualizar cantidad
    if (datos.Cantidad_Inventario !== undefined) {

        const cantidad = Number(datos.Cantidad_Inventario);

        if (!Number.isInteger(cantidad) || cantidad < 0) {
            throw new Error(
                'La cantidad del inventario debe ser un número entero mayor o igual a cero.'
            );
        }

        inventario.Cantidad_Inventario = cantidad;
    }

    return await inventarioRepository.save(inventario);
}

async function eliminar(id) {

    const inventario = await inventarioRepository.findOneBy({
        ID_Inventario: id
    });

    if (!inventario) {
        return null;
    }

    // Verificar movimientos relacionados
    const movimientos =
        await movimientoInventarioRepository.count({
            where: {
                ID_Inventario: id
            }
        });

    if (movimientos > 0) {
        throw new Error(
            'No se puede eliminar el inventario porque tiene movimientos registrados.'
        );
    }

    await inventarioRepository.remove(inventario);

    return inventario;
}

module.exports = {
    obtenerTodos,
    obtenerPorId,
    obtenerPorMedicamento,
    crear,
    actualizar,
    eliminar
};
