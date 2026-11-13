const validarFlujoEfectivo = (req, res, next) => {

    const {
        ID_Sucursal,
        Fecha_Inicio_Flujo,
        Fecha_Fin_Flujo,
        Saldo_Flujo,
        Total_Ingresos_Flujo,
        Total_Egresos_Flujo
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

    // Fecha inicio
    if (!Fecha_Inicio_Flujo) {

        errores.push(
            'La fecha de inicio del flujo es obligatoria.'
        );

    } else if (isNaN(Date.parse(Fecha_Inicio_Flujo))) {

        errores.push(
            'La fecha de inicio del flujo no tiene un formato válido.'
        );
    }

    // Fecha fin
    if (!Fecha_Fin_Flujo) {

        errores.push(
            'La fecha de fin del flujo es obligatoria.'
        );

    } else if (isNaN(Date.parse(Fecha_Fin_Flujo))) {

        errores.push(
            'La fecha de fin del flujo no tiene un formato válido.'
        );
    }

    // Saldo
    if (
        Saldo_Flujo === undefined ||
        Saldo_Flujo === null ||
        Saldo_Flujo === ''
    ) {
        errores.push(
            'El saldo del flujo es obligatorio.'
        );
    } else if (isNaN(Number(Saldo_Flujo))) {
        errores.push(
            'El saldo del flujo debe ser un valor numérico.'
        );
    }

    // Total ingresos
    if (
        Total_Ingresos_Flujo === undefined ||
        Total_Ingresos_Flujo === null ||
        Total_Ingresos_Flujo === ''
    ) {
        errores.push(
            'El total de ingresos es obligatorio.'
        );
    } else if (isNaN(Number(Total_Ingresos_Flujo))) {
        errores.push(
            'El total de ingresos debe ser un valor numérico.'
        );
    } else if (Number(Total_Ingresos_Flujo) < 0) {
        errores.push(
            'El total de ingresos no puede ser negativo.'
        );
    }

    // Total egresos
    if (
        Total_Egresos_Flujo === undefined ||
        Total_Egresos_Flujo === null ||
        Total_Egresos_Flujo === ''
    ) {
        errores.push(
            'El total de egresos es obligatorio.'
        );
    } else if (isNaN(Number(Total_Egresos_Flujo))) {
        errores.push(
            'El total de egresos debe ser un valor numérico.'
        );
    } else if (Number(Total_Egresos_Flujo) < 0) {
        errores.push(
            'El total de egresos no puede ser negativo.'
        );
    }

    // Validar período
    if (
        Fecha_Inicio_Flujo &&
        Fecha_Fin_Flujo &&
        !isNaN(Date.parse(Fecha_Inicio_Flujo)) &&
        !isNaN(Date.parse(Fecha_Fin_Flujo))
    ) {

        const inicio = new Date(Fecha_Inicio_Flujo);
        const fin = new Date(Fecha_Fin_Flujo);

        if (fin < inicio) {
            errores.push(
                'La fecha de fin no puede ser anterior a la fecha de inicio.'
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

module.exports = validarFlujoEfectivo;