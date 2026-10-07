const validarSucursal = (req, res, next) => {
    const {
        Nombre_Sucursal,
        Direccion_Sucursal,
        Telefono_Sucursal
    } = req.body;

    const errores = [];

    // Validar nombre
    if (!Nombre_Sucursal || Nombre_Sucursal.trim() === '') {
        errores.push('El nombre de la sucursal es obligatorio.');
    } else if (Nombre_Sucursal.length > 100) {
        errores.push('El nombre de la sucursal no puede superar los 100 caracteres.');
    }

    // Validar dirección
    if (!Direccion_Sucursal || Direccion_Sucursal.trim() === '') {
        errores.push('La dirección de la sucursal es obligatoria.');
    } else if (Direccion_Sucursal.length > 200) {
        errores.push('La dirección de la sucursal no puede superar los 200 caracteres.');
    }

    // Validar teléfono
    if (!Telefono_Sucursal || Telefono_Sucursal.trim() === '') {
        errores.push('El teléfono de la sucursal es obligatorio.');
    } else if (Telefono_Sucursal.length > 20) {
        errores.push('El teléfono de la sucursal no puede superar los 20 caracteres.');
    }

    // Si existen errores, detener la petición
    if (errores.length > 0) {
        return res.status(400).json({
            mensaje: 'Error de validación.',
            errores
        });
    }

    next();
};

module.exports = validarSucursal;