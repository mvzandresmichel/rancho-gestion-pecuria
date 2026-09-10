Rancho Gestión Pecuaria V6.11 — Nube
- Conexión Supabase configurada con Project URL y Publishable key.
- Autenticación por correo/contraseña.
- Migración local -> nube mediante "Subir datos locales a la nube".
- Descarga nube -> local.
- Sincronización automática de registros y Realtime.
- La contraseña de Supabase no está incluida.
- Las fotografías permanecen locales durante esta primera migración; no se suben como base64 a Postgres.


V6.11 - ALERTAS REPRODUCTIVAS Y GOOGLE SHEETS

Nuevas funciones:
- Alertas automáticas a los 60 y 80 días postparto, calculadas desde el último evento reproductivo "Parto".
- Cada alerta puede marcarse como atendida.
- Alertas pendientes visibles dentro de cada rancho.
- Alertas automáticas para calendarios sanitarios: revacunación y redesparasitación, calculadas desde la próxima fecha de cada campaña.
- Cada alerta sanitaria puede marcarse como atendida; al atender una campaña recurrente se calcula automáticamente su siguiente fecha según el intervalo en meses.
- Notificaciones del dispositivo cuando el navegador las permite. La aplicación debe haberse abierto al menos una vez y tener permiso de notificaciones.
- Sincronización automática con una Google Sheet mediante un Web App de Google Apps Script.

CONFIGURAR GOOGLE SHEETS
1. Crea una Google Sheet en Google Drive.
2. En la Sheet: Extensiones > Apps Script.
3. Pega este código y cambia SHEET_ID por el ID de tu hoja:

const SHEET_ID = 'PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET';

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const rows = data.rows || [];
  let sh = ss.getSheetByName('Animales') || ss.insertSheet('Animales');
  sh.clearContents();
  const headers = ['tipo','id','rancho','arete','nombre','sexo','raza','estado','estado_reproductivo','fecha_parto','dpp_hoy','alerta_60','alerta_80'];
  sh.getRange(1,1,1,headers.length).setValues([headers]);
  if (rows.length) sh.getRange(2,1,rows.length,headers.length).setValues(rows.map(r => headers.map(h => r[h] ?? '')));

  const raw = [
    ['Farms', JSON.stringify(data.farms || [])],
    ['Animals', JSON.stringify(data.animals || [])],
    ['Events', JSON.stringify(data.events || [])],
    ['Campaigns', JSON.stringify(data.campaigns || [])],
    ['Transactions', JSON.stringify(data.transactions || [])],
    ['Diets', JSON.stringify(data.diets || [])],
    ['ReproAlerts', JSON.stringify(data.reproAlerts || [])],
    ['HealthAlerts', JSON.stringify(data.healthAlerts || [])]
  ];
  let meta = ss.getSheetByName('Datos_App') || ss.insertSheet('Datos_App');
  meta.clearContents();
  meta.getRange(1,1,raw.length,2).setValues(raw);
  return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
}

4. Pulsa Implementar > Nueva implementación > Aplicación web.
5. Ejecutar como: tú mismo. Quién tiene acceso: cualquier persona con el enlace.
6. Autoriza los permisos solicitados y copia la URL del Web App.
7. En Rancho > Administración > Google Sheets, pega esa URL y pulsa "Guardar y activar sincronización".
8. La aplicación enviará los datos automáticamente cada vez que guardes cambios y también permite "Sincronizar ahora".

Nota: Google Sheets es el formato recomendado para esta integración. La hoja queda almacenada en Google Drive. La sincronización actual es de la aplicación hacia Google Sheets. Editar manualmente las celdas no cambia automáticamente la aplicación; la recuperación bidireccional puede añadirse en una siguiente versión.

VERSIÓN 6.9 - ALERTAS SANITARIAS POR ESPECIE, CATEGORÍA Y GRUPO
- Cada animal puede tener especie, categoría y grupo además del lote.
- Las campañas de vacunación y desparasitación permiten seleccionar especie, categoría y grupo/lote.
- Cada campaña tiene intervalo configurable en días, semanas, meses o años.
- Las alertas se generan por animal cuando la campaña está dirigida a una selección específica.
- Las alertas pueden marcarse individualmente como atendidas; al atenderlas se calcula la siguiente fecha según el intervalo configurado.
- Las campañas sin filtros siguen funcionando como campañas generales del hato.
- Los datos nuevos se incluyen en la sincronización con Google Sheets.

V6.11 - EVENTOS DE SERVICIO / INSEMINACIÓN
- Al seleccionar Servicio se muestran Tipo de servicio, código/identificación del toro y código de la pajilla.
- La próxima revisión de celo se calcula automáticamente a 21 días del servicio.
- La revisión de celo genera una alerta reproductiva y notificación cuando corresponde.
- Los datos se conservan en el historial reproductivo y se mantienen compatibles con la sincronización existente.
