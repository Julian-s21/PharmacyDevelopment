
import {
    AppBar,
    Box,
    IconButton,
    InputAdornment,
    TextField,
    Toolbar,
    Typography
} from '@mui/material';

import {
    MenuRounded,
    NotificationsNoneRounded,
    SearchRounded
} from '@mui/icons-material';

import './Header.css';

function Header({ onMenuClick, usuario }) {
    const nombreUsuario = usuario?.Nombre_Completo
        || `${usuario?.Nombre_Usuario || ''} ${usuario?.Apellido_Usuario || ''}`.trim()
        || usuario?.Correo_Usuario
        || 'Usuario';

    return (
        <AppBar
            position="fixed"
            className="header"
        >

            <Toolbar className="header-toolbar">

                <IconButton
                    className="header-menu-button"
                    onClick={onMenuClick}
                >
                    <MenuRounded />
                </IconButton>

                <Box className="header-welcome">

                    <Typography className="welcome-title">
                        Bienvenido, {nombreUsuario}
                    </Typography>

                    <Typography className="welcome-subtitle">
                        Aquí tienes el resumen de tu farmacia
                    </Typography>

                </Box>

                <Box className="header-spacer" />

                <TextField
                    className="header-search"
                    placeholder="Buscar..."
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchRounded />
                            </InputAdornment>
                        )
                    }}
                />

                <IconButton className="notification-button">

                    <NotificationsNoneRounded />

                    <span className="notification-dot" />

                </IconButton>

            </Toolbar>

        </AppBar>
    );
}

export default Header;
