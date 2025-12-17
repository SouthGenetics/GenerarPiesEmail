import {
  CLAVES_ICONOS,
  SVGS_ICONOS,
  MARCAS,
  MUESTRA_PREVIEW_POR_MARCA,
  CONFIG_DEFECTO,
  DEFAULTS_FALLBACK,
  MAPA_CONFIG_A_CSS,
  MAPA_MARCA_A_CSS,
  ESCALA_EXPORTACION,
  CAMPOS_FORMULARIO_MANUAL,
  IDS_SLIDERS,
  MAPA_SLIDER_A_CONFIG,
} from "./constants.js";

import {
  agregarListenerSeguro,
  crearElementoConClase,
  numeroSeguro,
  recolorearSvgDataUri,
  sanitizarNombreArchivo,
  canvasABase64,
  descargarBlob,
} from "./utils.js";

import {
  CLAVE_MARCA_DEFECTO,
  ClaseCss,
  IdDom,
  CampoDato,
  Archivos,
  HojaExcel,
  EstiloDisplay,
  TipoEvento,
  RANGO_ANCHO_IZQUIERDO_DEFECTO,
  RETRASO_RENDERIZADO_MS,
  PrefijoLog,
  ClaveAlmacenamiento,
} from "./enums.js";

const estadoApp = {
  claveMarcaActual: CLAVE_MARCA_DEFECTO,
  marcaActual: MARCAS[CLAVE_MARCA_DEFECTO],
  iconosMarcaActual: {},
  cacheIconosRecoloreados: {},
  defaultsFirmaEstaticos: null,
  filasExcel: [],
};

const configuracion = { ...CONFIG_DEFECTO };

async function cargarDefaultsDeArchivo() {
  try {
    const respuesta = await fetch(Archivos.DEFAULTS_JSON);
    if (!respuesta.ok) {
      throw new Error(`HTTP error! status: ${respuesta.status}`);
    }
    estadoApp.defaultsFirmaEstaticos = await respuesta.json();
    return estadoApp.defaultsFirmaEstaticos;
  } catch (error) {
    console.warn(
      `${PrefijoLog.DEFAULTS} Could not load ${Archivos.DEFAULTS_JSON}, using fallback values:`,
      error
    );
    estadoApp.defaultsFirmaEstaticos = { ...DEFAULTS_FALLBACK };
    return estadoApp.defaultsFirmaEstaticos;
  }
}

function actualizarSliderAnchoIzquierdo(rango) {
  const slider = document.getElementById(IdDom.SLIDER_ANCHO_IZQUIERDO);
  if (!slider) return;
  slider.min = rango.min;
  slider.max = rango.max;
  if (configuracion.leftColWidth < rango.min) {
    configuracion.leftColWidth = rango.min;
  } else if (configuracion.leftColWidth > rango.max) {
    configuracion.leftColWidth = rango.max;
  }
  slider.value = configuracion.leftColWidth;
  aplicarConfigACSS();
}

function renderizarVistaPrevia() {
  const contenedor = document.getElementById(IdDom.CONTENEDOR_PREVIEW);
  if (!contenedor) return;
  const muestra =
    MUESTRA_PREVIEW_POR_MARCA[estadoApp.claveMarcaActual] ||
    MUESTRA_PREVIEW_POR_MARCA[CLAVE_MARCA_DEFECTO];
  contenedor.innerHTML = "";
  const firma = crearDivFirma(muestra);
  firma.id = IdDom.PLANTILLA_FIRMA;
  contenedor.appendChild(firma);
}

function aplicarConfigACSS() {
  const raiz = document.documentElement;
  for (const [claveConfig, variableCss] of Object.entries(MAPA_CONFIG_A_CSS)) {
    const valor = configuracion[claveConfig];
    if (valor !== undefined) {
      raiz.style.setProperty(variableCss, valor + "px");
    }
  }
}

function aplicarTemaMarca(marca) {
  const raiz = document.documentElement;
  for (const [claveMarca, variableCss] of Object.entries(MAPA_MARCA_A_CSS)) {
    const valor = marca[claveMarca];
    if (valor !== undefined) {
      raiz.style.setProperty(variableCss, valor);
    }
  }
}

