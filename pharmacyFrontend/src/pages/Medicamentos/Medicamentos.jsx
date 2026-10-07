// ...existing code...

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Medicamentos.css";

function Medicamentos() {
    // ============================================================
    // ESTADOS
    // ============================================================

    const [medicamentos, setMedicamentos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [mostrarCategoria, setMostrarCategoria] = useState(false);
    const [nuevaCategoria, setNuevaCategoria] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [errorCategoria, setErrorCategoria] = useState("");
    const [guardandoCategoria, setGuardandoCategoria] = useState(false);

    const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [formData, setFormData] = useState({
        Nombre_Medicamento: "",
        Codigo_Medicamento: "",
        ID_Categoria: "",
        Presentacion: "",
        Precio_Medicamento: "0",
    });

    const [guardandoMedicamento, setGuardandoMedicamento] = useState(false);

    // ============================================================
    // CARGAR INFORMACIÓN
    // ============================================================

    useEffect(() => {
        cargarMedicamentos();
        cargarCategorias();
    }, []);

    const cargarCategorias = async () => {
        try {
            const respuesta = await fetch("/api/categorias-medicamento");
            if (!respuesta.ok) throw new Error("No fue posible cargar las categorías.");
            const datos = await respuesta.json();
            setCategorias(Array.isArray(datos) ? datos : []);
        } catch (error) {
            console.error("Error cargando categorías:", error);
        }
    };

    const agregarCategoria = async (e) => {
        e.preventDefault();
        const nombre = nuevaCategoria.trim();

        if (!nombre) {
            setErrorCategoria("Escribe el nombre de la categoría.");
            return;
        }

        try {
            setGuardandoCategoria(true);
            setErrorCategoria("");

            const respuesta = await fetch("/api/categorias-medicamento", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Nombre_Categoria: nombre }),
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || "No fue posible agregar la categoría.");
            }

            setCategorias((actuales) => [...actuales, datos]);
            setCategoriaSeleccionada(String(datos.ID_Categoria));
            setNuevaCategoria("");
            setMostrarCategoria(false);
        } catch (error) {
            setErrorCategoria(error.message || "No fue posible agregar la categoría.");
        } finally {
            setGuardandoCategoria(false);
        }
    };

    const cargarMedicamentos = async () => {
        try {
            setCargando(true);
            setError("");

            const respuesta = await fetch("/api/medicamentos");

            const datos = await respuesta.json();
            if (!respuesta.ok) {
                throw new Error(datos?.mensaje || datos?.message || `La API respondió ${respuesta.status} al cargar medicamentos.`);
            }
            setMedicamentos(Array.isArray(datos) ? datos : []);
        } catch (error) {
            console.error("Error cargando medicamentos:", error);
            setError(error.message || "No fue posible cargar la información de los medicamentos.");
        } finally {
            setCargando(false);
        }
    };

    // ============================================================
    // FORMULARIO DE MEDICAMENTO
    // ============================================================

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const registrarMedicamento = async (e) => {
        e.preventDefault();

        if (!formData.Nombre_Medicamento.trim()) {
            setError("El nombre del medicamento es obligatorio.");
            return;
        }

        try {
            setGuardandoMedicamento(true);
            setError("");

            const payload = {
                Nombre_Medicamento: formData.Nombre_Medicamento.trim(),
                Codigo_Medicamento: formData.Codigo_Medicamento.trim(),
                ID_Categoria: formData.ID_Categoria ? Number(formData.ID_Categoria) : null,
                Presentacion: formData.Presentacion.trim(),
                Precio_Medicamento: Number(formData.Precio_Medicamento || 0),
            };

            const respuesta = await fetch("/api/medicamentos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos?.message ||
                    datos?.mensaje ||
                    "No se pudo registrar el medicamento."
                );
            }

            setMostrarFormulario(false);
            setFormData({
                Nombre_Medicamento: "",
                Codigo_Medicamento: "",
                ID_Categoria: "",
                Presentacion: "",
                Precio_Medicamento: "0",
            });
            setCategoriaSeleccionada("");

            await cargarMedicamentos();
        } catch (error) {
            console.error("Error registrando medicamento:", error);
            setError(error.message || "No se pudo registrar el medicamento.");
        } finally {
            setGuardandoMedicamento(false);
        }
    };

    // ============================================================
    // FILTRAR MEDICAMENTOS
    // ============================================================

    const medicamentosFiltrados = useMemo(() => {
        const texto = busqueda.toLowerCase().trim();

        if (!texto) return medicamentos;

        return medicamentos.filter((medicamento) => {
            const nombre = medicamento.Nombre_Medicamento || medicamento.nombre || "";
            const codigo = medicamento.Codigo_Medicamento || medicamento.codigo || "";
            const categoria = medicamento.Nombre_Categoria || medicamento.Categoria || "";

            return (
                nombre.toLowerCase().includes(texto) ||
                codigo.toLowerCase().includes(texto) ||
                categoria.toLowerCase().includes(texto)
            );
        });
    }, [medicamentos, busqueda]);

    // ============================================================
    // VER INFORMACIÓN
    // ============================================================

    const verInformacion = async (medicamento) => {
        try {
            const id = medicamento.ID_Medicamento || medicamento.id;

            const respuesta = await fetch(`/api/medicamentos/${id}`);

            if (!respuesta.ok) {
                throw new Error("No fue posible obtener la información.");
            }

            const datos = await respuesta.json();
            setMedicamentoSeleccionado(datos);
        } catch (error) {
            console.error(error);
            setMedicamentoSeleccionado(medicamento);
        }

        setMostrarModal(true);
    };

    // ============================================================
    // CERRAR MODALES
    // ============================================================

    const cerrarModal = () => {
        setMostrarModal(false);
        setMedicamentoSeleccionado(null);
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="medicamentos-page">

            {/* ==================================================
                ENCABEZADO
            ================================================== */}

            <div className="medicamentos-header">
                <div>
                    <h1>Medicamentos</h1>
                    <p>
                        Catálogo de medicamentos, categorías y presentaciones.
                    </p>
                </div>

                <button
                    className="btn-principal"
                    onClick={() => setMostrarFormulario(true)}
                >
                    <span>+</span>
                    Nuevo medicamento
                </button>
            </div>

            {/* ==================================================
                CONTENEDOR PRINCIPAL
            ================================================== */}

            <div className="medicamentos-contenedor">

                {/* ==================================================
                    BARRA DE HERRAMIENTAS
                ================================================== */}

                <div className="medicamentos-toolbar">
                    <div className="busqueda-container">
                        <span className="busqueda-icono">⌕</span>
                        <input
                            type="text"
                            placeholder="Buscar medicamento..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    <span className="contador-resultados">
                        {medicamentosFiltrados.length} medicamentos
                    </span>
                </div>

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="mensaje-error">
                        {error}
                    </div>
                )}

                {/* ==================================================
                    CARGANDO
                ================================================== */}

                {cargando ? (
                    <div className="estado-vacio">
                        <div className="spinner"></div>
                        <p>Cargando medicamentos...</p>
                    </div>
                ) : medicamentosFiltrados.length === 0 ? (
                    <div className="estado-vacio">
                        <div className="estado-icono">+</div>
                        <h3>No se encontraron medicamentos</h3>
                        <p>
                            No existen medicamentos registrados que coincidan con la búsqueda.
                        </p>
                    </div>
                ) : (
                    <div className="tabla-container">
                        <table className="medicamentos-tabla">
                            <thead>
                                <tr>
                                    <th>Medicamento</th>
                                    <th>Código</th>
                                    <th>Categoría</th>
                                    <th>Presentación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {medicamentosFiltrados.map((medicamento, index) => {
                                    const id = medicamento.ID_Medicamento || medicamento.id || index;
                                    const nombre = medicamento.Nombre_Medicamento || medicamento.nombre || "Sin nombre";
                                    const codigo = medicamento.Codigo_Medicamento || medicamento.codigo || "—";
                                    const categoria = medicamento.Nombre_Categoria || medicamento.Categoria || "—";
                                    const presentacion = medicamento.Presentacion || medicamento.Presentacion_Medicamento || "—";

                                    return (
                                        <tr key={id}>
                                            <td>
                                                <div className="medicamento-nombre">
                                                    <div className="medicamento-avatar">M</div>
                                                    <div>
                                                        <strong>{nombre}</strong>
                                                        <small>ID: {id}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{codigo}</td>
                                            <td>{categoria}</td>
                                            <td>{presentacion}</td>
                                            <td>
                                                <button
                                                    className="btn-ver"
                                                    onClick={() => verInformacion(medicamento)}
                                                >
                                                    Ver información
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ==================================================
                MODAL INFORMACIÓN DEL MEDICAMENTO
            ================================================== */}

            {mostrarModal && medicamentoSeleccionado && (
                <div
                    className="modal-overlay"
                    onClick={cerrarModal}
                >
                    <div
                        className="modal-medicamento"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <div>
                                <span className="modal-etiqueta">
                                    INFORMACIÓN DEL MEDICAMENTO
                                </span>
                                <h2>
                                    {medicamentoSeleccionado.Nombre_Medicamento ||
                                        medicamentoSeleccionado.nombre ||
                                        "Medicamento"}
                                </h2>
                            </div>

                            <button
                                className="modal-cerrar"
                                onClick={cerrarModal}
                            >
                                ×
                            </button>
                        </div>

                        <div className="detalle-seccion">
                            <h3>Información general</h3>

                            <div className="detalle-grid">
                                <div className="detalle-item">
                                    <span>Código</span>
                                    <strong>
                                        {medicamentoSeleccionado.Codigo_Medicamento ||
                                            medicamentoSeleccionado.codigo ||
                                            "—"}
                                    </strong>
                                </div>

                                <div className="detalle-item">
                                    <span>Categoría</span>
                                    <strong>
                                        {medicamentoSeleccionado.Nombre_Categoria || medicamentoSeleccionado.categoria?.Nombre_Categoria ||
                                            medicamentoSeleccionado.Categoria ||
                                            "—"}
                                    </strong>
                                </div>

                                <div className="detalle-item">
                                    <span>Presentación</span>
                                    <strong>
                                        {medicamentoSeleccionado.Presentacion ||
                                            medicamentoSeleccionado.Presentacion_Medicamento ||
                                            "—"}
                                    </strong>
                                </div>

                            </div>
                        </div>

                        <div className="detalle-seccion">
                            <div className="seccion-titulo">
                                <div>
                                    <h3>Control de existencias</h3>
                                    <p>Consulta las existencias y registra entradas o salidas en el módulo Inventario.</p>
                                </div>
                                <Link className="btn-secundario" to="/inventario">Abrir inventario →</Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================================================
                MODAL NUEVO MEDICAMENTO
            ================================================== */}

            {mostrarFormulario && (
                <div
                    className="modal-overlay"
                    onClick={() => setMostrarFormulario(false)}
                >
                    <div
                        className="modal-formulario"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <div>
                                <span className="modal-etiqueta">REGISTRO</span>
                                <h2>Nuevo medicamento</h2>
                            </div>

                            <button
                                className="modal-cerrar"
                                onClick={() => setMostrarFormulario(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={registrarMedicamento}>
                            <div className="formulario-contenido">

                                <div className="form-group">
                                    <label>Nombre del medicamento</label>
                                    <input
                                        type="text"
                                        name="Nombre_Medicamento"
                                        required
                                        value={formData.Nombre_Medicamento}
                                        onChange={handleInputChange}
                                        placeholder="Ingrese el nombre"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Código</label>
                                        <input
                                            type="text"
                                            name="Codigo_Medicamento"
                                            value={formData.Codigo_Medicamento}
                                            onChange={handleInputChange}
                                            placeholder="Código"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Categoría</label>

                                        <div className="categoria-input-container">
                                            <select
                                                name="ID_Categoria"
                                                required
                                                value={categoriaSeleccionada}
                                                onChange={(e) => {
                                                    const valor = e.target.value;
                                                    setCategoriaSeleccionada(valor);
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        ID_Categoria: valor,
                                                    }));
                                                }}
                                            >
                                                <option value="">Seleccionar categoría</option>
                                                {categorias.map((categoria) => (
                                                    <option
                                                        key={categoria.ID_Categoria}
                                                        value={categoria.ID_Categoria}
                                                    >
                                                        {categoria.Nombre_Categoria}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                type="button"
                                                className="btn-agregar-categoria"
                                                onClick={() => setMostrarCategoria(true)}
                                                title="Agregar categoría"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Presentación</label>
                                    <input
                                        type="text"
                                        name="Presentacion"
                                        value={formData.Presentacion}
                                        onChange={handleInputChange}
                                        placeholder="Ej. Caja x 20 tabletas"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Precio</label>
                                    <input type="number" name="Precio_Medicamento" min="0" step="0.01" value={formData.Precio_Medicamento} onChange={handleInputChange} />
                                </div>

                                {error && (
                                    <div className="mensaje-error">
                                        {error}
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn-cancelar"
                                    onClick={() => setMostrarFormulario(false)}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="btn-principal"
                                    disabled={guardandoMedicamento}
                                >
                                    {guardandoMedicamento ? "Registrando..." : "Registrar medicamento"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ==================================================
                MODAL CATEGORÍA
            ================================================== */}

            {mostrarCategoria && (
                <div className="modal-overlay" onClick={() => setMostrarCategoria(false)}>
                    <form
                        className="modal-formulario"
                        onSubmit={agregarCategoria}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <div>
                                <span className="modal-etiqueta">CATEGORÍAS</span>
                                <h2>Agregar categoría</h2>
                            </div>

                            <button
                                type="button"
                                className="modal-cerrar"
                                onClick={() => setMostrarCategoria(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="formulario-contenido">
                            <div className="form-group">
                                <label htmlFor="nombre-categoria">Nombre de la categoría</label>
                                <input
                                    id="nombre-categoria"
                                    autoFocus
                                    value={nuevaCategoria}
                                    onChange={(e) => setNuevaCategoria(e.target.value)}
                                    placeholder="Ej. Analgésicos"
                                />
                            </div>

                            {errorCategoria && (
                                <div className="mensaje-error">
                                    {errorCategoria}
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn-cancelar"
                                onClick={() => setMostrarCategoria(false)}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="btn-principal"
                                disabled={guardandoCategoria}
                            >
                                {guardandoCategoria ? "Guardando..." : "Agregar categoría"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </div>
    );
}

export default Medicamentos;

// ...existing code...
