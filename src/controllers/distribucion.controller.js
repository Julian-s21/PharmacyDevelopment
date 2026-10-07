const distribucionService =
    require('../services/distribucion.service');

const obtenerTodas = async (req, res) => {
    try {

        const distribuciones =
            await distribucionService.obtenerTodas();

        res.status(200).json(distribuciones);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener las distribuciones'
        });
    }
};

const obtenerPorId = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const distribucion =
            await distribucionService.obtenerPorId(id);

        if (!distribucion) {

            return res.status(404).json({
                mensaje: 'Distribución no encontrada'
            });
        }

        res.status(200).json(distribucion);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener la distribución'
        });
    }
};

const crear = async (req, res) => {
    try {

        const distribucion =
            await distribucionService.crear(req.body);

        res.status(201).json(distribucion);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al crear la distribución'
        });
    }
};

const crearDistribucionCompleta = async (req, res) => {

    try {

        const resultado =
            await distribucionService.crearDistribucionCompleta(
                req.body
            );

        res.status(201).json({
            mensaje:
                'Distribución realizada correctamente.',
            datos: resultado
        });

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });
    }
};

const actualizar = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const distribucion =
            await distribucionService.actualizar(
                id,
                req.body
            );

        if (!distribucion) {

            return res.status(404).json({
                mensaje: 'Distribución no encontrada'
            });
        }

        res.status(200).json(distribucion);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar la distribución'
        });
    }
};

const eliminar = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const distribucion =
            await distribucionService.eliminar(id);

        if (!distribucion) {

            return res.status(404).json({
                mensaje: 'Distribución no encontrada'
            });
        }

        res.status(200).json({
            mensaje: 'Distribución eliminada correctamente'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar la distribución'
        });
    }
};

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    crearDistribucionCompleta,
    actualizar,
    eliminar
};