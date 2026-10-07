const movimientoFinancieroService =
    require('../services/movimientoFinanciero.service');

const obtenerTodos = async (req, res) => {
    try {

        const movimientos =
            await movimientoFinancieroService.obtenerTodos();

        res.status(200).json(movimientos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener los movimientos financieros'
        });
    }
};

const obtenerPorId = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const movimiento =
            await movimientoFinancieroService.obtenerPorId(id);

        if (!movimiento) {

            return res.status(404).json({
                mensaje: 'Movimiento financiero no encontrado'
            });
        }

        res.status(200).json(movimiento);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener el movimiento financiero'
        });
    }
};

const crear = async (req, res) => {
    try {

        const movimiento =
            await movimientoFinancieroService.crear(req.body);

        res.status(201).json(movimiento);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al crear el movimiento financiero'
        });
    }
};

const actualizar = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const movimiento =
            await movimientoFinancieroService.actualizar(
                id,
                req.body
            );

        if (!movimiento) {

            return res.status(404).json({
                mensaje: 'Movimiento financiero no encontrado'
            });
        }

        res.status(200).json(movimiento);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar el movimiento financiero'
        });
    }
};

const eliminar = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const movimiento =
            await movimientoFinancieroService.eliminar(id);

        if (!movimiento) {

            return res.status(404).json({
                mensaje: 'Movimiento financiero no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Movimiento financiero eliminado correctamente'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar el movimiento financiero'
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