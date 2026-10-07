import { useCallback, useEffect, useMemo, useState } from 'react';
import { AddRounded, BusinessRounded, CloseRounded, RefreshRounded, SearchRounded, VisibilityRounded } from '@mui/icons-material';
import './Activos.css';

const formularioVacio = {
    ID_Sucursal: '',
    Nombre_Activo: '',
    Descripcion_Activo: '',
    Precio_Adquisicion_Activo: '',
    Vida_Util_Activo: ''
};

function Activos() {
    const [activos, setActivos] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [formularioAbierto, setFormularioAbierto] = useState(false);
    const [editando, setEditando] = useState(null);
    const [formulario, setFormulario] = useState(formularioVacio);
    const [guardando, setGuardando] = useState(false);
    const [activoSeleccionado, setActivoSeleccionado] = useState(null);

    const cargarDatos = useCallback(async () => {
        try {
            setCargando(true);
            setError('');
            const [respuestaActivos, respuestaSucursales] = await Promise.all([
                fetch('/api/activos-fijos'),
                fetch('/api/sucursales')
            ]);
            const [datosActivos, datosSucursales] = await Promise.all([
                respuestaActivos.json(), respuestaSucursales.json()
            ]);
            if (!respuestaActivos.ok) throw new Error(datosActivos?.mensaje || 'No fue posible cargar los activos.');
            if (!respuestaSucursales.ok) throw new Error(datosSucursales?.mensaje || 'No fue posible cargar las sucursales.');
            setActivos(Array.isArray(datosActivos) ? datosActivos : []);
            setSucursales(Array.isArray(datosSucursales) ? datosSucursales : []);
        } catch (e) {
            setError(e.message || 'No fue posible cargar la información.');
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => { cargarDatos(); }, [cargarDatos]);

    const activosFiltrados = useMemo(() => {
        const termino = busqueda.trim().toLocaleLowerCase();
        if (!termino) return activos;
        return activos.filter((activo) => [activo.Nombre_Activo, activo.Descripcion_Activo, activo.sucursal?.Nombre_Sucursal]
            .some((valor) => String(valor || '').toLocaleLowerCase().includes(termino)));
    }, [activos, busqueda]);

    const abrirNuevo = () => {
        setEditando(null);
        setFormulario(formularioVacio);
        setFormularioAbierto(true);
        setError('');
    };

    const abrirEdicion = (activo) => {
        setEditando(activo);
        setFormulario({
            ID_Sucursal: String(activo.ID_Sucursal || activo.sucursal?.ID_Sucursal || ''),
            Nombre_Activo: activo.Nombre_Activo || '',
            Descripcion_Activo: activo.Descripcion_Activo || '',
            Precio_Adquisicion_Activo: String(activo.Precio_Adquisicion_Activo ?? ''),
            Vida_Util_Activo: String(activo.Vida_Util_Activo ?? '')
        });
        setFormularioAbierto(true);
        setError('');
    };

    const guardarActivo = async (event) => {
        event.preventDefault();
        try {
            setGuardando(true);
            setError('');
            const payload = {
                ID_Sucursal: Number(formulario.ID_Sucursal),
                Nombre_Activo: formulario.Nombre_Activo.trim(),
                Descripcion_Activo: formulario.Descripcion_Activo.trim() || null,
                Precio_Adquisicion_Activo: Number(formulario.Precio_Adquisicion_Activo),
                Vida_Util_Activo: formulario.Vida_Util_Activo ? Number(formulario.Vida_Util_Activo) : null
            };
            const respuesta = await fetch(`/api/activos-fijos${editando ? `/${editando.ID_Activo}` : ''}`, {
                method: editando ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const datos = await respuesta.json();
            if (!respuesta.ok) throw new Error(datos?.mensaje || datos?.errores?.join(' ') || 'No fue posible guardar el activo.');
            setFormularioAbierto(false);
            await cargarDatos();
        } catch (e) {
            setError(e.message || 'No fue posible guardar el activo.');
        } finally {
            setGuardando(false);
        }
    };

    const formatoMoneda = (valor) => new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(Number(valor || 0));

    return (
        <main className="activos-page">
            <header className="activos-header">
                <div className="activos-header-icon"><BusinessRounded /></div>
                <div className="activos-header-copy"><span>ADMINISTRACIÓN DE LA ORGANIZACIÓN</span><h1>Activos</h1><p>Registra y consulta los activos fijos y su valor de adquisición.</p></div>
                <button className="activos-refresh" type="button" onClick={cargarDatos} disabled={cargando}><RefreshRounded /> Actualizar</button>
            </header>

            {error && !formularioAbierto && <div className="activos-alert" role="alert">{error}<button type="button" onClick={cargarDatos}>Reintentar</button></div>}

            <section className="activos-summary">
                <article className="activos-stat"><span>Activos registrados</span><strong>{activos.length}</strong><small>En todas las sucursales</small></article>
                <article className="activos-stat"><span>Valor de adquisición</span><strong>{formatoMoneda(activos.reduce((suma, activo) => suma + Number(activo.Precio_Adquisicion_Activo || 0), 0))}</strong><small>Valor total registrado</small></article>
            </section>

            <section className="activos-panel">
                <div className="activos-panel-head"><div><span className="activos-overline">CONSULTA</span><h2>Registro de activos</h2><p>Información y valor de adquisición por sucursal.</p></div>
                    <div className="activos-toolbar"><label className="activos-search"><SearchRounded /><input type="search" aria-label="Buscar activos" placeholder="Buscar activo o sucursal…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></label><span className="activos-count">{activosFiltrados.length} activos</span><button className="activos-primary" type="button" onClick={abrirNuevo}><AddRounded /> Registrar activo</button></div>
                </div>
                {cargando ? <div className="activos-empty">Cargando activos…</div> : activosFiltrados.length === 0 ? <div className="activos-empty"><BusinessRounded /><strong>{busqueda ? 'No hay activos que coincidan con la búsqueda.' : 'Aún no hay activos registrados.'}</strong><span>{busqueda ? 'Prueba con otro nombre o sucursal.' : 'Registra el primer activo de la organización.'}</span></div> : (
                    <div className="activos-table-wrap"><table className="activos-table"><thead><tr><th>Activo</th><th>Sucursal</th><th>Valor adquisición</th><th>Vida útil</th><th>Acciones</th></tr></thead><tbody>
                        {activosFiltrados.map((activo) => <tr key={activo.ID_Activo}><td><div className="activos-name"><span>{(activo.Nombre_Activo || 'A').charAt(0).toUpperCase()}</span><div><strong>{activo.Nombre_Activo}</strong><small>ID: {activo.ID_Activo} · {activo.Descripcion_Activo || 'Sin descripción'}</small></div></div></td><td>{activo.sucursal?.Nombre_Sucursal || `Sucursal ${activo.ID_Sucursal}`}</td><td className="activos-value">{formatoMoneda(activo.Precio_Adquisicion_Activo)}</td><td>{activo.Vida_Util_Activo ? `${activo.Vida_Util_Activo} años` : '—'}</td><td><button type="button" className="activos-edit" onClick={() => setActivoSeleccionado(activo)}><VisibilityRounded /> Ver activo</button></td></tr>)}
                    </tbody></table></div>
                )}
            </section>

            {formularioAbierto && <div className="activos-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setFormularioAbierto(false); }}><section className="activos-modal" role="dialog" aria-modal="true" aria-labelledby="activo-form-title">
                <header><div><h2 id="activo-form-title">{editando ? 'Editar activo' : 'Registrar activo'}</h2><p>Completa la información del activo fijo.</p></div><button type="button" className="activos-close" onClick={() => setFormularioAbierto(false)} aria-label="Cerrar">×</button></header>
                <form onSubmit={guardarActivo}>
                    <label>Sucursal<select required value={formulario.ID_Sucursal} onChange={(e) => setFormulario({ ...formulario, ID_Sucursal: e.target.value })}><option value="">Selecciona una sucursal</option>{sucursales.map((sucursal) => <option key={sucursal.ID_Sucursal} value={sucursal.ID_Sucursal}>{sucursal.Nombre_Sucursal || `Sucursal ${sucursal.ID_Sucursal}`}</option>)}</select></label>
                    <label>Nombre del activo<input required maxLength="150" value={formulario.Nombre_Activo} onChange={(e) => setFormulario({ ...formulario, Nombre_Activo: e.target.value })} placeholder="Ej. Refrigerador de medicamentos" /></label>
                    <label>Descripción <span className="activos-optional">Opcional</span><textarea maxLength="500" rows="3" value={formulario.Descripcion_Activo} onChange={(e) => setFormulario({ ...formulario, Descripcion_Activo: e.target.value })} placeholder="Detalles del activo" /></label>
                    <div className="activos-form-row"><label>Valor de adquisición (Q)<input required type="number" min="0" step="0.01" value={formulario.Precio_Adquisicion_Activo} onChange={(e) => setFormulario({ ...formulario, Precio_Adquisicion_Activo: e.target.value })} placeholder="0.00" /></label><label>Vida útil (años) <span className="activos-optional">Opcional</span><input type="number" min="1" step="1" value={formulario.Vida_Util_Activo} onChange={(e) => setFormulario({ ...formulario, Vida_Util_Activo: e.target.value })} placeholder="Ej. 10" /></label></div>
                    {error && <div className="activos-alert" role="alert">{error}</div>}
                    <footer><button type="button" className="activos-secondary" onClick={() => setFormularioAbierto(false)}>Cancelar</button><button className="activos-primary" disabled={guardando}>{guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Registrar activo'}</button></footer>
                </form>
            </section></div>}

            {activoSeleccionado && <div className="activos-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setActivoSeleccionado(null); }}><section className="activos-modal activos-detail-modal" role="dialog" aria-modal="true" aria-labelledby="activo-detail-title">
                <header><div><h2 id="activo-detail-title">Información del activo</h2><p>Detalle del activo fijo registrado.</p></div><button type="button" className="activos-close" onClick={() => setActivoSeleccionado(null)} aria-label="Cerrar"><CloseRounded /></button></header>
                <div className="activos-detail-content">
                    <div><span>ID del activo</span><strong>{activoSeleccionado.ID_Activo}</strong></div>
                    <div><span>Nombre</span><strong>{activoSeleccionado.Nombre_Activo || '—'}</strong></div>
                    <div><span>Sucursal</span><strong>{activoSeleccionado.sucursal?.Nombre_Sucursal || `Sucursal ${activoSeleccionado.ID_Sucursal}`}</strong></div>
                    <div><span>Descripción</span><strong>{activoSeleccionado.Descripcion_Activo || 'Sin descripción'}</strong></div>
                    <div><span>Valor de adquisición</span><strong>{formatoMoneda(activoSeleccionado.Precio_Adquisicion_Activo)}</strong></div>
                    <div><span>Vida útil</span><strong>{activoSeleccionado.Vida_Util_Activo ? `${activoSeleccionado.Vida_Util_Activo} años` : 'No especificada'}</strong></div>
                    <footer><button type="button" className="activos-secondary" onClick={() => setActivoSeleccionado(null)}>Cerrar</button></footer>
                </div>
            </section></div>}
        </main>
    );
}

export default Activos;
