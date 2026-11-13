import { useEffect, useState } from 'react';

import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography
} from '@mui/material';

import {
    AccountBalanceRounded,
    BusinessRounded,
    CloseRounded,
    Inventory2Rounded,
    LocationOnRounded,
    MedicationRounded,
    PaymentsRounded,
    PeopleRounded,
    SearchRounded,
    SwapHorizRounded,
    VisibilityRounded
} from '@mui/icons-material';

import './Sucursales.css';

function Sucursales() {

    // ==========================================
    // ESTADOS
    // ==========================================

    const [sucursales, setSucursales] = useState([]);

    const [busqueda, setBusqueda] = useState('');

    const [cargando, setCargando] = useState(true);

    const [error, setError] = useState('');

    // Sucursal seleccionada para consultar
    const [sucursalSeleccionada, setSucursalSeleccionada] =
        useState(null);

    // Estado del modal
    const [detalleAbierto, setDetalleAbierto] =
        useState(false);

    // Estado de carga del detalle
    const [cargandoDetalle, setCargandoDetalle] =
        useState(false);


    // ==========================================
    // CONSULTAR SUCURSALES
    // RF-01
    // ==========================================

    useEffect(() => {

        cargarSucursales();

    }, []);


    const cargarSucursales = async () => {

        try {

            setCargando(true);

            setError('');

            const respuesta = await fetch('/api/sucursales');

            if (!respuesta.ok) {

                throw new Error(
                    'No fue posible consultar las sucursales.'
                );

            }

            const datos = await respuesta.json();

            setSucursales(datos);

        } catch (error) {

            console.error(
                'Error al consultar sucursales:',
                error
            );

            setError(
                'No fue posible cargar la información de las sucursales.'
            );

        } finally {

            setCargando(false);

        }

    };


    // ==========================================
    // CONSULTAR INFORMACIÓN DE SUCURSAL
    // RF-02
    // ==========================================

    const verInformacionSucursal = async (sucursal) => {

        try {

            setCargandoDetalle(true);

            setDetalleAbierto(true);

            /*
             * Consultamos la sucursal específica
             * mediante su ID.
             *
             * Vite redirige /api hacia Node.js.
             */
            const respuesta = await fetch(
                `/api/sucursales/${sucursal.ID_Sucursal}`
            );

            if (!respuesta.ok) {

                throw new Error(
                    'No fue posible consultar la información de la sucursal.'
                );

            }

            const datos = await respuesta.json();

            setSucursalSeleccionada(datos);

        } catch (error) {

            console.error(
                'Error al consultar la sucursal:',
                error
            );

            /*
             * Si por alguna razón el detalle no puede
             * obtenerse, conservamos la información
             * que ya tenemos en la tabla.
             */
            setSucursalSeleccionada(sucursal);

        } finally {

            setCargandoDetalle(false);

        }

    };


    // ==========================================
    // CERRAR DETALLE
    // ==========================================

    const cerrarDetalle = () => {

        setDetalleAbierto(false);

        setSucursalSeleccionada(null);

    };


    // ==========================================
    // FILTRO DE BÚSQUEDA
    // ==========================================

    const sucursalesFiltradas = sucursales.filter((sucursal) => {

        const nombre =
            sucursal.Nombre_Sucursal?.toLowerCase() || '';

        const direccion =
            sucursal.Direccion_Sucursal?.toLowerCase() || '';

        const texto =
            busqueda.toLowerCase();

        return (
            nombre.includes(texto) ||
            direccion.includes(texto)
        );

    });

    const getRelatedCount = (value) => {
        const numero = Number(value);
        return Number.isFinite(numero) ? numero : 0;
    };

    const toArray = (value) =>
        Array.isArray(value) ? value : [];

    const formatMoney = (value) => {
        const numero = Number(value);

        if (!Number.isFinite(numero)) {
            return 'Q 0.00';
        }

        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(numero);
    };

    const formatDate = (value) => {
        if (!value) {
            return 'Sin fecha';
        }

        const fecha = new Date(value);

        if (Number.isNaN(fecha.getTime())) {
            return 'Sin fecha';
        }

        return fecha.toLocaleDateString('es-GT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <Box className="sucursales-page">


            {/* ==========================================
                ENCABEZADO
            ========================================== */}

            <Box className="sucursales-header">

                <Box className="sucursales-header-left">

                    <Box className="sucursales-header-icon">

                        <BusinessRounded />

                    </Box>

                    <Box className="sucursales-header-information">

                        <Typography className="sucursales-title">
                            Sucursales
                        </Typography>

                        <Typography className="sucursales-subtitle">
                            Consulta la información de las sucursales
                            de la organización.
                        </Typography>

                    </Box>

                </Box>

            </Box>


            {/* ==========================================
                CONTENIDO PRINCIPAL
            ========================================== */}

            <Paper className="sucursales-panel">


                {/* ==========================================
                    BARRA DE HERRAMIENTAS
                ========================================== */}

                <Box className="sucursales-toolbar">

                    <TextField
                        className="sucursales-search"
                        placeholder="Buscar sucursal..."
                        variant="outlined"
                        size="small"
                        value={busqueda}
                        onChange={(e) =>
                            setBusqueda(e.target.value)
                        }
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">

                                    <SearchRounded />

                                </InputAdornment>
                            )
                        }}
                    />

                    <Typography className="sucursales-count">

                        {sucursalesFiltradas.length} sucursales

                    </Typography>

                </Box>


                {/* ==========================================
                    MENSAJE DE ERROR
                ========================================== */}

                {error && (

                    <Box className="sucursales-error">

                        <Typography>
                            {error}
                        </Typography>

                    </Box>

                )}


                {/* ==========================================
                    TABLA
                ========================================== */}

                <Box className="sucursales-table-container">


                    {/* ENCABEZADO */}

                    <Box className="sucursales-table-header">

                        <Box className="table-column column-name">
                            Sucursal
                        </Box>

                        <Box className="table-column column-location">
                            Ubicación
                        </Box>

                        <Box className="table-column column-status">
                            Estado
                        </Box>

                        <Box className="table-column column-actions">
                            Consulta
                        </Box>

                    </Box>


                    {/* ==========================================
                        CARGANDO
                    ========================================== */}

                    {cargando ? (

                        <Box className="sucursales-loading">

                            <Typography>
                                Cargando sucursales...
                            </Typography>

                        </Box>

                    ) : (


                        <Box className="sucursales-table-body">


                            {/* ==========================================
                                REGISTROS
                            ========================================== */}

                            {sucursalesFiltradas.map((sucursal) => (

                                <Box
                                    className="sucursal-row"
                                    key={sucursal.ID_Sucursal}
                                >


                                    {/* NOMBRE */}

                                    <Box className="table-column column-name">

                                        <Box className="sucursal-name-wrapper">

                                            <Box className="sucursal-icon">

                                                <BusinessRounded />

                                            </Box>

                                            <Box>

                                                <Typography className="sucursal-name">

                                                    {
                                                        sucursal.Nombre_Sucursal
                                                    }

                                                </Typography>

                                                <Typography className="sucursal-id">

                                                    ID: {
                                                        sucursal.ID_Sucursal
                                                    }

                                                </Typography>

                                            </Box>

                                        </Box>

                                    </Box>


                                    {/* UBICACIÓN */}

                                    <Box className="table-column column-location">

                                        <Box className="location-wrapper">

                                            <LocationOnRounded />

                                            <Typography>

                                                {
                                                    sucursal.Direccion_Sucursal
                                                }

                                            </Typography>

                                        </Box>

                                    </Box>


                                    {/* ESTADO */}

                                    <Box className="table-column column-status">

                                        <Box className="status-badge status-active">

                                            <Box className="status-dot" />

                                            Activa

                                        </Box>

                                    </Box>


                                    {/* CONSULTA */}

                                    <Box className="table-column column-actions">

                                        <IconButton
                                            className="action-button"
                                            title="Ver información de la sucursal"
                                            onClick={() =>
                                                verInformacionSucursal(
                                                    sucursal
                                                )
                                            }
                                        >

                                            <VisibilityRounded />

                                        </IconButton>

                                    </Box>

                                </Box>

                            ))}


                            {/* ==========================================
                                SIN RESULTADOS
                            ========================================== */}

                            {!cargando &&
                                sucursalesFiltradas.length === 0 && (

                                    <Box className="sucursales-empty">

                                        <BusinessRounded />

                                        <Typography>
                                            No se encontraron sucursales.
                                        </Typography>

                                    </Box>

                                )}

                        </Box>

                    )}

                </Box>

            </Paper>


            {/* ==========================================
                DETALLE DE SUCURSAL
                RF-02
            ========================================== */}

            <Dialog
                open={detalleAbierto}
                onClose={cerrarDetalle}
                fullWidth
                maxWidth="md"
            >

                <DialogTitle>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5
                            }}
                        >

                            <BusinessRounded />

                            <Box>

                                <Typography
                                    variant="h6"
                                    fontWeight="600"
                                >
                                    Información de la sucursal
                                </Typography>

                                {sucursalSeleccionada && (

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {
                                            sucursalSeleccionada
                                                .Nombre_Sucursal
                                        }
                                    </Typography>

                                )}

                            </Box>

                        </Box>


                        <IconButton
                            onClick={cerrarDetalle}
                            title="Cerrar"
                        >

                            <CloseRounded />

                        </IconButton>

                    </Box>

                </DialogTitle>


                <DialogContent dividers>

                    {cargandoDetalle ? (

                        <Box
                            sx={{
                                py: 5,
                                textAlign: 'center'
                            }}
                        >

                            <Typography>
                                Consultando información...
                            </Typography>

                        </Box>

                    ) : sucursalSeleccionada ? (

                        <Box>


                            {/* ==========================================
                                INFORMACIÓN GENERAL
                            ========================================== */}

                            <Box sx={{ mb: 4 }}>

                                <Typography
                                    variant="subtitle1"
                                    fontWeight="600"
                                    sx={{ mb: 2 }}
                                >
                                    Información general
                                </Typography>


                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns:
                                            'repeat(2, 1fr)',
                                        gap: 2
                                    }}
                                >

                                    <Box>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            ID de sucursal
                                        </Typography>

                                        <Typography>
                                            {
                                                sucursalSeleccionada
                                                    .ID_Sucursal
                                            }
                                        </Typography>

                                    </Box>


                                    <Box>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Estado
                                        </Typography>

                                        <Typography>
                                            Activa
                                        </Typography>

                                    </Box>


                                    <Box>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Nombre
                                        </Typography>

                                        <Typography>
                                            {
                                                sucursalSeleccionada
                                                    .Nombre_Sucursal
                                            }
                                        </Typography>

                                    </Box>


                                    <Box>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Dirección
                                        </Typography>

                                        <Typography>
                                            {
                                                sucursalSeleccionada
                                                    .Direccion_Sucursal
                                            }
                                        </Typography>

                                    </Box>

                                    <Box>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Teléfono
                                        </Typography>

                                        <Typography>
                                            {
                                                sucursalSeleccionada
                                                    .Telefono_Sucursal ||
                                                'No registrado'
                                            }
                                        </Typography>

                                    </Box>

                                </Box>

                            </Box>


                            {/* ==========================================
                                INFORMACIÓN RELACIONADA
                                RF-02
                            ========================================== */}

                            <Typography
                                variant="subtitle1"
                                fontWeight="600"
                                sx={{ mb: 2 }}
                            >
                                Información relacionada
                            </Typography>


                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns:
                                        'repeat(2, 1fr)',
                                    gap: 2
                                }}
                            >


                                {/* EMPLEADOS */}

                                <Box className="sucursal-info-card">

                                    <PeopleRounded />

                                    <Box sx={{ flex: 1 }}>

                                        <Typography
                                            fontWeight="600"
                                        >
                                            Empleados
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            sx={{ mt: 0.5 }}
                                        >
                                            {
                                                getRelatedCount(
                                                    toArray(
                                                        sucursalSeleccionada
                                                            .empleados
                                                    ).length
                                                )
                                            }
                                        </Typography>

                                        {toArray(
                                            sucursalSeleccionada.empleados
                                        )
                                            .slice(0, 3)
                                            .map((empleado) => (
                                                <Typography
                                                    key={empleado.ID_Usuario}
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    {empleado.Nombre_Usuario}{' '}
                                                    {empleado.Apellido_Usuario}
                                                </Typography>
                                            ))}

                                    </Box>

                                </Box>


                                {/* MEDICAMENTOS */}

                                <Box className="sucursal-info-card">

                                    <MedicationRounded />

                                    <Box sx={{ flex: 1 }}>

                                        <Typography
                                            fontWeight="600"
                                        >
                                            Medicamentos
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            sx={{ mt: 0.5 }}
                                        >
                                            {
                                                getRelatedCount(
                                                    toArray(
                                                        sucursalSeleccionada
                                                            .medicamentos
                                                    ).length
                                                )
                                            }
                                        </Typography>

                                        {toArray(
                                            sucursalSeleccionada.medicamentos
                                        )
                                            .slice(0, 3)
                                            .map((medicamento) => (
                                                <Typography
                                                    key={
                                                        medicamento.ID_Medicamento
                                                    }
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    {medicamento.Nombre_Medicamento}{' '}
                                                    · {' '}
                                                    {medicamento.Cantidad_Inventario}{' '}
                                                    unidades
                                                </Typography>
                                            ))}

                                    </Box>

                                </Box>


                                {/* INVENTARIO */}

                                <Box className="sucursal-info-card">

                                    <Inventory2Rounded />

                                    <Box sx={{ flex: 1 }}>

                                        <Typography
                                            fontWeight="600"
                                        >
                                            Inventario
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            sx={{ mt: 0.5 }}
                                        >
                                            {
                                                getRelatedCount(
                                                    sucursalSeleccionada
                                                        .inventario
                                                )
                                            }
                                        </Typography>

                                        {toArray(
                                            sucursalSeleccionada.inventarioDetalle
                                        )
                                            .slice(0, 3)
                                            .map((item) => (
                                                <Typography
                                                    key={item.ID_Inventario}
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    {item.medicamento?.Nombre_Medicamento || 'Medicamento'}
                                                    {' '}: {' '}
                                                    {item.Cantidad_Inventario} und.
                                                </Typography>
                                            ))}

                                    </Box>

                                </Box>


                                {/* ACTIVOS */}

                                <Box className="sucursal-info-card">

                                    <AccountBalanceRounded />

                                    <Box sx={{ flex: 1 }}>

                                        <Typography
                                            fontWeight="600"
                                        >
                                            Activos fijos
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            sx={{ mt: 0.5 }}
                                        >
                                            {
                                                getRelatedCount(
                                                    toArray(
                                                        sucursalSeleccionada
                                                            .activosFijos
                                                    ).length
                                                )
                                            }
                                        </Typography>

                                        {toArray(
                                            sucursalSeleccionada.activosFijos
                                        )
                                            .slice(0, 3)
                                            .map((activo) => (
                                                <Typography
                                                    key={activo.ID_Activo}
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    {activo.Nombre_Activo}{' '}
                                                    · {' '}
                                                    {formatMoney(
                                                        activo.Precio_Adquisicion_Activo
                                                    )}
                                                </Typography>
                                            ))}

                                    </Box>

                                </Box>


                                {/* GASTOS DE PLANILLA */}

                                <Box className="sucursal-info-card">

                                    <PaymentsRounded />

                                    <Box sx={{ flex: 1 }}>

                                        <Typography
                                            fontWeight="600"
                                        >
                                            Gastos de planilla
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            sx={{ mt: 0.5 }}
                                        >
                                            {
                                                getRelatedCount(
                                                    toArray(
                                                        sucursalSeleccionada
                                                            .gastosPlanilla
                                                    ).length
                                                )
                                            }
                                        </Typography>

                                        {toArray(
                                            sucursalSeleccionada.gastosPlanilla
                                        )
                                            .slice(0, 3)
                                            .map((gasto) => (
                                                <Typography
                                                    key={
                                                        gasto.ID_Gasto_Planilla
                                                    }
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    {gasto.Total_Planilla ? formatMoney(gasto.Total_Planilla) : 'Sin monto'}
                                                    {' '}
                                                    · {' '}
                                                    {formatDate(
                                                        gasto.Fecha_Planilla
                                                    )}
                                                </Typography>
                                            ))}

                                    </Box>

                                </Box>


                                {/* OPERACIONES */}

                                <Box className="sucursal-info-card">

                                    <SwapHorizRounded />

                                    <Box sx={{ flex: 1 }}>

                                        <Typography
                                            fontWeight="600"
                                        >
                                            Operaciones
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            sx={{ mt: 0.5 }}
                                        >
                                            {
                                                getRelatedCount(
                                                    toArray(
                                                        sucursalSeleccionada
                                                            .operaciones
                                                    ).length
                                                )
                                            }
                                        </Typography>

                                        {toArray(
                                            sucursalSeleccionada.operaciones
                                        )
                                            .slice(0, 3)
                                            .map((operacion, index) => (
                                                <Typography
                                                    key={`${operacion.tipo}-${operacion.id ?? index}`}
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    {operacion.tipo}{' '}
                                                    · {' '}
                                                    {formatDate(
                                                        operacion.fecha
                                                    )}
                                                </Typography>
                                            ))}

                                    </Box>

                                </Box>

                            </Box>

                        </Box>

                    ) : (

                        <Typography>
                            No fue posible obtener la información.
                        </Typography>

                    )}

                </DialogContent>

            </Dialog>

        </Box>
    );
}

export default Sucursales;