# Módulo 6: Motor de Importación Masiva Sofia Plus

## 1. Ubicación del Código
- **Componente:** `src/features/importador/ImportModal.jsx`
- **Servicio:** `src/services/parserService.js`
- **Formato de Apertura:** Ventana Emergente Modal accesible desde el Portal de Inicio o desde el Header

---

## 2. Reglas de Negocio y Validación de Carga
El servicio `parserService.js` procesa en caliente sábanas de datos en formato `.xls` (BIFF8) y `.xlsx` (OpenXML) directamente en el navegador sin enviar archivos a servidores externos:

1. **Lectura y Desestructuración:**
   - Detecta y extrae los metadatos de la ficha (Ficha, Programa, Regional, Centro, Modalidad, Estado de la ficha).
   - Recorre las filas a partir de la fila 13 y genera las entidades relacionales libres de duplicados.

2. **Detección de Duplicidad y Auditoría:**
   - **Caso 1 (Ficha Nueva):** Notifica con badge verde que la ficha no existía y la prepara para ingresar al repositorio.
   - **Caso 2 (Ficha Idéntica / Duplicada):** Compara los números de identificación de todos los aprendices y la cantidad total de juicios. Si coinciden con una ficha ya existente, despliega una alerta ámbar indicando que la ficha ya está cargada con exactamente los mismos datos.
   - **Caso 3 (Actualización de Ficha Existente):** Si la ficha ya existía pero contiene registros nuevos o modificados, notifica que se realizará una actualización y sobrescritura de los datos.

3. **Recuento de Auditoría de Carga:**
   - Total de filas leídas en el archivo.
   - Cantidad de registros/juicios válidos e importados con éxito.
   - Cantidad de filas omitidas o inválidas (por ejemplo, filas sin documento o vacías).
   - Conteo de entidades detectadas: Aprendices, Competencias y RAPs.

4. **Botones de Control:**
   - **"Importar / Actualizar Ficha":** Confirma la integración y redirige automáticamente al Dashboard de la ficha recién importada.
   - **"Cancelar":** Aborta el proceso sin alterar el estado del sistema.
