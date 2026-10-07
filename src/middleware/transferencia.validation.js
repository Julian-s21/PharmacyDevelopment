const validarTransferencia = (req, res, next) => {
    const {
        ID_Sucursal_Origen,
        ID_Sucursal_Destino,
        ID_Usuario,
        Fecha_Transferencia
    } = req.body;

    const errores = [];

    // Validar sucursal origen
    if (
        ID_Sucursal_Origen === undefined ||
        ID_Sucursal_Origen === null ||
        ID_Sucursal_Origen === ''
    ) {
        errores.push(
            'La sucursal de origen es obligatoria.'
        );
    } else if (
        !Number.isInteger(Number(ID_Sucursal_Origen))
    ) {
        errores.push(
            'El ID de la sucursal de origen debe ser un número entero.'
        );
    }

    // Validar sucursal destino
    if (
        ID_Sucursal_Destino === undefined ||
        ID_Sucursal_Destino === null ||
        ID_Sucursal_Destino === ''
    ) {
        errores.push(
            'La sucursal de destino es obligatoria.'
        );
    } else if (
        !Number.isInteger(Number(ID_Sucursal_Destino))
    ) {
        errores.push(
            'El ID de la sucursal de destino debe ser un número entero.'
        );
    }

    // Validar que origen y destino sean diferentes
    if (
        ID_Sucursal_Origen !== undefined &&
        ID_Sucursal_Destino !== undefined &&
        Number(ID_Sucursal_Origen) === Number(ID_Sucursal_Destino)
    ) {
        errores.push(
            'La sucursal de origen y la sucursal de destino deben ser diferentes.'
        );
    }

    // Validar usuario
    if (
        ID_Usuario === undefined ||
        ID_Usuario === null ||
        ID_Usuario === ''
    ) {
        errores.push(
            'El usuario es obligatorio.'
        );
    } else if (
        !Number.isInteger(Number(ID_Usuario))
    ) {
        errores.push(
            'El ID del usuario debe ser un número entero.'
        );
    }

    // Validar fecha
    if (
        !Fecha_Transferencia ||
        Fecha_Transferencia.trim() === ''
    ) {
        errores.push(
            'La fecha de transferencia es obligatoria.'
        );
    } else if (
        isNaN(Date.parse(Fecha_Transferencia))
    ) {
        errores.push(
            'La fecha de transferencia no tiene un formato válido.'
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

module.exports = validarTransferencia;