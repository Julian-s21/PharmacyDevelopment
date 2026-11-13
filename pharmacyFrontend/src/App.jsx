/*import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
*/


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

            {/* DASHBOARD */}

            <Route
                path="/"
                element={
                    <MainLayout usuario={usuario} onLogout={cerrarSesion}>
                        <Dashboard />
                    </MainLayout>
                }
            />


            {/* SUCURSALES */}

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
            

            {/* REDIRECCIÓN POR DEFECTO */}
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>
    );
}

export default App;
