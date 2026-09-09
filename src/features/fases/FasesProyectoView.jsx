import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, CheckCheck, AlertCircle } from 'lucide-react';
import { FASES_DEFECTO } from '../../constants/academicQueries';
import { apiService } from '../../services/apiService';

export function FasesProyectoView({ ficha }) {
  const raps = ficha?.resultadosAprendizaje || [];
  const juicios = ficha?.juicios || [];
  const aprendices = ficha?.aprendices || [];

  const [faseAssignments, setFaseAssignments] = useState(() => {
    const map = {};
    raps.forEach((r, idx) => {
      const faseIndex = (idx % 4) + 1;
      map[r.codigo] = faseIndex;
    });
    return map;
  });

  // Por defecto todas las fases inician suprimidas
  const [openFases, setOpenFases] = useState({});

  const toggleFase = (faseId) => {
    setOpenFases(prev => ({
      ...prev,
      [faseId]: !prev[faseId]
    }));
  };

  const handleAssignFase = async (rapCodigo, newFaseId) => {
    const numericFaseId = Number(newFaseId);
    setFaseAssignments(prev => ({
      ...prev,
      [rapCodigo]: numericFaseId
    }));
    try {
      await apiService.updateRapFase(rapCodigo, numericFaseId);
    } catch (e) {
      console.warn('Error syncing rap fase to PostgreSQL', e);
    }
  };

  const statsPorFase = useMemo(() => {
    return FASES_DEFECTO.map(fase => {
      const rapsEnFase = raps.filter(r => (faseAssignments[r.codigo] || 1) === fase.id);
      const rapCodigosSet = new Set(rapsEnFase.map(r => r.codigo));

      const juiciosEnFase = juicios.filter(j => rapCodigosSet.has(j.rapCodigo));
      const juiciosAprobados = juiciosEnFase.filter(j => j.estadoJuicio === 'APROBADO').length;
      const totalJuiciosFase = juiciosEnFase.length;
      const pctCumplimiento = totalJuiciosFase > 0 ? ((juiciosAprobados / totalJuiciosFase) * 100).toFixed(1) : 0;

      let aprendicesAprobadosFase = 0;
      let aprendicesPendientesFase = 0;
      const detalleAprendicesFase = [];

      aprendices.forEach(a => {
        const juiciosAprendizFase = juiciosEnFase.filter(j => j.numeroDocumento === a.numeroDocumento);
        const aprobadosA = juiciosAprendizFase.filter(j => j.estadoJuicio === 'APROBADO').length;
        const totalA = juiciosAprendizFase.length;
        const cumpleCompleto = totalA > 0 && aprobadosA === totalA;

        if (cumpleCompleto) {
          aprendicesAprobadosFase++;
        } else {
          aprendicesPendientesFase++;
        }

        detalleAprendicesFase.push({
          documento: a.numeroDocumento,
          nombre: a.nombreCompleto,
          estado: a.estado,
          aprobados: aprobadosA,
          total: totalA,
          cumpleCompleto,
          pct: totalA > 0 ? Math.round((aprobadosA / totalA) * 100) : 0
        });
      });

      return {
        ...fase,
        raps: rapsEnFase,
        totalRaps: rapsEnFase.length,
        totalJuicios: totalJuiciosFase,
        juiciosAprobados,
        pctCumplimiento,
        aprendicesAprobados: aprendicesAprobadosFase,
        aprendicesPendientes: aprendicesPendientesFase,
        detalleAprendices: detalleAprendicesFase
      };
    });
  }, [FASES_DEFECTO, raps, juicios, aprendices, faseAssignments]);

  return (
    <div className="fases-proyecto-view">
      <div className="sena-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Fases del Proyecto Formativo (Variante Avanzada)
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Todas las fases se encuentran suprimidas por defecto. Haz clic en la flecha de cualquiera de las fases para desplegar u ocultar su contenido y seguimiento.
            </p>
          </div>
          <span className="badge badge-neutral">4 Fases Formativas SENA</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {statsPorFase.map(fase => {
          const isOpen = !!openFases[fase.id];

          return (
            <div
              key={fase.id}
              className={`fase-accordion-card ${isOpen ? 'open' : ''}`}
            >
              <button
                type="button"
                className="fase-header-btn"
                onClick={() => toggleFase(fase.id)}
                aria-expanded={isOpen}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: fase.color
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
                        {fase.nombre}
                      </strong>
                      <span className="badge badge-neutral" style={{ fontSize: '0.74rem' }}>
                        {fase.totalRaps} RAPs
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      {fase.descripcion}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: fase.color }}>
                      {fase.pctCumplimiento}%
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {fase.aprendicesAprobados} al día • {fase.aprendicesPendientes} pendientes
                    </div>
                  </div>

                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="fase-content-body">
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                      <span>Cumplimiento Total de {fase.nombre}</span>
                      <strong>{fase.juiciosAprobados} de {fase.totalJuicios} juicios aprobados ({fase.pctCumplimiento}%)</strong>
                    </div>
                    <div className="progress-container" style={{ height: '8px' }}>
                      <div className="progress-bar" style={{ width: `${fase.pctCumplimiento}%`, background: fase.color }}></div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.5rem' }}>
                      Resultados de Aprendizaje asociados a esta fase:
                    </div>
                    <div
                      style={{
                        maxHeight: '180px',
                        overflowY: 'auto',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-card)'
                      }}
                    >
                      {fase.raps.length === 0 ? (
                        <div style={{ padding: '0.85rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                          No hay RAPs asignados a esta fase.
                        </div>
                      ) : (
                        fase.raps.map(r => (
                          <div
                            key={r.codigo}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0.5rem 0.85rem',
                              borderBottom: '1px solid var(--border-color)',
                              gap: '0.75rem',
                              fontSize: '0.82rem'
                            }}
                          >
                            <span style={{ flex: 1 }}>
                              <strong>RAP {r.codigo}:</strong> {r.denominacion}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Mover:</span>
                              <select
                                value={faseAssignments[r.codigo] || 1}
                                onChange={(e) => handleAssignFase(r.codigo, e.target.value)}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '4px',
                                  border: '1px solid var(--border-color)',
                                  background: 'var(--bg-subtle)',
                                  color: 'var(--text-main)',
                                  fontSize: '0.75rem'
                                }}
                              >
                                {FASES_DEFECTO.map(f => (
                                  <option key={f.id} value={f.id}>{f.nombre}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.5rem' }}>
                      Seguimiento de Aprendices en {fase.nombre}:
                    </div>
                    <div className="table-responsive">
                      <table className="sena-table">
                        <thead>
                          <tr>
                            <th>Aprendiz</th>
                            <th>Documento</th>
                            <th>Estado</th>
                            <th>Aprobados en Fase</th>
                            <th>% Fase</th>
                            <th>Diagnóstico</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fase.detalleAprendices.map(item => (
                            <tr key={item.documento}>
                              <td><strong>{item.nombre}</strong></td>
                              <td style={{ color: 'var(--text-muted)' }}>{item.documento}</td>
                              <td>
                                <span className={`badge ${item.estado === 'EN FORMACION' ? 'badge-neutral' : 'badge-warning'}`}>
                                  {item.estado}
                                </span>
                              </td>
                              <td>{item.aprobados} de {item.total}</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <div className="progress-container" style={{ width: '60px', height: '6px', margin: 0 }}>
                                    <div className="progress-bar" style={{ width: `${item.pct}%`, background: fase.color }}></div>
                                  </div>
                                  <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{item.pct}%</span>
                                </div>
                              </td>
                              <td>
                                {item.cumpleCompleto ? (
                                  <span className="badge badge-success">
                                    <CheckCheck size={13} /> Fase Aprobada
                                  </span>
                                ) : (
                                  <span className="badge badge-warning">
                                    <AlertCircle size={13} /> {item.total - item.aprobados} pendientes
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
