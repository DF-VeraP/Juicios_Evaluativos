import React from 'react';
import { Moon, Sun, Home, Plus } from 'lucide-react';

export function Header({
  fichas,
  selectedFichaIndex,
  onSelectFicha,
  activeTab,
  onTabChange,
  theme,
  onToggleTheme,
  onOpenImportModal,
  dbStatus
}) {
  const currentFicha = fichas[selectedFichaIndex] || fichas[0];
  const meta = currentFicha?.meta || {};

  return (
    <header>
      <div className="app-header">
        <div className="brand-section">
          {/* Logo SENA Oficial con padding adecuado y sin cortes */}
          <div className="sena-logo-badge" title="Servicio Nacional de Aprendizaje - SENA">
            <svg
              viewBox="0 0 100 100"
              width="36"
              height="36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="20" r="14" fill="#ffffff" />
              <path
                d="M50 38 C42 38 28 42 22 50 L22 66 C28 60 40 56 50 56 C60 56 72 60 78 66 L78 50 C72 42 58 38 50 38 Z"
                fill="#ffffff"
              />
              <path
                d="M32 70 L32 94 L44 94 L44 76 L56 76 L56 94 L68 94 L68 70 C60 67 40 67 32 70 Z"
                fill="#ffffff"
              />
            </svg>
          </div>

          <div className="brand-info">
            <h1>
              <span>{import.meta.env.VITE_APP_TITLE || 'Sistema de Juicios Evaluativos'}</span>
              <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>PostgreSQL 17</span>
            </h1>
            <p className="tagline">
              {import.meta.env.VITE_APP_SUBTITLE || 'Guía GA-220501096 • Análisis y Diseño Lógico de Datos'}
            </p>
          </div>
        </div>

        <div className="header-actions">
          {/* Botón Volver a Inicio */}
          <button
            id="btn-volver-inicio"
            className={`btn btn-sm ${activeTab === 'inicio' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onTabChange('inicio')}
            title="Ir al Portal de Fichas"
          >
            <Home size={15} />
            <span>Inicio</span>
          </button>

          {/* Selector de Ficha Activa (Visible en vistas de ficha) */}
          {fichas.length > 0 && activeTab !== 'inicio' && (
            <div className="ficha-selector-box" title="Cambiar ficha activa">
              <select
                id="select-ficha-activa"
                value={selectedFichaIndex}
                onChange={(e) => onSelectFicha(Number(e.target.value))}
              >
                {fichas.map((f, idx) => (
                  <option key={idx} value={idx}>
                    Ficha {f.meta?.ficha || idx} - {f.meta?.programa || 'Programa'}
                  </option>
                ))}
              </select>
              <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                {meta.estadoFicha || 'EN EJECUCIÓN'}
              </span>
            </div>
          )}

          {/* Botón Importar Masivo */}
          <button
            className="btn btn-sm btn-outline"
            style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
            onClick={onOpenImportModal}
            title="Importar nueva ficha Sofia Plus"
          >
            <Plus size={15} />
            <span>Importar</span>
          </button>

          {/* Toggle Dark/Light Mode */}
          <button
            id="btn-toggle-theme"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>

      {/* Barra de Navegación por Módulos */}
      {activeTab !== 'inicio' && (
        <nav className="app-nav-bar">
          <button
            id="nav-dashboard"
            className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => onTabChange('dashboard')}
          >
            <span>Dashboard & Métricas</span>
          </button>

          <button
            id="nav-aprendices"
            className={`nav-tab-btn ${activeTab === 'aprendices' ? 'active' : ''}`}
            onClick={() => onTabChange('aprendices')}
          >
            <span>Aprendices & Seguimiento</span>
          </button>

          <button
            id="nav-fases"
            className={`nav-tab-btn ${activeTab === 'fases' ? 'active' : ''}`}
            onClick={() => onTabChange('fases')}
          >
            <span>Fases del Proyecto</span>
          </button>

          <button
            id="nav-modelo-sql"
            className={`nav-tab-btn ${activeTab === 'modelo' ? 'active' : ''}`}
            onClick={() => onTabChange('modelo')}
          >
            <span>Modelo Lógico & SQL</span>
          </button>
        </nav>
      )}
    </header>
  );
}
