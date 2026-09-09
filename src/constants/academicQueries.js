// Constantes académicas, reglas de negocio y consultas SQL (Guía GA-220501096)

export const FASES_DEFECTO = [
  { id: 1, nombre: 'FASE 1: ANÁLISIS', color: '#2563EB', descripcion: 'Diagnóstico de necesidades, identificación de requerimientos y estudio de factibilidad del proyecto formativo.' },
  { id: 2, nombre: 'FASE 2: PLANEACIÓN', color: '#7C3AED', descripcion: 'Diseño de la solución, arquitectura de software, modelado de bases de datos y planificación de entregables.' },
  { id: 3, nombre: 'FASE 3: EJECUCIÓN', color: '#39A900', descripcion: 'Desarrollo, codificación, implementación práctica de actividades y aseguramiento de calidad.' },
  { id: 4, nombre: 'FASE 4: EVALUACIÓN', color: '#D97706', descripcion: 'Pruebas de aceptación, sustentación final del proyecto, cierre pedagógico y evaluación de impacto.' }
];

export const REGLAS_NEGOCIO = [
  "1. Todo aprendiz debe tener un tipo de documento oficial registrado en el sistema.",
  "2. El número de documento no debe repetirse para dos aprendices diferentes (Unicidad / Primary Key).",
  "3. Todo aprendiz debe tener un estado de formación (EN FORMACIÓN, RETIRO VOLUNTARIO, TRASLADADO, etc.).",
  "4. Una competencia puede contener uno o varios resultados de aprendizaje (Relación 1:N).",
  "5. Un resultado de aprendizaje debe pertenecer obligatoriamente a una sola competencia.",
  "6. Un juicio evaluativo debe estar asociado a un aprendiz específico.",
  "7. Un juicio evaluativo debe estar asociado a un resultado de aprendizaje específico.",
  "8. Todo juicio evaluativo aprobado debe registrar fecha y hora exacta de evaluación.",
  "9. Todo juicio evaluativo aprobado debe indicar el funcionario/instructor que lo asentó.",
  "10. El juicio de evaluación solo puede tener valores controlados y estandarizados (APROBADO o POR EVALUAR)."
];

