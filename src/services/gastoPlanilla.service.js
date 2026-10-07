/*const gastoPlanillaRepository =
    require('../repositories/gastoPlanilla.repository');

const obtenerTodos = async () => {
    return await gastoPlanillaRepository.find();
};

const obtenerPorId = async (id) => {
    return await gastoPlanillaRepository.findOneBy({
        ID_Gasto_Planilla: id
    });
};

const crear = async (datos) => {
    const gastoPlanilla =
        gastoPlanillaRepository.create(datos);

    return await gastoPlanillaRepository.save(gastoPlanilla);
};

const actualizar = async (id, datos) => {
    const gastoPlanilla = await obtenerPorId(id);

    if (!gastoPlanilla) {
        return null;
    }

    Object.assign(gastoPlanilla, datos);

    return await gastoPlanillaRepository.save(gastoPlanilla);
};

const eliminar = async (id) => {
    const gastoPlanilla = await obtenerPorId(id);

    if (!gastoPlanilla) {
        return null;
    }

    await gastoPlanillaRepository.remove(gastoPlanilla);

    return gastoPlanilla;
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};*/

const gastoPlanillaRepository =
    require('../repositories/gastoPlanilla.repository');

const sucursalRepository =
    require('../repositories/sucursal.repository');

const usuarioRepository =
    require('../repositories/usuario.repository');


async function obtenerTodos() {

    return await gastoPlanillaRepository.find({
        relations: {
            sucursal: true,
            usuario: true
        }
    });
}


async function obtenerPorId(id) {

    return await gastoPlanillaRepository.findOne({
        where: {
            ID_Gasto_Planilla: id
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


    // Validar salario
    const salario =
        Number(datos.Salario_Planilla);

    if (isNaN(salario) || salario < 0) {
        throw new Error(
            'El salario debe ser un número mayor o igual a cero.'
        );
    }


    // Validar deducciones
    const deducciones =
        datos.Deducciones_Planilla === undefined ||
        datos.Deducciones_Planilla === null
            ? 0
            : Number(datos.Deducciones_Planilla);

    if (isNaN(deducciones) || deducciones < 0) {
        throw new Error(
            'Las deducciones deben ser un número mayor o igual a cero.'
        );
    }


    // Las deducciones no pueden superar el salario
    if (deducciones > salario) {
        throw new Error(
            'Las deducciones no pueden ser mayores que el salario.'
        );
    }


    // Calcular automáticamente el total
    const total = salario - deducciones;


    // Validar fecha
    if (!datos.Fecha_Planilla) {
        throw new Error(
            'La fecha de planilla es obligatoria.'
        );
    }

    const fecha =
        new Date(datos.Fecha_Planilla);

    if (isNaN(fecha.getTime())) {
        throw new Error(
            'La fecha de planilla no es válida.'
        );
    }


    const gastoPlanilla =
        gastoPlanillaRepository.create({
            ID_Sucursal:
                datos.ID_Sucursal,

            ID_Usuario:
                datos.ID_Usuario,

            Salario_Planilla:
                salario,

            Deducciones_Planilla:
                deducciones,

            Total_Planilla:
                total,

            Fecha_Planilla:
                fecha
        });


    return await gastoPlanillaRepository.save(
        gastoPlanilla
    );
}


async function actualizar(id, datos) {

    const gastoPlanilla =
        await gastoPlanillaRepository.findOneBy({
            ID_Gasto_Planilla: id
        });

    if (!gastoPlanilla) {
        return null;
    }


    // La planilla registrada forma parte del historial financiero.
    throw new Error(
        'Los gastos de planilla no pueden modificarse una vez registrados.'
    );
}


async function eliminar(id) {

    const gastoPlanilla =
        await gastoPlanillaRepository.findOneBy({
            ID_Gasto_Planilla: id
        });

    if (!gastoPlanilla) {
        return null;
    }


    throw new Error(
        'Los gastos de planilla no pueden eliminarse porque forman parte del historial financiero.'
    );
}


module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};