const transferenciaService =
    require('../services/transferencia.service');

const obtenerTodas = async (req, res) => {
    try {
        const transferencias =
            await transferenciaService.obtenerTodas();

        res.status(200).json(transferencias);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener las transferencias'
        });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const transferencia =
            await transferenciaService.obtenerPorId(id);

        if (!transferencia) {
            return res.status(404).json({
                mensaje: 'Transferencia no encontrada'
            });
        }

        res.status(200).json(transferencia);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener la transferencia'
        });
    }
};

const crear = async (req, res) => {
    try {
        const transferencia =
            await transferenciaService.crear(req.body);

        res.status(201).json(transferencia);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al crear la transferencia'
        });
    }
};

const crearTransferenciaCompleta =
    async (req, res) => {

        try {

            const resultado =
                await transferenciaService
                    .crearTransferenciaCompleta(
                        req.body
                    );

            res.status(201).json({
                mensaje:
                    'Transferencia realizada correctamente.',
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

        const transferencia =
            await transferenciaService.actualizar(
                id,
                req.body
            );

        if (!transferencia) {
            return res.status(404).json({
                mensaje: 'Transferencia no encontrada'
            });
        }

        res.status(200).json(transferencia);
    } catch (error) {
        res.status(400).json({
            mensaje: error.message || 'Error al actualizar la transferencia'
        });
    }
};

const eliminar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const transferencia =
            await transferenciaService.eliminar(id);

        if (!transferencia) {
            return res.status(404).json({
                mensaje: 'Transferencia no encontrada'
            });
        }

        res.status(200).json({
            mensaje: 'Transferencia eliminada correctamente'
        });
    } catch (error) {
        res.status(400).json({
            mensaje: error.message || 'Error al eliminar la transferencia'
        });
    }
};

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    crearTransferenciaCompleta,
    actualizar,
    eliminar
};