function agregarDiagnosticos() {
  window.addEventListener(
    TipoEvento.ERROR,
    (e) => {
      const src = (e && e.target && (e.target.src || e.target.href)) || e.filename || "";
      console.warn(`${PrefijoLog.DIAGNOSTICOS} window error:`, e.message || e.type, src);
    },
    true
  );

  window.addEventListener("unhandledrejection", (e) => {
    console.warn(`${PrefijoLog.DIAGNOSTICOS} unhandledrejection:`, e.reason);
  });

  function adjuntarLoggerImagen(img) {
    if (!img) return;
    img.addEventListener(TipoEvento.ERROR, () => {
      console.warn(`${PrefijoLog.DIAGNOSTICOS} Failed to load image:`, img.src);
    });
  }

  try {
    const imagenes = document.querySelectorAll("img");
    for (const img of imagenes) {
      adjuntarLoggerImagen(img);
    }
  } catch {
    // ignorar si DOM no está listo
  }
}

async function asegurarIconosParaMarca(claveMarca) {
  if (estadoApp.cacheIconosRecoloreados[claveMarca]) {
    return estadoApp.cacheIconosRecoloreados[claveMarca];
  }

  const marca = MARCAS[claveMarca];
  const mapaIconos = {};

  for (const clave of CLAVES_ICONOS) {
    const svgOriginal = SVGS_ICONOS[clave];
    if (svgOriginal) {
      mapaIconos[clave] = recolorearSvgDataUri(svgOriginal, marca.primary);
    }
  }

  estadoApp.cacheIconosRecoloreados[claveMarca] = mapaIconos;
  return mapaIconos;
}

function actualizarActivosMarcaPreview() {
  const iconos = document.querySelectorAll(`.${ClaseCss.FIRMA_ICONO}[data-icon]`);
  for (const img of iconos) {
    const clave = img.dataset.icon;
    if (estadoApp.iconosMarcaActual[clave]) {
      img.src = estadoApp.iconosMarcaActual[clave];
    }
  }

  const logos = document.querySelectorAll(`.${ClaseCss.FIRMA_LOGO}`);
  for (const img of logos) {
    img.src = estadoApp.marcaActual.logo;
    img.alt = estadoApp.marcaActual.label;
    img.addEventListener(TipoEvento.ERROR, () => {
      console.warn(`${PrefijoLog.DIAGNOSTICOS} Failed to load logo:`, img.src);
    });
  }
}

function actualizarUIToggleMarca(claveActiva) {
  const opcionesMarca = document.querySelectorAll(`.${ClaseCss.OPCION_MARCA}`);
  for (const etiqueta of opcionesMarca) {
    const entrada = etiqueta.querySelector('input[name="brand"]');
    const estaActivo = etiqueta.dataset.brand === claveActiva;
    etiqueta.classList.toggle(ClaseCss.ACTIVO, estaActivo);
    if (entrada) {
      entrada.checked = estaActivo;
    }
  }
}

async function establecerMarca(claveMarca) {
  if (!MARCAS[claveMarca]) return;
  estadoApp.claveMarcaActual = claveMarca;
  estadoApp.marcaActual = MARCAS[claveMarca];
  aplicarTemaMarca(estadoApp.marcaActual);
  actualizarSliderAnchoIzquierdo(
    estadoApp.marcaActual.leftWidthRange || RANGO_ANCHO_IZQUIERDO_DEFECTO
  );
  estadoApp.iconosMarcaActual = await asegurarIconosParaMarca(claveMarca);
  if (typeof actualizarVistaPreviaEnVivo === "function") {
    actualizarVistaPreviaEnVivo();
  } else {
    renderizarVistaPrevia();
  }
  actualizarActivosMarcaPreview();
  actualizarUIToggleMarca(claveMarca);
}

function crearElementoLogo() {
  const logo = document.createElement("img");
  logo.src = estadoApp.marcaActual.logo;
  logo.className = ClaseCss.FIRMA_LOGO;
  logo.alt = estadoApp.marcaActual.label;
  logo.addEventListener(TipoEvento.ERROR, () => {
    console.warn(`${PrefijoLog.DIAGNOSTICOS} Failed to load logo:`, logo.src);
  });
  return logo;
}

