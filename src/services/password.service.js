const crypto = require('crypto');
const { promisify } = require('util');
const bcrypt = require('bcrypt');
const scrypt = promisify(crypto.scrypt);
const HASH_PREFIX = 'scrypt';

async function hashPassword(password) {
    const salt = crypto.randomBytes(16);
    const hash = await scrypt(password, salt, 64);
    return `${HASH_PREFIX}$${salt.toString('hex')}$${hash.toString('hex')}`;
}

async function verifyPassword(password, stored) {
    if (!stored) return false;
    if (/^\$2[aby]\$\d{2}\$/.test(stored)) {
        return bcrypt.compare(password, stored);
    }
    if (stored.startsWith(`${HASH_PREFIX}$`)) {
        const [, saltHex, hashHex] = stored.split('$');
        if (!saltHex || !hashHex) return false;
        const expected = Buffer.from(hashHex, 'hex');
        const actual = await scrypt(password, Buffer.from(saltHex, 'hex'), expected.length);
        return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
    }
    // Migra las contraseñas heredadas en texto plano en el primer acceso válido.
    const incoming = Buffer.from(password);
    const legacy = Buffer.from(stored);
    return incoming.length === legacy.length && crypto.timingSafeEqual(incoming, legacy);
}

module.exports = { hashPassword, verifyPassword };
