import { Activity, Component, Suspense, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, Grid2X2, Search, X } from "lucide-react";
import { allModules, normalizeSearch, systemGroups, systemModules } from "../data/systemModules";

class ModuleErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="panel-message" role="alert"><p>No se pudo abrir este control.</p><button onClick={() => this.setState({ failed: false })}>Reintentar</button></div>;
    return this.props.children;
  }
}

function CachedModule({ module, moduleProps, active }) {
  const scroller = useRef(null);
  const position = useRef(0);
  const Control = module.component;
  // Activity conserva el estado, pero desconecta efectos de las funciones ocultas.
  useLayoutEffect(() => { scroller.current.scrollTop = position.current; }, []);
  return (
    <div ref={scroller} className="panel-scroll module-content" data-testid={`module-${module.id}`} onScroll={(event) => {
      if (active) position.current = event.currentTarget.scrollTop;
    }}>
      <ModuleErrorBoundary><Suspense fallback={<p className="panel-message" role="status">Cargando módulo…</p>}><Control {...moduleProps} {...(!module.group ? { open: true, inline: true } : {})} /></Suspense></ModuleErrorBoundary>
    </div>
  );
}

function Directory({ group, onSelect }) {
  const [query, setQuery] = useState("");
  const input = useRef(null);
  const search = normalizeSearch(query);
  const results = systemModules.filter((module) => search
    ? normalizeSearch(`${module.name} ${module.description}`).includes(search)
    : !group || module.group === group);
  useLayoutEffect(() => { if (!group) input.current.focus(); }, [group]);
  return (
    <div className="function-directory">
      <label className="function-search"><Search aria-hidden="true" /><input ref={input} type="search" aria-label="Buscar función" placeholder="Buscar entre las 21 funciones…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      <div className="panel-scroll directory-scroll">
        <p className="directory-caption">{search ? "RESULTADOS EN TODOS LOS SISTEMAS" : "SELECCIONA UN CONTROL"}<span>{results.length}</span></p>
        <div className="function-grid">
          {results.map(({ id, name, description, icon: Icon }) => <button className="function-card" key={id} data-testid={`open-${id}`} onClick={() => onSelect(id)}><Icon aria-hidden="true" /><span><strong>{name}</strong><small>{description}</small></span><ArrowRight aria-hidden="true" /></button>)}
        </div>
        {!results.length && <p className="panel-message" role="status">No hay funciones con ese nombre. Prueba otra búsqueda.</p>}
      </div>
    </div>
  );
}

export default function SystemPanel({ selection, visited, moduleProps, onSelect, onDirectory, onClose }) {
  const module = allModules.find((item) => item.id === selection?.id);
  const group = systemGroups.find((item) => item.id === (selection?.group || module?.group));
  const title = useRef(null);
  useLayoutEffect(() => {
    if (selection?.kind === "module" || selection?.group) title.current.focus({ preventScroll: true });
  }, [selection]);

  return (
    <section className="system-panel" hidden={!selection} aria-labelledby="system-panel-title" data-testid="system-panel">
      <header className="panel-header">
        <div><span className="panel-eyebrow">{group?.name || "CENTRO DE CONTROL"}</span><h1 ref={title} tabIndex={-1} id="system-panel-title">{module?.name || (group ? group.description : "Todas las funciones")}</h1></div>
        <button className="icon-button" title="Todas las funciones" aria-label="Todas las funciones" onClick={() => onDirectory()}><Grid2X2 /></button>
        <button className="icon-button" title="Cerrar controles" aria-label="Cerrar controles" onClick={onClose}><X /></button>
      </header>
      {selection?.kind === "module" && <label className="module-selector">Cambiar control<select aria-label="Cambiar función" value={module.id} onChange={(event) => onSelect(event.target.value)}>
        {systemGroups.map((category) => <optgroup label={category.name} key={category.id}>{systemModules.filter((item) => item.group === category.id).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</optgroup>)}
        <optgroup label="Accesos rápidos">{allModules.filter((item) => !item.group).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</optgroup>
      </select></label>}
      {selection?.kind === "directory" && <Directory key={selection.group || "all"} group={selection.group} onSelect={onSelect} />}
      {visited.map((id) => {
        const active = selection?.kind === "module" && selection.id === id;
        return <Activity key={id} mode={active ? "visible" : "hidden"}><CachedModule module={allModules.find((item) => item.id === id)} moduleProps={moduleProps} active={active} /></Activity>;
      })}
    </section>
  );
}
