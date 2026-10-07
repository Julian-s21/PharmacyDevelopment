# Usuarios e inicio de sesión

El backend usa las cuentas de la tabla `USUARIO`. Cada usuario debe estar asociado a una sucursal. La contraseña se almacena con hash scrypt y nunca se devuelve en las respuestas de la API.

## Primera cuenta

Si la tabla no contiene usuarios, el servidor crea una cuenta inicial al arrancar. Configura estas variables en `.env` antes de iniciar el backend:

```dotenv
INITIAL_USER_EMAIL=usuario@farmacia.com
INITIAL_USER_PASSWORD=define-una-clave-segura
INITIAL_USER_BRANCH_ID=1
INITIAL_USER_NAME=Nombre
INITIAL_USER_LAST_NAME=Apellido
```

`INITIAL_USER_BRANCH_ID` debe corresponder a una sucursal existente. El servidor crea esta cuenta solo cuando aún no hay usuarios; una vez creada, puedes quitar estas variables. No guardes `.env` en el repositorio.

En producción también es obligatorio configurar `AUTH_SECRET` con una clave aleatoria estable de al menos 32 caracteres para firmar las sesiones.

## API de usuarios

- `POST /api/auth/login` recibe `{ "Correo_Usuario": "...", "Contrasena_Usuario": "..." }` y crea una sesión.
- `GET /api/auth/session` devuelve la cuenta autenticada.
- `POST /api/auth/logout` cierra la sesión.
- `POST /api/usuarios` crea usuarios; requiere sesión e incluye `ID_Sucursal`, `Nombre_Usuario`, `Apellido_Usuario`, `Correo_Usuario` y `Contrasena_Usuario`.
- `GET`, `PUT` y `DELETE /api/usuarios/:id` requieren sesión.

Todos los endpoints de la API, excepto iniciar y cerrar sesión, requieren la cookie de sesión válida.

## Crear una cuenta administradora

El script `src/scripts/crearAdministrador.js` carga `.env` desde la raíz del proyecto aunque se invoque desde `src/scripts`, crea la cuenta en Oracle y guarda la contraseña con bcrypt. Solo requiere `ADMIN_EMAIL` y `ADMIN_PASSWORD`; también acepta `INITIAL_USER_EMAIL` e `INITIAL_USER_PASSWORD`. El esquema exige una sucursal para cada usuario: el script asocia la primera sucursal disponible y, si todavía no hay ninguna, crea `Sucursal principal` con dirección y teléfono pendientes para permitir el primer acceso. Actualiza esos datos desde el sistema después de iniciar sesión. Después ejecuta:

```sh
npm run usuario:administrador
```

El script no imprime la contraseña y no cambia una cuenta si el correo ya existe. El esquema actual de `USUARIO` no tiene una columna de rol; la cuenta queda identificada como administradora por su nombre, pero la API hoy aplica permisos por sesión, no por rol.
