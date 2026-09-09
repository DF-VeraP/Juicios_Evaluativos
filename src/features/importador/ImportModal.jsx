import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle, AlertTriangle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { parserService } from '../../services/parserService';

export function ImportModal({ isOpen, onClose, existingFichas, onConfirmImport }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setLoading(true);
    setErrorMsg(null);
    setAnalysis(null);

    try {
      const result = await parserService.parseExcelFile(selectedFile);
      const { parsedFicha, totalFilas, exitosos, invalidos } = result;

      // Evaluar existencia y duplicidad usando el servicio
      const existing = existingFichas.find(f => f.meta?.ficha === parsedFicha.meta?.ficha);
      const comparison = parserService.compareFichas(existing, parsedFicha);

      setAnalysis({
        parsedFicha,
        totalFilas,
        exitosos,
        invalidos,
        ...comparison
      });

    } catch (err) {
      setErrorMsg('No se pudo procesar el archivo: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (analysis && analysis.parsedFicha) {
      onConfirmImport(analysis.parsedFicha, analysis.isExisting);
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setAnalysis(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileSpreadsheet size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Importar Reporte Masivo Sofia Plus</h3>
          </div>
          <button className="btn-icon" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{
              border: '2px dashed var(--border-color)',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.75rem',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '1.25rem'
            }}
            onClick={() => document.getElementById('modal-file-input').click()}
          >
            <input
              id="modal-file-input"
              type="file"
              accept=".xls,.xlsx"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />
            <UploadCloud size={34} color="var(--primary)" style={{ margin: '0 auto 0.5rem auto' }} />
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              {file ? file.name : 'Haz clic para seleccionar el archivo .xls o .xlsx'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Reportes planos de Juicios Evaluativos exportados de Sofia Plus
            </div>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Analizando estructura y validando duplicidad con la base de datos...
            </div>
          )}

          {errorMsg && (
            <div style={{ padding: '0.85rem', background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem' }}>
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {analysis && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {analysis.isExactDuplicate && (
                <div style={{ padding: '0.85rem', background: 'rgba(217, 119, 6, 0.12)', border: '1px solid rgba(217, 119, 6, 0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--warning)', fontSize: '0.85rem', display: 'flex', gap: '0.6rem' }}>
                  <AlertTriangle size={20} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Ficha ya existente con exactamente los mismos datos:</strong>
                    <div style={{ marginTop: '0.2rem', color: 'var(--text-main)', fontSize: '0.82rem' }}>
                      La Ficha <strong>{analysis.parsedFicha.meta.ficha}</strong> ya se encuentra cargada en el sistema con idéntica cantidad de aprendices ({analysis.duplicateStats.existingAprendices}) y juicios evaluativos ({analysis.duplicateStats.existingJuicios}). Si continúas, se actualizarán los registros.
                    </div>
                  </div>
                </div>
              )}

              {analysis.existingDiffers && (
                <div style={{ padding: '0.85rem', background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.25)', borderRadius: 'var(--radius-sm)', color: 'var(--info)', fontSize: '0.85rem', display: 'flex', gap: '0.6rem' }}>
                  <AlertCircle size={20} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Actualización de Ficha Existente:</strong>
                    <div style={{ marginTop: '0.2rem', color: 'var(--text-main)', fontSize: '0.82rem' }}>
                      La Ficha <strong>{analysis.parsedFicha.meta.ficha}</strong> ya existía, pero el archivo contiene variaciones. Se sobrescribirán y actualizarán los datos de la ficha.
                    </div>
                  </div>
                </div>
              )}

              {!analysis.isExisting && (
                <div style={{ padding: '0.85rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-sm)', color: '#10B981', fontSize: '0.85rem', display: 'flex', gap: '0.6rem' }}>
                  <CheckCircle size={20} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Nueva Ficha de Formación Detectada:</strong>
                    <div style={{ marginTop: '0.2rem', color: 'var(--text-main)', fontSize: '0.82rem' }}>
                      La Ficha <strong>{analysis.parsedFicha.meta.ficha}</strong> ({analysis.parsedFicha.meta.programa}) es nueva y será agregada al repositorio.
                    </div>
                  </div>
                </div>
              )}

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  Recuento de Auditoría de Carga
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
                  <div style={{ background: 'var(--bg-subtle)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Total Filas</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{analysis.totalFilas}</div>
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.74rem', color: '#10B981' }}>Juicios Válidos</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981' }}>{analysis.exitosos}</div>
                  </div>
                  <div style={{ background: 'var(--bg-subtle)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Omitidos / Inválidos</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: analysis.invalidos > 0 ? '#DC2626' : 'var(--text-muted)' }}>
                      {analysis.invalidos}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '0.85rem', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem' }}>
                  <span>Aprendices: <strong>{analysis.parsedFicha.aprendices.length}</strong></span>
                  <span>Competencias: <strong>{analysis.parsedFicha.competencias.length}</strong></span>
                  <span>RAPs: <strong>{analysis.parsedFicha.resultadosAprendizaje.length}</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={handleClose}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            disabled={!analysis || loading}
            onClick={handleConfirm}
          >
            {analysis?.isExisting ? 'Confirmar y Actualizar' : 'Importar Ficha'}
          </button>
        </div>
      </div>
    </div>
  );
}
