/*const sucursalRepository = require('../repositories/sucursal.repository');

const obtenerTodas = async () => {
    return await sucursalRepository.find();
};

const obtenerPorId = async (id) => {
    return await sucursalRepository.findOneBy({
        ID_Sucursal: id
    });
};

const crear = async (datos) => {
    const sucursal = sucursalRepository.create(datos);

    return await sucursalRepository.save(sucursal);
};

const actualizar = async (id, datos) => {
    const sucursal = await obtenerPorId(id);

    if (!sucursal) {
        return null;
    }

    Object.assign(sucursal, datos);

    return await sucursalRepository.save(sucursal);
};

const eliminar = async (id) => {
    const sucursal = await obtenerPorId(id);

    if (!sucursal) {
        return null;
    }

    await sucursalRepository.remove(sucursal);

    return sucursal;
};

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};*/

const sucursalRepository = require('../repositories/sucursal.repository');
const usuarioRepository = require('../repositories/usuario.repository');
const inventarioRepository = require('../repositories/inventario.repository');
const transferenciaRepository = require('../repositories/transferencia.repository');
const distribucionRepository = require('../repositories/distribucion.repository');
const movimientoFinancieroRepository = require('../repositories/movimientoFinanciero.repository');
const gastoPlanillaRepository = require('../repositories/gastoPlanilla.repository');
const activoFijoRepository = require('../repositories/activoFijo.repository');
const flujoEfectivoRepository = require('../repositories/flujoEfectivo.repository');

async function obtenerTodas() {
    return await sucursalRepository.find();
}

async function obtenerPorId(id) {
    const sucursal = await sucursalRepository.findOneBy({
        ID_Sucursal: id
    });

    if (!sucursal) {
        return null;
    }

    const [empleados, inventarios, activos, gastos, transferencias, distribuciones, movimientos, flujos] = await Promise.all([
        usuarioRepository.find({
            where: {
                ID_Sucursal: id
            }
        }),
        inventarioRepository.find({
            where: {
                ID_Sucursal: id
            },
            relations: {
                medicamento: true
            }
        }),
        activoFijoRepository.find({
            where: {
                ID_Sucursal: id
            }
        }),
        gastoPlanillaRepository.find({
            where: {
                ID_Sucursal: id
            },
            relations: {
                usuario: true
            }
        }),
        transferenciaRepository.find({
            where: [
                { ID_Sucursal_Origen: id },
                { ID_Sucursal_Destino: id }
            ],
            relations: {
                usuario: true,
                sucursalOrigen: true,
                sucursalDestino: true
            }
        }),
        distribucionRepository.find({
            where: {
                ID_Sucursal: id
            },
            relations: {
                usuario: true
            }
        }),
        movimientoFinancieroRepository.find({
            where: {
                ID_Sucursal: id
            },
            relations: {
                usuario: true
            }
        }),
        flujoEfectivoRepository.find({
            where: {
                ID_Sucursal: id
            },
            relations: {
                sucursal: true
            }
        })
    ]);

    const medicamentos = inventarios
        .filter((item) => item.medicamento)
        .map((item) => ({
            ID_Inventario: item.ID_Inventario,
            ID_Medicamento: item.ID_Medicamento,
            Nombre_Medicamento: item.medicamento?.Nombre_Medicamento,
            Cantidad_Inventario: item.Cantidad_Inventario,
            Precio_Medicamento: item.medicamento?.Precio_Medicamento
        }));

    const totalInventario = inventarios.reduce(
        (acumulador, item) =>
            acumulador + Number(item.Cantidad_Inventario || 0),
        0
    );

    const operaciones = [
        ...transferencias.map((item) => ({
            tipo: 'Transferencia',
            id: item.ID_Transferencia,
            fecha: item.Fecha_Transferencia,
            descripcion: `Transferencia ${item.ID_Transferencia}`,
            usuario: item.usuario
                ? `${item.usuario.Nombre_Usuario} ${item.usuario.Apellido_Usuario}`
                : 'Usuario no disponible'
        })),
        ...distribuciones.map((item) => ({
            tipo: 'Distribución',
            id: item.ID_Distribucion,
            fecha: item.Fecha_Distribucion,
            descripcion: `Distribución ${item.ID_Distribucion}`,
            usuario: item.usuario
                ? `${item.usuario.Nombre_Usuario} ${item.usuario.Apellido_Usuario}`
                : 'Usuario no disponible'
        })),
        ...movimientos.map((item) => ({
            tipo: 'Movimiento financiero',
            id: item.ID_Movimiento_Financiero,
            fecha: item.Fecha_Movimiento_Financiero,
            descripcion: item.Concepto_Movimiento_Financiero || 'Movimiento financiero',
            usuario: item.usuario
                ? `${item.usuario.Nombre_Usuario} ${item.usuario.Apellido_Usuario}`
                : 'Usuario no disponible'
        })),
        ...flujos.map((item) => ({
            tipo: 'Flujo de efectivo',
            id: item.ID_Flujo_Efectivo,
            fecha: item.Fecha_Fin_Flujo || item.Fecha_Inicio_Flujo,
            descripcion: `Flujo ${item.ID_Flujo_Efectivo}`,
            usuario: 'Sucursal'
        }))
    ];

    return {
        ...sucursal,
        empleados,
        medicamentos,
        activosFijos: activos,
        gastosPlanilla: gastos,
        inventario: totalInventario,
        inventarioDetalle: inventarios,
        operaciones,
        transferencias,
        distribuciones,
        movimientosFinancieros: movimientos,
        flujosEfectivo: flujos
    };
}

