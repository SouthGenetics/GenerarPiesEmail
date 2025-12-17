// ==============================
// Utilidades genéricas
// ==============================

/**
 * Agrega un event listener de forma segura, sin romper si el elemento no existe.
 * @param {string} id - El ID del elemento DOM
 * @param {string} tipoEvento - El tipo de evento (ej: "click", "input", "change")
 * @param {Function} callback - La función a ejecutar cuando ocurra el evento
 * @returns {void}
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
 * Crea un elemento DOM con una clase CSS.
 * @param {string} etiqueta - El nombre de la etiqueta HTML (ej: "div", "span")
 * @param {string} nombreClase - El nombre de la clase CSS a asignar
 * @returns {HTMLElement} El elemento DOM creado
 */
export function crearElementoConClase(etiqueta, nombreClase) {
  const elemento = document.createElement(etiqueta);
  elemento.className = nombreClase;
  return elemento;
}

/**
 * Convierte un valor a número de forma segura.
 * @param {string|number} valor - El valor a convertir
 * @returns {number|undefined} El número convertido o undefined si no es válido
 */
export function numeroSeguro(valor) {
  return (typeof valor === "string" || typeof valor === "number") && !isNaN(Number(valor))
    ? Number(valor)
    : undefined;
}

/**
 * Recolorea un SVG data URI reemplazando "currentColor" por un color específico.
 * @param {string} dataUri - El data URI del SVG en base64
 * @param {string} colorHex - El color hexadecimal (ej: "#0096ab")
 * @returns {string} El nuevo data URI con el color aplicado
 */
export function recolorearSvgDataUri(dataUri, colorHex) {
  const contenidoBase64 = dataUri.split(",")[1];
  let contenidoSvg = atob(contenidoBase64);
  contenidoSvg = contenidoSvg.replace(/currentColor/g, colorHex);
  const nuevoBase64 = btoa(contenidoSvg);
  return `data:image/svg+xml;base64,${nuevoBase64}`;
}

/**
 * Sanitiza un nombre para usarlo como nombre de archivo, removiendo caracteres inválidos.
 * @param {string} nombre - El nombre original
 * @returns {string} El nombre sanitizado con extensión .png
 */
export function sanitizarNombreArchivo(nombre) {
  return (nombre || "firma").replace(/[/\\?%*:|"<>]/g, "_") + ".png";
}

/**
 * Convierte un canvas a string base64 en formato PNG.
 * @param {HTMLCanvasElement} canvas - El elemento canvas a convertir
 * @returns {string|null} El contenido base64 sin prefijo, o null si falla
 */
export function canvasABase64(canvas) {
  const dataURL = canvas.toDataURL("image/png");
  if (!dataURL.startsWith("data:image/png;base64,")) {
    return null;
  }
  return dataURL.split(",")[1];
}

/**
 * Descarga un blob como archivo, creando un enlace temporal.
 * @param {Blob} blob - El blob a descargar
 * @param {string} nombreArchivo - El nombre del archivo para la descarga
 * @returns {void}
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

/**
 * Muestra un toast de notificación
 * @param {string} mensaje - El mensaje a mostrar
 * @param {string} tipo - Tipo de toast: "warning", "error", "success", "info"
 * @param {number} duracion - Duración en ms antes de auto-ocultar
 */
export function mostrarToast(mensaje, tipo = "warning", duracion = 5000) {
  const contenedor = document.getElementById("toast-container");
  if (!contenedor) {
    console.warn("[Toast] Contenedor de toasts no encontrado");
    return;
  }

  const iconosSvg = {
    warning: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    error: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>`,
    success: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>`,
    info: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`,
  };

  const toast = document.createElement("div");
  toast.className = `toast toast-${tipo}`;
  toast.innerHTML = `
    ${iconosSvg[tipo] || iconosSvg.warning}
    <span class="toast-message">${mensaje}</span>
    <button class="toast-close" aria-label="Cerrar">&times;</button>
  `;

  const cerrarToast = () => {
    toast.classList.add("toast-hiding");
    setTimeout(() => toast.remove(), 250);
  };

  toast.querySelector(".toast-close").addEventListener("click", cerrarToast);
  contenedor.appendChild(toast);

  if (duracion > 0) {
    setTimeout(cerrarToast, duracion);
  }
}
