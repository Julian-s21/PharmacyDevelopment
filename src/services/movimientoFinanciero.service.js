/*const movimientoFinancieroRepository =
    require('../repositories/movimientoFinanciero.repository');

const obtenerTodos = async () => {
    return await movimientoFinancieroRepository.find();
};

const obtenerPorId = async (id) => {
    return await movimientoFinancieroRepository.findOneBy({
        ID_Movimiento_Financiero: id
    });
};

const crear = async (datos) => {
    const movimiento =
        movimientoFinancieroRepository.create(datos);

    return await movimientoFinancieroRepository.save(movimiento);
};

const actualizar = async (id, datos) => {
    const movimiento = await obtenerPorId(id);

    if (!movimiento) {
        return null;
    }

    Object.assign(movimiento, datos);

    return await movimientoFinancieroRepository.save(movimiento);
};

const eliminar = async (id) => {
    const movimiento = await obtenerPorId(id);

    if (!movimiento) {
        return null;
    }

    await movimientoFinancieroRepository.remove(movimiento);

    return movimiento;
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};*/
const movimientoFinancieroRepository =
    require('../repositories/movimientoFinanciero.repository');

const sucursalRepository =
    require('../repositories/sucursal.repository');

const usuarioRepository =
    require('../repositories/usuario.repository');


async function obtenerTodos() {

    return await movimientoFinancieroRepository.find({
        relations: {
            sucursal: true,
            usuario: true
        }
    });
}


async function obtenerPorId(id) {

    return await movimientoFinancieroRepository.findOne({
        where: {
            ID_Movimiento_Financiero: id
        },
        relations: {
            sucursal: true,
            usuario: true
        }
    });
}


async function crear(datos) {

    // Verificar sucursal
    const sucursal =
        await sucursalRepository.findOneBy({
            ID_Sucursal: datos.ID_Sucursal
        });

    if (!sucursal) {
        throw new Error(
            'La sucursal indicada no existe.'
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


    // Validar tipo
    if (!datos.Tipo_Movimiento_Financiero) {
        throw new Error(
            'El tipo de movimiento financiero es obligatorio.'
        );
    }

    const tipo =
        String(datos.Tipo_Movimiento_Financiero)
            .trim()
            .toUpperCase();


    if (tipo !== 'INGRESO' && tipo !== 'EGRESO') {
        throw new Error(
            'El tipo de movimiento debe ser INGRESO o EGRESO.'
        );
    }


    // Validar concepto
    if (!datos.Concepto_Movimiento_Financiero) {
        throw new Error(
            'El concepto del movimiento financiero es obligatorio.'
        );
    }

    const concepto =
        String(datos.Concepto_Movimiento_Financiero)
            .trim();


    if (concepto.length > 250) {
        throw new Error(
            'El concepto no puede superar los 250 caracteres.'
        );
    }


    // Validar monto
    const monto =
        Number(datos.Monto_Movimiento_Financiero);

    if (isNaN(monto) || monto < 0) {
        throw new Error(
            'El monto debe ser un número mayor o igual a cero.'
        );
    }


    // Validar fecha
    if (!datos.Fecha_Movimiento_Financiero) {
        throw new Error(
            'La fecha del movimiento financiero es obligatoria.'
        );
    }

    const fecha =
        new Date(datos.Fecha_Movimiento_Financiero);

    if (isNaN(fecha.getTime())) {
        throw new Error(
            'La fecha del movimiento financiero no es válida.'
        );
    }


    const movimiento =
        movimientoFinancieroRepository.create({
            ID_Sucursal:
                datos.ID_Sucursal,

            ID_Usuario:
                datos.ID_Usuario,

            Tipo_Movimiento_Financiero:
                tipo,

            Concepto_Movimiento_Financiero:
                concepto,

            Monto_Movimiento_Financiero:
                monto,

            Fecha_Movimiento_Financiero:
                fecha
        });


    return await movimientoFinancieroRepository.save(
        movimiento
    );
}


async function actualizar(id, datos) {

    const movimiento =
        await movimientoFinancieroRepository.findOneBy({
            ID_Movimiento_Financiero: id
        });

    if (!movimiento) {
        return null;
    }


    // Los movimientos financieros representan
    // operaciones históricas.
    throw new Error(
        'Los movimientos financieros no pueden modificarse una vez registrados.'
    );
}


async function eliminar(id) {

    const movimiento =
        await movimientoFinancieroRepository.findOneBy({
            ID_Movimiento_Financiero: id
        });

    if (!movimiento) {
        return null;
    }


    throw new Error(
        'Los movimientos financieros no pueden eliminarse porque forman parte del historial financiero.'
    );
}


module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};