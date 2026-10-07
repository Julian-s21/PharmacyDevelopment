const flujoEfectivoService =
    require('../services/flujoEfectivo.service');

const obtenerTodos = async (req, res) => {
    try {

        const flujos =
            await flujoEfectivoService.obtenerTodos();

        res.status(200).json(flujos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener los flujos de efectivo'
        });
    }
};

const obtenerPorId = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const flujo =
            await flujoEfectivoService.obtenerPorId(id);

        if (!flujo) {

            return res.status(404).json({
                mensaje: 'Flujo de efectivo no encontrado'
            });
        }

        res.status(200).json(flujo);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener el flujo de efectivo'
        });
    }
};

const crear = async (req, res) => {
    try {

        const flujo =
            await flujoEfectivoService.crear(req.body);

        res.status(201).json(flujo);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al crear el flujo de efectivo'
        });
    }
};

const actualizar = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const flujo =
            await flujoEfectivoService.actualizar(
                id,
                req.body
            );

        if (!flujo) {

            return res.status(404).json({
                mensaje: 'Flujo de efectivo no encontrado'
            });
        }

        res.status(200).json(flujo);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar el flujo de efectivo'
        });
    }
};

const eliminar = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const flujo =
            await flujoEfectivoService.eliminar(id);

        if (!flujo) {

            return res.status(404).json({
                mensaje: 'Flujo de efectivo no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Flujo de efectivo eliminado correctamente'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar el flujo de efectivo'
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