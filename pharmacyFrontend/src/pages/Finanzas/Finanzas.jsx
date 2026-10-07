import { useCallback, useEffect, useMemo, useState } from 'react';
import { AccountBalanceWalletRounded, ArrowDownwardRounded, ArrowUpwardRounded, SearchRounded } from '@mui/icons-material';
import './Finanzas.css';

const fechaLocalActual = () => {
    const ahora = new Date();
    ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
    return ahora.toISOString().slice(0, 16);
};

const nombreSucursal = (movimiento) => movimiento.sucursal?.Nombre_Sucursal || `Sucursal ${movimiento.ID_Sucursal}`;
const nombreUsuario = (movimiento) => [movimiento.usuario?.Nombre_Usuario, movimiento.usuario?.Apellido_Usuario].filter(Boolean).join(' ') || 'Usuario';
const formatoMoneda = (monto) => new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(Number(monto || 0));

function Finanzas() {
    const [sucursales, setSucursales] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [movimientos, setMovimientos] = useState([]);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState('');
    const [tipo, setTipo] = useState('INGRESO');
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
    const [concepto, setConcepto] = useState('');
    const [monto, setMonto] = useState('');
    const [fecha, setFecha] = useState(fechaLocalActual());
    const [busqueda, setBusqueda] = useState('');
    const [filtroSucursal, setFiltroSucursal] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('TODOS');
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const cargarDatos = useCallback(async () => {
        setCargando(true);
        setError('');
        try {
            const rutas = ['sucursales', 'usuarios', 'movimientos-financieros'];
            const respuestas = await Promise.all(rutas.map((ruta) => fetch(`/api/${ruta}`)));
            const fallida = respuestas.find((respuesta) => !respuesta.ok);
            if (fallida) throw new Error('No se pudieron cargar los movimientos financieros. Comprueba la conexión con el servidor.');
            const [sucursalesDatos, usuariosDatos, movimientosDatos] = await Promise.all(respuestas.map((respuesta) => respuesta.json()));
            const listaSucursales = Array.isArray(sucursalesDatos) ? sucursalesDatos : [];
            const listaUsuarios = Array.isArray(usuariosDatos) ? usuariosDatos : [];
            setSucursales(listaSucursales);
            setUsuarios(listaUsuarios);
            setMovimientos(Array.isArray(movimientosDatos) ? movimientosDatos : []);
            setSucursalSeleccionada((actual) => actual || String(listaSucursales[0]?.ID_Sucursal || ''));
            setFiltroSucursal((actual) => actual || String(listaSucursales[0]?.ID_Sucursal || ''));
        } catch (err) {
            setError(err.message || 'No fue posible cargar la información financiera.');
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => { cargarDatos(); }, [cargarDatos]);

    const usuariosSucursal = useMemo(() => usuarios.filter((usuario) => Number(usuario.ID_Sucursal ?? usuario.sucursal?.ID_Sucursal) === Number(sucursalSeleccionada)), [usuarios, sucursalSeleccionada]);
    useEffect(() => {
        if (!usuariosSucursal.some((usuario) => String(usuario.ID_Usuario) === usuarioSeleccionado)) {
            setUsuarioSeleccionado(String(usuariosSucursal[0]?.ID_Usuario || ''));
        }
    }, [usuariosSucursal, usuarioSeleccionado]);

    const movimientosFiltrados = useMemo(() => movimientos
        .filter((movimiento) => !filtroSucursal || Number(movimiento.ID_Sucursal ?? movimiento.sucursal?.ID_Sucursal) === Number(filtroSucursal))
        .filter((movimiento) => filtroTipo === 'TODOS' || movimiento.Tipo_Movimiento_Financiero === filtroTipo)
        .filter((movimiento) => `${movimiento.Concepto_Movimiento_Financiero || ''} ${nombreSucursal(movimiento)} ${nombreUsuario(movimiento)}`.toLocaleLowerCase().includes(busqueda.trim().toLocaleLowerCase()))
        .sort((a, b) => new Date(b.Fecha_Movimiento_Financiero) - new Date(a.Fecha_Movimiento_Financiero)), [movimientos, filtroSucursal, filtroTipo, busqueda]);

    const resumenSucursal = useMemo(() => movimientos.filter((movimiento) => Number(movimiento.ID_Sucursal ?? movimiento.sucursal?.ID_Sucursal) === Number(sucursalSeleccionada)), [movimientos, sucursalSeleccionada]);
    const totalIngresos = resumenSucursal.filter((movimiento) => movimiento.Tipo_Movimiento_Financiero === 'INGRESO').reduce((total, movimiento) => total + Number(movimiento.Monto_Movimiento_Financiero || 0), 0);
    const totalEgresos = resumenSucursal.filter((movimiento) => movimiento.Tipo_Movimiento_Financiero === 'EGRESO').reduce((total, movimiento) => total + Number(movimiento.Monto_Movimiento_Financiero || 0), 0);

    const registrarMovimiento = async (event) => {
        event.preventDefault();
        setError('');
        setExito('');
        if (!sucursalSeleccionada) return setError('Selecciona una sucursal.');
        if (!usuarioSeleccionado) return setError('No hay un usuario responsable disponible para la sucursal seleccionada.');
        if (!concepto.trim()) return setError('Escribe el concepto del movimiento.');
        if (!Number.isFinite(Number(monto)) || Number(monto) < 0) return setError('El monto debe ser un valor igual o mayor que cero.');
        if (!fecha || Number.isNaN(Date.parse(fecha))) return setError('Selecciona una fecha válida.');

        setGuardando(true);
        try {
            const respuesta = await fetch('/api/movimientos-financieros', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ID_Sucursal: Number(sucursalSeleccionada),
                    ID_Usuario: Number(usuarioSeleccionado),
                    Tipo_Movimiento_Financiero: tipo,
                    Concepto_Movimiento_Financiero: concepto.trim(),
                    Monto_Movimiento_Financiero: Number(monto),
                    Fecha_Movimiento_Financiero: new Date(fecha).toISOString()
                })
            });
            const datos = await respuesta.json();
            if (!respuesta.ok) throw new Error(datos.mensaje || datos.errores?.join(' ') || 'No se pudo registrar el movimiento financiero.');
            setExito(`${tipo === 'INGRESO' ? 'Ingreso' : 'Egreso'} registrado correctamente.`);
            setConcepto('');
            setMonto('');
            setFecha(fechaLocalActual());
            await cargarDatos();
        } catch (err) {
            setError(err.message || 'No se pudo registrar el movimiento financiero.');
        } finally {
            setGuardando(false);
        }
    };

    const fechaHora = (valor) => valor ? new Date(valor).toLocaleString('es-GT', { dateStyle: 'short', timeStyle: 'short' }) : '—';

    return (
        <main className="finanzas-page">
            <header className="finanzas-header">
                <div className="finanzas-header-icon"><AccountBalanceWalletRounded /></div>
                <div className="finanzas-header-copy"><span>CONTROL DE EFECTIVO</span><h1>Ingresos y egresos</h1><p>Registra movimientos de efectivo y consulta el historial por sucursal.</p></div>
            </header>

            {error && <div className="finanzas-alert error" role="alert">{error}<button type="button" onClick={cargarDatos}>Reintentar</button></div>}
            {exito && <div className="finanzas-alert success" role="status">{exito}</div>}

            <section className="finanzas-summary" aria-label="Resumen de la sucursal seleccionada">
                <article className="finanzas-stat"><span>Ingresos registrados</span><strong>{formatoMoneda(totalIngresos)}</strong><small>{sucursales.find((sucursal) => Number(sucursal.ID_Sucursal) === Number(sucursalSeleccionada))?.Nombre_Sucursal || 'Sucursal seleccionada'}</small></article>
                <article className="finanzas-stat"><span>Egresos registrados</span><strong>{formatoMoneda(totalEgresos)}</strong><small>{sucursales.find((sucursal) => Number(sucursal.ID_Sucursal) === Number(sucursalSeleccionada))?.Nombre_Sucursal || 'Sucursal seleccionada'}</small></article>
                <article className="finanzas-stat"><span>Balance neto</span><strong>{formatoMoneda(totalIngresos - totalEgresos)}</strong><small>Ingresos menos egresos</small></article>
            </section>

            <section className="finanzas-workspace">
                <article className="finanzas-card finanzas-form-card">
                    <div className="finanzas-card-heading"><div><span className="finanzas-overline">NUEVO MOVIMIENTO</span><h2>Registrar ingreso o egreso</h2></div><AccountBalanceWalletRounded /></div>
                    <form onSubmit={registrarMovimiento}>
                        <label className="finanzas-field">Sucursal<select required value={sucursalSeleccionada} onChange={(event) => setSucursalSeleccionada(event.target.value)}><option value="">Selecciona sucursal</option>{sucursales.map((sucursal) => <option key={sucursal.ID_Sucursal} value={sucursal.ID_Sucursal}>{sucursal.Nombre_Sucursal}</option>)}</select></label>
                        <div className="finanzas-type-toggle" role="group" aria-label="Tipo de movimiento"><button type="button" className={tipo === 'INGRESO' ? 'active' : ''} onClick={() => setTipo('INGRESO')}><ArrowDownwardRounded /> Ingreso</button><button type="button" className={tipo === 'EGRESO' ? 'active' : ''} onClick={() => setTipo('EGRESO')}><ArrowUpwardRounded /> Egreso</button></div>
                        <label className="finanzas-field">Concepto<input required maxLength="250" value={concepto} onChange={(event) => setConcepto(event.target.value)} placeholder={tipo === 'INGRESO' ? 'Ej. Venta de productos' : 'Ej. Pago de servicios'} /></label>
                        <div className="finanzas-form-row"><label className="finanzas-field">Monto (Q)<input required type="number" min="0" step="0.01" value={monto} onChange={(event) => setMonto(event.target.value)} placeholder="0.00" /></label><label className="finanzas-field">Fecha y hora<input required type="datetime-local" value={fecha} onChange={(event) => setFecha(event.target.value)} /></label></div>
                        <label className="finanzas-field">Responsable<select required value={usuarioSeleccionado} onChange={(event) => setUsuarioSeleccionado(event.target.value)}><option value="">Selecciona usuario</option>{usuariosSucursal.map((usuario) => <option key={usuario.ID_Usuario} value={usuario.ID_Usuario}>{usuario.Nombre_Usuario} {usuario.Apellido_Usuario}</option>)}</select></label>
                        <button className="finanzas-submit" type="submit" disabled={guardando || cargando || !sucursalSeleccionada || !usuariosSucursal.length}>{guardando ? 'Guardando…' : `Registrar ${tipo === 'INGRESO' ? 'ingreso' : 'egreso'}`}<span>→</span></button>
                    </form>
                </article>

                <article className="finanzas-card finanzas-history-card">
                    <div className="finanzas-card-heading"><div><span className="finanzas-overline">CONSULTA</span><h2>Movimientos registrados</h2><p>El historial es permanente y no permite editar ni borrar movimientos.</p></div><span className="finanzas-count">{movimientosFiltrados.length} registros</span></div>
                    <div className="finanzas-filters"><label className="finanzas-search"><SearchRounded /><input type="search" aria-label="Buscar movimientos" placeholder="Buscar concepto, sucursal o responsable…" value={busqueda} onChange={(event) => setBusqueda(event.target.value)} /></label><select aria-label="Filtrar por sucursal" value={filtroSucursal} onChange={(event) => setFiltroSucursal(event.target.value)}><option value="">Todas las sucursales</option>{sucursales.map((sucursal) => <option key={sucursal.ID_Sucursal} value={sucursal.ID_Sucursal}>{sucursal.Nombre_Sucursal}</option>)}</select><select aria-label="Filtrar por tipo" value={filtroTipo} onChange={(event) => setFiltroTipo(event.target.value)}><option value="TODOS">Todos los tipos</option><option value="INGRESO">Ingresos</option><option value="EGRESO">Egresos</option></select></div>
                    {cargando ? <div className="finanzas-empty">Cargando movimientos…</div> : movimientosFiltrados.length === 0 ? <div className="finanzas-empty">{busqueda || filtroSucursal || filtroTipo !== 'TODOS' ? 'No hay movimientos que coincidan con los filtros.' : 'Aún no hay movimientos registrados.'}</div> : <div className="finanzas-table-wrap"><table className="finanzas-table"><thead><tr><th>Fecha</th><th>Tipo</th><th>Concepto</th><th>Sucursal</th><th>Responsable</th><th>Monto</th></tr></thead><tbody>{movimientosFiltrados.map((movimiento) => <tr key={movimiento.ID_Movimiento_Financiero}><td>{fechaHora(movimiento.Fecha_Movimiento_Financiero)}</td><td><span className={`finanzas-tag ${movimiento.Tipo_Movimiento_Financiero === 'INGRESO' ? 'income' : 'expense'}`}>{movimiento.Tipo_Movimiento_Financiero}</span></td><td className="finanzas-concept">{movimiento.Concepto_Movimiento_Financiero}</td><td>{nombreSucursal(movimiento)}</td><td>{nombreUsuario(movimiento)}</td><td className={`finanzas-amount ${movimiento.Tipo_Movimiento_Financiero === 'INGRESO' ? 'income' : 'expense'}`}>{movimiento.Tipo_Movimiento_Financiero === 'INGRESO' ? '+' : '−'}{formatoMoneda(movimiento.Monto_Movimiento_Financiero)}</td></tr>)}</tbody></table></div>}
                </article>
            </section>
        </main>
    );
}

export default Finanzas;
