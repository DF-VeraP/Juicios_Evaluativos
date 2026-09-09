// Servicio de comunicación HTTP con la API REST conectada a PostgreSQL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiService = {
  // 1. Obtener todas las fichas desde PostgreSQL
  async getFichas() {
    try {
      const res = await fetch(`${API_URL}/fichas`);
      const data = await res.json();
      if (data.success) return data.fichas;
      throw new Error(data.error || 'Error al obtener fichas');
    } catch (err) {
      console.error('Error in apiService.getFichas:', err);
      throw err;
    }
  },

  // 2. Obtener el detalle completo de una ficha desde PostgreSQL
  async getFichaDetail(numero) {
    try {
      const res = await fetch(`${API_URL}/fichas/${numero}`);
      const data = await res.json();
      if (data.success) return data.ficha;
      throw new Error(data.error || 'Error al obtener detalle de la ficha');
    } catch (err) {
      console.error(`Error in apiService.getFichaDetail(${numero}):`, err);
      throw err;
    }
  },

  // 3. Guardar / Importar ficha en PostgreSQL
  async saveFicha(ficha) {
    try {
      const res = await fetch(`${API_URL}/fichas/importar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ficha })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Error al guardar ficha en PostgreSQL');
      return data;
    } catch (err) {
      console.error('Error in apiService.saveFicha:', err);
      throw err;
    }
  },

  // 4. Eliminar ficha de PostgreSQL
  async deleteFicha(numero) {
    try {
      const res = await fetch(`${API_URL}/fichas/${numero}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Error al eliminar ficha');
      return data;
    } catch (err) {
      console.error(`Error in apiService.deleteFicha(${numero}):`, err);
      throw err;
    }
  },

  // 5. Actualizar la fase de un RAP en PostgreSQL
  async updateRapFase(codigo, faseId) {
    try {
      const res = await fetch(`${API_URL}/raps/${codigo}/fase`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faseId })
      });
      return await res.json();
    } catch (err) {
      console.error(`Error in apiService.updateRapFase:`, err);
      throw err;
    }
  },

  // 6. Ejecutar SQL en vivo directamente contra PostgreSQL
  async executeSql(sql) {
    try {
      const res = await fetch(`${API_URL}/sql/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql })
      });
      return await res.json();
    } catch (err) {
      console.error('Error in apiService.executeSql:', err);
      throw err;
    }
  }
};
