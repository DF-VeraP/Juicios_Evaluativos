import React from 'react';

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)', padding: '1.25rem 2rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
      <div>
        <strong>Servicio Nacional de Aprendizaje (SENA)</strong> • {import.meta.env.VITE_DEFAULT_REGIONAL || 'Regional Caquetá'} • {import.meta.env.VITE_DEFAULT_CENTRO || 'Centro Tecnológico de la Amazonia'}
      </div>
      <div style={{ marginTop: '0.25rem' }}>
        {import.meta.env.VITE_APP_TITLE || 'Sistema de Gestión y Normalización de Juicios Evaluativos'} • v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
      </div>
    </footer>
  );
}