function crearColumnaIzquierda() {
  const izquierda = crearElementoConClase("div", ClaseCss.FIRMA_IZQUIERDA);
  izquierda.appendChild(crearElementoLogo());
  return izquierda;
}

function crearFilaContacto(claveIcono, texto) {
  if (!texto) return null;

  const fila = crearElementoConClase("div", ClaseCss.FIRMA_FILA);
  const icono = document.createElement("img");
  icono.className = ClaseCss.FIRMA_ICONO;
  icono.dataset.icon = claveIcono;
  icono.src = estadoApp.iconosMarcaActual[claveIcono] || SVGS_ICONOS[claveIcono] || "";
  icono.alt = "";
  icono.addEventListener(TipoEvento.ERROR, () => {
    console.warn(`${PrefijoLog.DIAGNOSTICOS} Failed to load icon:`, icono.src);
  });

  const etiqueta = document.createElement("span");
  etiqueta.textContent = texto;

  fila.appendChild(icono);
  fila.appendChild(etiqueta);
  return fila;
}

function crearColumnaDerecha(fila) {
  const derecha = crearElementoConClase("div", ClaseCss.FIRMA_DERECHA);

  const nombre = crearElementoConClase("div", ClaseCss.FIRMA_NOMBRE);
  nombre.textContent = fila[CampoDato.NOMBRE] || "";
  derecha.appendChild(nombre);

  const cargo = crearElementoConClase("div", ClaseCss.FIRMA_CARGO);
  cargo.textContent = fila[CampoDato.PUESTO] || "";
  derecha.appendChild(cargo);

  const camposContacto = [
    ["phone", fila[CampoDato.TELEFONO]],
    ["cellphone", fila[CampoDato.CELULAR]],
    ["location", fila[CampoDato.DIRECCION]],
    ["web", fila[CampoDato.PAGINA_WEB]],
  ];

  for (const [claveIcono, texto] of camposContacto) {
    const filaContacto = crearFilaContacto(claveIcono, texto);
    if (filaContacto) {
      derecha.appendChild(filaContacto);
    }
  }

  return derecha;
}

function crearDivFirma(fila) {
  const div = crearElementoConClase("div", ClaseCss.FIRMA);
  div.appendChild(crearColumnaIzquierda());
  div.appendChild(crearElementoConClase("div", ClaseCss.FIRMA_DIVISOR));
  div.appendChild(crearColumnaDerecha(fila));
  return div;
}

function configurarListenersSliders() {
  for (const [idSlider, claveConfig] of Object.entries(MAPA_SLIDER_A_CONFIG)) {
    if (idSlider === IdDom.SLIDER_ANCHO_IZQUIERDO) {
      agregarListenerSeguro(idSlider, TipoEvento.INPUT, (e) => {
        const rango = estadoApp.marcaActual.leftWidthRange || RANGO_ANCHO_IZQUIERDO_DEFECTO;
        const valor = parseInt(e.target.value, 10);
        configuracion[claveConfig] = Math.min(rango.max, Math.max(rango.min, valor));
        aplicarConfigACSS();
      });
    } else {
      agregarListenerSeguro(idSlider, TipoEvento.INPUT, (e) => {
        configuracion[claveConfig] = parseInt(e.target.value, 10) || configuracion[claveConfig];
        aplicarConfigACSS();
      });
    }
  }
}

function configurarListenersMarca() {
  const radiosMarca = document.querySelectorAll('input[name="brand"]');
  for (const radio of radiosMarca) {
    radio.addEventListener(TipoEvento.CAMBIO, async (e) => {
      if (e.target.checked) {
        await establecerMarca(e.target.value);
      }
    });
  }
}

function configurarListenerExcel() {
  agregarListenerSeguro(IdDom.ENTRADA_EXCEL, TipoEvento.CAMBIO, (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = (evt) => {
      const datos = new Uint8Array(evt.target.result);
      const libroExcel = XLSX.read(datos, { type: "array" });
      const nombreHoja = libroExcel.SheetNames[0];
      const hoja = libroExcel.Sheets[nombreHoja];
      estadoApp.filasExcel = XLSX.utils.sheet_to_json(hoja);
      alert(`Cargadas ${estadoApp.filasExcel.length} filas de Excel.`);
    };
    lector.readAsArrayBuffer(archivo);
  });
}

