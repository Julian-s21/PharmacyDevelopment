/*const categoriaMedicamentoRepository =
    require('../repositories/categoriaMedicamento.repository');

const obtenerTodas = async () => {
    return await categoriaMedicamentoRepository.find();
};

const obtenerPorId = async (id) => {
    return await categoriaMedicamentoRepository.findOneBy({
        ID_Categoria: id
    });
};

const crear = async (datos) => {
    const categoria = categoriaMedicamentoRepository.create(datos);

    return await categoriaMedicamentoRepository.save(categoria);
};

const actualizar = async (id, datos) => {
    const categoria = await obtenerPorId(id);

    if (!categoria) {
        return null;
    }

    Object.assign(categoria, datos);

    return await categoriaMedicamentoRepository.save(categoria);
};

const eliminar = async (id) => {
    const categoria = await obtenerPorId(id);

    if (!categoria) {
        return null;
    }

    await categoriaMedicamentoRepository.remove(categoria);

    return categoria;
};

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};*/

const categoriaRepository = require('../repositories/categoriaMedicamento.repository');
const medicamentoRepository = require('../repositories/medicamento.repository');

async function obtenerTodas() {
    return await categoriaRepository.find({
        relations: {
            medicamentos: true
        }
    });
}

async function obtenerPorId(id) {
    return await categoriaRepository.findOne({
        where: {
            ID_Categoria: id
        },
        relations: {
            medicamentos: true
        }
    });
}

async function crear(datos) {

    const categoriaExistente = await categoriaRepository.findOneBy({
        Nombre_Categoria: datos.Nombre_Categoria
    });

    if (categoriaExistente) {
        throw new Error('Ya existe una categoría con ese nombre.');
    }

    const categoria = categoriaRepository.create({
        Nombre_Categoria: datos.Nombre_Categoria
    });

    return await categoriaRepository.save(categoria);
}

async function actualizar(id, datos) {

    const categoria = await categoriaRepository.findOneBy({
        ID_Categoria: id
    });

    if (!categoria) {
        return null;
    }

    if (datos.Nombre_Categoria !== undefined) {

        const categoriaExistente = await categoriaRepository.findOneBy({
            Nombre_Categoria: datos.Nombre_Categoria
        });

        if (
            categoriaExistente &&
            categoriaExistente.ID_Categoria !== Number(id)
        ) {
            throw new Error(
                'Ya existe otra categoría con ese nombre.'
            );
        }

        categoria.Nombre_Categoria = datos.Nombre_Categoria;
    }

    return await categoriaRepository.save(categoria);
}

async function eliminar(id) {

    const categoria = await categoriaRepository.findOneBy({
        ID_Categoria: id
    });

    if (!categoria) {
        return null;
    }

    const medicamentos = await medicamentoRepository.count({
        where: {
            ID_Categoria: id
        }
    });

    if (medicamentos > 0) {
        throw new Error(
            'No se puede eliminar la categoría porque tiene medicamentos asociados.'
        );
    }

    await categoriaRepository.remove(categoria);

    return categoria;
}

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};