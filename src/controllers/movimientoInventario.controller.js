const movimientoInventarioService =
    require('../services/movimientoInventario.service');

const obtenerTodos = async (req, res) => {
    try {
        const movimientos =
            await movimientoInventarioService.obtenerTodos();

        res.status(200).json(movimientos);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener los movimientos de inventario'
        });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const movimiento =
            await movimientoInventarioService.obtenerPorId(id);

        if (!movimiento) {
            return res.status(404).json({
                mensaje: 'Movimiento de inventario no encontrado'
            });
        }

        res.status(200).json(movimiento);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener el movimiento de inventario'
        });
    }
};

const crear = async (req, res) => {
    try {
        const movimiento =
            await movimientoInventarioService.crear(req.body);

        res.status(201).json(movimiento);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: error.message || 'Error al crear el movimiento de inventario'
        });
    }
};

const actualizar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const movimiento =
            await movimientoInventarioService.actualizar(
                id,
                req.body
            );

        if (!movimiento) {
            return res.status(404).json({
                mensaje: 'Movimiento de inventario no encontrado'
            });
        }

        res.status(200).json(movimiento);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar el movimiento de inventario'
        });
    }
};

const eliminar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const movimiento =
            await movimientoInventarioService.eliminar(id);

        if (!movimiento) {
            return res.status(404).json({
                mensaje: 'Movimiento de inventario no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Movimiento de inventario eliminado correctamente'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar el movimiento de inventario'
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
