import {
    Box,
    Typography
} from '@mui/material';

import {
    DashboardRounded
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';

import './DashboardHeaderCard.css';

function DashboardHeaderCard() {

    const navigate = useNavigate();

    return (

        <Box
            className="dashboard-header-card"
            onClick={() => navigate('/')}
            sx={{ cursor: 'pointer' }}
        >

            <Box className="dashboard-header-icon">

                <DashboardRounded />

            </Box>


            <Box className="dashboard-header-information">

                <Typography className="dashboard-header-title">
                    Resumen general
                </Typography>

                <Typography className="dashboard-header-subtitle">
                    Consulta el estado actual de tus operaciones.
                </Typography>

            </Box>

        </Box>

    );

}


export default DashboardHeaderCard;