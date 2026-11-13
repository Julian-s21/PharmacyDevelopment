

const flujoEfectivoRepository =
    require('../repositories/flujoEfectivo.repository');

const sucursalRepository =
    require('../repositories/sucursal.repository');

const movimientoFinancieroRepository =
    require('../repositories/movimientoFinanciero.repository');


async function obtenerTodos() {

    return await flujoEfectivoRepository.find({
        relations: {
            sucursal: true
        }
    });
}


async function obtenerPorId(id) {

    return await flujoEfectivoRepository.findOne({
        where: {
            ID_Flujo_Efectivo: id
        },
        relations: {
            sucursal: true
        }
    });
}


async function crear(datos) {


    const sucursal =
        await sucursalRepository.findOneBy({
            ID_Sucursal: datos.ID_Sucursal
        });

    if (!sucursal) {
        throw new Error(
            'La sucursal indicada no existe.'
        );
    }



    if (!datos.Fecha_Inicio_Flujo) {
        throw new Error(
            'La fecha de inicio del flujo es obligatoria.'
        );
    }

    const fechaInicio =
        new Date(datos.Fecha_Inicio_Flujo);

    if (isNaN(fechaInicio.getTime())) {
        throw new Error(
            'La fecha de inicio del flujo no es válida.'
        );
    }



    if (!datos.Fecha_Fin_Flujo) {
        throw new Error(
            'La fecha de finalización del flujo es obligatoria.'
        );
    }

    const fechaFin =
        new Date(datos.Fecha_Fin_Flujo);

    if (isNaN(fechaFin.getTime())) {
        throw new Error(
            'La fecha de finalización del flujo no es válida.'
        );
    }



    if (fechaFin < fechaInicio) {
        throw new Error(
            'La fecha de finalización no puede ser anterior a la fecha de inicio.'
        );
    }



    const ingresos =
        Number(datos.Total_Ingresos_Flujo);

    if (isNaN(ingresos) || ingresos < 0) {
        throw new Error(
            'El total de ingresos debe ser un número mayor o igual a cero.'
        );
    }



    const egresos =
        Number(datos.Total_Egresos_Flujo);

    if (isNaN(egresos) || egresos < 0) {
        throw new Error(
            'El total de egresos debe ser un número mayor o igual a cero.'
        );
    }



    const saldo =
        ingresos - egresos;


    const flujo =
        flujoEfectivoRepository.create({
            ID_Sucursal:
                datos.ID_Sucursal,

            Fecha_Inicio_Flujo:
                fechaInicio,

            Fecha_Fin_Flujo:
                fechaFin,

            Saldo_Flujo:
                saldo,

            Total_Ingresos_Flujo:
                ingresos,

            Total_Egresos_Flujo:
                egresos
        });


    return await flujoEfectivoRepository.save(flujo);
}


async function actualizar(id, datos) {

    const flujo =
        await flujoEfectivoRepository.findOneBy({
            ID_Flujo_Efectivo: id
        });

    if (!flujo) {
        return null;
    }



    if (datos.ID_Sucursal !== undefined) {

        const sucursal =
            await sucursalRepository.findOneBy({
                ID_Sucursal: datos.ID_Sucursal
            });

        if (!sucursal) {
            throw new Error(
                'La sucursal indicada no existe.'
            );
        }

        flujo.ID_Sucursal =
            datos.ID_Sucursal;
    }



    if (datos.Fecha_Inicio_Flujo !== undefined) {

        const fechaInicio =
            new Date(datos.Fecha_Inicio_Flujo);

        if (isNaN(fechaInicio.getTime())) {
            throw new Error(
                'La fecha de inicio del flujo no es válida.'
            );
        }

        flujo.Fecha_Inicio_Flujo =
            fechaInicio;
    }



    if (datos.Fecha_Fin_Flujo !== undefined) {

        const fechaFin =
            new Date(datos.Fecha_Fin_Flujo);

        if (isNaN(fechaFin.getTime())) {
            throw new Error(
                'La fecha de finalización del flujo no es válida.'
            );
        }

        flujo.Fecha_Fin_Flujo =
            fechaFin;
    }



    if (
        flujo.Fecha_Fin_Flujo <
        flujo.Fecha_Inicio_Flujo
    ) {
        throw new Error(
            'La fecha de finalización no puede ser anterior a la fecha de inicio.'
        );
    }



    if (datos.Total_Ingresos_Flujo !== undefined) {

        const ingresos =
            Number(datos.Total_Ingresos_Flujo);

        if (isNaN(ingresos) || ingresos < 0) {
            throw new Error(
                'El total de ingresos debe ser un número mayor o igual a cero.'
            );
        }

        flujo.Total_Ingresos_Flujo =
            ingresos;
    }



    if (datos.Total_Egresos_Flujo !== undefined) {

        const egresos =
            Number(datos.Total_Egresos_Flujo);

        if (isNaN(egresos) || egresos < 0) {
            throw new Error(
                'El total de egresos debe ser un número mayor o igual a cero.'
            );
        }

        flujo.Total_Egresos_Flujo =
            egresos;
    }



    flujo.Saldo_Flujo =
        Number(flujo.Total_Ingresos_Flujo) -
        Number(flujo.Total_Egresos_Flujo);


    return await flujoEfectivoRepository.save(flujo);
}


async function eliminar(id) {

    const flujo =
        await flujoEfectivoRepository.findOneBy({
            ID_Flujo_Efectivo: id
        });

    if (!flujo) {
        return null;
    }


    await flujoEfectivoRepository.remove(flujo);

    return flujo;
}


module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};