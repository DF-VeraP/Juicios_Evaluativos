// Servicio de persistencia y almacenamiento local
const STORAGE_KEY = 'sena_juicios_fichas';
const THEME_KEY = 'sena_theme';

export const storageService = {
  getFichas(fallbackFichas = []) {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading from localStorage', e);
    }
    return fallbackFichas;
  },

  saveFichas(fichas) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fichas));
    } catch (e) {
      console.warn('LocalStorage quota exceeded or unavailable', e);
    }
  },

  getTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
  },

  saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
  }
};
