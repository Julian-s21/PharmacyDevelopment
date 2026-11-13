const validarActivoFijo = (req, res, next) => {

    const {
        ID_Sucursal,
        Nombre_Activo,
        Descripcion_Activo,
        Precio_Adquisicion_Activo,
        Vida_Util_Activo
    } = req.body;

    const errores = [];

    // ID Sucursal
    if (
        ID_Sucursal === undefined ||
        ID_Sucursal === null ||
        !Number.isInteger(Number(ID_Sucursal))
    ) {
        errores.push(
            'El ID de la sucursal es obligatorio y debe ser un número entero.'
        );
    }

    // Nombre
    if (
        !Nombre_Activo ||
        Nombre_Activo.trim() === ''
    ) {
        errores.push(
            'El nombre del activo es obligatorio.'
        );
    } else if (Nombre_Activo.length > 150) {
        errores.push(
            'El nombre del activo no puede superar los 150 caracteres.'
        );
    }

    // Descripción
    if (
        Descripcion_Activo !== undefined &&
        Descripcion_Activo !== null &&
        Descripcion_Activo !== ''
    ) {
        if (Descripcion_Activo.length > 500) {
            errores.push(
                'La descripción del activo no puede superar los 500 caracteres.'
            );
        }
    }

    // Precio de adquisición
    if (
        Precio_Adquisicion_Activo === undefined ||
        Precio_Adquisicion_Activo === null ||
        Precio_Adquisicion_Activo === ''
    ) {
        errores.push(
            'El precio de adquisición es obligatorio.'
        );
    } else if (
        isNaN(Number(Precio_Adquisicion_Activo))
    ) {
        errores.push(
            'El precio de adquisición debe ser un valor numérico.'
        );
    } else if (
        Number(Precio_Adquisicion_Activo) < 0
    ) {
        errores.push(
            'El precio de adquisición no puede ser negativo.'
        );
    }

    // Vida útil
    if (
        Vida_Util_Activo !== undefined &&
        Vida_Util_Activo !== null &&
        Vida_Util_Activo !== ''
    ) {
        if (
            !Number.isInteger(Number(Vida_Util_Activo))
        ) {
            errores.push(
                'La vida útil debe ser un número entero.'
            );
        } else if (
            Number(Vida_Util_Activo) <= 0
        ) {
            errores.push(
                'La vida útil debe ser mayor que 0.'
            );
        }
    }

    if (errores.length > 0) {

        return res.status(400).json({
            mensaje: 'Error de validación.',
            errores
        });
    }

    next();
};

module.exports = validarActivoFijo;