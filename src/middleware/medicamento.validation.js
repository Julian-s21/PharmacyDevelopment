const validarMedicamento = (req, res, next) => {
    const {
        ID_Categoria,
        Nombre_Medicamento,
        Descripcion_Medicamento,
        Precio_Medicamento
    } = req.body;

    const errores = [];

    // Validar categoría
    if (
        ID_Categoria === undefined ||
        ID_Categoria === null ||
        ID_Categoria === ''
    ) {
        errores.push('La categoría del medicamento es obligatoria.');
    } else if (!Number.isInteger(Number(ID_Categoria))) {
        errores.push(
            'El ID de la categoría debe ser un número entero.'
        );
    }

    // Validar nombre
    if (
        !Nombre_Medicamento ||
        Nombre_Medicamento.trim() === ''
    ) {
        errores.push(
            'El nombre del medicamento es obligatorio.'
        );
    } else if (Nombre_Medicamento.length > 150) {
        errores.push(
            'El nombre del medicamento no puede superar los 150 caracteres.'
        );
    }

    // Validar descripción
    if (
        Descripcion_Medicamento !== undefined &&
        Descripcion_Medicamento !== null &&
        Descripcion_Medicamento.length > 500
    ) {
        errores.push(
            'La descripción no puede superar los 500 caracteres.'
        );
    }

    // Validar precio
    if (
        Precio_Medicamento === undefined ||
        Precio_Medicamento === null ||
        Precio_Medicamento === ''
    ) {
        errores.push(
            'El precio del medicamento es obligatorio.'
        );
    } else if (isNaN(Number(Precio_Medicamento))) {
        errores.push(
            'El precio del medicamento debe ser numérico.'
        );
    } else if (Number(Precio_Medicamento) < 0) {
        errores.push(
            'El precio del medicamento no puede ser negativo.'
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

module.exports = validarMedicamento;