export const DICCIONARIO_DATOS = [
  { entidad: 'programa_formacion', campo: 'codigo', tipo: 'VARCHAR(20)', pk: true, fk: false, null: false, desc: 'Código oficial del programa en Sofia Plus (ej: 723106)' },
  { entidad: 'programa_formacion', campo: 'version', tipo: 'INT', pk: false, fk: false, null: false, desc: 'Número de versión curricular del programa' },
  { entidad: 'programa_formacion', campo: 'denominacion', tipo: 'VARCHAR(255)', pk: false, fk: false, null: false, desc: 'Nombre del programa formativo (ej: PRODUCCIÓN GANADERA)' },
  
  { entidad: 'ficha_caracterizacion', campo: 'numero', tipo: 'VARCHAR(20)', pk: true, fk: false, null: false, desc: 'Número único de la ficha SENA (ej: 3407847)' },
  { entidad: 'ficha_caracterizacion', campo: 'programa_codigo', tipo: 'VARCHAR(20)', pk: false, fk: true, null: false, desc: 'FK que relaciona la ficha con el programa' },
  { entidad: 'ficha_caracterizacion', campo: 'estado', tipo: 'VARCHAR(50)', pk: false, fk: false, null: false, desc: 'Estado de ejecución de la ficha' },
  { entidad: 'ficha_caracterizacion', campo: 'modalidad', tipo: 'VARCHAR(50)', pk: false, fk: false, null: false, desc: 'Modalidad de oferta: PRESENCIAL, VIRTUAL' },
  
  { entidad: 'aprendiz', campo: 'numero_documento', tipo: 'VARCHAR(20)', pk: true, fk: false, null: false, desc: 'Identificación única del aprendiz (CC, TI, etc.)' },
  { entidad: 'aprendiz', campo: 'tipo_documento', tipo: 'VARCHAR(10)', pk: false, fk: false, null: false, desc: 'Tipo de documento (CC, TI, PEP, CE)' },
  { entidad: 'aprendiz', campo: 'nombres', tipo: 'VARCHAR(120)', pk: false, fk: false, null: false, desc: 'Nombres del aprendiz' },
  { entidad: 'aprendiz', campo: 'apellidos', tipo: 'VARCHAR(120)', pk: false, fk: false, null: false, desc: 'Apellidos del aprendiz' },
  { entidad: 'aprendiz', campo: 'estado', tipo: 'VARCHAR(50)', pk: false, fk: false, null: false, desc: 'Estado académico: EN FORMACION, RETIRO, TRASLADADO' },
  { entidad: 'aprendiz', campo: 'ficha_numero', tipo: 'VARCHAR(20)', pk: false, fk: true, null: false, desc: 'FK que vincula el aprendiz a una ficha' },

  { entidad: 'competencia', campo: 'codigo', tipo: 'VARCHAR(30)', pk: true, fk: false, null: false, desc: 'Código identificador de la norma de competencia' },
  { entidad: 'competencia', campo: 'denominacion', tipo: 'TEXT', pk: false, fk: false, null: false, desc: 'Texto completo de la competencia laboral o básica' },
  { entidad: 'competencia', campo: 'programa_codigo', tipo: 'VARCHAR(20)', pk: false, fk: true, null: false, desc: 'FK al programa al que pertenece la competencia' },

  { entidad: 'resultado_aprendizaje', campo: 'codigo', tipo: 'VARCHAR(30)', pk: true, fk: false, null: false, desc: 'Código del RAP (ej: 202613)' },
  { entidad: 'resultado_aprendizaje', campo: 'competencia_codigo', tipo: 'VARCHAR(30)', pk: false, fk: true, null: false, desc: 'FK a la competencia correspondiente' },
  { entidad: 'resultado_aprendizaje', campo: 'denominacion', tipo: 'TEXT', pk: false, fk: false, null: false, desc: 'Descripción del resultado esperado de aprendizaje' },
  { entidad: 'resultado_aprendizaje', campo: 'fase_id', tipo: 'INT', pk: false, fk: true, null: true, desc: 'FK opcional a la fase del proyecto formativo' },

  { entidad: 'funcionario', campo: 'documento', tipo: 'VARCHAR(30)', pk: true, fk: false, null: false, desc: 'Cédula/identificación del funcionario o instructor' },
  { entidad: 'funcionario', campo: 'nombre_completo', tipo: 'VARCHAR(255)', pk: false, fk: false, null: false, desc: 'Nombres y apellidos del evaluador registrado' },

  { entidad: 'juicio_evaluativo', campo: 'id', tipo: 'BIGINT AUTO_INCREMENT', pk: true, fk: false, null: false, desc: 'Identificador único del registro de juicio' },
  { entidad: 'juicio_evaluativo', campo: 'aprendiz_documento', tipo: 'VARCHAR(20)', pk: false, fk: true, null: false, desc: 'FK al aprendiz evaluado' },
  { entidad: 'juicio_evaluativo', campo: 'rap_codigo', tipo: 'VARCHAR(30)', pk: false, fk: true, null: false, desc: 'FK al resultado de aprendizaje evaluado' },
  { entidad: 'juicio_evaluativo', campo: 'estado_juicio', tipo: "ENUM('APROBADO', 'POR EVALUAR')", pk: false, fk: false, null: false, desc: 'Calificación asignada al aprendiz en el RAP' },
  { entidad: 'juicio_evaluativo', campo: 'fecha_hora_evaluacion', tipo: 'DATETIME', pk: false, fk: false, null: true, desc: 'Momento exacto en que se asentó el juicio' },
  { entidad: 'juicio_evaluativo', campo: 'funcionario_documento', tipo: 'VARCHAR(30)', pk: false, fk: true, null: true, desc: 'FK al funcionario responsable de la calificación' }
];

