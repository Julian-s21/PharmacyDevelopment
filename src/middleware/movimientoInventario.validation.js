const validarMovimientoInventario = (req, res, next) => {
    const {
        ID_Inventario,
        ID_Usuario,
        Tipo_Movimiento_Inventario,
        Cantidad_Movimiento_Inventario,
        Fecha_Movimiento_Inventario
    } = req.body;

    const errores = [];

    // Inventario
    if (
        ID_Inventario === undefined ||
        ID_Inventario === null ||
        ID_Inventario === ''
    ) {
        errores.push('El inventario es obligatorio.');
    } else if (!Number.isInteger(Number(ID_Inventario))) {
        errores.push(
            'El ID del inventario debe ser un número entero.'
        );
    }

    // Usuario
    if (
        ID_Usuario === undefined ||
        ID_Usuario === null ||
        ID_Usuario === ''
    ) {
        errores.push('El usuario es obligatorio.');
    } else if (!Number.isInteger(Number(ID_Usuario))) {
        errores.push(
            'El ID del usuario debe ser un número entero.'
        );
    }

    // Tipo de movimiento
    if (
        !Tipo_Movimiento_Inventario ||
        Tipo_Movimiento_Inventario.trim() === ''
    ) {
        errores.push(
            'El tipo de movimiento es obligatorio.'
        );
    } else if (Tipo_Movimiento_Inventario.length > 50) {
        errores.push(
            'El tipo de movimiento no puede superar los 50 caracteres.'
        );
    }

    // Cantidad
    if (
        Cantidad_Movimiento_Inventario === undefined ||
        Cantidad_Movimiento_Inventario === null ||
        Cantidad_Movimiento_Inventario === ''
    ) {
        errores.push(
            'La cantidad del movimiento es obligatoria.'
        );
    } else if (
        !Number.isInteger(
            Number(Cantidad_Movimiento_Inventario)
        )
    ) {
        errores.push(
            'La cantidad del movimiento debe ser un número entero.'
        );
    } else if (
        Number(Cantidad_Movimiento_Inventario) <= 0
    ) {
        errores.push(
            'La cantidad del movimiento debe ser mayor que cero.'
        );
    }

    // Fecha
    if (
        !Fecha_Movimiento_Inventario ||
        Fecha_Movimiento_Inventario.trim() === ''
    ) {
        errores.push(
            'La fecha del movimiento es obligatoria.'
        );
    } else if (
        isNaN(Date.parse(Fecha_Movimiento_Inventario))
    ) {
        errores.push(
            'La fecha del movimiento no tiene un formato válido.'
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

module.exports = validarMovimientoInventario;