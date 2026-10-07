const validarDetalleDistribucion = (req, res, next) => {

    const {
        ID_Distribucion,
        ID_Medicamento,
        Cantidad_Distribucion
    } = req.body;

    const errores = [];

    if (
        ID_Distribucion === undefined ||
        ID_Distribucion === null ||
        !Number.isInteger(Number(ID_Distribucion))
    ) {
        errores.push(
            'El ID de la distribución es obligatorio y debe ser un número entero.'
        );
    }

    if (
        ID_Medicamento === undefined ||
        ID_Medicamento === null ||
        !Number.isInteger(Number(ID_Medicamento))
    ) {
        errores.push(
            'El ID del medicamento es obligatorio y debe ser un número entero.'
        );
    }

    if (
        Cantidad_Distribucion === undefined ||
        Cantidad_Distribucion === null ||
        !Number.isInteger(Number(Cantidad_Distribucion))
    ) {
        errores.push(
            'La cantidad de distribución es obligatoria y debe ser un número entero.'
        );
    } else if (Number(Cantidad_Distribucion) <= 0) {
        errores.push(
            'La cantidad de distribución debe ser mayor que 0.'
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

module.exports = validarDetalleDistribucion;