async function crear(datos) {

    const sucursalExistente = await sucursalRepository.findOneBy({
        Nombre_Sucursal: datos.Nombre_Sucursal
    });

    if (sucursalExistente) {
        throw new Error('Ya existe una sucursal con ese nombre.');
    }

    const sucursal = sucursalRepository.create({
        Nombre_Sucursal: datos.Nombre_Sucursal,
        Direccion_Sucursal: datos.Direccion_Sucursal,
        Telefono_Sucursal: datos.Telefono_Sucursal
    });

    return await sucursalRepository.save(sucursal);
}

async function actualizar(id, datos) {

    const sucursal = await sucursalRepository.findOneBy({
        ID_Sucursal: id
    });

    if (!sucursal) {
        return null;
    }

    if (datos.Nombre_Sucursal) {

        const sucursalExistente = await sucursalRepository.findOneBy({
            Nombre_Sucursal: datos.Nombre_Sucursal
        });

        if (
            sucursalExistente &&
            sucursalExistente.ID_Sucursal !== Number(id)
        ) {
            throw new Error('Ya existe otra sucursal con ese nombre.');
        }
    }

    if (datos.Nombre_Sucursal !== undefined) {
        sucursal.Nombre_Sucursal = datos.Nombre_Sucursal;
    }

    if (datos.Direccion_Sucursal !== undefined) {
        sucursal.Direccion_Sucursal = datos.Direccion_Sucursal;
    }

    if (datos.Telefono_Sucursal !== undefined) {
        sucursal.Telefono_Sucursal = datos.Telefono_Sucursal;
    }

    return await sucursalRepository.save(sucursal);
}

async function eliminar(id) {

    const sucursal = await sucursalRepository.findOneBy({
        ID_Sucursal: id
    });

    if (!sucursal) {
        return null;
    }

    const usuarios = await usuarioRepository.count({
        where: {
            ID_Sucursal: id
        }
    });

    const inventarios = await inventarioRepository.count({
        where: {
            ID_Sucursal: id
        }
    });

    const transferenciasOrigen = await transferenciaRepository.count({
        where: {
            ID_Sucursal_Origen: id
        }
    });

    const transferenciasDestino = await transferenciaRepository.count({
        where: {
            ID_Sucursal_Destino: id
        }
    });

    const distribuciones = await distribucionRepository.count({
        where: {
            ID_Sucursal: id
        }
    });

    const movimientosFinancieros = await movimientoFinancieroRepository.count({
        where: {
            ID_Sucursal: id
        }
    });

    const gastosPlanilla = await gastoPlanillaRepository.count({
        where: {
            ID_Sucursal: id
        }
    });

    const activosFijos = await activoFijoRepository.count({
        where: {
            ID_Sucursal: id
        }
    });

    const flujosEfectivo = await flujoEfectivoRepository.count({
        where: {
            ID_Sucursal: id
        }
    });

    const tieneRegistrosRelacionados =
        usuarios > 0 ||
        inventarios > 0 ||
        transferenciasOrigen > 0 ||
        transferenciasDestino > 0 ||
        distribuciones > 0 ||
        movimientosFinancieros > 0 ||
        gastosPlanilla > 0 ||
        activosFijos > 0 ||
        flujosEfectivo > 0;

    if (tieneRegistrosRelacionados) {
        throw new Error(
            'No se puede eliminar la sucursal porque tiene información relacionada.'
        );
    }

    await sucursalRepository.remove(sucursal);

    return sucursal;
}

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};