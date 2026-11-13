const express = require('express');
const path = require('path');
const AppDataSource = require('./config/database');
const asegurarUsuarioInicial = require('./services/usuario.bootstrap');

const app = express();

const PORT = process.env.PORT || 3000;


app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const { authenticate } = require('./middleware/auth.middleware');
app.use('/api/auth', authRoutes);

app.use('/api', authenticate);


const sucursalRoutes = require('./routes/sucursal.routes');
app.use('/api/sucursales', sucursalRoutes);



const usuarioRoutes = require('./routes/usuario.routes');
app.use('/api/usuarios', usuarioRoutes);

const categoriaMedicamentoRoutes =
    require('./routes/categoriaMedicamento.routes');


app.use(
    '/api/categorias-medicamento',
    categoriaMedicamentoRoutes
);


const medicamentoRoutes = require('./routes/medicamento.routes');

app.use(
    '/api/medicamentos',
    medicamentoRoutes
);
app.get('/health', (req, res) => {
    res.json({
        mensaje: 'Backend funcionando correctamente'
    });
});


const inventarioRoutes =
    require('./routes/inventario.routes');

app.use(
    '/api/inventario',
    inventarioRoutes
);
app.use('/api/inventarios', inventarioRoutes);



const movimientoInventarioRoutes =
    require('./routes/movimientoInventario.routes');

app.use(
    '/api/movimientos-inventario',
    movimientoInventarioRoutes
);
app.use('/api/inventario/movimiento', movimientoInventarioRoutes);


const transferenciaRoutes =
    require('./routes/transferencia.routes');

app.use(
    '/api/transferencias',
    transferenciaRoutes
);


const detalleTransferenciaRoutes =
    require('./routes/detalleTransferencia.routes');

app.use(
    '/api/detalles-transferencia',
    detalleTransferenciaRoutes
);


const distribucionRoutes =
    require('./routes/distribucion.routes');

app.use(
    '/api/distribuciones',
    distribucionRoutes
);



const detalleDistribucionRoutes =
    require('./routes/detalleDistribucion.routes');

app.use(
    '/api/detalles-distribucion',
    detalleDistribucionRoutes
);



const movimientoFinancieroRoutes =
    require('./routes/movimientoFinanciero.routes');

app.use(
    '/api/movimientos-financieros',
    movimientoFinancieroRoutes
);


const gastoPlanillaRoutes =
    require('./routes/gastoPlanilla.routes');

app.use(
    '/api/gastos-planilla',
    gastoPlanillaRoutes
);


const activoFijoRoutes =
    require('./routes/activoFijo.routes');

app.use(
    '/api/activos-fijos',
    activoFijoRoutes
);


const flujoEfectivoRoutes =
    require('./routes/flujoEfectivo.routes');

app.use(
    '/api/flujos-efectivo',
    flujoEfectivoRoutes
);


const frontendDist = path.join(__dirname, '..', 'pharmacyFrontend', 'dist');
app.use(express.static(frontendDist));
app.use((req, res, next) => {
    if (req.method !== 'GET' || !req.accepts('html')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'), (error) => {
        if (error) next(error);
    });
});


AppDataSource.initialize()
    .then(() => {
        console.log('Conexión a Oracle establecida correctamente.');
        return asegurarUsuarioInicial();
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al iniciar el backend:', error);
    });
