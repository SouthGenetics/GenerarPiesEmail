// ==============================
// Enums y Valores Mágicos
// ==============================

// Claves de marca
export const ClaveMarca = {
  SOUTH_GENETICS: "southgenetics",
  PACIFIC_GENOMICS: "pacific-genomics",
};

// Marca por defecto
export const CLAVE_MARCA_DEFECTO = ClaveMarca.SOUTH_GENETICS;

// Clases CSS para firmas
export const ClaseCss = {
  FIRMA: "signature",
  FIRMA_IZQUIERDA: "sig-left",
  FIRMA_DERECHA: "sig-right",
  FIRMA_DIVISOR: "sig-divider",
  FIRMA_LOGO: "sig-logo",
  FIRMA_ICONO: "sig-icon",
  FIRMA_FILA: "sig-row",
  FIRMA_NOMBRE: "sig-name",
  FIRMA_CARGO: "sig-role",
  OPCION_MARCA: "brand-option",
  ACTIVO: "is-active",
  EXPORTAR_LIMPIO: "export-clean",
};

// IDs de elementos del DOM
export const IdDom = {
  CONTENEDOR_PREVIEW: "preview-container",
  FIRMAS_OCULTAS: "hidden-signatures",
  PLANTILLA_FIRMA: "signature-template",
  SLIDER_ANCHO_IZQUIERDO: "leftWidth",
  ENTRADA_EXCEL: "excelInput",
  BTN_APLICAR_DEFAULTS: "btnApplyDefaults",
  BTN_DESBLOQUEAR_SLIDERS: "btnUnlockSliders",
  BTN_DESCARGAR_PLANTILLA: "btnDownloadTemplate",
  BTN_DESCARGAR_ZIP: "btnDownloadZip",
};

// Campos de datos de firma (keys del Excel/formulario)
export const CampoDato = {
  NOMBRE: "Nombre",
  PUESTO: "Puesto",
  TELEFONO: "Teléfono",
  CELULAR: "Celular",
  DIRECCION: "Dirección",
  PAGINA_WEB: "Página web",
};

// Mapeo de iconos a campos de datos
export const MAPA_ICONO_A_CAMPO = {
  phone: CampoDato.TELEFONO,
  cellphone: CampoDato.CELULAR,
  location: CampoDato.DIRECCION,
  web: CampoDato.PAGINA_WEB,
};

// Archivos
export const Archivos = {
  DEFAULTS_JSON: "defaults.json",
  PLANTILLA_EXCEL: "plantilla_firmas.xlsx",
  ZIP_SALIDA: "firmas.zip",
};

// Nombres de hojas Excel
export const HojaExcel = {
  FIRMAS: "Firmas",
};

// Estilos de display CSS
export const EstiloDisplay = {
  NINGUNO: "none",
  INLINE_BLOCK: "inline-block",
};

// Tipos de eventos
export const TipoEvento = {
  INPUT: "input",
  CAMBIO: "change",
  CLICK: "click",
  ERROR: "error",
};

// Rango por defecto para ancho izquierdo
export const RANGO_ANCHO_IZQUIERDO_DEFECTO = {
  min: 180,
  max: 480,
};

// Tiempo de espera para renderizado (ms)
export const RETRASO_RENDERIZADO_MS = 50;

// Prefijos de logs
export const PrefijoLog = {
  DIAGNOSTICOS: "[Diagnosticos]",
  DEFAULTS: "[Defaults]",
  LISTENER_SEGURO: "[ListenerSeguro]",
  INICIALIZACION: "[Init]",
};

// Claves de localStorage
export const ClaveAlmacenamiento = {
  DEFAULTS_FIRMA: "sigDefaults",
};

// Mensajes de validación
export const MensajeValidacion = {
  CAMPOS_REQUERIDOS: "Por favor, complete al menos el campo Nombre o suba un archivo Excel.",
};
