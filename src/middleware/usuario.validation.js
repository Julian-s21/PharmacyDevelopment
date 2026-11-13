const validarUsuario = (req, res, next) => {
    const {
        ID_Sucursal,
        Nombre_Usuario,
        Apellido_Usuario,
        Correo_Usuario,
        Contrasena_Usuario
    } = req.body;

    const errores = [];

    // Validar sucursal
    if (
        ID_Sucursal === undefined ||
        ID_Sucursal === null ||
        ID_Sucursal === ''
    ) {
        errores.push('La sucursal es obligatoria.');
    } else if (!Number.isInteger(Number(ID_Sucursal))) {
        errores.push('El ID de la sucursal debe ser un número entero.');
    }

    // Validar nombre
    if (!Nombre_Usuario || Nombre_Usuario.trim() === '') {
        errores.push('El nombre del usuario es obligatorio.');
    } else if (Nombre_Usuario.length > 100) {
        errores.push('El nombre del usuario no puede superar los 100 caracteres.');
    }

    // Validar apellido
    if (!Apellido_Usuario || Apellido_Usuario.trim() === '') {
        errores.push('El apellido del usuario es obligatorio.');
    } else if (Apellido_Usuario.length > 100) {
        errores.push('El apellido del usuario no puede superar los 100 caracteres.');
    }

    // Validar correo
    if (!Correo_Usuario || Correo_Usuario.trim() === '') {
        errores.push('El correo del usuario es obligatorio.');
    } else if (Correo_Usuario.length > 150) {
        errores.push('El correo del usuario no puede superar los 150 caracteres.');
    } else if (!Correo_Usuario.includes('@')) {
        errores.push('El correo del usuario no tiene un formato válido.');
    }

    // Validar contraseña
    if (!Contrasena_Usuario || Contrasena_Usuario.trim() === '') {
        errores.push('La contraseña del usuario es obligatoria.');
    } else if (Contrasena_Usuario.length > 255) {
        errores.push('La contraseña del usuario no puede superar los 255 caracteres.');
    }

    if (errores.length > 0) {
        return res.status(400).json({
            mensaje: 'Error de validación.',
            errores
        });
    }

    next();
};

module.exports = validarUsuario;