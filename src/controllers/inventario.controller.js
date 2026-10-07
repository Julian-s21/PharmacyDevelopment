const inventarioService =
    require('../services/inventario.service');

const obtenerPorMedicamento = async (req, res) => {
    try {
        const inventarios = await inventarioService.obtenerPorMedicamento(req.params.id);
        res.status(200).json(inventarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: error.message || 'Error al obtener inventario del medicamento' });
    }
};

const obtenerTodos = async (req, res) => {
    try {
        const inventarios =
            await inventarioService.obtenerTodos();

        res.status(200).json(inventarios);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener los inventarios'
        });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const inventario =
            await inventarioService.obtenerPorId(id);

        if (!inventario) {
            return res.status(404).json({
                mensaje: 'Inventario no encontrado'
            });
        }

        res.status(200).json(inventario);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener el inventario'
        });
    }
};

const crear = async (req, res) => {
    try {
        const inventario =
            await inventarioService.crear(req.body);

        res.status(201).json(inventario);
    } catch (error) {
    console.error('Error al crear inventario:', error);

    res.status(500).json({
        mensaje: error.message
    });
}
};

const actualizar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const inventario =
            await inventarioService.actualizar(
                id,
                req.body
            );

        if (!inventario) {
            return res.status(404).json({
                mensaje: 'Inventario no encontrado'
            });
        }

        res.status(200).json(inventario);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar el inventario'
        });
    }
};

const eliminar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const inventario =
            await inventarioService.eliminar(id);

        if (!inventario) {
            return res.status(404).json({
                mensaje: 'Inventario no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Inventario eliminado correctamente'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar el inventario'
        });
    }
};

module.exports = {
    obtenerPorMedicamento,
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
