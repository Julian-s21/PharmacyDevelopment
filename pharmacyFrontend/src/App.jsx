


import { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes
} from 'react-router-dom';

import MainLayout from './layouts/MainLayout/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Medicamentos from './pages/Medicamentos/Medicamentos';
import Sucursales from './pages/Sucursales/Sucursales';
import Transferencias from './pages/Transferencias/Transferencias';
import Inventario from './pages/Inventario/Inventario';
import Activos from './pages/Activos/Activos';
import Finanzas from './pages/Finanzas/Finanzas';
import Configuracion from './pages/Configuracion/Configuracion';
import Login from './pages/Login/Login';

import './App.css';

function App() {
    const [usuario, setUsuario] = useState(undefined);

    useEffect(() => {
        fetch('/api/auth/session')
            .then((respuesta) => respuesta.ok ? respuesta.json() : null)
            .then((datos) => setUsuario(datos?.usuario || null))
            .catch(() => setUsuario(null));
    }, []);

    const cerrarSesion = async () => {
        try { await fetch('/api/auth/logout', { method: 'POST' }); } finally { setUsuario(null); }
    };

    if (usuario === undefined) return <div className="auth-loading" role="status">Verificando acceso…</div>;
    if (!usuario) return <Login onLogin={setUsuario} />;

    return (
        <Routes>

             <Route
                path="/"
                element={
                    <MainLayout usuario={usuario} onLogout={cerrarSesion}>
                        <Dashboard />
                    </MainLayout>
                }
            />


            <Route
                path="/sucursales"
                element={
                    <MainLayout usuario={usuario} onLogout={cerrarSesion}>
                        <Sucursales />
                    </MainLayout>
                }
            />


            <Route
              path="/medicamentos"
              element={
                <MainLayout usuario={usuario} onLogout={cerrarSesion}>
                  <Medicamentos />
                </MainLayout>
              }
            />

            <Route
              path="/transferencias"
              element={
                <MainLayout usuario={usuario} onLogout={cerrarSesion}>
                  <Transferencias />
                </MainLayout>
              }
            />

            <Route
              path="/inventario"
              element={
                <MainLayout usuario={usuario} onLogout={cerrarSesion}>
                  <Inventario />
                </MainLayout>
              }
            />

            <Route
              path="/activos"
              element={
                <MainLayout usuario={usuario} onLogout={cerrarSesion}>
                  <Activos />
                </MainLayout>
              }
            />

            <Route
              path="/finanzas"
              element={
                <MainLayout usuario={usuario} onLogout={cerrarSesion}>
                  <Finanzas />
                </MainLayout>
              }
            />

            <Route
              path="/configuracion"
              element={
                <MainLayout usuario={usuario} onLogout={cerrarSesion}>
                  <Configuracion />
                </MainLayout>
              }
            />


                     path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>
    );
}

export default App;
