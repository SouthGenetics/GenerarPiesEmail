// ==============================
// Utilidades genéricas
// ==============================

/**
 * Agrega un event listener de forma segura, sin romper si el elemento no existe
 */
export function agregarListenerSeguro(id, tipoEvento, callback) {
  const elemento = document.getElementById(id);
  if (elemento) {
    elemento.addEventListener(tipoEvento, callback);
  } else {
    console.warn(`[ListenerSeguro] Elemento no encontrado: #${id}`);
  }
}

/**
 * Crea un elemento DOM con una clase CSS
 */
export function crearElementoConClase(etiqueta, nombreClase) {
  const elemento = document.createElement(etiqueta);
  elemento.className = nombreClase;
  return elemento;
}

/**
 * Convierte un valor a número de forma segura
 */
export function numeroSeguro(valor) {
  return (typeof valor === "string" || typeof valor === "number") && !isNaN(Number(valor))
    ? Number(valor)
    : undefined;
}

/**
 * Recolorea un SVG data URI reemplazando currentColor
 */
export function recolorearSvgDataUri(dataUri, colorHex) {
  const contenidoBase64 = dataUri.split(",")[1];
  let contenidoSvg = atob(contenidoBase64);
  contenidoSvg = contenidoSvg.replace(/currentColor/g, colorHex);
  const nuevoBase64 = btoa(contenidoSvg);
  return `data:image/svg+xml;base64,${nuevoBase64}`;
}

/**
 * Sanitiza un nombre para usarlo como nombre de archivo
 */
export function sanitizarNombreArchivo(nombre) {
  return (nombre || "firma").replace(/[/\\?%*:|"<>]/g, "_") + ".png";
}

/**
 * Convierte un canvas a base64 PNG
 */
export function canvasABase64(canvas) {
  const dataURL = canvas.toDataURL("image/png");
  if (!dataURL.startsWith("data:image/png;base64,")) {
    return null;
  }
  return dataURL.split(",")[1];
}

/**
 * Descarga un blob como archivo
 */
export function descargarBlob(blob, nombreArchivo) {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}
