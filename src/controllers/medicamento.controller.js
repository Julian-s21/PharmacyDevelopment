const medicamentoService =
    require('../services/medicamento.service');

const obtenerTodos = async (req, res) => {
    try {
        const medicamentos =
            await medicamentoService.obtenerTodos();

        res.status(200).json(medicamentos);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: error.message || 'Error al obtener los medicamentos'
        });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const medicamento =
            await medicamentoService.obtenerPorId(id);

        if (!medicamento) {
            return res.status(404).json({
                mensaje: 'Medicamento no encontrado'
            });
        }

        res.status(200).json(medicamento);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: error.message || 'Error al obtener el medicamento'
        });
    }
};

const crear = async (req, res) => {
    try {
        const medicamento =
            await medicamentoService.crear(req.body);

        res.status(201).json(medicamento);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: error.message || 'Error al crear el medicamento'
        });
    }
};

const actualizar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const medicamento =
            await medicamentoService.actualizar(
                id,
                req.body
            );

        if (!medicamento) {
            return res.status(404).json({
                mensaje: 'Medicamento no encontrado'
            });
        }

        res.status(200).json(medicamento);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar el medicamento'
        });
    }
};

const eliminar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const medicamento =
            await medicamentoService.eliminar(id);

        if (!medicamento) {
            return res.status(404).json({
                mensaje: 'Medicamento no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Medicamento eliminado correctamente'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar el medicamento'
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
