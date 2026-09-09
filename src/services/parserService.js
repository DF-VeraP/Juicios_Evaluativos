import * as XLSX from 'xlsx';

/**
 * Servicio de procesamiento y normalización de reportes de Sofia Plus.
 * Transforma la sábana plana en entidades relacionales: Ficha, Aprendiz, Competencia, RAP, Funcionario y Juicios.
 */
export const parserService = {
  async parseExcelFile(file) {
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data, { type: 'array' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(ws, { header: 1 });

    if (!json || json.length < 13) {
      throw new Error('El archivo no cumple con el formato estándar de Reporte de Juicios Evaluativos de Sofia Plus.');
    }

    // Extracción de Metadatos de la Ficha
    const meta = {
      reporte: json[0] ? json[0][0] : 'Reporte de Juicios de Evaluación',
      fechaReporte: json[1] ? json[1][2] : new Date().toLocaleDateString('es-CO'),
      ficha: json[2] ? String(json[2][2]) : '000000',
      codigoPrograma: json[3] ? String(json[3][2]) : '',
      version: json[4] ? String(json[4][2]) : '1',
      programa: json[5] ? String(json[5][2]) : 'PROGRAMA IMPORTADO',
      estadoFicha: json[6] ? String(json[6][2]) : 'EN EJECUCION',
      fechaInicio: json[7] ? json[7][2] : '',
      fechaFin: json[8] ? json[8][2] : '',
      modalidad: json[9] ? String(json[9][2]) : 'PRESENCIAL',
      regional: json[10] ? String(json[10][2]) : 'REGIONAL SENA',
      centro: json[11] ? String(json[11][2]) : 'CENTRO DE FORMACIÓN'
    };

    const rawRows = json.slice(13);
    const aprendicesMap = new Map();
    const competenciasMap = new Map();
    const rapsMap = new Map();
    const funcionariosMap = new Map();
    const juicios = [];
    let invalidRowsCount = 0;

    rawRows.forEach((r, idx) => {
      if (!r || !r[1] || String(r[1]).trim() === '') {
        invalidRowsCount++;
        return;
      }

      const tipoDoc = (r[0] || 'CC').toString().trim();
      const numDoc = (r[1] || '').toString().trim();
      const nombres = (r[2] || '').toString().trim();
      const apellidos = (r[3] || '').toString().trim();
      const estadoAprendiz = (r[4] || 'EN FORMACION').toString().trim();
      const compStr = (r[5] || '').toString().trim();
      const rapStr = (r[6] || '').toString().trim();
      const juicioVal = (r[7] || '').toString().trim().toUpperCase();
      const fechaHoraRaw = r[8];
      const funcionarioStr = (r[9] || '').toString().trim();

      // Normalizar Aprendiz
      if (!aprendicesMap.has(numDoc)) {
        aprendicesMap.set(numDoc, {
          tipoDocumento: tipoDoc,
          numeroDocumento: numDoc,
          nombres,
          apellidos,
          nombreCompleto: `${nombres} ${apellidos}`,
          estado: estadoAprendiz
        });
      }

      // Normalizar Competencia
      let compCodigo = compStr;
      let compNombre = compStr;
      const compMatch = compStr.match(/^([0-9]+)\s*-\s*(.+)$/);
      if (compMatch) {
        compCodigo = compMatch[1];
        compNombre = compMatch[2];
      }
      if (!competenciasMap.has(compCodigo)) {
        competenciasMap.set(compCodigo, {
          codigo: compCodigo,
          denominacion: compNombre,
          textoCompleto: compStr
        });
      }

      // Normalizar Resultado de Aprendizaje (RAP)
      let rapCodigo = rapStr;
      let rapNombre = rapStr;
      const rapMatch = rapStr.match(/^([0-9]+)\s*-\s*(.+)$/);
      if (rapMatch) {
        rapCodigo = rapMatch[1];
        rapNombre = rapMatch[2];
      }
      if (!rapsMap.has(rapCodigo)) {
        rapsMap.set(rapCodigo, {
          codigo: rapCodigo,
          denominacion: rapNombre,
          textoCompleto: rapStr,
          competenciaCodigo: compCodigo
        });
      }

      // Normalizar Funcionario / Instructor
      if (funcionarioStr && !funcionariosMap.has(funcionarioStr)) {
        funcionariosMap.set(funcionarioStr, {
          documento: funcionarioStr.includes('-') ? funcionarioStr.split('-')[0].trim() : 'N/A',
          nombre: funcionarioStr.includes('-') ? funcionarioStr.split('-').slice(1).join('-').trim() : funcionarioStr
        });
      }

      // Formatear Fecha / Hora de Evaluación
      let fechaHoraStr = '';
      if (fechaHoraRaw) {
        if (typeof fechaHoraRaw === 'number') {
          const d = XLSX.SSF.parse_date_code(fechaHoraRaw);
          if (d) {
            const pad = n => String(n).padStart(2, '0');
            fechaHoraStr = `${pad(d.d)}/${pad(d.m)}/${d.y} ${pad(d.H)}:${pad(d.M)}`;
          }
        } else {
          fechaHoraStr = String(fechaHoraRaw);
        }
      }

      // Registro de Juicio Evaluativo
      juicios.push({
        id: idx + 1,
        numeroDocumento: numDoc,
        competenciaCodigo: compCodigo,
        rapCodigo: rapCodigo,
        estadoJuicio: juicioVal.includes('APROBADO') ? 'APROBADO' : 'POR EVALUAR',
        fechaHora: fechaHoraStr,
        funcionario: funcionarioStr
      });
    });

    const parsedFicha = {
      meta,
      aprendices: Array.from(aprendicesMap.values()),
      competencias: Array.from(competenciasMap.values()),
      resultadosAprendizaje: Array.from(rapsMap.values()),
      funcionarios: Array.from(funcionariosMap.values()),
      juicios
    };

    return {
      parsedFicha,
      totalFilas: rawRows.length,
      exitosos: juicios.length,
      invalidos: invalidRowsCount
    };
  },

  compareFichas(existingFicha, incomingFicha) {
    if (!existingFicha) return { isExisting: false, isExactDuplicate: false };

    const existingJuiciosCount = existingFicha.juicios?.length || 0;
    const incomingJuiciosCount = incomingFicha.juicios?.length || 0;

    const existingAprendicesSet = new Set(existingFicha.aprendices.map(a => a.numeroDocumento));
    const incomingAprendicesSet = new Set(incomingFicha.aprendices.map(a => a.numeroDocumento));

    let allSameAprendices = existingAprendicesSet.size === incomingAprendicesSet.size;
    if (allSameAprendices) {
      for (let doc of incomingAprendicesSet) {
        if (!existingAprendicesSet.has(doc)) {
          allSameAprendices = false;
          break;
        }
      }
    }

    const isExactDuplicate = allSameAprendices && existingJuiciosCount === incomingJuiciosCount;

    return {
      isExisting: true,
      isExactDuplicate,
      existingDiffers: !isExactDuplicate,
      duplicateStats: {
        existingAprendices: existingFicha.aprendices.length,
        existingJuicios: existingJuiciosCount,
        incomingAprendices: incomingFicha.aprendices.length,
        incomingJuicios: incomingJuiciosCount
      }
    };
  }
};
