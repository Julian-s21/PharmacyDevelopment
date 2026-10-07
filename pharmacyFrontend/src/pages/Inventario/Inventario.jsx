import { useCallback, useEffect, useMemo, useState } from 'react';
import { AddRounded, ArrowDownwardRounded, ArrowUpwardRounded, Inventory2Rounded, RefreshRounded, SearchRounded, SwapVertRounded } from '@mui/icons-material';
import BusquedaSeleccion from '../../components/BusquedaSeleccion/BusquedaSeleccion';
import './Inventario.css';

const nombreMedicamento = (medicamento) => medicamento?.Nombre_Medicamento || medicamento?.medicamento?.Nombre_Medicamento || `Medicamento ${medicamento?.ID_Medicamento ?? ''}`;
const fechaHora = (fecha) => fecha ? new Date(fecha).toLocaleString() : '—';

function Inventario() {
    const [sucursales, setSucursales] = useState([]);
    const [medicamentos, setMedicamentos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [inventarios, setInventarios] = useState([]);
    const [movimientos, setMovimientos] = useState([]);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState('');
    const [tipo, setTipo] = useState('ENTRADA');
    const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState('');
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [observacion, setObservacion] = useState('');
    const [busquedaInventario, setBusquedaInventario] = useState('');
    const [busquedaMovimientos, setBusquedaMovimientos] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('TODOS');
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const cargarDatos = useCallback(async () => {
        setCargando(true);
        setError('');
        try {
            const endpoints = ['sucursales', 'medicamentos', 'usuarios', 'inventarios', 'movimientos-inventario'];
            const respuestas = await Promise.all(endpoints.map((endpoint) => fetch(`/api/${endpoint}`)));
            const respuestaFallida = respuestas.find((respuesta) => !respuesta.ok);
            if (respuestaFallida) throw new Error('No fue posible cargar el inventario. Comprueba que el servidor esté disponible.');
            const [sucursalesDatos, medicamentosDatos, usuariosDatos, inventariosDatos, movimientosDatos] = await Promise.all(respuestas.map((respuesta) => respuesta.json()));
            const sucursalesLista = Array.isArray(sucursalesDatos) ? sucursalesDatos : [];
            setSucursales(sucursalesLista);
            setMedicamentos(Array.isArray(medicamentosDatos) ? medicamentosDatos : []);
            setUsuarios(Array.isArray(usuariosDatos) ? usuariosDatos : []);
            setInventarios(Array.isArray(inventariosDatos) ? inventariosDatos : []);
            setMovimientos(Array.isArray(movimientosDatos) ? movimientosDatos : []);
            setSucursalSeleccionada((actual) => actual || String(sucursalesLista[0]?.ID_Sucursal || ''));
            setUsuarioSeleccionado((actual) => actual || String(usuariosDatos?.[0]?.ID_Usuario || ''));
        } catch (err) {
            setError(err.message || 'No fue posible cargar la información.');
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => { cargarDatos(); }, [cargarDatos]);

    const inventarioSucursal = useMemo(() => inventarios.filter((item) => Number(item.ID_Sucursal ?? item.sucursal?.ID_Sucursal) === Number(sucursalSeleccionada)), [inventarios, sucursalSeleccionada]);
    const obtenerRegistro = useCallback((idMedicamento) => inventarioSucursal.find((item) => Number(item.ID_Medicamento ?? item.medicamento?.ID_Medicamento) === Number(idMedicamento)), [inventarioSucursal]);
    const obtenerStock = useCallback((idMedicamento) => Number(obtenerRegistro(idMedicamento)?.Cantidad_Inventario ?? 0), [obtenerRegistro]);
    const totalUnidades = inventarioSucursal.reduce((total, item) => total + Number(item.Cantidad_Inventario || 0), 0);
    const medicamentosConExistencia = medicamentos.filter((medicamento) => obtenerStock(medicamento.ID_Medicamento) > 0).length;
    const medicamentosAgotados = medicamentos.filter((medicamento) => obtenerStock(medicamento.ID_Medicamento) <= 0).length;

    const medicamentosInventarioFiltrados = useMemo(() => {
        const termino = busquedaInventario.trim().toLocaleLowerCase();
        return medicamentos.filter((medicamento) => `${nombreMedicamento(medicamento)} ${medicamento.Codigo_Medicamento || ''} ${medicamento.categoria?.Nombre_Categoria || medicamento.Nombre_Categoria || ''}`.toLocaleLowerCase().includes(termino));
    }, [medicamentos, busquedaInventario]);

    const movimientosSucursal = useMemo(() => movimientos
        .filter((movimiento) => Number(movimiento.inventario?.ID_Sucursal ?? movimiento.inventario?.sucursal?.ID_Sucursal) === Number(sucursalSeleccionada))
        .filter((movimiento) => filtroTipo === 'TODOS' || movimiento.Tipo_Movimiento_Inventario?.toUpperCase() === filtroTipo)
        .filter((movimiento) => `${nombreMedicamento(movimiento.inventario)} ${movimiento.Observacion_Movimiento_Inventario || ''} ${movimiento.usuario?.Nombre_Usuario || ''} ${movimiento.usuario?.Apellido_Usuario || ''}`.toLocaleLowerCase().includes(busquedaMovimientos.trim().toLocaleLowerCase()))
        .sort((a, b) => new Date(b.Fecha_Movimiento_Inventario) - new Date(a.Fecha_Movimiento_Inventario)), [movimientos, sucursalSeleccionada, filtroTipo, busquedaMovimientos]);

    const opcionesMedicamento = useMemo(
        () => medicamentos.filter((medicamento) => tipo === 'ENTRADA' || obtenerStock(medicamento.ID_Medicamento) > 0),
        [medicamentos, tipo, obtenerStock]
    );

    const registrarMovimiento = async (event) => {
        event.preventDefault();
        setError('');
        setExito('');
        const cantidadNumerica = Number(cantidad);
        if (!sucursalSeleccionada) return setError('Selecciona una sucursal.');
        if (!medicamentoSeleccionado) return setError('Selecciona un medicamento.');
        if (!Number.isInteger(cantidadNumerica) || cantidadNumerica <= 0) return setError('La cantidad debe ser un número entero mayor que cero.');
        if (!usuarioSeleccionado) return setError(usuarios.length ? 'Selecciona el usuario responsable.' : 'Registra un usuario antes de crear movimientos de inventario.');
        if (tipo === 'SALIDA' && cantidadNumerica > obtenerStock(medicamentoSeleccionado)) return setError(`No hay suficiente existencia. Disponible: ${obtenerStock(medicamentoSeleccionado)} unidades.`);

        setGuardando(true);
        try {
            let inventario = obtenerRegistro(medicamentoSeleccionado);
            if (!inventario) {
                if (tipo === 'SALIDA') throw new Error('Este medicamento no tiene inventario en la sucursal seleccionada. Registra una entrada primero.');
                const respuestaInventario = await fetch('/api/inventarios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ID_Medicamento: Number(medicamentoSeleccionado), ID_Sucursal: Number(sucursalSeleccionada), Cantidad_Inventario: 0 })
                });
                const inventarioDatos = await respuestaInventario.json();
                if (!respuestaInventario.ok) throw new Error(inventarioDatos.mensaje || 'No se pudo preparar el inventario para este medicamento.');
                inventario = inventarioDatos;
            }

            const respuesta = await fetch('/api/movimientos-inventario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ID_Inventario: Number(inventario.ID_Inventario),
                    ID_Usuario: Number(usuarioSeleccionado),
                    Tipo_Movimiento_Inventario: tipo,
                    Cantidad_Movimiento_Inventario: cantidadNumerica,
                    Fecha_Movimiento_Inventario: new Date().toISOString(),
                    Observacion_Movimiento_Inventario: observacion.trim() || null
                })
            });
            const datos = await respuesta.json();
            if (!respuesta.ok) throw new Error(datos.mensaje || datos.message || 'No se pudo registrar el movimiento.');

            setExito(`${tipo === 'ENTRADA' ? 'Entrada' : 'Salida'} registrada. Las existencias se actualizaron.`);
            setCantidad('');
            setObservacion('');
            setMedicamentoSeleccionado('');
            setBusquedaInventario('');
            await cargarDatos();
        } catch (err) {
            setError(err.message || 'No se pudo registrar el movimiento.');
        } finally {
            setGuardando(false);
        }
    };

    return (
        <main className="inventario-page">
            <header className="inventario-header">
                <div className="inventario-header-icon"><Inventory2Rounded /></div>
                <div className="inventario-header-copy"><span>CONTROL DE EXISTENCIAS</span><h1>Inventario</h1><p>Registra entradas y salidas, y consulta los movimientos por sucursal.</p></div>
                <button className="inventario-refresh" type="button" onClick={cargarDatos} disabled={cargando} aria-label="Actualizar inventario"><RefreshRounded /> Actualizar</button>
            </header>

            {error && <div className="inventario-alert inventario-alert-error" role="alert">{error}<button type="button" onClick={cargarDatos}>Reintentar</button></div>}
            {exito && <div className="inventario-alert inventario-alert-success" role="status">{exito}</div>}

            <section className="inventario-workspace">
                <article className="inventario-card inventario-movement-card">
                    <div className="inventario-card-heading"><div><span className="inventario-overline">OPERACIÓN</span><h2>Registrar movimiento</h2></div><SwapVertRounded /></div>
                    <form onSubmit={registrarMovimiento}>
                        <label className="inventario-field">Sucursal<select value={sucursalSeleccionada} onChange={(event) => { setSucursalSeleccionada(event.target.value); setMedicamentoSeleccionado(''); setCantidad(''); }} required><option value="">Selecciona sucursal</option>{sucursales.map((sucursal) => <option key={sucursal.ID_Sucursal} value={sucursal.ID_Sucursal}>{sucursal.Nombre_Sucursal}</option>)}</select></label>
                        <div className="inventario-type-toggle" role="group" aria-label="Tipo de movimiento">
                            <button className={tipo === 'ENTRADA' ? 'active' : ''} type="button" onClick={() => { setTipo('ENTRADA'); setMedicamentoSeleccionado(''); }}><ArrowDownwardRounded /> Entrada</button>
                            <button className={tipo === 'SALIDA' ? 'active' : ''} type="button" onClick={() => { setTipo('SALIDA'); setMedicamentoSeleccionado(''); }}><ArrowUpwardRounded /> Salida</button>
                        </div>
                        <BusquedaSeleccion
                            label="Medicamento"
                            placeholder={sucursalSeleccionada ? 'Buscar medicamento…' : 'Selecciona primero una sucursal'}
                            options={sucursalSeleccionada ? opcionesMedicamento : []}
                            value={medicamentos.find((medicamento) => Number(medicamento.ID_Medicamento) === Number(medicamentoSeleccionado)) || null}
                            getOptionLabel={nombreMedicamento}
                            getOptionKey={(medicamento) => medicamento.ID_Medicamento}
                            getOptionMeta={(medicamento) => `${obtenerStock(medicamento.ID_Medicamento)} unidades en stock`}
                            emptyMessage={!sucursalSeleccionada ? 'Primero selecciona una sucursal' : tipo === 'SALIDA' ? 'No hay medicamentos con existencia' : 'No hay medicamentos que coincidan'}
                            onChange={(medicamento) => setMedicamentoSeleccionado(medicamento ? String(medicamento.ID_Medicamento) : '')}
                        />
                        {medicamentoSeleccionado && <div className="inventario-stock-hint">Stock actual en esta sucursal <strong>{obtenerStock(medicamentoSeleccionado)} unidades</strong></div>}
                        <div className="inventario-form-row">
                            <label className="inventario-field">Cantidad<input type="number" min="1" step="1" max={tipo === 'SALIDA' && medicamentoSeleccionado ? obtenerStock(medicamentoSeleccionado) : undefined} value={cantidad} onChange={(event) => setCantidad(event.target.value)} placeholder="0" required /></label>
                            <label className="inventario-field">Responsable<select value={usuarioSeleccionado} onChange={(event) => setUsuarioSeleccionado(event.target.value)} required><option value="">Selecciona usuario</option>{usuarios.map((usuario) => <option key={usuario.ID_Usuario} value={usuario.ID_Usuario}>{usuario.Nombre_Usuario} {usuario.Apellido_Usuario}</option>)}</select></label>
                        </div>
                        <label className="inventario-field">Observación <span className="inventario-optional">Opcional</span><textarea value={observacion} onChange={(event) => setObservacion(event.target.value)} rows="2" maxLength="500" placeholder="Motivo o detalle del movimiento…" /></label>
                        <button className="inventario-submit" type="submit" disabled={guardando || cargando || !sucursalSeleccionada || !usuarios.length}>{guardando ? 'Guardando…' : `Registrar ${tipo === 'ENTRADA' ? 'entrada' : 'salida'}`}<span>→</span></button>
                    </form>
                </article>

                <article className="inventario-card inventario-overview-card">
                    <div className="inventario-card-heading"><div><span className="inventario-overline">CONSULTA</span><h2>Existencias por sucursal</h2></div><span className="inventario-branch-count">{inventarioSucursal.length} registros</span></div>
                    <div className="inventario-search"><SearchRounded /><input type="search" value={busquedaInventario} onChange={(event) => setBusquedaInventario(event.target.value)} placeholder="Buscar medicamento o código…" aria-label="Buscar existencias" /></div>
                    {!sucursalSeleccionada ? <div className="inventario-empty">Selecciona una sucursal para consultar su inventario.</div> : cargando ? <div className="inventario-empty">Cargando existencias…</div> : <div className="inventario-stock-list">{medicamentosInventarioFiltrados.map((medicamento) => {
                        const stock = obtenerStock(medicamento.ID_Medicamento);
                        return <div className="inventario-stock-row" key={medicamento.ID_Medicamento}><div className="inventario-product-monogram">{nombreMedicamento(medicamento).charAt(0).toUpperCase()}</div><div className="inventario-stock-name"><strong>{nombreMedicamento(medicamento)}</strong><small>{medicamento.Codigo_Medicamento || 'Sin código'} · {medicamento.categoria?.Nombre_Categoria || medicamento.Nombre_Categoria || 'Sin categoría'}</small></div><div className={`inventario-stock-value ${stock === 0 ? 'is-zero' : ''}`}><strong>{stock}</strong><small>{stock === 1 ? 'unidad' : 'unidades'}</small></div></div>;
                    })}{medicamentosInventarioFiltrados.length === 0 && <div className="inventario-empty">No hay medicamentos que coincidan con la búsqueda.</div>}</div>}
                </article>
            </section>

            <section className="inventario-summary" aria-label="Resumen de sucursal">
                <article className="inventario-stat"><span>Total de unidades</span><strong>{totalUnidades}</strong><small>{sucursales.find((sucursal) => Number(sucursal.ID_Sucursal) === Number(sucursalSeleccionada))?.Nombre_Sucursal || 'Sucursal seleccionada'}</small></article>
                <article className="inventario-stat"><span>Medicamentos con stock</span><strong>{medicamentosConExistencia}</strong><small>Referencias disponibles</small></article>
                <article className="inventario-stat"><span>Sin existencia</span><strong>{medicamentosAgotados}</strong><small>Referencias agotadas</small></article>
                <article className="inventario-stat"><span>Movimientos consultados</span><strong>{movimientosSucursal.length}</strong><small>Según filtros activos</small></article>
            </section>

            <section className="inventario-card inventario-history-card">
                <div className="inventario-card-heading"><div><span className="inventario-overline">HISTORIAL</span><h2>Movimientos de la sucursal</h2><p>Entradas, salidas y movimientos creados por transferencias.</p></div></div>
                <div className="inventario-history-filters"><label className="inventario-search"><SearchRounded /><input type="search" value={busquedaMovimientos} onChange={(event) => setBusquedaMovimientos(event.target.value)} placeholder="Buscar medicamento, usuario u observación…" aria-label="Buscar movimientos" /></label><select value={filtroTipo} onChange={(event) => setFiltroTipo(event.target.value)} aria-label="Filtrar movimientos"><option value="TODOS">Todos los movimientos</option><option value="ENTRADA">Entradas</option><option value="SALIDA">Salidas</option></select></div>
                {!sucursalSeleccionada ? <div className="inventario-empty">Selecciona una sucursal para ver sus movimientos.</div> : cargando ? <div className="inventario-empty">Cargando movimientos…</div> : movimientosSucursal.length === 0 ? <div className="inventario-empty">No hay movimientos que coincidan con los filtros.</div> : <div className="inventario-table-wrap"><table className="inventario-table"><thead><tr><th>Tipo</th><th>Medicamento</th><th>Cantidad</th><th>Responsable</th><th>Fecha</th><th>Observación</th></tr></thead><tbody>{movimientosSucursal.map((movimiento) => <tr key={movimiento.ID_Movimiento_Inventario}><td><span className={`inventario-movement-tag ${movimiento.Tipo_Movimiento_Inventario?.toUpperCase() === 'ENTRADA' ? 'is-entry' : 'is-exit'}`}>{movimiento.Tipo_Movimiento_Inventario}</span></td><td>{nombreMedicamento(movimiento.inventario)}</td><td className="inventario-quantity">{movimiento.Cantidad_Movimiento_Inventario}</td><td>{[movimiento.usuario?.Nombre_Usuario, movimiento.usuario?.Apellido_Usuario].filter(Boolean).join(' ') || '—'}</td><td>{fechaHora(movimiento.Fecha_Movimiento_Inventario)}</td><td>{movimiento.Observacion_Movimiento_Inventario || '—'}</td></tr>)}</tbody></table></div>}
            </section>
        </main>
    );
}

export default Inventario;
