import { Router } from 'express';
import { fichasController } from '../controllers/fichasController.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', database: 'PostgreSQL 17 (sena_juicios_db)' });
});

// Fichas
router.get('/fichas', fichasController.getAllFichas);
router.get('/fichas/:numero', fichasController.getFichaByNumero);
router.post('/fichas/importar', fichasController.importarFicha);
router.delete('/fichas/:numero', fichasController.deleteFicha);

// RAPs & Fases
router.put('/raps/:codigo/fase', fichasController.updateRapFase);

// Ejecución SQL directa en PostgreSQL
router.post('/sql/execute', fichasController.executeSql);

export default router;
