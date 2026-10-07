import { useEffect, useMemo, useState } from 'react';
import './BusquedaSeleccion.css';

function BusquedaSeleccion({ label, placeholder, options, value, onChange, getOptionLabel, getOptionKey, getOptionMeta, emptyMessage }) {
    const [abierto, setAbierto] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [opcionActiva, setOpcionActiva] = useState(-1);
    const opcionesFiltradas = useMemo(() => {
        const texto = busqueda.trim().toLocaleLowerCase();
        return options.filter((option) => getOptionLabel(option).toLocaleLowerCase().includes(texto));
    }, [options, busqueda, getOptionLabel]);

    useEffect(() => {
        if (!abierto) setBusqueda('');
    }, [abierto]);

    const seleccionar = (option) => {
        onChange(option);
        setBusqueda('');
        setAbierto(false);
        setOpcionActiva(-1);
    };

    const manejarTeclas = (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setAbierto(true);
            setOpcionActiva((actual) => Math.min(actual + 1, opcionesFiltradas.length - 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setOpcionActiva((actual) => Math.max(actual - 1, 0));
        } else if (event.key === 'Enter' && abierto) {
            event.preventDefault();
            if (opcionesFiltradas[opcionActiva]) seleccionar(opcionesFiltradas[opcionActiva]);
        } else if (event.key === 'Escape') {
            setAbierto(false);
            setBusqueda('');
        }
    };

    return (
        <div className={`busqueda-select-field ${abierto ? 'is-open' : ''}`}>
            <span>{label}</span>
            <div className="busqueda-select-picker">
                <input
                    type="search"
                    value={abierto ? busqueda : value ? getOptionLabel(value) : ''}
                    placeholder={placeholder}
                    role="combobox"
                    aria-expanded={abierto}
                    aria-autocomplete="list"
                    onFocus={() => { setBusqueda(''); setAbierto(true); setOpcionActiva(-1); }}
                    onChange={(event) => { setBusqueda(event.target.value); setAbierto(true); setOpcionActiva(-1); }}
                    onKeyDown={manejarTeclas}
                    onBlur={() => { setAbierto(false); setBusqueda(''); }}
                />
                <span className={`busqueda-select-chevron ${abierto ? 'is-open' : ''}`} aria-hidden="true">⌄</span>
                {abierto && (
                    <div className="busqueda-select-menu" role="listbox">
                        {opcionesFiltradas.length ? opcionesFiltradas.map((option, index) => (
                            <button
                                className={`busqueda-select-option ${value && getOptionKey(value) === getOptionKey(option) ? 'is-selected' : ''} ${index === opcionActiva ? 'is-active' : ''}`}
                                key={getOptionKey(option)}
                                type="button"
                                role="option"
                                aria-selected={Boolean(value && getOptionKey(value) === getOptionKey(option))}
                                onMouseEnter={() => setOpcionActiva(index)}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => seleccionar(option)}
                            >
                                <span className="busqueda-select-option-copy">
                                    <strong>{getOptionLabel(option)}</strong>
                                    {getOptionMeta && <small>{getOptionMeta(option)}</small>}
                                </span>
                                {value && getOptionKey(value) === getOptionKey(option) && <span className="busqueda-select-check" aria-hidden="true">✓</span>}
                            </button>
                        )) : <div className="busqueda-select-empty">{emptyMessage}</div>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BusquedaSeleccion;
