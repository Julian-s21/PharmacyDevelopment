const validarGastoPlanilla = (req, res, next) => {

    const {
        ID_Sucursal,
        ID_Usuario,
        Salario_Planilla,
        Deducciones_Planilla,
        Total_Planilla,
        Fecha_Planilla
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

    // Salario
    if (
        Salario_Planilla === undefined ||
        Salario_Planilla === null ||
        Salario_Planilla === ''
    ) {
        errores.push(
            'El salario es obligatorio.'
        );
    } else if (isNaN(Number(Salario_Planilla))) {
        errores.push(
            'El salario debe ser un valor numérico.'
        );
    } else if (Number(Salario_Planilla) < 0) {
        errores.push(
            'El salario no puede ser negativo.'
        );
    }

    // Deducciones
    if (
        Deducciones_Planilla !== undefined &&
        Deducciones_Planilla !== null &&
        Deducciones_Planilla !== ''
    ) {
        if (isNaN(Number(Deducciones_Planilla))) {
            errores.push(
                'Las deducciones deben ser un valor numérico.'
            );
        } else if (Number(Deducciones_Planilla) < 0) {
            errores.push(
                'Las deducciones no pueden ser negativas.'
            );
        }
    }

    // Total
    if (
        Total_Planilla === undefined ||
        Total_Planilla === null ||
        Total_Planilla === ''
    ) {
        errores.push(
            'El total de planilla es obligatorio.'
        );
    } else if (isNaN(Number(Total_Planilla))) {
        errores.push(
            'El total de planilla debe ser un valor numérico.'
        );
    } else if (Number(Total_Planilla) < 0) {
        errores.push(
            'El total de planilla no puede ser negativo.'
        );
    }

    // Fecha
    if (!Fecha_Planilla) {

        errores.push(
            'La fecha de planilla es obligatoria.'
        );

    } else if (isNaN(Date.parse(Fecha_Planilla))) {

        errores.push(
            'La fecha de planilla no tiene un formato válido.'
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

module.exports = validarGastoPlanilla;