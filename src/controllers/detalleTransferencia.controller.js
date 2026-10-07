const detalleTransferenciaService =
    require('../services/detalleTransferencia.service');

const obtenerTodos = async (req, res) => {
    try {

        const detalles =
            await detalleTransferenciaService.obtenerTodos();

        res.status(200).json(detalles);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener los detalles de transferencia'
        });
    }
};

const obtenerPorId = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const detalle =
            await detalleTransferenciaService.obtenerPorId(id);

        if (!detalle) {
            return res.status(404).json({
                mensaje: 'Detalle de transferencia no encontrado'
            });
        }

        res.status(200).json(detalle);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener el detalle de transferencia'
        });
    }
};

const crear = async (req, res) => {
    try {

        const detalle =
            await detalleTransferenciaService.crear(req.body);

        res.status(201).json(detalle);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al crear el detalle de transferencia'
        });
    }
};

const actualizar = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const detalle =
            await detalleTransferenciaService.actualizar(
                id,
                req.body
            );

        if (!detalle) {
            return res.status(404).json({
                mensaje: 'Detalle de transferencia no encontrado'
            });
        }

        res.status(200).json(detalle);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar el detalle de transferencia'
        });
    }
};

const eliminar = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const detalle =
            await detalleTransferenciaService.eliminar(id);

        if (!detalle) {
            return res.status(404).json({
                mensaje: 'Detalle de transferencia no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Detalle de transferencia eliminado correctamente'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar el detalle de transferencia'
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