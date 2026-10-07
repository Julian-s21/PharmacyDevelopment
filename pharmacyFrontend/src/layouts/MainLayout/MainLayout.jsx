import { useState } from 'react';

import {
    Box
} from '@mui/material';

import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';

import './MainLayout.css';

function MainLayout({ children, usuario, onLogout }) {

    const [mobileOpen, setMobileOpen] = useState(false);

    const abrirMenu = () => {
        setMobileOpen(!mobileOpen);
    };

    const cerrarMenu = () => {
        setMobileOpen(false);
    };

    return (
        <Box className="main-layout">

            <Header
                onMenuClick={abrirMenu}
            />

            <Sidebar
                mobileOpen={mobileOpen}
                onClose={cerrarMenu}
                usuario={usuario}
                onLogout={onLogout}
            />

            <Box
                component="main"
                className="main-content"
            >


                {children}

            </Box>

        </Box>
    );
}

export default MainLayout;