export const PREGUNTAS_ACADEMICAS = [
  {
    id: 1,
    pregunta: "¿Cuántos aprendices tiene la ficha o programa?",
    descripcion: "Total de aprendices matriculados en la ficha actual.",
    sql: `SELECT COUNT(*) AS total_aprendices \nFROM aprendiz \nWHERE ficha_numero = ':ficha';`,
    run: (ficha) => {
      const count = ficha.aprendices.length;
      return {
        columns: ['Total Aprendices', 'Ficha', 'Programa'],
        rows: [[count, ficha.meta.ficha, ficha.meta.programa]]
      };
    }
  },
  {
    id: 2,
    pregunta: "¿Cuántos aprendices están en formación, retirados o trasladados?",
    descripcion: "Agrupación de aprendices según su estado de formación.",
    sql: `SELECT estado, COUNT(*) AS cantidad \nFROM aprendiz \nGROUP BY estado \nORDER BY cantidad DESC;`,
    run: (ficha) => {
      const counts = {};
      ficha.aprendices.forEach(a => {
        counts[a.estado] = (counts[a.estado] || 0) + 1;
      });
      return {
        columns: ['Estado de Aprendiz', 'Cantidad de Aprendices', 'Porcentaje'],
        rows: Object.entries(counts).map(([estado, cant]) => [
          estado,
          cant,
          `${((cant / ficha.aprendices.length) * 100).toFixed(1)}%`
        ])
      };
    }
  },
  {
    id: 3,
    pregunta: "¿Cuántos resultados de aprendizaje tiene cada aprendiz?",
    descripcion: "Total de RAPs asociados al programa de formación por aprendiz.",
    sql: `SELECT a.numero_documento, a.nombres, a.apellidos, COUNT(j.rap_codigo) AS total_raps\nFROM aprendiz a\nJOIN juicio_evaluativo j ON a.numero_documento = j.aprendiz_documento\nGROUP BY a.numero_documento, a.nombres, a.apellidos\nLIMIT 10;`,
    run: (ficha) => {
      const totalRaps = ficha.resultadosAprendizaje.length;
      return {
        columns: ['Documento', 'Aprendiz', 'Total RAPs en Programa', 'Estado'],
        rows: ficha.aprendices.slice(0, 10).map(a => [
          a.numeroDocumento,
          a.nombreCompleto,
          totalRaps,
          a.estado
        ])
      };
    }
  },
  {
    id: 4,
    pregunta: "¿Cuántos resultados de aprendizaje han sido aprobados?",
    descripcion: "Consolidado total de juicios con resultado 'APROBADO'.",
    sql: `SELECT COUNT(*) AS juicios_aprobados \nFROM juicio_evaluativo \nWHERE estado_juicio = 'APROBADO';`,
    run: (ficha) => {
      const aprobados = ficha.juicios.filter(j => j.estadoJuicio === 'APROBADO').length;
      const total = ficha.juicios.length;
      return {
        columns: ['Juicios Aprobados', 'Total Evaluaciones', 'Tasa Global Aprobación'],
        rows: [[aprobados, total, `${((aprobados / total) * 100).toFixed(2)}%`]]
      };
    }
  },
  {
    id: 5,
    pregunta: "¿Cuántos resultados están pendientes por evaluar?",
    descripcion: "Consolidado de juicios en estado 'POR EVALUAR'.",
    sql: `SELECT COUNT(*) AS juicios_pendientes \nFROM juicio_evaluativo \nWHERE estado_juicio = 'POR EVALUAR';`,
    run: (ficha) => {
      const pendientes = ficha.juicios.filter(j => j.estadoJuicio === 'POR EVALUAR').length;
      const total = ficha.juicios.length;
      return {
        columns: ['Juicios Pendientes', 'Total Evaluaciones', 'Porcentaje Pendiente'],
        rows: [[pendientes, total, `${((pendientes / total) * 100).toFixed(2)}%`]]
      };
    }
  },
  {
    id: 6,
    pregunta: "¿Cuál es el avance porcentual de cada aprendiz?",
    descripcion: "Cálculo del porcentaje de RAPs aprobados sobre el total asignado por aprendiz.",
    sql: `SELECT \n  a.numero_documento, \n  CONCAT(a.nombres, ' ', a.apellidos) AS aprendiz,\n  COUNT(CASE WHEN j.estado_juicio = 'APROBADO' THEN 1 END) AS aprobados,\n  COUNT(*) AS total_juicios,\n  ROUND((COUNT(CASE WHEN j.estado_juicio = 'APROBADO' THEN 1 END) * 100.0) / COUNT(*), 2) AS porcentaje_avance\nFROM aprendiz a\nJOIN juicio_evaluativo j ON a.numero_documento = j.aprendiz_documento\nGROUP BY a.numero_documento, a.nombres, a.apellidos\nORDER BY porcentaje_avance DESC;`,
    run: (ficha) => {
      const stats = ficha.aprendices.map(a => {
        const juiciosA = ficha.juicios.filter(j => j.numeroDocumento === a.numeroDocumento);
        const aprobados = juiciosA.filter(j => j.estadoJuicio === 'APROBADO').length;
        const total = juiciosA.length;
        const pct = total > 0 ? ((aprobados / total) * 100).toFixed(1) : '0.0';
        return [
          a.numeroDocumento,
          a.nombreCompleto,
          a.estado,
          aprobados,
          total - aprobados,
          `${pct}%`
        ];
      });
      return {
        columns: ['Documento', 'Aprendiz', 'Estado', 'Aprobados', 'Pendientes', '% Avance'],
        rows: stats.sort((a, b) => parseFloat(b[5]) - parseFloat(a[5]))
      };
    }
  },
  {
    id: 7,
    pregunta: "¿Qué competencias tienen mayor nivel de aprobación?",
    descripcion: "Ranking de competencias según porcentaje de juicios aprobados.",
    sql: `SELECT \n  c.codigo, \n  c.denominacion,\n  COUNT(CASE WHEN j.estado_juicio = 'APROBADO' THEN 1 END) AS aprobados,\n  COUNT(*) AS total,\n  ROUND((COUNT(CASE WHEN j.estado_juicio = 'APROBADO' THEN 1 END) * 100.0) / COUNT(*), 1) AS pct_aprobacion\nFROM competencia c\nJOIN resultado_aprendizaje r ON c.codigo = r.competencia_codigo\nJOIN juicio_evaluativo j ON r.codigo = j.rap_codigo\nGROUP BY c.codigo, c.denominacion\nORDER BY pct_aprobacion DESC;`,
    run: (ficha) => {
      const compStats = ficha.competencias.map(c => {
        const juiciosComp = ficha.juicios.filter(j => j.competenciaCodigo === c.codigo);
        const aprobados = juiciosComp.filter(j => j.estadoJuicio === 'APROBADO').length;
        const total = juiciosComp.length;
        const pct = total > 0 ? ((aprobados / total) * 100) : 0;
        return {
          codigo: c.codigo,
          nombre: c.denominacion,
          aprobados,
          total,
          pct: pct.toFixed(1)
        };
      });
      compStats.sort((a, b) => parseFloat(b.pct) - parseFloat(a.pct));
      return {
        columns: ['Código', 'Competencia', 'Aprobados', 'Total Juicios', '% Aprobación'],
        rows: compStats.map(c => [c.codigo, c.nombre, c.aprobados, c.total, `${c.pct}%`])
      };
    }
  },
  {
    id: 8,
    pregunta: "¿Qué funcionario registró determinado juicio evaluativo?",
    descripcion: "Detalle de funcionarios y cantidad de juicios registrados.",
    sql: `SELECT \n  COALESCE(f.nombre_completo, 'Sin Asignar') AS funcionario,\n  COUNT(*) AS total_registrados,\n  COUNT(CASE WHEN j.estado_juicio = 'APROBADO' THEN 1 END) AS aprobados\nFROM juicio_evaluativo j\nLEFT JOIN funcionario f ON j.funcionario_documento = f.documento\nGROUP BY funcionario\nORDER BY total_registrados DESC;`,
    run: (ficha) => {
      const funcMap = {};
      ficha.juicios.forEach(j => {
        const fName = j.funcionario || 'Sin asignar / Pendiente';
        if (!funcMap[fName]) funcMap[fName] = { total: 0, aprobados: 0 };
        funcMap[fName].total++;
        if (j.estadoJuicio === 'APROBADO') funcMap[fName].aprobados++;
      });
      return {
        columns: ['Funcionario / Evaluador', 'Total Evaluaciones', 'Aprobadas', 'Por Evaluar'],
        rows: Object.entries(funcMap).map(([f, data]) => [
          f,
          data.total,
          data.aprobados,
          data.total - data.aprobados
        ]).sort((a, b) => b[2] - a[2])
      };
    }
  },
  {
    id: 9,
    pregunta: "¿En qué fecha y hora se registró cada juicio?",
    descripcion: "Auditoría cronológica de los juicios registrados en Sofia Plus.",
    sql: `SELECT \n  j.fecha_hora_evaluacion,\n  a.numero_documento,\n  CONCAT(a.nombres, ' ', a.apellidos) AS aprendiz,\n  j.rap_codigo,\n  j.estado_juicio,\n  f.nombre_completo AS funcionario\nFROM juicio_evaluativo j\nJOIN aprendiz a ON j.aprendiz_documento = a.numero_documento\nLEFT JOIN funcionario f ON j.funcionario_documento = f.documento\nWHERE j.fecha_hora_evaluacion IS NOT NULL\nORDER BY j.fecha_hora_evaluacion DESC\nLIMIT 15;`,
    run: (ficha) => {
      const conFecha = ficha.juicios.filter(j => j.fechaHora && j.fechaHora.trim() !== '');
      const apMap = new Map(ficha.aprendices.map(a => [a.numeroDocumento, a.nombreCompleto]));
      return {
        columns: ['Fecha y Hora', 'Aprendiz', 'Cód RAP', 'Estado', 'Funcionario'],
        rows: conFecha.slice(0, 15).map(j => [
          j.fechaHora,
          apMap.get(j.numeroDocumento) || j.numeroDocumento,
          j.rapCodigo,
          j.estadoJuicio,
          j.funcionario || 'N/A'
        ])
      };
    }
  },
  {
    id: 10,
    pregunta: "¿Qué aprendices tienen juicios pendientes?",
    descripcion: "Identificación de aprendices que tienen al menos un juicio 'POR EVALUAR'.",
    sql: `SELECT \n  a.numero_documento,\n  CONCAT(a.nombres, ' ', a.apellidos) AS aprendiz,\n  a.estado,\n  COUNT(CASE WHEN j.estado_juicio = 'POR EVALUAR' THEN 1 END) AS juicios_pendientes\nFROM aprendiz a\nJOIN juicio_evaluativo j ON a.numero_documento = j.aprendiz_documento\nGROUP BY a.numero_documento, a.nombres, a.apellidos, a.estado\nHAVING juicios_pendientes > 0\nORDER BY juicios_pendientes DESC;`,
    run: (ficha) => {
      const resultado = [];
      ficha.aprendices.forEach(a => {
        const juiciosA = ficha.juicios.filter(j => j.numeroDocumento === a.numeroDocumento);
        const pendientes = juiciosA.filter(j => j.estadoJuicio === 'POR EVALUAR').length;
        if (pendientes > 0) {
          resultado.push([
            a.numeroDocumento,
            a.nombreCompleto,
            a.estado,
            pendientes,
            juiciosA.length - pendientes,
            juiciosA.length
          ]);
        }
      });
      return {
        columns: ['Documento', 'Aprendiz', 'Estado', 'Pendientes', 'Aprobados', 'Total RAPs'],
        rows: resultado.sort((a, b) => b[3] - a[3])
      };
    }
  }
];
