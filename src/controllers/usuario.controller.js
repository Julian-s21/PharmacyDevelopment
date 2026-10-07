const usuarioService = require('../services/usuario.service');

const usuarioPublico = (usuario) => {
    if (!usuario) return usuario;
    const { Contrasena_Usuario, ...datosPublicos } = usuario;
    return datosPublicos;
};

const obtenerTodos = async (req, res) => {
    try {
        const usuarios = await usuarioService.obtenerTodos();

        res.status(200).json(usuarios.map(usuarioPublico));
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener los usuarios'
        });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const usuario = await usuarioService.obtenerPorId(id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        res.status(200).json(usuarioPublico(usuario));
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener el usuario'
        });
    }
};

const crear = async (req, res) => {
    try {
        const usuario = await usuarioService.crear(req.body);

        res.status(201).json(usuarioPublico(usuario));
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al crear el usuario'
        });
    }
};

const actualizar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const usuario = await usuarioService.actualizar(
            id,
            req.body
        );

        if (!usuario) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        res.status(200).json(usuarioPublico(usuario));
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar el usuario'
        });
    }
};

const eliminar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const usuario = await usuarioService.eliminar(id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar el usuario'
        });
    }
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
