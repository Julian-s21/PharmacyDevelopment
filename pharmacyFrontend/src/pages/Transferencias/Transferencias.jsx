import { useCallback, useEffect, useMemo, useState } from 'react';
import { AddRounded, CloseRounded, DeleteOutlineRounded, EditRounded, SwapHorizRounded } from '@mui/icons-material';
import BusquedaSeleccion from '../../components/BusquedaSeleccion/BusquedaSeleccion';
import './Transferencias.css';

const hoy = () => new Date().toISOString().slice(0, 10);
const nombreSucursal = (item) => item?.Nombre_Sucursal || item?.sucursal?.Nombre_Sucursal || `Sucursal ${item?.ID_Sucursal ?? ''}`;
const nombreMedicamento = (item) => item?.Nombre_Medicamento || item?.medicamento?.Nombre_Medicamento || `Medicamento ${item?.ID_Medicamento ?? ''}`;
const fechaCorta = (value) => value ? new Date(value).toLocaleString() : '—';

function Transferencias() {
    const [sucursales, setSucursales] = useState([]);
    const [medicamentos, setMedicamentos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [inventario, setInventario] = useState([]);
    const [transferencias, setTransferencias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorCarga, setErrorCarga] = useState('');
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtroSucursal, setFiltroSucursal] = useState('');
    const [form, setForm] = useState({ origen: '', destino: '', usuario: '', fecha: hoy() });
    const [lineas, setLineas] = useState([{ medicamento: '', cantidad: '' }]);
    const [transferenciaEditando, setTransferenciaEditando] = useState(null);
    const [lineasEdicion, setLineasEdicion] = useState([]);
    const [errorEdicion, setErrorEdicion] = useState('');
    const [guardandoEdicion, setGuardandoEdicion] = useState(false);
    const [confirmandoEliminacion, setConfirmandoEliminacion] = useState(null);
    const [eliminando, setEliminando] = useState(false);

    const cargarDatos = useCallback(async () => {
        setCargando(true);
        setErrorCarga('');
        try {
            const endpoints = ['sucursales', 'medicamentos', 'usuarios', 'inventarios', 'transferencias'];
            const respuestas = await Promise.all(endpoints.map((endpoint) => fetch(`/api/${endpoint}`)));
            const fallida = respuestas.find((respuesta) => !respuesta.ok);
            if (fallida) throw new Error('No se pudo cargar la información de transferencias. Verifica la conexión con el servidor.');
            const [suc, meds, users, stock, moves] = await Promise.all(respuestas.map((respuesta) => respuesta.json()));
            setSucursales(Array.isArray(suc) ? suc : []);
            setMedicamentos(Array.isArray(meds) ? meds : []);
            setUsuarios(Array.isArray(users) ? users : []);
            setInventario(Array.isArray(stock) ? stock : []);
            setTransferencias(Array.isArray(moves) ? moves : []);
        } catch (err) {
            setErrorCarga(err.message || 'No fue posible cargar los datos.');
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => { cargarDatos(); }, [cargarDatos]);

    const existenciasOrigen = (idMedicamento) => {
        const registro = inventario.find((item) => Number(item.ID_Sucursal ?? item.sucursal?.ID_Sucursal) === Number(form.origen)
            && Number(item.ID_Medicamento ?? item.medicamento?.ID_Medicamento) === Number(idMedicamento));
        return Number(registro?.Cantidad_Inventario ?? 0);
    };

    const existenciasReversibles = (transferencia, idMedicamento) => {
        const existenciaActual = Number(inventario.find((item) => Number(item.ID_Sucursal ?? item.sucursal?.ID_Sucursal) === Number(transferencia.ID_Sucursal_Origen)
            && Number(item.ID_Medicamento ?? item.medicamento?.ID_Medicamento) === Number(idMedicamento))?.Cantidad_Inventario ?? 0);
        const cantidadTransferida = (transferencia.detalles || []).filter((detalle) => Number(detalle.ID_Medicamento) === Number(idMedicamento))
            .reduce((total, detalle) => total + Number(detalle.Cantidad_Transferencia), 0);
        return existenciaActual + cantidadTransferida;
    };

    const medicamentosEdicionPara = (index) => medicamentos.filter((medicamento) => {
        const idMedicamento = Number(medicamento.ID_Medicamento);
        const tieneStock = transferenciaEditando && existenciasReversibles(transferenciaEditando, idMedicamento) > 0;
        const repetido = lineasEdicion.some((linea, lineaIndex) => lineaIndex !== index && Number(linea.medicamento) === idMedicamento);
        return tieneStock && !repetido;
    });

    const medicamentosDisponibles = useMemo(() => {
        if (!form.origen) return [];
        const idsDisponibles = new Set(inventario
            .filter((item) => Number(item.ID_Sucursal ?? item.sucursal?.ID_Sucursal) === Number(form.origen)
                && Number(item.Cantidad_Inventario) > 0)
            .map((item) => Number(item.ID_Medicamento ?? item.medicamento?.ID_Medicamento)));
        return medicamentos.filter((medicamento) => idsDisponibles.has(Number(medicamento.ID_Medicamento)));
    }, [form.origen, inventario, medicamentos]);

    const cantidadesPorMedicamento = useMemo(() => lineas.reduce((acc, linea) => {
        if (linea.medicamento) acc[linea.medicamento] = (acc[linea.medicamento] || 0) + Number(linea.cantidad || 0);
        return acc;
    }, {}), [lineas]);

    const actualizarLinea = (index, campo, valor) => setLineas((actuales) => actuales.map((linea, i) => i === index ? { ...linea, [campo]: valor } : linea));
    const agregarLinea = () => setLineas((actuales) => [...actuales, { medicamento: '', cantidad: '' }]);
    const quitarLinea = (index) => setLineas((actuales) => actuales.length === 1 ? [{ medicamento: '', cantidad: '' }] : actuales.filter((_, i) => i !== index));

    const iniciarEdicion = (transferencia) => {
        setError('');
        setErrorEdicion('');
        setExito('');
        setTransferenciaEditando(transferencia);
        setLineasEdicion((transferencia.detalles || []).map((detalle) => ({
            medicamento: String(detalle.ID_Medicamento),
            cantidad: String(detalle.Cantidad_Transferencia)
        })));
    };

    const guardarEdicion = async (event) => {
        event.preventDefault();
        if (!transferenciaEditando) return;
        const detalles = lineasEdicion.map((linea) => ({
            ID_Medicamento: Number(linea.medicamento),
            Cantidad_Transferencia: Number(linea.cantidad)
        }));
        if (!detalles.length || detalles.some((detalle) => !detalle.ID_Medicamento || !Number.isInteger(detalle.Cantidad_Transferencia) || detalle.Cantidad_Transferencia <= 0)) {
            setErrorEdicion('Agrega medicamentos con cantidades enteras mayores que cero.');
            return;
        }
        if (new Set(detalles.map((detalle) => detalle.ID_Medicamento)).size !== detalles.length) {
            setErrorEdicion('Cada medicamento debe aparecer una sola vez.');
            return;
        }
        const insuficiente = detalles.find((detalle) => detalle.Cantidad_Transferencia > existenciasReversibles(transferenciaEditando, detalle.ID_Medicamento));
        if (insuficiente) {
            setErrorEdicion(`Existencia insuficiente de ${nombreMedicamento(medicamentos.find((med) => Number(med.ID_Medicamento) === insuficiente.ID_Medicamento))}.`);
            return;
        }

        setError('');
        setErrorEdicion('');
        setGuardandoEdicion(true);
        try {
            const respuesta = await fetch(`/api/transferencias/${transferenciaEditando.ID_Transferencia}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ detalles })
            });
            const datos = await respuesta.json();
            if (!respuesta.ok) throw new Error(datos.mensaje || 'No se pudo editar la transferencia.');
            setTransferenciaEditando(null);
            setExito('Transferencia actualizada. Las existencias y los movimientos quedaron ajustados.');
            await cargarDatos();
        } catch (err) {
            setErrorEdicion(err.message || 'No se pudo editar la transferencia.');
        } finally {
            setGuardandoEdicion(false);
        }
    };

    const eliminarTransferencia = async () => {
        if (!confirmandoEliminacion) return;
        setEliminando(true);
        setError('');
        try {
            const respuesta = await fetch(`/api/transferencias/${confirmandoEliminacion.ID_Transferencia}`, { method: 'DELETE' });
            const datos = await respuesta.json();
            if (!respuesta.ok) throw new Error(datos.mensaje || 'No se pudo eliminar la transferencia.');
            setConfirmandoEliminacion(null);
            setExito('Transferencia eliminada y existencias revertidas.');
            await cargarDatos();
        } catch (err) {
            setConfirmandoEliminacion(null);
            setError(err.message || 'No se pudo eliminar la transferencia.');
        } finally {
            setEliminando(false);
        }
    };

    const registrarTransferencia = async (event) => {
        event.preventDefault();
        setError('');
        setExito('');
        if (!form.origen || !form.destino || !form.usuario || !form.fecha) return setError('Completa sucursal de origen, destino, usuario y fecha.');
        if (Number(form.origen) === Number(form.destino)) return setError('La sucursal de origen y destino deben ser diferentes.');
        const detalles = lineas.map((linea) => ({ ID_Medicamento: Number(linea.medicamento), Cantidad_Transferencia: Number(linea.cantidad) }));
        if (!detalles.length || detalles.some((detalle) => !detalle.ID_Medicamento || !Number.isInteger(detalle.Cantidad_Transferencia) || detalle.Cantidad_Transferencia <= 0)) return setError('Agrega medicamentos con cantidades enteras mayores que cero.');
        if (new Set(detalles.map((detalle) => detalle.ID_Medicamento)).size !== detalles.length) return setError('Cada medicamento debe aparecer una sola vez.');
        const insuficiente = detalles.find((detalle) => detalle.Cantidad_Transferencia > existenciasOrigen(detalle.ID_Medicamento));
        if (insuficiente) return setError(`Existencia insuficiente de ${nombreMedicamento(medicamentos.find((med) => Number(med.ID_Medicamento) === insuficiente.ID_Medicamento))}: disponibles ${existenciasOrigen(insuficiente.ID_Medicamento)}.`);

        setGuardando(true);
        try {
            const respuesta = await fetch('/api/transferencias/completa', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ID_Sucursal_Origen: Number(form.origen), ID_Sucursal_Destino: Number(form.destino), ID_Usuario: Number(form.usuario), Fecha_Transferencia: new Date(`${form.fecha}T12:00:00`).toISOString(), detalles })
            });
            const datos = await respuesta.json();
            if (!respuesta.ok) throw new Error(datos.mensaje || 'No se pudo registrar la transferencia.');
            setExito(datos.mensaje || 'Transferencia registrada correctamente. Las existencias se actualizaron.');
            setForm((actual) => ({ ...actual, fecha: hoy() }));
            setLineas([{ medicamento: '', cantidad: '' }]);
            await cargarDatos();
        } catch (err) {
            setError(err.message || 'No se pudo registrar la transferencia.');
        } finally {
            setGuardando(false);
        }
    };

    const transferenciasFiltradas = useMemo(() => transferencias.filter((item) => {
        const origen = nombreSucursal(item.sucursalOrigen);
        const destino = nombreSucursal(item.sucursalDestino);
        const texto = `${item.ID_Transferencia} ${origen} ${destino} ${item.detalles?.map(nombreMedicamento).join(' ') || ''}`.toLowerCase();
        return texto.includes(busqueda.toLowerCase()) && (!filtroSucursal || Number(item.ID_Sucursal_Origen) === Number(filtroSucursal) || Number(item.ID_Sucursal_Destino) === Number(filtroSucursal));
    }), [transferencias, busqueda, filtroSucursal]);

    return (
        <main className="transferencias-page">
            <header className="transferencias-header">
                <div className="transferencias-heading-icon"><SwapHorizRounded /></div>
                <div><span className="transferencias-eyebrow">OPERACIONES DE INVENTARIO</span><h1>Transferencias</h1><p>Envía medicamentos entre sucursales y consulta el historial de movimientos.</p></div>
            </header>

            {errorCarga && <div className="transferencias-alert error" role="alert">{errorCarga} <button type="button" onClick={cargarDatos}>Reintentar</button></div>}
            {error && <div className="transferencias-alert error" role="alert">{error}</div>}
            {exito && <div className="transferencias-alert success" role="status">{exito}</div>}

            <section className="transferencias-card">
                <div className="transferencias-card-title"><div><span className="transferencias-eyebrow">NUEVO MOVIMIENTO</span><h2>Registrar transferencia</h2></div><span className="transferencias-step">Origen → destino</span></div>
                <form onSubmit={registrarTransferencia}>
                    <div className="transferencias-fields">
                        <BusquedaSeleccion
                            label="Sucursal de origen"
                            placeholder="Buscar sucursal de origen…"
                            options={sucursales}
                            value={sucursales.find((s) => Number(s.ID_Sucursal) === Number(form.origen)) || null}
                            getOptionLabel={nombreSucursal}
                            getOptionKey={(s) => s.ID_Sucursal}
                            emptyMessage="No encontramos esa sucursal"
                            onChange={(sucursal) => { setForm({ ...form, origen: sucursal?.ID_Sucursal || '', destino: Number(sucursal?.ID_Sucursal) === Number(form.destino) ? '' : form.destino }); setLineas([{ medicamento: '', cantidad: '' }]); }}
                        />
                        <BusquedaSeleccion
                            label="Sucursal de destino"
                            placeholder="Buscar sucursal de destino…"
                            options={sucursales.filter((s) => Number(s.ID_Sucursal) !== Number(form.origen))}
                            value={sucursales.find((s) => Number(s.ID_Sucursal) === Number(form.destino)) || null}
                            getOptionLabel={nombreSucursal}
                            getOptionKey={(s) => s.ID_Sucursal}
                            emptyMessage={form.origen ? 'No hay otras sucursales disponibles' : 'No encontramos esa sucursal'}
                            onChange={(sucursal) => setForm({ ...form, destino: sucursal?.ID_Sucursal || '' })}
                        />
                        <label>Responsable<select value={form.usuario} onChange={(e) => setForm({ ...form, usuario: e.target.value })} required><option value="">Selecciona usuario</option>{usuarios.map((u) => <option key={u.ID_Usuario} value={u.ID_Usuario}>{[u.Nombre_Usuario, u.Apellido_Usuario].filter(Boolean).join(' ') || `Usuario ${u.ID_Usuario}`}</option>)}</select></label>
                        <label>Fecha<input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} required /></label>
                    </div>
                    <div className="transferencias-items-heading"><div><h3>Medicamentos</h3><p>{form.origen ? 'Solo se muestran medicamentos con existencias en la sucursal de origen.' : 'Selecciona la sucursal de origen para consultar su inventario.'}</p></div><button className="transferencias-secondary" type="button" onClick={agregarLinea} disabled={!form.origen || !medicamentosDisponibles.length}><AddRounded /> Agregar medicamento</button></div>
                    {form.origen && medicamentosDisponibles.length === 0 && <p className="transferencias-no-stock">La sucursal seleccionada no tiene medicamentos disponibles para transferir.</p>}
                    <div className="transferencias-lines">
                        {lineas.map((linea, index) => {
                            const stock = linea.medicamento ? existenciasOrigen(linea.medicamento) : null;
                            const comprometido = linea.medicamento ? cantidadesPorMedicamento[linea.medicamento] || 0 : 0;
                            return <div className="transferencias-line" key={index}>
                                <BusquedaSeleccion
                                    label="Medicamento"
                                    placeholder={form.origen ? 'Buscar medicamento…' : 'Selecciona sucursal de origen'}
                                    options={medicamentosDisponibles.filter((m) => !lineas.some((otra, i) => i !== index && Number(otra.medicamento) === Number(m.ID_Medicamento)))}
                                    value={medicamentosDisponibles.find((m) => Number(m.ID_Medicamento) === Number(linea.medicamento)) || null}
                                    getOptionLabel={nombreMedicamento}
                                    getOptionKey={(m) => m.ID_Medicamento}
                                    getOptionMeta={(m) => `${existenciasOrigen(m.ID_Medicamento)} unidades disponibles`}
                                    emptyMessage={form.origen ? 'No hay coincidencias con existencias' : 'Primero selecciona la sucursal de origen'}
                                    onChange={(medicamento) => actualizarLinea(index, 'medicamento', medicamento?.ID_Medicamento || '')}
                                />
                                <label>Cantidad<input type="number" min="1" step="1" value={linea.cantidad} onChange={(e) => actualizarLinea(index, 'cantidad', e.target.value)} placeholder="0" required /></label>
                                <div className={`transferencias-stock ${stock !== null && comprometido > stock ? 'stock-low' : ''}`}>Disponible <strong>{stock ?? '—'}</strong></div>
                                <button className="transferencias-icon-button" type="button" onClick={() => quitarLinea(index)} aria-label="Quitar medicamento"><DeleteOutlineRounded /></button>
                            </div>;
                        })}
                    </div>
                    <div className="transferencias-form-footer"><span>Al confirmar se descontará el origen y se sumará al destino.</span><button className="transferencias-primary" type="submit" disabled={guardando || cargando || !sucursales.length || !usuarios.length}>{guardando ? 'Registrando…' : 'Confirmar transferencia'}</button></div>
                </form>
            </section>

            <section className="transferencias-card transferencias-history">
                <div className="transferencias-card-title"><div><span className="transferencias-eyebrow">REGISTRO</span><h2>Transferencias realizadas</h2></div><span className="transferencias-count">{transferenciasFiltradas.length} registros</span></div>
                <div className="transferencias-filters"><input type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar sucursal o medicamento…" aria-label="Buscar transferencias"/><select value={filtroSucursal} onChange={(e) => setFiltroSucursal(e.target.value)} aria-label="Filtrar por sucursal"><option value="">Todas las sucursales</option>{sucursales.map((s) => <option key={s.ID_Sucursal} value={s.ID_Sucursal}>{nombreSucursal(s)}</option>)}</select></div>
                {cargando ? <div className="transferencias-empty">Cargando transferencias…</div> : transferenciasFiltradas.length === 0 ? <div className="transferencias-empty">No hay transferencias que coincidan con la búsqueda.</div> : <div className="transferencias-table-wrap"><table className="transferencias-table"><thead><tr><th>#</th><th>Origen</th><th>Destino</th><th>Medicamentos</th><th>Responsable</th><th>Fecha</th><th>Acciones</th></tr></thead><tbody>{transferenciasFiltradas.map((item) => <tr key={item.ID_Transferencia}><td>TR-{item.ID_Transferencia}</td><td>{nombreSucursal(item.sucursalOrigen)}</td><td>{nombreSucursal(item.sucursalDestino)}</td><td><div className="transferencias-detail-list">{(item.detalles || []).map((detalle) => <span key={detalle.ID_Detalle_Transferencia}>{nombreMedicamento(detalle)} <b>× {detalle.Cantidad_Transferencia}</b></span>)}</div></td><td>{[item.usuario?.Nombre_Usuario, item.usuario?.Apellido_Usuario].filter(Boolean).join(' ') || '—'}</td><td>{fechaCorta(item.Fecha_Transferencia)}</td><td><div className="transferencias-row-actions"><button className="transferencias-action-button" type="button" onClick={() => iniciarEdicion(item)} aria-label={`Editar transferencia ${item.ID_Transferencia}`} title="Editar transferencia"><EditRounded /><span>Editar</span></button><button className="transferencias-action-button" type="button" onClick={() => { setError(''); setConfirmandoEliminacion(item); }} aria-label={`Eliminar transferencia ${item.ID_Transferencia}`} title="Eliminar transferencia"><DeleteOutlineRounded /><span>Eliminar</span></button></div></td></tr>)}</tbody></table></div>}
            </section>

            {transferenciaEditando && <div className="transferencias-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !guardandoEdicion) setTransferenciaEditando(null); }}>
                <section className="transferencias-dialog" role="dialog" aria-modal="true" aria-labelledby="editar-transferencia-title">
                    <header className="transferencias-dialog-header"><div className="transferencias-dialog-icon"><EditRounded /></div><div><span className="transferencias-eyebrow">TR-{transferenciaEditando.ID_Transferencia}</span><h2 id="editar-transferencia-title">Editar transferencia</h2><p>Actualiza los medicamentos y las cantidades transferidas.</p></div><button className="transferencias-dialog-close" type="button" onClick={() => setTransferenciaEditando(null)} disabled={guardandoEdicion} aria-label="Cerrar"><CloseRounded /></button></header>
                    <div className="transferencias-route-summary"><span>{nombreSucursal(transferenciaEditando.sucursalOrigen)}</span><SwapHorizRounded /><span>{nombreSucursal(transferenciaEditando.sucursalDestino)}</span></div>
                    <form onSubmit={guardarEdicion}>
                        {errorEdicion && <div className="transferencias-alert error transferencias-edit-error" role="alert">{errorEdicion}</div>}
                        <div className="transferencias-items-heading"><div><h3>Detalle de medicamentos</h3><p>El stock mostrado incluye las unidades que regresarán al origen al aplicar este cambio.</p></div><button className="transferencias-secondary" type="button" onClick={() => setLineasEdicion((actuales) => [...actuales, { medicamento: '', cantidad: '' }])}><AddRounded /> Agregar</button></div>
                        <div className="transferencias-lines transferencias-edit-lines">{lineasEdicion.map((linea, index) => {
                            const medicamentoActual = medicamentos.find((med) => Number(med.ID_Medicamento) === Number(linea.medicamento));
                            const stock = linea.medicamento ? existenciasReversibles(transferenciaEditando, linea.medicamento) : null;
                            return <div className="transferencias-line" key={`${transferenciaEditando.ID_Transferencia}-${index}`}>
                                <BusquedaSeleccion label="Medicamento" placeholder="Buscar medicamento…" options={medicamentosEdicionPara(index)} value={medicamentoActual || null} getOptionLabel={nombreMedicamento} getOptionKey={(med) => med.ID_Medicamento} getOptionMeta={(med) => `${existenciasReversibles(transferenciaEditando, med.ID_Medicamento)} unidades disponibles`} emptyMessage="No hay medicamentos disponibles" onChange={(med) => setLineasEdicion((actuales) => actuales.map((actual, lineaIndex) => lineaIndex === index ? { ...actual, medicamento: med?.ID_Medicamento || '' } : actual))} />
                                <label>Cantidad<input type="number" min="1" max={stock ?? undefined} step="1" value={linea.cantidad} onChange={(event) => setLineasEdicion((actuales) => actuales.map((actual, lineaIndex) => lineaIndex === index ? { ...actual, cantidad: event.target.value } : actual))} placeholder="0" required /></label>
                                <div className="transferencias-stock">Disponible <strong>{stock ?? '—'}</strong></div>
                                <button className="transferencias-icon-button" type="button" onClick={() => setLineasEdicion((actuales) => actuales.length === 1 ? [{ medicamento: '', cantidad: '' }] : actuales.filter((_, lineaIndex) => lineaIndex !== index))} aria-label="Quitar medicamento"><DeleteOutlineRounded /></button>
                            </div>;
                        })}</div>
                        <footer className="transferencias-dialog-footer"><button className="transferencias-secondary" type="button" onClick={() => setTransferenciaEditando(null)} disabled={guardandoEdicion}>Cancelar</button><button className="transferencias-primary" type="submit" disabled={guardandoEdicion}>{guardandoEdicion ? 'Guardando…' : 'Guardar cambios'}</button></footer>
                    </form>
                </section>
            </div>}

            {confirmandoEliminacion && <div className="transferencias-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !eliminando) setConfirmandoEliminacion(null); }}>
                <section className="transferencias-dialog transferencias-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="eliminar-transferencia-title">
                    <header className="transferencias-dialog-header"><div className="transferencias-dialog-icon"><DeleteOutlineRounded /></div><div><span className="transferencias-eyebrow">TR-{confirmandoEliminacion.ID_Transferencia}</span><h2 id="eliminar-transferencia-title">Eliminar transferencia</h2><p>Se devolverán las unidades al origen y se descontarán del destino.</p></div><button className="transferencias-dialog-close" type="button" onClick={() => setConfirmandoEliminacion(null)} disabled={eliminando} aria-label="Cerrar"><CloseRounded /></button></header>
                    <div className="transferencias-delete-note">Si el destino ya no dispone de las unidades transferidas, el sistema impedirá eliminar el registro.</div>
                    <footer className="transferencias-dialog-footer"><button className="transferencias-secondary" type="button" onClick={() => setConfirmandoEliminacion(null)} disabled={eliminando}>Cancelar</button><button className="transferencias-primary" type="button" onClick={eliminarTransferencia} disabled={eliminando}>{eliminando ? 'Eliminando…' : 'Confirmar eliminación'}</button></footer>
                </section>
            </div>}
        </main>
    );
}

export default Transferencias;
