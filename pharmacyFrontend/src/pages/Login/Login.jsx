import { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card as MuiCard,
    FormControl,
    FormLabel,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    LocalPharmacyRounded,
    VisibilityOffRounded,
    VisibilityRounded
} from '@mui/icons-material';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 450,
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    border: '1px solid #e2e2e2',
    borderRadius: '12px',
    background: '#fff',
    boxShadow: '0 8px 30px #0000000d'
}));

const SignInContainer = styled(Stack)(() => ({
    position: 'relative',
    isolation: 'isolate',
    boxSizing: 'border-box',
    minHeight: '100dvh',
    padding: '24px',
    '&::before': {
        content: '""',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, #eeeeee, #f7f7f7 68%, #fff)',
        backgroundRepeat: 'no-repeat'
    }
}));

function Login({ onLogin }) {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const enviar = async (event) => {
        event.preventDefault();
        setError('');
        setCargando(true);
        try {
            const respuesta = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Correo_Usuario: correo, Contrasena_Usuario: contrasena })
            });
            const datos = await respuesta.json();
            if (!respuesta.ok) throw new Error(datos.mensaje || 'No fue posible iniciar sesión.');
            onLogin(datos.usuario);
        } catch (e) {
            setError(e.message || 'No fue posible conectar con el servidor.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <SignInContainer direction="column" sx={{ justifyContent: 'center' }}>
            <Card variant="outlined">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#171717' }}>
                    <LocalPharmacyRounded sx={{ fontSize: 27 }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: '.15em' }}>PHARMASY</Typography>
                </Box>

                <Typography component="h1" sx={{ width: '100%', color: '#171717', fontSize: 'clamp(1.8rem, 7vw, 2.15rem)', fontWeight: 700 }}>
                    Inicia sesión
                </Typography>
                <Typography sx={{ mt: -1, color: '#777', fontSize: 13 }}>
                    Ingresa con tu cuenta autorizada para continuar.
                </Typography>

                <Box component="form" onSubmit={enviar} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
                    <FormControl>
                        <FormLabel htmlFor="login-email" sx={{ mb: 0.75, color: '#333', fontSize: 12, '&.Mui-focused': { color: '#171717' } }}>
                            Correo electrónico
                        </FormLabel>
                        <TextField
                            id="login-email"
                            name="email"
                            type="email"
                            placeholder="nombre@farmacia.com"
                            autoComplete="username"
                            autoFocus
                            required
                            fullWidth
                            value={correo}
                            onChange={(event) => setCorreo(event.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '7px', fontSize: 13 }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#dedede' }, '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#999' }, '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#333' } }}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="login-password" sx={{ mb: 0.75, color: '#333', fontSize: 12, '&.Mui-focused': { color: '#171717' } }}>
                            Contraseña
                        </FormLabel>
                        <TextField
                            id="login-password"
                            name="password"
                            type={mostrarContrasena ? 'text' : 'password'}
                            placeholder="Tu contraseña"
                            autoComplete="current-password"
                            required
                            fullWidth
                            value={contrasena}
                            onChange={(event) => setContrasena(event.target.value)}
                            variant="outlined"
                            size="small"
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setMostrarContrasena(!mostrarContrasena)} aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'} edge="end">
                                                {mostrarContrasena ? <VisibilityOffRounded /> : <VisibilityRounded />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '7px', fontSize: 13 }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#dedede' }, '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#999' }, '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#333' }, '& .MuiIconButton-root': { color: '#666' } }}
                        />
                    </FormControl>

                    {error && <Alert severity="error" sx={{ border: '1px solid #e2e2e2', borderRadius: '7px', bgcolor: '#f7f7f7', color: '#444', fontSize: 12, '& .MuiAlert-icon': { color: '#555' } }}>{error}</Alert>}

                    <Button type="submit" fullWidth variant="contained" disabled={cargando} sx={{ minHeight: 42, borderRadius: '7px', bgcolor: '#171717', color: '#fff', fontSize: 12, fontWeight: 700, textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#333', boxShadow: '0 5px 13px #00000020' }, '&.Mui-disabled': { bgcolor: '#777', color: '#fff' } }}>
                        {cargando ? 'Verificando…' : 'Iniciar sesión'}
                    </Button>
                </Box>

                <Typography sx={{ color: '#888', fontSize: 10, textAlign: 'center' }}>Solo personal autorizado</Typography>
            </Card>
        </SignInContainer>
    );
}

export default Login;
