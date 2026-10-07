const categoriaMedicamentoService =
    require('../services/categoriaMedicamento.service');

const obtenerTodas = async (req, res) => {
    try {
        const categorias =
            await categoriaMedicamentoService.obtenerTodas();

        res.status(200).json(categorias);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener las categorías de medicamento'
        });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const categoria =
            await categoriaMedicamentoService.obtenerPorId(id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: 'Categoría de medicamento no encontrada'
            });
        }

        res.status(200).json(categoria);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener la categoría de medicamento'
        });
    }
};

const crear = async (req, res) => {
    try {
        const categoria =
            await categoriaMedicamentoService.crear(req.body);

        res.status(201).json(categoria);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al crear la categoría de medicamento'
        });
    }
};

const actualizar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const categoria =
            await categoriaMedicamentoService.actualizar(
                id,
                req.body
            );

        if (!categoria) {
            return res.status(404).json({
                mensaje: 'Categoría de medicamento no encontrada'
            });
        }

        res.status(200).json(categoria);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar la categoría de medicamento'
        });
    }
};

const eliminar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const categoria =
            await categoriaMedicamentoService.eliminar(id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: 'Categoría de medicamento no encontrada'
            });
        }

        res.status(200).json({
            mensaje: 'Categoría de medicamento eliminada correctamente'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar la categoría de medicamento'
        });
    }
};

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};