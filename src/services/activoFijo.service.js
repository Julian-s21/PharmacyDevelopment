/*const activoFijoRepository =
    require('../repositories/activoFijo.repository');

const obtenerTodos = async () => {
    return await activoFijoRepository.find();
};

const obtenerPorId = async (id) => {
    return await activoFijoRepository.findOneBy({
        ID_Activo: id
    });
};

const crear = async (datos) => {
    const activo =
        activoFijoRepository.create(datos);

    return await activoFijoRepository.save(activo);
};

const actualizar = async (id, datos) => {
    const activo = await obtenerPorId(id);

    if (!activo) {
        return null;
    }

    Object.assign(activo, datos);

    return await activoFijoRepository.save(activo);
};

const eliminar = async (id) => {
    const activo = await obtenerPorId(id);

    if (!activo) {
        return null;
    }

    await activoFijoRepository.remove(activo);

    return activo;
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};*/

const activoFijoRepository =
    require('../repositories/activoFijo.repository');

const sucursalRepository =
    require('../repositories/sucursal.repository');


async function obtenerTodos() {

    return await activoFijoRepository.find({
        relations: {
            sucursal: true
        }
    });
}


async function obtenerPorId(id) {

    return await activoFijoRepository.findOne({
        where: {
            ID_Activo: id
        },
        relations: {
            sucursal: true
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


    // Validar nombre
    if (!datos.Nombre_Activo) {
        throw new Error(
            'El nombre del activo es obligatorio.'
        );
    }

    const nombre =
        String(datos.Nombre_Activo).trim();


    if (nombre.length > 150) {
        throw new Error(
            'El nombre del activo no puede superar los 150 caracteres.'
        );
    }


    // Validar descripción
    let descripcion = null;

    if (
        datos.Descripcion_Activo !== undefined &&
        datos.Descripcion_Activo !== null
    ) {
        descripcion =
            String(datos.Descripcion_Activo).trim();

        if (descripcion.length > 500) {
            throw new Error(
                'La descripción del activo no puede superar los 500 caracteres.'
            );
        }
    }


    // Validar precio de adquisición
    const precio =
        Number(datos.Precio_Adquisicion_Activo);

    if (isNaN(precio) || precio < 0) {
        throw new Error(
            'El precio de adquisición debe ser un número mayor o igual a cero.'
        );
    }


    // Validar vida útil
    let vidaUtil = null;

    if (
        datos.Vida_Util_Activo !== undefined &&
        datos.Vida_Util_Activo !== null
    ) {

        vidaUtil =
            Number(datos.Vida_Util_Activo);

        if (
            !Number.isInteger(vidaUtil) ||
            vidaUtil <= 0
        ) {
            throw new Error(
                'La vida útil debe ser un número entero mayor que cero.'
            );
        }
    }


    const activo =
        activoFijoRepository.create({
            ID_Sucursal:
                datos.ID_Sucursal,

            Nombre_Activo:
                nombre,

            Descripcion_Activo:
                descripcion,

            Precio_Adquisicion_Activo:
                precio,

            Vida_Util_Activo:
                vidaUtil
        });


    return await activoFijoRepository.save(activo);
}


async function actualizar(id, datos) {

    const activo =
        await activoFijoRepository.findOneBy({
            ID_Activo: id
        });

    if (!activo) {
        return null;
    }


    // Verificar sucursal si se modifica
    if (datos.ID_Sucursal !== undefined) {

        const sucursal =
            await sucursalRepository.findOneBy({
                ID_Sucursal: datos.ID_Sucursal
            });

        if (!sucursal) {
            throw new Error(
                'La sucursal indicada no existe.'
            );
        }

        activo.ID_Sucursal =
            datos.ID_Sucursal;
    }


    // Actualizar nombre
    if (datos.Nombre_Activo !== undefined) {

        const nombre =
            String(datos.Nombre_Activo).trim();

        if (!nombre) {
            throw new Error(
                'El nombre del activo es obligatorio.'
            );
        }

        if (nombre.length > 150) {
            throw new Error(
                'El nombre del activo no puede superar los 150 caracteres.'
            );
        }

        activo.Nombre_Activo = nombre;
    }


    // Actualizar descripción
    if (datos.Descripcion_Activo !== undefined) {

        if (
            datos.Descripcion_Activo === null
        ) {
            activo.Descripcion_Activo = null;

        } else {

            const descripcion =
                String(datos.Descripcion_Activo).trim();

            if (descripcion.length > 500) {
                throw new Error(
                    'La descripción del activo no puede superar los 500 caracteres.'
                );
            }

            activo.Descripcion_Activo =
                descripcion;
        }
    }


    // Actualizar precio
    if (datos.Precio_Adquisicion_Activo !== undefined) {

        const precio =
            Number(datos.Precio_Adquisicion_Activo);

        if (isNaN(precio) || precio < 0) {
            throw new Error(
                'El precio de adquisición debe ser un número mayor o igual a cero.'
            );
        }

        activo.Precio_Adquisicion_Activo =
            precio;
    }


    // Actualizar vida útil
    if (datos.Vida_Util_Activo !== undefined) {

        if (datos.Vida_Util_Activo === null) {

            activo.Vida_Util_Activo = null;

        } else {

            const vidaUtil =
                Number(datos.Vida_Util_Activo);

            if (
                !Number.isInteger(vidaUtil) ||
                vidaUtil <= 0
            ) {
                throw new Error(
                    'La vida útil debe ser un número entero mayor que cero.'
                );
            }

            activo.Vida_Util_Activo =
                vidaUtil;
        }
    }


    return await activoFijoRepository.save(activo);
}


async function eliminar(id) {

    const activo =
        await activoFijoRepository.findOneBy({
            ID_Activo: id
        });

    if (!activo) {
        return null;
    }


    await activoFijoRepository.remove(activo);

    return activo;
}


module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};