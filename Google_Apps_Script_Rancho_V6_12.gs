const SHEET_ID = 'PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const ss = SpreadsheetApp.openById(SHEET_ID);

    writeObjects(ss, 'Ranchos', data.farms || []);
    writeObjects(ss, 'Animales', data.animals || []);
    writeObjects(ss, 'Eventos', data.events || []);
    writeObjects(ss, 'Campañas', data.campaigns || []);
    writeObjects(ss, 'Ventas', data.transactions || []);
    writeObjects(ss, 'Dietas', data.diets || []);
    writeObjects(ss, 'Alertas_Repro', data.reproAlerts || []);
    writeObjects(ss, 'Alertas_Salud', data.healthAlerts || []);
    writeObjects(ss, 'Resumen_Animales', data.rows || []);

    const meta = {
      aplicacion: data.app || 'Rancho Gestión Pecuaria',
      version: data.version || '',
      ultima_sincronizacion: data.syncedAt || new Date().toISOString()
    };
    writeObjects(ss, 'Control_Sync', [meta]);

    return json({ok:true, syncedAt:meta.ultima_sincronizacion});
  } catch (err) {
    return json({ok:false, error:String(err)});
  }
}

function writeObjects(ss, sheetName, rows) {
  let sh = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  sh.clearContents();
  if (!rows || !rows.length) return;

  const normalized = rows.map(r => {
    const o = {};
    Object.keys(r || {}).forEach(k => {
      const v = r[k];
      o[k] = (v !== null && typeof v === 'object') ? JSON.stringify(v) : v;
    });
    return o;
  });

  const headers = [...new Set(normalized.flatMap(r => Object.keys(r)))];
  const values = normalized.map(r => headers.map(h => r[h] ?? ''));
  sh.getRange(1,1,1,headers.length).setValues([headers]);
  sh.getRange(2,1,values.length,headers.length).setValues(values);
  sh.setFrozenRows(1);
  sh.autoResizeColumns(1, headers.length);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function test() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  Logger.log(ss.getName());
}
