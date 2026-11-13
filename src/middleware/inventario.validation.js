const validarInventario = (req, res, next) => {
    const {
        ID_Sucursal,
        ID_Medicamento,
        Cantidad_Inventario
    } = req.body;

    const errores = [];

    // Validar sucursal
    if (
        ID_Sucursal === undefined ||
        ID_Sucursal === null ||
        ID_Sucursal === ''
    ) {
        errores.push(
            'La sucursal es obligatoria.'
        );
    } else if (!Number.isInteger(Number(ID_Sucursal))) {
        errores.push(
            'El ID de la sucursal debe ser un número entero.'
        );
    }

    // Validar medicamento
    if (
        ID_Medicamento === undefined ||
        ID_Medicamento === null ||
        ID_Medicamento === ''
    ) {
        errores.push(
            'El medicamento es obligatorio.'
        );
    } else if (!Number.isInteger(Number(ID_Medicamento))) {
        errores.push(
            'El ID del medicamento debe ser un número entero.'
        );
    }

    // Validar cantidad
    if (
        Cantidad_Inventario === undefined ||
        Cantidad_Inventario === null ||
        Cantidad_Inventario === ''
    ) {
        errores.push(
            'La cantidad del inventario es obligatoria.'
        );
    } else if (
        !Number.isInteger(Number(Cantidad_Inventario))
    ) {
        errores.push(
            'La cantidad del inventario debe ser un número entero.'
        );
    } else if (
        Number(Cantidad_Inventario) < 0
    ) {
        errores.push(
            'La cantidad del inventario no puede ser negativa.'
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

module.exports = validarInventario;