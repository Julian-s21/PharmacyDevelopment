const crypto = require('crypto');

if (process.env.NODE_ENV === 'production' && !process.env.AUTH_SECRET) {
    throw new Error('Define AUTH_SECRET en el entorno de producción para firmar las sesiones.');
}

const secret = process.env.AUTH_SECRET || crypto.randomBytes(32).toString('hex');
const cookieName = 'pharmasy_session';

function createToken(usuario) {
    const payload = Buffer.from(JSON.stringify({
        id: usuario.ID_Usuario,
        correo: usuario.Correo_Usuario,
        nombre: `${usuario.Nombre_Usuario || ''} ${usuario.Apellido_Usuario || ''}`.trim(),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8
    })).toString('base64url');
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
    return `${payload}.${signature}`;
}

function readToken(token) {
    if (!token || typeof token !== 'string') return null;
    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra) return null;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest();
    let actual;
    try { actual = Buffer.from(signature, 'base64url'); } catch { return null; }
    if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;
    try {
        const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());
        if (!decoded.id || !decoded.exp || decoded.exp <= Math.floor(Date.now() / 1000)) return null;
        return decoded;
    } catch {
        return null;
    }
}

function cookieOptions() {
    return `Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 8}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
}

function setSession(res, usuario) {
    res.setHeader('Set-Cookie', `${cookieName}=${createToken(usuario)}; ${cookieOptions()}`);
}

function clearSession(res) {
    res.setHeader('Set-Cookie', `${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
}

function authenticate(req, res, next) {
    const cookie = (req.headers.cookie || '').split(';').map((part) => part.trim())
        .find((part) => part.startsWith(`${cookieName}=`));
    const session = readToken(cookie?.slice(cookieName.length + 1));
    if (!session) return res.status(401).json({ mensaje: 'Debes iniciar sesión para continuar.' });
    req.authUser = { ID_Usuario: session.id, Correo_Usuario: session.correo, Nombre_Completo: session.nombre };
    next();
}

module.exports = { authenticate, clearSession, createToken, setSession };
