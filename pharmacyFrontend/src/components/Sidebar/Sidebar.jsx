
import {
    Box,
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from '@mui/material';

import {
    Link,
    useLocation
} from 'react-router-dom';

import {
    AccountBalanceWalletRounded,
    DashboardRounded,
    Inventory2Rounded,
    BusinessRounded,
    MedicationRounded,
    SettingsRounded,
    StoreRounded,
    SwapHorizRounded,
    LogoutRounded
} from '@mui/icons-material';

import './Sidebar.css';

const drawerWidth = 220;


/* ==========================================
   MENÚ
========================================== */

const menuPrincipal = [
    {
        title: 'Resumen',
        icon: <DashboardRounded />,
        to: '/'
    },
    {
        title: 'Sucursales',
        icon: <StoreRounded />,
        to: '/sucursales'
    },
    {
        title: 'Medicamentos',
        icon: <MedicationRounded />,
        to: '/medicamentos'
    },
    {
        title: 'Inventario',
        icon: <Inventory2Rounded />,
        to: '/inventario'
    },
    {
        title: 'Activos',
        icon: <BusinessRounded />,
        to: '/activos'
    }
];


const menuOperaciones = [
    {
        title: 'Transferencias',
        icon: <SwapHorizRounded />,
        to: '/transferencias'
    }
];


const menuFinanzas = [
    {
        title: 'Ingresos y egresos',
        icon: <AccountBalanceWalletRounded />,
        to: '/finanzas'
    },
    {
        title: 'Configuración',
        icon: <SettingsRounded />,
        to: '/configuracion'
    }
];


/* ==========================================
   SIDEBAR
========================================== */

function Sidebar({ mobileOpen, onClose, usuario, onLogout }) {
    const location = useLocation();
    const nombreUsuario = usuario?.Nombre_Completo || `${usuario?.Nombre_Usuario || ''} ${usuario?.Apellido_Usuario || ''}`.trim() || usuario?.Correo_Usuario || 'Usuario';
    const inicialUsuario = nombreUsuario.charAt(0).toUpperCase();

    const isItemActive = (to) => {
        if (!to) return false;

        if (to === '/') {
            return location.pathname === '/';
        }

        return location.pathname === to || location.pathname.startsWith(`${to}/`);
    };


    /* ======================================
       CREAR MENÚ
    ====================================== */

    const crearMenu = (items, activo = false) => (
    <List className="sidebar-list">

        {items.map((item, index) => {
            const isActive = isItemActive(item.to);

            const contenidoItem = (
                <>
                    <ListItemIcon className="sidebar-icon">
                        {item.icon}
                    </ListItemIcon>

                    <ListItemText
                        primary={item.title}
                    />
                </>
            );

            if (item.to) {
                return (
                    <ListItemButton
                        key={item.title}
                        component={Link}
                        to={item.to}
                        onClick={onClose}
                        className={
                            isActive
                                ? 'sidebar-item sidebar-item-active'
                                : 'sidebar-item'
                        }
                    >
                        {contenidoItem}
                    </ListItemButton>
                );
            }

            return (
                <ListItemButton
                    key={item.title}
                    className={
                        activo && index === 0
                            ? 'sidebar-item sidebar-item-active'
                            : 'sidebar-item'
                    }
                >
                    {contenidoItem}
                </ListItemButton>
            );

        })}

    </List>
);


    /* ======================================
       CONTENIDO
    ====================================== */

    const contenido = (

        <Box className="sidebar-container">


            {/* =================================
                LOGO
            ================================= */}

            <Box className="sidebar-brand">

                <Box className="brand-icon">
                    P
                </Box>

                <Box className="brand-information">

                    <Typography className="brand-title">
                        PHARMASY
                    </Typography>

                    <Typography className="brand-subtitle">
                        Gestión de Farmacias
                    </Typography>

                </Box>

            </Box>


            <Divider className="sidebar-divider" />


            {/* =================================
                PRINCIPAL
            ================================= */}

            <Box className="sidebar-section">

                <Typography className="sidebar-section-title">
                    PRINCIPAL
                </Typography>

                {crearMenu(menuPrincipal, true)}

            </Box>


            {/* =================================
                OPERACIONES
            ================================= */}

            <Box className="sidebar-section">

                <Typography className="sidebar-section-title">
                    OPERACIONES
                </Typography>

                {crearMenu(menuOperaciones)}

            </Box>


            {/* =================================
                FINANZAS
            ================================= */}

            <Box className="sidebar-section">

                <Typography className="sidebar-section-title">
                    FINANZAS
                </Typography>

                {crearMenu(menuFinanzas)}

            </Box>


            {/* =================================
                PERFIL / PARTE INFERIOR
            ================================= */}

            <Box className="sidebar-bottom">

                <Box className="sidebar-user">

                    <Box className="sidebar-user-avatar">
                        {inicialUsuario}
                    </Box>

                    <Box className="sidebar-user-info">

                        <Typography>
                            {nombreUsuario}
                        </Typography>

                        <span>
                            {usuario?.Correo_Usuario || 'Personal autorizado'}
                        </span>

                    </Box>

                </Box>

                <ListItemButton className="sidebar-logout" onClick={() => { onClose?.(); onLogout?.(); }}>
                    <ListItemIcon className="sidebar-logout-icon"><LogoutRounded /></ListItemIcon>
                    <ListItemText primary="Cerrar sesión" />
                </ListItemButton>

            </Box>

        </Box>
    );


    /* ==========================================
       DRAWERS
    ========================================== */

    return (
        <>

            {/* DESKTOP */}

            <Drawer
                variant="permanent"
                className="sidebar-desktop"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,

                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box'
                    }
                }}
            >

                {contenido}

            </Drawer>


            {/* MOBILE */}

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{
                    keepMounted: true
                }}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerWidth
                    }
                }}
            >

                {contenido}

            </Drawer>

        </>
    );
}

export default Sidebar;
