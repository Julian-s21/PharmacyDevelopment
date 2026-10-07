const validarDistribucion = (req, res, next) => {

    const {
        ID_Sucursal,
        ID_Usuario,
        Fecha_Distribucion,
        Estado_Distribucion
    } = req.body;

    const errores = [];

    if (
        ID_Sucursal === undefined ||
        ID_Sucursal === null ||
        !Number.isInteger(Number(ID_Sucursal))
    ) {
        errores.push(
            'El ID de la sucursal es obligatorio y debe ser un número entero.'
        );
    }

    if (
        ID_Usuario === undefined ||
        ID_Usuario === null ||
        !Number.isInteger(Number(ID_Usuario))
    ) {
        errores.push(
            'El ID del usuario es obligatorio y debe ser un número entero.'
        );
    }

    if (!Fecha_Distribucion) {

        errores.push(
            'La fecha de distribución es obligatoria.'
        );

    } else if (isNaN(Date.parse(Fecha_Distribucion))) {

        errores.push(
            'La fecha de distribución no tiene un formato válido.'
        );
    }

    if (
        !Estado_Distribucion ||
        Estado_Distribucion.trim() === ''
    ) {

        errores.push(
            'El estado de distribución es obligatorio.'
        );

    } else if (Estado_Distribucion.length > 50) {

        errores.push(
            'El estado de distribución no puede superar los 50 caracteres.'
        );
    }

    if (errores.length > 0) {

        return res.status(400).json({
            mensaje: 'Error de validación.',
            errores
        });
    }

    next();
};

module.exports = validarDistribucion;