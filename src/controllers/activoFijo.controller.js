const activoFijoService =
    require('../services/activoFijo.service');

const obtenerTodos = async (req, res) => {
    try {

        const activos =
            await activoFijoService.obtenerTodos();

        res.status(200).json(activos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener los activos fijos'
        });
    }
};

const obtenerPorId = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const activo =
            await activoFijoService.obtenerPorId(id);

        if (!activo) {

            return res.status(404).json({
                mensaje: 'Activo fijo no encontrado'
            });
        }

        res.status(200).json(activo);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener el activo fijo'
        });
    }
};

const crear = async (req, res) => {
    try {

        const activo =
            await activoFijoService.crear(req.body);

        res.status(201).json(activo);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al crear el activo fijo'
        });
    }
};

const actualizar = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const activo =
            await activoFijoService.actualizar(
                id,
                req.body
            );

        if (!activo) {

            return res.status(404).json({
                mensaje: 'Activo fijo no encontrado'
            });
        }

        res.status(200).json(activo);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar el activo fijo'
        });
    }
};

const eliminar = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const activo =
            await activoFijoService.eliminar(id);

        if (!activo) {

            return res.status(404).json({
                mensaje: 'Activo fijo no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Activo fijo eliminado correctamente'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar el activo fijo'
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