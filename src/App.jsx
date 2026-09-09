import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { InicioView } from './features/inicio/InicioView';
import { DashboardView } from './features/dashboard/DashboardView';
import { AprendicesView } from './features/aprendices/AprendicesView';
import { FasesProyectoView } from './features/fases/FasesProyectoView';
import { ModeloLogicoView } from './features/modelo-logico/ModeloLogicoView';
import { ImportModal } from './features/importador/ImportModal';
import { apiService } from './services/apiService';
import { storageService } from './services/storageService';

export function App() {
  const [fichas, setFichas] = useState([]);
  const [currentFicha, setCurrentFicha] = useState(null);
  const [selectedFichaIndex, setSelectedFichaIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('inicio');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState('Conectando a PostgreSQL...');
  const [theme, setTheme] = useState(() => storageService.getTheme());

  // Cargar catálogo de fichas desde PostgreSQL
  const loadFichasFromDb = async () => {
    try {
      setLoading(true);
      const list = await apiService.getFichas();
      setFichas(list);
      setDbStatus('PostgreSQL 17 Conectado');
      return list;
    } catch (err) {
      console.error('Error connecting to PostgreSQL:', err);
      setDbStatus('Error de conexión a PostgreSQL');
    } finally {
      setLoading(false);
    }
  };

  // Cargar detalle de una ficha seleccionada desde PostgreSQL
  const loadFichaDetail = async (fichaNumero) => {
    try {
      setLoading(true);
      const detail = await apiService.getFichaDetail(fichaNumero);
      setCurrentFicha(detail);
      return detail;
    } catch (err) {
      console.error('Error loading ficha detail from PostgreSQL:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFichasFromDb();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    storageService.saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Seleccionar ficha desde el inicio
  const handleSelectFichaAndGo = async (index) => {
    setSelectedFichaIndex(index);
    const targetFicha = fichas[index];
    if (targetFicha && targetFicha.meta?.ficha) {
      await loadFichaDetail(targetFicha.meta.ficha);
      setActiveTab('dashboard');
    }
  };

  // Cambiar de ficha en el selector del header
  const handleSelectFichaFromHeader = async (index) => {
    setSelectedFichaIndex(index);
    const targetFicha = fichas[index];
    if (targetFicha && targetFicha.meta?.ficha) {
      await loadFichaDetail(targetFicha.meta.ficha);
    }
  };

  // Eliminar ficha directamente en PostgreSQL
  const handleDeleteFicha = async (index) => {
    const target = fichas[index];
    if (!target) return;
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar permanentemente la Ficha ${target.meta?.ficha} (${target.meta?.programa}) de PostgreSQL?`);
    if (confirmDelete) {
      try {
        await apiService.deleteFicha(target.meta.ficha);
        const updatedList = await loadFichasFromDb();
        if (updatedList && updatedList.length > 0) {
          setSelectedFichaIndex(0);
          if (activeTab !== 'inicio') {
            await loadFichaDetail(updatedList[0].meta.ficha);
          }
        } else {
          setCurrentFicha(null);
          setActiveTab('inicio');
        }
      } catch (err) {
        alert('Error al eliminar en PostgreSQL: ' + err.message);
      }
    }
  };

  // Importar ficha masivamente a PostgreSQL
  const handleConfirmImport = async (parsedFicha) => {
    try {
      setLoading(true);
      await apiService.saveFicha(parsedFicha);
      const updatedList = await loadFichasFromDb();
      const newIdx = updatedList.findIndex(f => f.meta?.ficha === parsedFicha.meta?.ficha);
      const targetIdx = newIdx >= 0 ? newIdx : 0;
      setSelectedFichaIndex(targetIdx);
      await loadFichaDetail(parsedFicha.meta.ficha);
      setActiveTab('dashboard');
    } catch (err) {
      alert('Error guardando en PostgreSQL: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header
        fichas={fichas}
        selectedFichaIndex={selectedFichaIndex}
        onSelectFicha={handleSelectFichaFromHeader}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        dbStatus={dbStatus}
      />

      <main className="app-main">
        {loading && (
          <div style={{ padding: '0.6rem 1rem', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Consultando datos en PostgreSQL...</span>
            <span className="badge badge-success">BD Activa</span>
          </div>
        )}

        {/* Vista Inicio / Portal de Fichas */}
        {activeTab === 'inicio' && (
          <InicioView
            fichas={fichas}
            onSelectFicha={handleSelectFichaAndGo}
            onDeleteFicha={handleDeleteFicha}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            dbStatus={dbStatus}
          />
        )}

        {/* Vistas Detalladas de la Ficha Activa desde PostgreSQL */}
        {activeTab === 'dashboard' && currentFicha && (
          <DashboardView
            ficha={currentFicha}
            onSelectAprendiz={() => setActiveTab('aprendices')}
          />
        )}

        {activeTab === 'aprendices' && currentFicha && (
          <AprendicesView ficha={currentFicha} />
        )}

        {activeTab === 'fases' && currentFicha && (
          <FasesProyectoView ficha={currentFicha} />
        )}

        {activeTab === 'modelo' && currentFicha && (
          <ModeloLogicoView ficha={currentFicha} />
        )}
      </main>

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        existingFichas={fichas}
        onConfirmImport={handleConfirmImport}
      />

      <Footer />
    </div>
  );
}

export default App;
