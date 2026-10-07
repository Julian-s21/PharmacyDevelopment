const detalleDistribucionService =
    require('../services/detalleDistribucion.service');

const obtenerTodos = async (req, res) => {
    try {

        const detalles =
            await detalleDistribucionService.obtenerTodos();

        res.status(200).json(detalles);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener los detalles de distribución'
        });
    }
};

const obtenerPorId = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const detalle =
            await detalleDistribucionService.obtenerPorId(id);

        if (!detalle) {
            return res.status(404).json({
                mensaje: 'Detalle de distribución no encontrado'
            });
        }

        res.status(200).json(detalle);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener el detalle de distribución'
        });
    }
};

const crear = async (req, res) => {
    try {

        const detalle =
            await detalleDistribucionService.crear(req.body);

        res.status(201).json(detalle);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al crear el detalle de distribución'
        });
    }
};

const actualizar = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const detalle =
            await detalleDistribucionService.actualizar(
                id,
                req.body
            );

        if (!detalle) {
            return res.status(404).json({
                mensaje: 'Detalle de distribución no encontrado'
            });
        }

        res.status(200).json(detalle);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar el detalle de distribución'
        });
    }
};

const eliminar = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const detalle =
            await detalleDistribucionService.eliminar(id);

        if (!detalle) {
            return res.status(404).json({
                mensaje: 'Detalle de distribución no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Detalle de distribución eliminado correctamente'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar el detalle de distribución'
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