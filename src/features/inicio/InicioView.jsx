import React from 'react';
import {
  FileSpreadsheet,
  Eye,
  Trash2,
  BookOpen,
  CheckCircle,
  Database,
  ArrowRight,
  Plus
} from 'lucide-react';

export function InicioView({ fichas, onSelectFicha, onDeleteFicha, onOpenImportModal }) {
  return (
    <div className="inicio-view">
      {/* Banner Principal de Bienvenida y Resumen */}
      <div
        className="sena-card"
        style={{
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-subtle) 100%)',
          padding: '2.2rem'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.65rem' }}>
              <span className="badge badge-success">Servicio Nacional de Aprendizaje • SENA</span>
              <span className="badge badge-neutral">Guía GA-220501096</span>
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.65rem', lineHeight: 1.2 }}>
              Sistema de Gestión y Normalización de Juicios Evaluativos
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Plataforma diseñada para transformar los reportes planos ("sábanas de datos") exportados de Sofia Plus en una estructura relacional normalizada en Tercera Forma Normal (3FN). Permite auditar el avance curricular por aprendiz, analizar el cumplimiento por fases del proyecto formativo y responder a las consultas académicas institucionales mediante SQL.
            </p>
          </div>

          <div>
            <button
              id="btn-abrir-importador"
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.4rem', fontSize: '0.95rem' }}
              onClick={onOpenImportModal}
            >
              <Plus size={18} />
              <span>Importar Reporte Sofia Plus</span>
            </button>
          </div>
        </div>

        {/* Resumen de capacidades del sistema */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
            <CheckCircle size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
            <div style={{ fontSize: '0.84rem' }}>
              <strong>Analítica de Rendimiento</strong>
              <div style={{ color: 'var(--text-muted)' }}>Métricas de aprobación, deserción y seguimiento por instructor.</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
            <BookOpen size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
            <div style={{ fontSize: '0.84rem' }}>
              <strong>Fases del Proyecto</strong>
              <div style={{ color: 'var(--text-muted)' }}>Mapeo de competencias a Análisis, Planeación, Ejecución y Evaluación.</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
            <Database size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
            <div style={{ fontSize: '0.84rem' }}>
              <strong>Modelo Lógico & SQL</strong>
              <div style={{ color: 'var(--text-muted)' }}>DER interactivo, diccionario de datos y consultas para las 10 preguntas.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor de Fichas Importadas */}
      <div className="sena-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <FileSpreadsheet size={20} color="var(--primary)" />
              <span>Fichas de Formación Cargadas ({fichas.length})</span>
            </h3>
            <p className="card-subtitle">
              Selecciona una ficha para abrir su panel completo de seguimiento o elimínala del sistema
            </p>
          </div>
        </div>

        {fichas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>No hay fichas cargadas actualmente en el sistema.</p>
            <button className="btn btn-primary" onClick={onOpenImportModal}>
              <Plus size={16} /> Importar la primera ficha
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {fichas.map((f, idx) => {
              const meta = f.meta || {};
              const aprendicesCount = f.aprendices?.length || 0;
              const juiciosCount = f.juicios?.length || 0;
              const aprobados = f.juicios?.filter(j => j.estadoJuicio === 'APROBADO').length || 0;
              const pct = juiciosCount > 0 ? ((aprobados / juiciosCount) * 100).toFixed(1) : 0;

              return (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span className="badge badge-success">Ficha {meta.ficha}</span>
                      <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>{meta.modalidad}</span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.4rem 0 0.25rem 0', lineHeight: 1.25 }}>
                      {meta.programa}
                    </h4>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {meta.centro || 'Centro de Formación SENA'}
                    </div>

                    <div style={{ marginTop: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '0.2rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Avance de la Ficha</span>
                        <strong>{pct}%</strong>
                      </div>
                      <div className="progress-container" style={{ margin: 0, height: '6px' }}>
                        <div className="progress-bar" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.78rem' }}>
                      <div style={{ background: 'var(--bg-card)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Aprendices: </span>
                        <strong>{aprendicesCount}</strong>
                      </div>
                      <div style={{ background: 'var(--bg-card)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Juicios: </span>
                        <strong>{juiciosCount}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onDeleteFicha(idx)}
                      title="Eliminar esta ficha del sistema"
                    >
                      <Trash2 size={14} />
                      <span>Eliminar</span>
                    </button>

                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => onSelectFicha(idx)}
                      title="Abrir dashboard y seguimiento de esta ficha"
                    >
                      <Eye size={14} />
                      <span>Ver Ficha</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
