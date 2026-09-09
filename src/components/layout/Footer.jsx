import React from 'react';

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)', padding: '1.25rem 2rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
      <div>
        <strong>Servicio Nacional de Aprendizaje (SENA)</strong> • Regional Caquetá • Centro Tecnológico de la Amazonia
      </div>
      <div style={{ marginTop: '0.25rem' }}>
        Sistema de Gestión y Normalización de Juicios Evaluativos • Guía de Aprendizaje GA-220501096
      </div>
    </footer>
  );
}
