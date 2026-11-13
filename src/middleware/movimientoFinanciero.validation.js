const validarMovimientoFinanciero = (req, res, next) => {

    const {
        ID_Sucursal,
        ID_Usuario,
        Tipo_Movimiento_Financiero,
        Concepto_Movimiento_Financiero,
        Monto_Movimiento_Financiero,
        Fecha_Movimiento_Financiero
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

    // ID Usuario
    if (
        ID_Usuario === undefined ||
        ID_Usuario === null ||
        !Number.isInteger(Number(ID_Usuario))
    ) {
        errores.push(
            'El ID del usuario es obligatorio y debe ser un número entero.'
        );
    }

    // Tipo de movimiento
    if (
        !Tipo_Movimiento_Financiero ||
        Tipo_Movimiento_Financiero.trim() === ''
    ) {
        errores.push(
            'El tipo de movimiento financiero es obligatorio.'
        );
    } else if (Tipo_Movimiento_Financiero.length > 50) {
        errores.push(
            'El tipo de movimiento financiero no puede superar los 50 caracteres.'
        );
    }

    // Concepto
    if (
        !Concepto_Movimiento_Financiero ||
        Concepto_Movimiento_Financiero.trim() === ''
    ) {
        errores.push(
            'El concepto del movimiento financiero es obligatorio.'
        );
    } else if (Concepto_Movimiento_Financiero.length > 250) {
        errores.push(
            'El concepto del movimiento financiero no puede superar los 250 caracteres.'
        );
    }

    // Monto
    if (
        Monto_Movimiento_Financiero === undefined ||
        Monto_Movimiento_Financiero === null ||
        Monto_Movimiento_Financiero === ''
    ) {
        errores.push(
            'El monto del movimiento financiero es obligatorio.'
        );
    } else if (
        isNaN(Number(Monto_Movimiento_Financiero))
    ) {
        errores.push(
            'El monto del movimiento financiero debe ser numérico.'
        );
    } else if (
        Number(Monto_Movimiento_Financiero) < 0
    ) {
        errores.push(
            'El monto del movimiento financiero no puede ser negativo.'
        );
    }

    // Fecha
    if (!Fecha_Movimiento_Financiero) {

        errores.push(
            'La fecha del movimiento financiero es obligatoria.'
        );

    } else if (
        isNaN(Date.parse(Fecha_Movimiento_Financiero))
    ) {

        errores.push(
            'La fecha del movimiento financiero no tiene un formato válido.'
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

module.exports = validarMovimientoFinanciero;