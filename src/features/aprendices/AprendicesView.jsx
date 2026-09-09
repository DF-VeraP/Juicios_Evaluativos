import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, Printer, X, CheckCircle, Clock } from 'lucide-react';

export function AprendicesView({ ficha }) {
  const aprendices = ficha?.aprendices || [];
  const juicios = ficha?.juicios || [];
  const competencias = ficha?.competencias || [];
  const raps = ficha?.resultadosAprendizaje || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('TODOS');
  const [selectedAprendiz, setSelectedAprendiz] = useState(null);
  const [filterCompetenciaModal, setFilterCompetenciaModal] = useState('TODAS');

  const rapMap = useMemo(() => {
    const map = new Map();
    raps.forEach(r => map.set(r.codigo, r));
    return map;
  }, [raps]);

  const aprendicesConProgreso = useMemo(() => {
    return aprendices.map(a => {
      const juiciosA = juicios.filter(j => j.numeroDocumento === a.numeroDocumento);
      const aprobados = juiciosA.filter(j => j.estadoJuicio === 'APROBADO').length;
      const pendientes = juiciosA.filter(j => j.estadoJuicio === 'POR EVALUAR').length;
      const total = juiciosA.length;
      const pct = total > 0 ? Math.round((aprobados / total) * 100) : 0;
      return {
        ...a,
        totalJuicios: total,
        aprobados,
        pendientes,
        porcentaje: pct
      };
    });
  }, [aprendices, juicios]);

  const filteredAprendices = useMemo(() => {
    return aprendicesConProgreso.filter(a => {
      const matchesSearch =
        a.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.numeroDocumento.includes(searchTerm);
      const matchesEstado = filterEstado === 'TODOS' || a.estado === filterEstado;
      return matchesSearch && matchesEstado;
    });
  }, [aprendicesConProgreso, searchTerm, filterEstado]);

  const estadosUnicos = useMemo(() => {
    return Array.from(new Set(aprendices.map(a => a.estado)));
  }, [aprendices]);

  const juiciosDelSeleccionado = useMemo(() => {
    if (!selectedAprendiz) return [];
    let list = juicios.filter(j => j.numeroDocumento === selectedAprendiz.numeroDocumento);
    if (filterCompetenciaModal !== 'TODAS') {
      list = list.filter(j => j.competenciaCodigo === filterCompetenciaModal);
    }
    return list;
  }, [selectedAprendiz, juicios, filterCompetenciaModal]);

  return (
    <div className="aprendices-view">
      {/* Barra de Búsqueda y Filtros */}
      <div className="sena-card" style={{ marginBottom: '1.5rem' }}>
        <div className="search-filter-bar" style={{ margin: 0 }}>
          <div className="search-input-box">
            <Search className="icon" size={17} />
            <input
              id="input-buscar-aprendiz"
              type="text"
              placeholder="Buscar por nombre, apellidos o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select
              id="select-filtro-estado"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              style={{
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '0.86rem',
                outline: 'none'
              }}
            >
              <option value="TODOS">Todos los Estados</option>
              {estadosUnicos.map(est => (
                <option key={est} value={est}>{est}</option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            Mostrando <strong>{filteredAprendices.length}</strong> de {aprendices.length} aprendices
          </div>
        </div>
      </div>

      {/* Grid de Tarjetas de Aprendices */}
      <div className="grid-3">
        {filteredAprendices.map(aprendiz => (
          <div
            key={aprendiz.numeroDocumento}
            className="sena-card"
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onClick={() => setSelectedAprendiz(aprendiz)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, lineHeight: 1.25 }}>
                    {aprendiz.nombreCompleto}
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {aprendiz.tipoDocumento} {aprendiz.numeroDocumento}
                  </div>
                </div>
                <span
                  className={`badge ${
                    aprendiz.estado === 'EN FORMACION' ? 'badge-success' : 'badge-warning'
                  }`}
                  style={{ fontSize: '0.7rem' }}
                >
                  {aprendiz.estado}
                </span>
              </div>

              {/* Progreso */}
              <div style={{ margin: '0.85rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Avance</span>
                  <strong style={{ color: 'var(--primary)' }}>{aprendiz.porcentaje}%</strong>
                </div>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${aprendiz.porcentaje}%` }}></div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', fontSize: '0.78rem' }}>
                <div style={{ background: 'var(--bg-subtle)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Aprobados: </span>
                  <strong style={{ color: '#10B981' }}>{aprendiz.aprobados}</strong>
                </div>
                <div style={{ background: 'var(--bg-subtle)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Pendientes: </span>
                  <strong style={{ color: '#D97706' }}>{aprendiz.pendientes}</strong>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.85rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                Ver sábana de juicios
              </span>
              <ChevronRight size={15} color="var(--primary)" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detallado de Juicios del Aprendiz con Scroll Vertical */}
      {selectedAprendiz && (
        <div className="modal-overlay" onClick={() => setSelectedAprendiz(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {selectedAprendiz.nombreCompleto}
                </h3>
                <div style={{ display: 'flex', gap: '0.65rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <span>{selectedAprendiz.tipoDocumento}: {selectedAprendiz.numeroDocumento}</span>
                  <span>•</span>
                  <span>Estado: {selectedAprendiz.estado}</span>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setSelectedAprendiz(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.15rem', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Avance Curricular</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>
                    {selectedAprendiz.porcentaje}% ({selectedAprendiz.aprobados} de {selectedAprendiz.totalJuicios})
                  </strong>
                </div>
                <div className="progress-container" style={{ height: '8px' }}>
                  <div className="progress-bar" style={{ width: `${selectedAprendiz.porcentaje}%` }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Filtrar Competencia:</span>
                <select
                  value={filterCompetenciaModal}
                  onChange={(e) => setFilterCompetenciaModal(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem'
                  }}
                >
                  <option value="TODAS">Todas las Competencias ({competencias.length})</option>
                  {competencias.map(c => (
                    <option key={c.codigo} value={c.codigo}>
                      {c.codigo} - {c.denominacion.substring(0, 55)}...
                    </option>
                  ))}
                </select>
              </div>

              {/* Tabla con Alto Fijo y Scroll Vertical Automático */}
              <div className="table-responsive">
                <table className="sena-table">
                  <thead>
                    <tr>
                      <th>Competencia & RAP</th>
                      <th>Estado Juicio</th>
                      <th>Fecha Evaluación</th>
                      <th>Funcionario Evaluador</th>
                    </tr>
                  </thead>
                  <tbody>
                    {juiciosDelSeleccionado.map(j => {
                      const rapObj = rapMap.get(j.rapCodigo);
                      const isAprobado = j.estadoJuicio === 'APROBADO';
                      return (
                        <tr key={j.id}>
                          <td style={{ maxWidth: '380px' }}>
                            <div style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 700 }}>
                              COMPETENCIA {j.competenciaCodigo}
                            </div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600, marginTop: '0.1rem' }}>
                              RAP {j.rapCodigo}: {rapObj ? rapObj.denominacion : 'Resultado de aprendizaje'}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${isAprobado ? 'badge-success' : 'badge-warning'}`}>
                              {isAprobado ? <CheckCircle size={12} /> : <Clock size={12} />}
                              {j.estadoJuicio}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {j.fechaHora || 'Sin calificar'}
                          </td>
                          <td style={{ fontSize: '0.8rem' }}>
                            {j.funcionario || 'Por asignar'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => window.print()}
                title="Imprimir sábana de notas del aprendiz"
              >
                <Printer size={15} />
                <span>Imprimir Sábana</span>
              </button>
              <button className="btn btn-primary" onClick={() => setSelectedAprendiz(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
