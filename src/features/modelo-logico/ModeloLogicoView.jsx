import React, { useState } from 'react';
import { Download, Play } from 'lucide-react';
import { PREGUNTAS_ACADEMICAS, REGLAS_NEGOCIO, DICCIONARIO_DATOS } from '../../constants/academicQueries';
import { sqlEngineService } from '../../services/sqlEngineService';

export function ModeloLogicoView({ ficha }) {
  const [subTab, setSubTab] = useState('der');
  const [selectedQueryIndex, setSelectedQueryIndex] = useState(0);
  const [queryResult, setQueryResult] = useState(() => PREGUNTAS_ACADEMICAS[0].run(ficha));
  const [customSql, setCustomSql] = useState(PREGUNTAS_ACADEMICAS[0].sql);

  const handleSelectQuery = (idx) => {
    setSelectedQueryIndex(idx);
    const q = PREGUNTAS_ACADEMICAS[idx];
    setCustomSql(q.sql);
    setQueryResult(q.run(ficha));
  };

  const handleDownloadSql = () => {
    const script = sqlEngineService.generateFullSqlScript(ficha);
    const blob = new Blob([script], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `schema_juicios_sena_ficha_${ficha.meta?.ficha || '3407847'}.sql`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modelo-logico-view">
      {/* Subpestañas */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
        <button
          className={`btn btn-sm ${subTab === 'der' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSubTab('der')}
        >
          <span>Diagrama Entidad-Relación (DER)</span>
        </button>

        <button
          className={`btn btn-sm ${subTab === 'diccionario' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSubTab('diccionario')}
        >
          <span>Diccionario de Datos</span>
        </button>

        <button
          className={`btn btn-sm ${subTab === 'sql' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSubTab('sql')}
        >
          <span>Consultas SQL (10 Preguntas)</span>
        </button>

        <button
          className={`btn btn-sm ${subTab === 'teoria' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSubTab('teoria')}
        >
          <span>Reglas de Negocio & Reflexión</span>
        </button>

        <button
          className="btn btn-sm btn-outline"
          style={{ marginLeft: 'auto', borderColor: 'var(--primary)', color: 'var(--primary)' }}
          onClick={handleDownloadSql}
          title="Descargar script DDL/DML para MySQL"
        >
          <Download size={14} />
          <span>Exportar SQL</span>
        </button>
      </div>

      {/* Subpestaña 1: DER */}
      {subTab === 'der' && (
        <div className="sena-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Diagrama Entidad-Relación Lógico (3FN)</h3>
              <p className="card-subtitle">
                Estructura relacional para eliminar la redundancia del reporte plano de Sofia Plus
              </p>
            </div>
            <span className="badge badge-success">3ra Forma Normal</span>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.15rem' }}>
              
              <div style={{ background: 'var(--bg-card)', border: '2px solid #3B82F6', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <div style={{ background: '#3B82F6', color: 'white', padding: '0.45rem 0.75rem', fontWeight: 700, fontSize: '0.84rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>PROGRAMA_FORMACION</span>
                  <span>1:N</span>
                </div>
                <div style={{ padding: '0.75rem', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>PK: codigo (VARCHAR)</div>
                  <div>• version (INT)</div>
                  <div>• denominacion (VARCHAR)</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '2px solid #8B5CF6', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <div style={{ background: '#8B5CF6', color: 'white', padding: '0.45rem 0.75rem', fontWeight: 700, fontSize: '0.84rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>FICHA_CARACTERIZACION</span>
                  <span>1:N</span>
                </div>
                <div style={{ padding: '0.75rem', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>PK: numero (VARCHAR)</div>
                  <div style={{ color: '#8B5CF6' }}>• FK: programa_codigo</div>
                  <div>• estado (VARCHAR)</div>
                  <div>• modalidad (VARCHAR)</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '2px solid #10B981', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <div style={{ background: '#10B981', color: 'white', padding: '0.45rem 0.75rem', fontWeight: 700, fontSize: '0.84rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>APRENDIZ</span>
                  <span>1:N</span>
                </div>
                <div style={{ padding: '0.75rem', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>PK: numero_documento</div>
                  <div>• tipo_documento (VARCHAR)</div>
                  <div>• nombres (VARCHAR)</div>
                  <div>• apellidos (VARCHAR)</div>
                  <div>• estado (VARCHAR)</div>
                  <div style={{ color: '#8B5CF6' }}>• FK: ficha_numero</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '2px solid #F59E0B', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <div style={{ background: '#F59E0B', color: 'white', padding: '0.45rem 0.75rem', fontWeight: 700, fontSize: '0.84rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>COMPETENCIA</span>
                  <span>1:N</span>
                </div>
                <div style={{ padding: '0.75rem', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>PK: codigo (VARCHAR)</div>
                  <div>• denominacion (TEXT)</div>
                  <div style={{ color: '#3B82F6' }}>• FK: programa_codigo</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '2px solid #EC4899', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <div style={{ background: '#EC4899', color: 'white', padding: '0.45rem 0.75rem', fontWeight: 700, fontSize: '0.84rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>RESULTADO_APRENDIZAJE</span>
                  <span>1:N</span>
                </div>
                <div style={{ padding: '0.75rem', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>PK: codigo (VARCHAR)</div>
                  <div style={{ color: '#F59E0B' }}>• FK: competencia_codigo</div>
                  <div>• denominacion (TEXT)</div>
                  <div>• FK: fase_id (Opcional)</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '2px solid #6366F1', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <div style={{ background: '#6366F1', color: 'white', padding: '0.45rem 0.75rem', fontWeight: 700, fontSize: '0.84rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>FUNCIONARIO</span>
                  <span>1:N</span>
                </div>
                <div style={{ padding: '0.75rem', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>PK: documento (VARCHAR)</div>
                  <div>• nombre_completo (VARCHAR)</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '2px solid #39A900', borderRadius: 'var(--radius-sm)', overflow: 'hidden', gridColumn: 'span 2' }}>
                <div style={{ background: '#39A900', color: 'white', padding: '0.45rem 0.75rem', fontWeight: 700, fontSize: '0.84rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>JUICIO_EVALUATIVO (Tabla de Hechos)</span>
                  <span>N:M</span>
                </div>
                <div style={{ padding: '0.75rem', fontSize: '0.8rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>PK: id (BIGINT AUTO_INCREMENT)</div>
                    <div style={{ color: '#10B981' }}>• FK: aprendiz_documento (Ref APRENDIZ)</div>
                    <div style={{ color: '#EC4899' }}>• FK: rap_codigo (Ref RESULTADO_APRENDIZAJE)</div>
                  </div>
                  <div>
                    <div style={{ color: '#6366F1' }}>• FK: funcionario_documento (Ref FUNCIONARIO)</div>
                    <div>• estado_juicio: ENUM('APROBADO', 'POR EVALUAR')</div>
                    <div>• fecha_hora_evaluacion: DATETIME</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Subpestaña 2: Diccionario de Datos */}
      {subTab === 'diccionario' && (
        <div className="sena-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Diccionario de Datos Normalizado</h3>
              <p className="card-subtitle">Estructura técnica de campos, tipos SQL, claves y descripciones</p>
            </div>
            <span className="badge badge-neutral">{DICCIONARIO_DATOS.length} atributos</span>
          </div>

          <div className="table-responsive">
            <table className="sena-table">
              <thead>
                <tr>
                  <th>Entidad</th>
                  <th>Campo</th>
                  <th>Tipo SQL</th>
                  <th>Claves</th>
                  <th>Nullable</th>
                  <th>Descripción del Atributo</th>
                </tr>
              </thead>
              <tbody>
                {DICCIONARIO_DATOS.map((d, i) => (
                  <tr key={i}>
                    <td><code>{d.entidad}</code></td>
                    <td><strong>{d.campo}</strong></td>
                    <td><code>{d.tipo}</code></td>
                    <td>
                      {d.pk && <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>PK</span>}
                      {d.fk && <span className="badge badge-info" style={{ fontSize: '0.68rem', marginLeft: '0.2rem' }}>FK</span>}
                    </td>
                    <td>
                      <span className={`badge ${d.null ? 'badge-neutral' : 'badge-danger'}`} style={{ fontSize: '0.68rem' }}>
                        {d.null ? 'NULL' : 'NOT NULL'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subpestaña 3: Consultas SQL */}
      {subTab === 'sql' && (
        <div className="sena-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Consultas SQL - 10 Preguntas de Coordinación</h3>
              <p className="card-subtitle">
                Consultas SQL para responder a los requerimientos del PDF
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
            {PREGUNTAS_ACADEMICAS.map((q, idx) => (
              <button
                key={q.id}
                className={`btn btn-sm ${selectedQueryIndex === idx ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleSelectQuery(idx)}
              >
                P{q.id}
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, marginBottom: '0.2rem' }}>
              Pregunta {PREGUNTAS_ACADEMICAS[selectedQueryIndex].id}: {PREGUNTAS_ACADEMICAS[selectedQueryIndex].pregunta}
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {PREGUNTAS_ACADEMICAS[selectedQueryIndex].descripcion}
            </p>
          </div>

          <div className="sql-editor-container">
            <div className="sql-editor-header">
              <span>SQL ANSI / MySQL</span>
              <button
                className="btn btn-sm btn-primary"
                style={{ padding: '0.2rem 0.6rem', fontSize: '0.74rem' }}
                onClick={() => setQueryResult(PREGUNTAS_ACADEMICAS[selectedQueryIndex].run(ficha))}
              >
                <Play size={12} /> Ejecutar Query
              </button>
            </div>
            <textarea
              className="sql-textarea"
              value={customSql}
              onChange={(e) => setCustomSql(e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, marginBottom: '0.45rem' }}>
              Resultado ({queryResult.rows.length} registros):
            </div>
            <div className="table-responsive">
              <table className="sena-table">
                <thead>
                  <tr>
                    {queryResult.columns.map((c, i) => (
                      <th key={i}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queryResult.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx}>
                          {cIdx === 0 ? <strong>{cell}</strong> : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subpestaña 4: Reglas de Negocio & Reflexión */}
      {subTab === 'teoria' && (
        <div className="grid-2">
          <div className="sena-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Reglas de Negocio del Sistema SENA</h3>
                <p className="card-subtitle">Restricciones lógicas definidas en el ejercicio</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {REGLAS_NEGOCIO.map((r, i) => (
                <div key={i} style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.84rem' }}>
                  {r}
                </div>
              ))}
            </div>
          </div>

          <div className="sena-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Preguntas de Reflexión Resueltas</h3>
                <p className="card-subtitle">Fundamentación de ingeniería y normalización</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.84rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <strong>1. ¿Por qué no guardar todo en una sola tabla plana?</strong>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Genera redundancia masiva de datos, desperdicia almacenamiento y provoca anomalías al insertar, modificar o eliminar registros.
                </p>
              </div>

              <div style={{ padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <strong>2. ¿Qué pasaría si el nombre de una competencia cambia?</strong>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  En un archivo plano habría que actualizar miles de filas arriesgando inconsistencias. En 3FN solo se actualiza 1 sola fila en la tabla <code>competencia</code>.
                </p>
              </div>

              <div style={{ padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <strong>3. ¿Por qué registrar fecha/hora y funcionario?</strong>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Garantiza trazabilidad y no repudio legal: saber con exactitud qué instructor emitió el juicio y cuándo fue evaluado.
                </p>
              </div>

              <div style={{ padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <strong>4. ¿Cómo se calcula el avance académico?</strong>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Fórmula: <code>(Total RAPs Aprobados / Total RAPs del Programa) * 100</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
