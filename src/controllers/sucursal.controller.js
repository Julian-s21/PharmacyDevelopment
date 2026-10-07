const sucursalService = require('../services/sucursal.service');

const obtenerTodas = async (req, res) => {
    try {
        const sucursales = await sucursalService.obtenerTodas();

        res.status(200).json(sucursales);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener las sucursales'
        });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const sucursal = await sucursalService.obtenerPorId(id);

        if (!sucursal) {
            return res.status(404).json({
                mensaje: 'Sucursal no encontrada'
            });
        }

        res.status(200).json(sucursal);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener la sucursal'
        });
    }
};

const crear = async (req, res) => {
    try {
        const sucursal = await sucursalService.crear(req.body);

        res.status(201).json(sucursal);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al crear la sucursal'
        });
    }
};

const actualizar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const sucursal = await sucursalService.actualizar(
            id,
            req.body
        );

        if (!sucursal) {
            return res.status(404).json({
                mensaje: 'Sucursal no encontrada'
            });
        }

        res.status(200).json(sucursal);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar la sucursal'
        });
    }
};

const eliminar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const sucursal = await sucursalService.eliminar(id);

        if (!sucursal) {
            return res.status(404).json({
                mensaje: 'Sucursal no encontrada'
            });
        }

        res.status(200).json({
            mensaje: 'Sucursal eliminada correctamente'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar la sucursal'
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