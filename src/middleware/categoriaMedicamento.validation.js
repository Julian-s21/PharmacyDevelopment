const validarCategoriaMedicamento = (req, res, next) => {
    const {
        Nombre_Categoria
    } = req.body;

    const errores = [];

    if (!Nombre_Categoria || Nombre_Categoria.trim() === '') {
        errores.push('El nombre de la categoría es obligatorio.');
    } else if (Nombre_Categoria.length > 100) {
        errores.push(
            'El nombre de la categoría no puede superar los 100 caracteres.'
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

module.exports = validarCategoriaMedicamento;