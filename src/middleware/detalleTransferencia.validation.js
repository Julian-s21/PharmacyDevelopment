const validarDetalleTransferencia = (req, res, next) => {

    const {
        ID_Transferencia,
        ID_Medicamento,
        Cantidad_Transferencia
    } = req.body;

    const errores = [];

    if (
        ID_Transferencia === undefined ||
        ID_Transferencia === null ||
        !Number.isInteger(Number(ID_Transferencia))
    ) {
        errores.push(
            'El ID de la transferencia es obligatorio y debe ser un número entero.'
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
        Cantidad_Transferencia === undefined ||
        Cantidad_Transferencia === null ||
        !Number.isInteger(Number(Cantidad_Transferencia))
    ) {
        errores.push(
            'La cantidad de transferencia es obligatoria y debe ser un número entero.'
        );
    } else if (Number(Cantidad_Transferencia) <= 0) {
        errores.push(
            'La cantidad de transferencia debe ser mayor que 0.'
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

module.exports = validarDetalleTransferencia;