function configurarListenersFormularioManual() {
  for (const id of CAMPOS_FORMULARIO_MANUAL) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.addEventListener(TipoEvento.INPUT, actualizarVistaPreviaEnVivo);
    }
  }
}

function configurarListenersBotones() {
  agregarListenerSeguro(IdDom.BTN_APLICAR_DEFAULTS, TipoEvento.CLICK, async () => {
    if (!estadoApp.defaultsFirmaEstaticos) {
      await cargarDefaultsDeArchivo();
    }
    aplicarDefaultsFirma(estadoApp.defaultsFirmaEstaticos);
    bloquearSliders();
  });

  agregarListenerSeguro(IdDom.BTN_DESBLOQUEAR_SLIDERS, TipoEvento.CLICK, desbloquearSliders);

  agregarListenerSeguro(IdDom.BTN_DESCARGAR_PLANTILLA, TipoEvento.CLICK, () => {
    const encabezados = [
      CampoDato.NOMBRE,
      CampoDato.PUESTO,
      CampoDato.TELEFONO,
      CampoDato.CELULAR,
      CampoDato.DIRECCION,
      CampoDato.PAGINA_WEB,
    ];
    const filaMuestra = [
      "Juan Pérez",
      "Representante de ventas",
      "'+52 55 1234 5678",
      "'+52 55 0000 0000",
      "World Trade Center México – Montecito 50, piso 20 of. 314 y 15. Benito Juárez, Col. Nápoles. CP 03180",
      "www.southgenetics.com",
    ];

    const hojaCalculo = XLSX.utils.aoa_to_sheet([encabezados, filaMuestra]);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hojaCalculo, HojaExcel.FIRMAS);
    XLSX.writeFile(libro, Archivos.PLANTILLA_EXCEL);
  });

  agregarListenerSeguro(IdDom.BTN_DESCARGAR_ZIP, TipoEvento.CLICK, manejarDescargaZip);
}

function configurarTodosLosListeners() {
  configurarListenersSliders();
  configurarListenersMarca();
  configurarListenerExcel();
  configurarListenersFormularioManual();
  configurarListenersBotones();
}

async function inicializar() {
  try {
    agregarDiagnosticos();
    await cargarDefaultsDeArchivo();
    aplicarConfigACSS();
    configurarTodosLosListeners();
    await establecerMarca(estadoApp.claveMarcaActual);
    await actualizarVistaPreviaEnVivo();
  } catch (error) {
    console.error(`${PrefijoLog.INICIALIZACION} Error durante la inicialización:`, error);
  }
}

inicializar();

function obtenerDefaultsDeFuentes(defaultsEntrada) {
  if (defaultsEntrada) return defaultsEntrada;
  if (window.__sigDefaults) return window.__sigDefaults;

  try {
    const crudo = localStorage.getItem(ClaveAlmacenamiento.DEFAULTS_FIRMA);
    return crudo ? JSON.parse(crudo) : null;
  } catch (e) {
    console.warn(
      `${PrefijoLog.DEFAULTS} Failed to parse localStorage.${ClaveAlmacenamiento.DEFAULTS_FIRMA}`,
      e
    );
    return null;
  }
}

function aplicarDefaultsAConfig(defs) {
  for (const idSlider of Object.keys(MAPA_SLIDER_A_CONFIG)) {
    const claveConfig = MAPA_SLIDER_A_CONFIG[idSlider];
    const numero = numeroSeguro(defs[claveConfig]);
    if (numero !== undefined) {
      configuracion[claveConfig] = numero;
    }
  }
}

function sincronizarSlidersConConfig() {
  for (const [id, claveConfig] of Object.entries(MAPA_SLIDER_A_CONFIG)) {
    const elemento = document.getElementById(id);
    if (elemento && configuracion[claveConfig] !== undefined) {
      elemento.value = configuracion[claveConfig];
    }
  }
}

function aplicarDefaultsFirma(defaultsEntrada) {
  const defs = obtenerDefaultsDeFuentes(defaultsEntrada);

  if (!defs) {
    console.warn(`${PrefijoLog.DEFAULTS} No signature defaults found.`);
    return false;
  }

  aplicarDefaultsAConfig(defs);
  sincronizarSlidersConConfig();
  aplicarConfigACSS();
  renderizarVistaPrevia();

  return true;
}

