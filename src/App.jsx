import React, { useState, useEffect } from 'react';
import initialData from './data/initialData.json';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { InicioView } from './features/inicio/InicioView';
import { DashboardView } from './features/dashboard/DashboardView';
import { AprendicesView } from './features/aprendices/AprendicesView';
import { FasesProyectoView } from './features/fases/FasesProyectoView';
import { ModeloLogicoView } from './features/modelo-logico/ModeloLogicoView';
import { ImportModal } from './features/importador/ImportModal';
import { storageService } from './services/storageService';

export function App() {
  const [fichas, setFichas] = useState(() => {
    return storageService.getFichas(initialData.fichas || []);
  });

  const [selectedFichaIndex, setSelectedFichaIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('inicio');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [theme, setTheme] = useState(() => storageService.getTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    storageService.saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    storageService.saveFichas(fichas);
  }, [fichas]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectFichaAndGo = (index) => {
    setSelectedFichaIndex(index);
    setActiveTab('dashboard');
  };

  const handleDeleteFicha = (index) => {
    const target = fichas[index];
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar la Ficha ${target?.meta?.ficha || ''} (${target?.meta?.programa || ''})?`);
    if (confirmDelete) {
      const updated = fichas.filter((_, i) => i !== index);
      setFichas(updated);
      if (selectedFichaIndex >= updated.length) {
        setSelectedFichaIndex(Math.max(0, updated.length - 1));
      }
    }
  };

  const handleConfirmImport = (parsedFicha, isExisting) => {
    if (isExisting) {
      const updated = fichas.map(f => {
        if (f.meta?.ficha === parsedFicha.meta?.ficha) {
          return parsedFicha;
        }
        return f;
      });
      setFichas(updated);
      const targetIdx = updated.findIndex(f => f.meta?.ficha === parsedFicha.meta?.ficha);
      setSelectedFichaIndex(targetIdx >= 0 ? targetIdx : 0);
    } else {
      setFichas(prev => [...prev, parsedFicha]);
      setSelectedFichaIndex(fichas.length);
    }
    setActiveTab('dashboard');
  };

  const currentFicha = fichas[selectedFichaIndex] || fichas[0];

  return (
    <div className="app-container">
      <Header
        fichas={fichas}
        selectedFichaIndex={selectedFichaIndex}
        onSelectFicha={(idx) => setSelectedFichaIndex(idx)}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenImportModal={() => setIsImportModalOpen(true)}
      />

      <main className="app-main">
        {activeTab === 'inicio' && (
          <InicioView
            fichas={fichas}
            onSelectFicha={handleSelectFichaAndGo}
            onDeleteFicha={handleDeleteFicha}
            onOpenImportModal={() => setIsImportModalOpen(true)}
          />
        )}

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
