const gastoPlanillaService =
    require('../services/gastoPlanilla.service');

const obtenerTodos = async (req, res) => {
    try {

        const gastos =
            await gastoPlanillaService.obtenerTodos();

        res.status(200).json(gastos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener los gastos de planilla'
        });
    }
};

const obtenerPorId = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const gasto =
            await gastoPlanillaService.obtenerPorId(id);

        if (!gasto) {

            return res.status(404).json({
                mensaje: 'Gasto de planilla no encontrado'
            });
        }

        res.status(200).json(gasto);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener el gasto de planilla'
        });
    }
};

const crear = async (req, res) => {
    try {

        const gasto =
            await gastoPlanillaService.crear(req.body);

        res.status(201).json(gasto);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al crear el gasto de planilla'
        });
    }
};

const actualizar = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const gasto =
            await gastoPlanillaService.actualizar(
                id,
                req.body
            );

        if (!gasto) {

            return res.status(404).json({
                mensaje: 'Gasto de planilla no encontrado'
            });
        }

        res.status(200).json(gasto);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar el gasto de planilla'
        });
    }
};

const eliminar = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const gasto =
            await gastoPlanillaService.eliminar(id);

        if (!gasto) {

            return res.status(404).json({
                mensaje: 'Gasto de planilla no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Gasto de planilla eliminado correctamente'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar el gasto de planilla'
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