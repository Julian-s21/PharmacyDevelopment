import { useEffect, useState } from 'react';
import { Alert, Box, Button, FormControlLabel, MenuItem, Switch, TextField, Typography } from '@mui/material';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import './Configuracion.css';

const STORAGE_KEY = 'pharmasy-configuracion';
const valoresIniciales = { nombreFarmacia: 'PHARMASY', moneda: 'GTQ', umbralInventario: 10, avisosInventario: true };

function Configuracion() {
    const [valores, setValores] = useState(valoresIniciales);
    const [guardado, setGuardado] = useState(false);

    useEffect(() => {
        try {
            const guardados = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (guardados && typeof guardados === 'object') setValores({ ...valoresIniciales, ...guardados });
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    const actualizar = (campo) => (evento) => {
        const valor = evento.target.type === 'checkbox' ? evento.target.checked : evento.target.value;
        setValores((actuales) => ({ ...actuales, [campo]: valor }));
        setGuardado(false);
    };

    const guardar = (evento) => {
        evento.preventDefault();
        const configuracion = { ...valores, nombreFarmacia: valores.nombreFarmacia.trim() || valoresIniciales.nombreFarmacia, umbralInventario: Math.max(0, Number(valores.umbralInventario) || 0) };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(configuracion));
        setValores(configuracion);
        setGuardado(true);
    };

    const restaurar = () => {
        localStorage.removeItem(STORAGE_KEY);
        setValores(valoresIniciales);
        setGuardado(false);
    };

    return (
        <Box className="configuracion-page">
            <Box className="configuracion-heading">
                <span className="configuracion-heading-icon"><SettingsRounded /></span>
                <Box><Typography variant="h4">Configuración</Typography><Typography color="text.secondary">Preferencias básicas de Pharmasy para este navegador.</Typography></Box>
            </Box>
            <Box component="form" className="configuracion-card" onSubmit={guardar}>
                <Typography variant="h6">Preferencias generales</Typography>
                <Typography className="configuracion-description">Estos valores se guardan localmente en este dispositivo.</Typography>
                <TextField label="Nombre de la farmacia" value={valores.nombreFarmacia} onChange={actualizar('nombreFarmacia')} fullWidth inputProps={{ maxLength: 80 }} />
                <TextField select label="Moneda de referencia" value={valores.moneda} onChange={actualizar('moneda')} fullWidth>
                    <MenuItem value="GTQ">Quetzal guatemalteco (GTQ)</MenuItem>
                    <MenuItem value="USD">Dólar estadounidense (USD)</MenuItem>
                </TextField>
                <TextField label="Umbral de inventario bajo" type="number" value={valores.umbralInventario} onChange={actualizar('umbralInventario')} fullWidth inputProps={{ min: 0, step: 1 }} helperText="Cantidad mínima de unidades para considerar bajo el inventario." />
                <FormControlLabel control={<Switch checked={Boolean(valores.avisosInventario)} onChange={actualizar('avisosInventario')} />} label="Activar avisos de inventario bajo" />
                {guardado && <Alert severity="success">Configuración guardada en este dispositivo.</Alert>}
                <Box className="configuracion-actions"><Button type="button" color="inherit" onClick={restaurar}>Restaurar valores</Button><Button type="submit" variant="contained">Guardar cambios</Button></Box>
            </Box>
        </Box>
    );
}

export default Configuracion;
