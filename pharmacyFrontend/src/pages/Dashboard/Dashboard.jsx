import {
    Box,
    Paper
} from '@mui/material';

import {
    Inventory2Rounded,
    MedicationRounded,
    StoreRounded,
    SwapHorizRounded
} from '@mui/icons-material';

import CategoryChart from '../../components/CategoryChart/CategoryChart';
import DashboardHeaderCard from '../../components/DashboardHeaderCard/DashboardHeaderCard';
import SalesChart from '../../components/SalesChart/SalesChart';
import StatCard from '../../components/StatCard/StatCard';

import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {

    const navigate = useNavigate();

    return (
        <Box className="dashboard">

            <DashboardHeaderCard />


            <Box className="stats-grid">

                <StatCard
                    title="Sucursales"
                    value="12"
                    percentage="+8.2%"
                    description="vs. mes anterior"
                    icon={<StoreRounded />}
                    delay={100}
                    onClick={() => navigate('/sucursales')}
                />

                <StatCard
                    title="Medicamentos"
                    value="1,248"
                    percentage="+12.5%"
                    description="productos registrados"
                    icon={<MedicationRounded />}
                    delay={180}
                />

                <StatCard
                    title="Existencias"
                    value="8,942"
                    percentage="+5.4%"
                    description="unidades disponibles"
                    icon={<Inventory2Rounded />}
                    delay={260}
                />

                <StatCard
                    title="Transferencias"
                    value="326"
                    percentage="+9.7%"
                    description="este mes"
                    icon={<SwapHorizRounded />}
                    delay={340}
                />

            </Box>


            <Box className="charts-grid">

                <Paper className="dashboard-panel sales-panel">

                    <Box className="panel-header">

                        <Box>

                            <div className="panel-title">
                                Rendimiento financiero
                            </div>

                            <div className="panel-subtitle">
                                Ingresos y egresos de los últimos meses
                            </div>

                        </Box>

                        <Box className="panel-period">
                            Últimos 6 meses
                        </Box>

                    </Box>

                    <SalesChart />

                </Paper>


                <Paper className="dashboard-panel category-panel">

                    <Box className="panel-header">

                        <Box>

                            <div className="panel-title">
                                Categorías
                            </div>

                            <div className="panel-subtitle">
                                Distribución de medicamentos
                            </div>

                        </Box>

                    </Box>

                    <CategoryChart />

                </Paper>

            </Box>


            <Paper className="dashboard-panel activity-panel">

                <Box className="panel-header">

                    <Box>

                        <div className="panel-title">
                            Actividad reciente
                        </div>

                        <div className="panel-subtitle">
                            Últimos movimientos registrados
                        </div>

                    </Box>

                </Box>


                <Box className="activity-list">

                    <Activity
                        icon={<Inventory2Rounded />}
                        title="Entrada de inventario"
                        description="Paracetamol 500mg"
                        time="Hace 12 minutos"
                    />

                    <Activity
                        icon={<SwapHorizRounded />}
                        title="Transferencia realizada"
                        description="Sucursal Zona 1 → Sucursal Zona 10"
                        time="Hace 35 minutos"
                    />

                    <Activity
                        icon={<StoreRounded />}
                        title="Nueva sucursal registrada"
                        description="Sucursal San Marcos"
                        time="Hace 1 hora"
                    />

                </Box>

            </Paper>

        </Box>
    );
}


function Activity({
    icon,
    title,
    description,
    time
}) {

    return (
        <Box className="activity-item">

            <Box className="activity-icon">
                {icon}
            </Box>

            <Box className="activity-info">

                <div className="activity-title">
                    {title}
                </div>

                <div className="activity-description">
                    {description}
                </div>

            </Box>

            <div className="activity-time">
                {time}
            </div>

        </Box>
    );
}

export default Dashboard;