const usuarioRepository = require('../repositories/usuario.repository');
const { clearSession, setSession } = require('../middleware/auth.middleware');
const { hashPassword, verifyPassword } = require('../services/password.service');
const HASH_PREFIX = 'scrypt';

function publicUser(usuario) {
    return {
        ID_Usuario: usuario.ID_Usuario,
        ID_Sucursal: usuario.ID_Sucursal,
        Nombre_Usuario: usuario.Nombre_Usuario,
        Apellido_Usuario: usuario.Apellido_Usuario,
        Correo_Usuario: usuario.Correo_Usuario
    };
}

async function iniciarSesion(req, res) {
    try {
        const correo = String(req.body?.Correo_Usuario || '').trim().toLowerCase();
        const contrasena = req.body?.Contrasena_Usuario;
        if (!correo || typeof contrasena !== 'string' || !contrasena) {
            return res.status(400).json({ mensaje: 'Ingresa tu correo y contraseña.' });
        }

        const usuario = await usuarioRepository.createQueryBuilder('usuario')
            .addSelect('usuario.Contrasena_Usuario')
            .where('LOWER(usuario.Correo_Usuario) = :correo', { correo })
            .getOne();

        const valida = await verifyPassword(contrasena, usuario?.Contrasena_Usuario);
        if (!usuario || !valida) {
            return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' });
        }

        if (!usuario.Contrasena_Usuario.startsWith(`${HASH_PREFIX}$`)) {
            usuario.Contrasena_Usuario = await hashPassword(contrasena);
            await usuarioRepository.save(usuario);
        }

        setSession(res, usuario);
        return res.status(200).json({ usuario: publicUser(usuario) });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ mensaje: 'No fue posible iniciar sesión.' });
    }
}

function obtenerSesion(req, res) {
    res.status(200).json({ usuario: req.authUser });
}

function cerrarSesion(req, res) {
    clearSession(res);
    res.status(200).json({ mensaje: 'Sesión cerrada.' });
}

module.exports = { iniciarSesion, obtenerSesion, cerrarSesion, publicUser };