function bloquearSliders() {
  for (const id of IDS_SLIDERS) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.disabled = true;
    }
  }
  document.getElementById(IdDom.BTN_APLICAR_DEFAULTS).style.display = EstiloDisplay.NINGUNO;
  document.getElementById(IdDom.BTN_DESBLOQUEAR_SLIDERS).style.display = EstiloDisplay.INLINE_BLOCK;
}

function desbloquearSliders() {
  for (const id of IDS_SLIDERS) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.disabled = false;
    }
  }
  document.getElementById(IdDom.BTN_APLICAR_DEFAULTS).style.display = EstiloDisplay.INLINE_BLOCK;
  document.getElementById(IdDom.BTN_DESBLOQUEAR_SLIDERS).style.display = EstiloDisplay.NINGUNO;
}

function obtenerDatosFormularioManual(usarPlaceholders = true) {
  const obtenerValor = (id) => {
    const elemento = document.getElementById(id);
    const valor = elemento.value.trim();
    if (usarPlaceholders) {
      return valor || elemento.placeholder || "";
    }
    return valor;
  };
  return {
    [CampoDato.NOMBRE]: obtenerValor("manualNombre"),
    [CampoDato.PUESTO]: obtenerValor("manualPuesto"),
    [CampoDato.TELEFONO]: obtenerValor("manualTelefono"),
    [CampoDato.CELULAR]: obtenerValor("manualCelular"),
    [CampoDato.DIRECCION]: obtenerValor("manualDireccion"),
    [CampoDato.PAGINA_WEB]: obtenerValor("manualWeb"),
  };
}

async function actualizarVistaPreviaEnVivo() {
  const datosFormulario = obtenerDatosFormularioManual();
  estadoApp.iconosMarcaActual = await asegurarIconosParaMarca(estadoApp.claveMarcaActual);
  const contenedor = document.getElementById(IdDom.CONTENEDOR_PREVIEW);
  contenedor.innerHTML = "";
  const firma = crearDivFirma(datosFormulario);
  firma.id = IdDom.PLANTILLA_FIRMA;
  contenedor.appendChild(firma);
}

function obtenerFilasAProcesar() {
  if (estadoApp.filasExcel.length > 0) {
    return estadoApp.filasExcel;
  }
  return [obtenerDatosFormularioManual(false)];
}

async function renderizarFirmaACanvas(fila, contenedor) {
  const divFirma = crearDivFirma(fila);
  contenedor.appendChild(divFirma);

  await new Promise((resolver) => setTimeout(resolver, RETRASO_RENDERIZADO_MS));

  divFirma.classList.add(ClaseCss.EXPORTAR_LIMPIO);
  const lienzo = await html2canvas(divFirma, { scale: ESCALA_EXPORTACION });
  divFirma.classList.remove(ClaseCss.EXPORTAR_LIMPIO);

  contenedor.removeChild(divFirma);
  return lienzo;
}

async function agregarFirmasAZip(zip, filas, contenedor) {
  for (const fila of filas) {
    const lienzo = await renderizarFirmaACanvas(fila, contenedor);
    const datosBase64 = canvasABase64(lienzo);

    if (!datosBase64) {
      console.warn("Fallo al generar imagen para", fila[CampoDato.NOMBRE]);
      continue;
    }

    const nombreArchivo = sanitizarNombreArchivo(fila[CampoDato.NOMBRE]);
    zip.file(nombreArchivo, datosBase64, { base64: true });
  }
}

async function manejarDescargaZip() {
  estadoApp.iconosMarcaActual = await asegurarIconosParaMarca(estadoApp.claveMarcaActual);

  const oculto = document.getElementById(IdDom.FIRMAS_OCULTAS);
  oculto.innerHTML = "";

  const zip = new JSZip();
  const filasAProcesar = obtenerFilasAProcesar();

  await agregarFirmasAZip(zip, filasAProcesar, oculto);

  const blob = await zip.generateAsync({ type: "blob" });
  descargarBlob(blob, Archivos.ZIP_SALIDA);
}
