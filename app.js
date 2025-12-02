// ==============================
// Config general
// ==============================
const ICON_FILES = ["phone.png", "cellphone.png", "email.png", "location.png", "web.png"];
const BRANDS = {
  "southgenetics": {
    label: "SouthGenetics",
    logo: "logo1.png",
    primary: "#0096ab",
    highlight: "#00b9cd",
    accentSoft: "rgba(0, 150, 171, 0.12)",
    accentShadow: "rgba(0, 150, 171, 0.25)",
    buttonShadow: "0 8px 20px -10px rgba(0, 150, 171, 0.8)",
    buttonShadowHover: "0 12px 26px -10px rgba(0, 150, 171, 0.9)",
    fileBorder: "rgba(0, 150, 171, 0.5)",
    fileBackground: "rgba(0, 150, 171, 0.08)",
    gradientStart: "#f5fcff",
    gradientMid: "#eef3f8",
    gradientEnd: "#e1e7ef",
    leftWidthRange: { min: 180, max: 480 }
  },
  "pacific-genomics": {
    label: "Pacific Genomics",
    logo: "logo2.png",
    primary: "#1d3e88",
    highlight: "#4f6fcd",
    accentSoft: "rgba(29, 62, 136, 0.14)",
    accentShadow: "rgba(29, 62, 136, 0.28)",
    buttonShadow: "0 8px 20px -10px rgba(29, 62, 136, 0.7)",
    buttonShadowHover: "0 12px 26px -10px rgba(29, 62, 136, 0.82)",
    fileBorder: "rgba(29, 62, 136, 0.45)",
    fileBackground: "rgba(29, 62, 136, 0.08)",
    gradientStart: "#f3f6ff",
    gradientMid: "#e7ecff",
    gradientEnd: "#dce3ff",
    leftWidthRange: { min: 180, max: 340 }
  }
};
const recoloredIconsCache = {};
let currentBrandKey = "southgenetics";
let currentBrand = BRANDS[currentBrandKey];
let currentBrandIcons = {};

const config = {
  nameFontSize: 28,
  roleFontSize: 14,
  contactFontSize: 14,
  gapAfterName: 4,
  gapAfterRole: 6,
  iconSize: 20,
  lineGap: 6,
  signatureWidth: 800,
  signatureHeight: 220,
  leftColWidth: 260
};

// Static defaults baked into the page so every visitor gets the same defaults.
// These are used when no explicit inputDefaults or window.__sigDefaults are provided.
const STATIC_SIG_DEFAULTS = {
  nameFontSize: 28,
  roleFontSize: 10,
  contactFontSize: 18,
  gapAfterName: 4,
  gapAfterRole: 6,
  iconSize: 23,
  leftColWidth: 304
};

let excelRows = []; // se llena cuando cargás el Excel

const PREVIEW_SAMPLE_BY_BRAND = {
  "southgenetics": {
    "Nombre": "Juan Pérez",
    "Puesto": "Representante de ventas",
    "Teléfono": "+52 55 1234 5678",
    "Celular": "+52 55 0000 0000",
    "Email": "ventas@southgenetics.com",
    "Dirección": "World Trade Center México – Montecito 50, piso 20 of. 314 y 15.\nBenito Juárez, Col. Nápoles. CP 03180",
    "Página web": "southgenetics.com"
  },
  "pacific-genomics": {
    "Nombre": "Ana Torres",
    "Puesto": "Business Development",
    "Teléfono": "+52 55 3210 4321",
    "Celular": "+52 55 8888 9999",
    "Email": "contact@pacificgenomics.com",
    "Dirección": "World Trade Center México – Montecito 50, piso 20 of. 314 y 15.\nBenito Juárez, Col. Nápoles. CP 03180",
    "Página web": "pacificgenomics.com"
  }
};

function updateLeftWidthSlider(range) {
  const slider = document.getElementById("leftWidth");
  if (!slider) return;
  slider.min = range.min;
  slider.max = range.max;
  if (config.leftColWidth < range.min) {
    config.leftColWidth = range.min;
  } else if (config.leftColWidth > range.max) {
    config.leftColWidth = range.max;
  }
  slider.value = config.leftColWidth;
  applyConfigToCSS();
}

function renderPreviewSignature() {
  const container = document.getElementById("preview-container");
  if (!container) return;
  const sample = PREVIEW_SAMPLE_BY_BRAND[currentBrandKey] || PREVIEW_SAMPLE_BY_BRAND["southgenetics"];
  container.innerHTML = "";
  const signature = createSignatureDiv(sample);
  signature.id = "signature-template";
  container.appendChild(signature);
}

// ==============================
// Utilidades para CSS variables
// ==============================
function applyConfigToCSS() {
  const root = document.documentElement;
  root.style.setProperty("--name-font-size", config.nameFontSize + "px");
  root.style.setProperty("--role-font-size", config.roleFontSize + "px");
  root.style.setProperty("--contact-font-size", config.contactFontSize + "px");
  root.style.setProperty("--gap-after-name", config.gapAfterName + "px");
  root.style.setProperty("--gap-after-role", config.gapAfterRole + "px");
  root.style.setProperty("--icon-size", config.iconSize + "px");
  root.style.setProperty("--line-gap", config.lineGap + "px");
  root.style.setProperty("--signature-width", config.signatureWidth + "px");
  root.style.setProperty("--signature-height", config.signatureHeight + "px");
  root.style.setProperty("--left-col-width", config.leftColWidth + "px");
}

function applyBrandTheme(brand) {
  const root = document.documentElement;
  root.style.setProperty("--accent", brand.primary);
  root.style.setProperty("--highlight-color", brand.highlight);
  root.style.setProperty("--accent-soft", brand.accentSoft);
  root.style.setProperty("--accent-shadow", brand.accentShadow);
  root.style.setProperty("--button-shadow", brand.buttonShadow);
  root.style.setProperty("--button-shadow-hover", brand.buttonShadowHover);
  root.style.setProperty("--file-border", brand.fileBorder);
  root.style.setProperty("--file-bg", brand.fileBackground);
  root.style.setProperty("--page-gradient-start", brand.gradientStart);
  root.style.setProperty("--page-gradient-mid", brand.gradientMid);
  root.style.setProperty("--page-gradient-end", brand.gradientEnd);
}

// ==============================
// Diagnostics / Instrumentación
// ==============================
function addDiagnostics() {
  // Global JS error handler (captures script errors and resource load errors when available)
  window.addEventListener('error', (e) => {
    const src = (e && e.target && (e.target.src || e.target.href)) || e.filename || '';
    // Log a clear diagnostic message so you can copy the failing URL from the console
    console.warn('[Diagnostics] window error:', e.message || e.type, src);
  }, true);

  // Promise rejections
  window.addEventListener('unhandledrejection', (e) => {
    console.warn('[Diagnostics] unhandledrejection:', e.reason);
  });

  // Attach onerror to images created later: also attach to current images if any
  function attachImgLogger(img) {
    if (!img) return;
    img.addEventListener('error', () => {
      console.warn('[Diagnostics] Failed to load image:', img.src);
    });
  }

  // Attach to existing images in the page (helps with preview image failures)
  try {
    document.querySelectorAll('img').forEach(attachImgLogger);
  } catch (err) {
    // ignore if DOM not ready
  }
}


// ==============================
// Recolor de íconos vía canvas
// ==============================
function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function recolorImage(src, hexColor) {
  const { r, g, b } = hexToRgb(hexColor);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // por si servís los archivos desde un server
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha !== 0) {
          data[i]     = r; // R
          data[i + 1] = g; // G
          data[i + 2] = b; // B
          // alpha lo dejamos
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const outUrl = canvas.toDataURL("image/png");
      resolve(outUrl);
    };
    img.onerror = reject;
    img.src = src;
  });
}

async function initRecoloredIcons() {
  for (const file of ICON_FILES) {
    recoloredIcons[file] = await recolorImage(`iconos/${file}`, TARGET_ICON_COLOR);
  }
  document.querySelectorAll(".sig-icon[data-icon]").forEach(img => {
    const key = img.dataset.icon;
    if (recoloredIcons[key]) img.src = recoloredIcons[key];
  });
}

async function ensureIconsForBrand(brandKey) {
  if (recoloredIconsCache[brandKey]) return recoloredIconsCache[brandKey];
  const brand = BRANDS[brandKey];
  const iconMap = {};
  await Promise.all(
    ICON_FILES.map(async file => {
      iconMap[file] = await recolorImage(`iconos/${file}`, brand.primary);
    })
  );
  recoloredIconsCache[brandKey] = iconMap;
  return iconMap;
}

function updatePreviewBrandAssets() {
  document.querySelectorAll(".sig-icon[data-icon]").forEach(img => {
    const key = img.dataset.icon;
    if (currentBrandIcons[key]) {
      img.src = currentBrandIcons[key];
    }
  });
  document.querySelectorAll(".sig-logo").forEach(img => {
    img.src = currentBrand.logo;
    img.alt = currentBrand.label;
    // diagnostics: log if logo fails to load
    img.addEventListener('error', () => {
      console.warn('[Diagnostics] Failed to load logo:', img.src);
    });
  });
}

function updateBrandToggleUI(activeKey) {
  document.querySelectorAll(".brand-option").forEach(label => {
    const input = label.querySelector('input[name="brand"]');
    const isActive = label.dataset.brand === activeKey;
    label.classList.toggle("is-active", isActive);
    if (input) input.checked = isActive;
  });
}

async function setBrand(brandKey) {
  if (!BRANDS[brandKey]) return;
  currentBrandKey = brandKey;
  currentBrand = BRANDS[brandKey];
  applyBrandTheme(currentBrand);
  updateLeftWidthSlider(currentBrand.leftWidthRange || { min: 180, max: 480 });
  currentBrandIcons = await ensureIconsForBrand(brandKey);
  renderPreviewSignature();
  updatePreviewBrandAssets();
  updateBrandToggleUI(brandKey);
}


// ==============================
// Sliders / Controles UI
// ==============================
document.getElementById("nameSize").addEventListener("input", e => {
  config.nameFontSize = parseInt(e.target.value, 10) || config.nameFontSize;
  applyConfigToCSS();
});

document.getElementById("contactSize").addEventListener("input", e => {
  config.contactFontSize = parseInt(e.target.value, 10) || config.contactFontSize;
  applyConfigToCSS();
});

document.getElementById("gapName").addEventListener("input", e => {
  config.gapAfterName = parseInt(e.target.value, 10) || config.gapAfterName;
  applyConfigToCSS();
});

document.getElementById("gapRole").addEventListener("input", e => {
  config.gapAfterRole = parseInt(e.target.value, 10) || config.gapAfterRole;
  applyConfigToCSS();
});

document.getElementById("iconSize").addEventListener("input", e => {
  config.iconSize = parseInt(e.target.value, 10) || config.iconSize;
  applyConfigToCSS();
});

document.getElementById("leftWidth").addEventListener("input", e => {
  const range = currentBrand.leftWidthRange || { min: 180, max: 480 };
  const value = parseInt(e.target.value, 10);
  config.leftColWidth = Math.min(range.max, Math.max(range.min, value));
  applyConfigToCSS();
});

document.getElementById("roleSize").addEventListener("input", e => {
  config.roleFontSize = parseInt(e.target.value, 10) || config.roleFontSize;
  applyConfigToCSS();
});

document.querySelectorAll('input[name="brand"]').forEach(radio => {
  radio.addEventListener("change", async e => {
    if (e.target.checked) {
      await setBrand(e.target.value);
    }
  });
});


// ==============================
// Leer Excel
// ==============================
document.getElementById("excelInput").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    excelRows = XLSX.utils.sheet_to_json(sheet); // array de objetos
    alert(`Cargadas ${excelRows.length} filas de Excel.`);
  };
  reader.readAsArrayBuffer(file);
});


// ==============================
// Construir un div.signature desde una fila
// ==============================
function createSignatureDiv(row) {
  const div = document.createElement("div");
  div.className = "signature";

  const left = document.createElement("div");
  left.className = "sig-left";
  const logo = document.createElement("img");
  logo.src = currentBrand.logo;
  logo.className = "sig-logo";
  logo.alt = currentBrand.label;
  // diagnostics: log if logo fails to load
  logo.addEventListener('error', () => {
    console.warn('[Diagnostics] Failed to load logo (createSignatureDiv):', logo.src);
  });
  left.appendChild(logo);

  // Separador
  const divider = document.createElement("div");
  divider.className = "sig-divider";

  // Columna derecha
  const right = document.createElement("div");
  right.className = "sig-right";

  const name = document.createElement("div");
  name.className = "sig-name";
  name.textContent = row["Nombre"] || "";
  right.appendChild(name);

  const role = document.createElement("div");
  role.className = "sig-role";
  role.textContent = row["Puesto"] || "";
  right.appendChild(role);

  // Helper para filas de contacto
  function addRow(iconFile, text) {
    if (!text) return;
    const r = document.createElement("div");
    r.className = "sig-row";

    const icon = document.createElement("img");
    icon.className = "sig-icon";
    icon.dataset.icon = iconFile;
    if (currentBrandIcons[iconFile]) {
      icon.src = currentBrandIcons[iconFile];
    } else {
      icon.src = "iconos/" + iconFile;
    }
    icon.alt = "";
    // diagnostics: log if an icon fails to load
    icon.addEventListener('error', () => {
      console.warn('[Diagnostics] Failed to load icon (addRow):', icon.src);
    });

    const span = document.createElement("span");
    span.textContent = text;

    r.appendChild(icon);
    r.appendChild(span);
    right.appendChild(r);
  }

  addRow("phone.png", row["Teléfono"]);
  addRow("cellphone.png", row["Celular"]);
  addRow("location.png", row["Dirección"]);
  addRow("web.png", row["Página web"]);

  div.appendChild(left);
  div.appendChild(divider);
  div.appendChild(right);

  return div;
}


// ==============================
// Generar imágenes sueltas
// ==============================
const EXPORT_SCALE = 4; // 2 = duplica resolución; subí/ bajá según necesites

document.getElementById("btnGenerateImages").addEventListener("click", async () => {
  if (!excelRows.length) {
    alert("Primero cargá un Excel.");
    return;
  }

  currentBrandIcons = await ensureIconsForBrand(currentBrandKey);

  const hidden = document.getElementById("hidden-signatures");
  hidden.innerHTML = "";

  for (const row of excelRows) {
    const sigDiv = createSignatureDiv(row);
    hidden.appendChild(sigDiv);

    // pequeño delay para que se renderice
    await new Promise(res => setTimeout(res, 50));

    const canvas = await html2canvas(sigDiv, { scale: EXPORT_SCALE });

    const dataURL = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataURL;
    const fileName = (row["Nombre"] || "firma").replace(/[\/\\?%*:|"<>]/g, "_") + ".png";
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    hidden.removeChild(sigDiv);
  }
});


// ==============================
// Generar ZIP con todas las imágenes
// ==============================
document.getElementById("btnGenerateZip").addEventListener("click", async () => {
  if (!excelRows.length) {
    alert("Primero cargá un Excel.");
    return;
  }

  currentBrandIcons = await ensureIconsForBrand(currentBrandKey);

  const hidden = document.getElementById("hidden-signatures");
  hidden.innerHTML = "";

  const zip = new JSZip();

  for (const row of excelRows) {
    const sigDiv = createSignatureDiv(row);
    hidden.appendChild(sigDiv);

    await new Promise(res => setTimeout(res, 50));

    const canvas = await html2canvas(sigDiv, { scale: EXPORT_SCALE });

    const dataURL = canvas.toDataURL("image/png");

    // si vino algo raro, salteamos
    if (!dataURL.startsWith("data:image/png;base64,")) {
      console.warn("Fallo al generar imagen para", row["Nombre"], dataURL);
      hidden.removeChild(sigDiv);
      continue;
    }

    const base64Data = dataURL.split(",")[1];
    const fileName = (row["Nombre"] || "firma").replace(/[\/\\?%*:|"<>]/g, "_") + ".png";

    zip.file(fileName, base64Data, { base64: true });

    hidden.removeChild(sigDiv);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "firmas.zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});


// ==============================
// Init
// ==============================
// Enable diagnostics early
addDiagnostics();

applyConfigToCSS();
setBrand(currentBrandKey).catch(console.error);
renderPreviewSignature();
// Apply signature defaults (reads input, console-saved, static or localStorage).
// Usage:
//   - call in console: window.applySigDefaults()
//   - or: window.default()  (alias)
// It will read saved values (if any) and apply them to `config` and the sliders.
function applySigDefaults(inputDefaults) {
  // Priority for defaults:
  // 1. explicit inputDefaults passed to the function
  // 2. window.__sigDefaults (useful for interactive console overrides)
  // 3. localStorage.sigDefaults (legacy / optional persistence)
  // Note: STATIC_SIG_DEFAULTS is NOT applied automatically anymore; pass it explicitly
  // if you want to apply the baked-in static defaults.
  let defs = inputDefaults || window.__sigDefaults;
  if (!defs) {
    try {
      const raw = localStorage.getItem('sigDefaults');
      defs = raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('[Defaults] Failed to parse localStorage.sigDefaults', e);
    }
  }

  if (!defs) {
    console.warn('[Defaults] No signature defaults found (checked input, window.__sigDefaults, and localStorage). To apply static defaults, call applySigDefaults(STATIC_SIG_DEFAULTS) or window.applySigDefaults(STATIC_SIG_DEFAULTS).');
    return false;
  }

  // Map incoming keys to config keys (they should match but be defensive)
  const safeNum = v => (typeof v === 'string' || typeof v === 'number') && !isNaN(Number(v)) ? Number(v) : undefined;

  const mapping = {
    nameFontSize: 'nameFontSize',
    roleFontSize: 'roleFontSize',
    contactFontSize: 'contactFontSize',
    gapAfterName: 'gapAfterName',
    gapAfterRole: 'gapAfterRole',
    iconSize: 'iconSize',
    leftColWidth: 'leftColWidth'
  };

  Object.keys(mapping).forEach(k => {
    const incoming = defs[k];
    const num = safeNum(incoming);
    if (typeof num !== 'undefined') {
      config[mapping[k]] = num;
    }
  });

  // Update slider UI values if present
  const uiMap = {
    nameSize: 'nameFontSize',
    roleSize: 'roleFontSize',
    contactSize: 'contactFontSize',
    gapName: 'gapAfterName',
    gapRole: 'gapAfterRole',
    iconSize: 'iconSize',
    leftWidth: 'leftColWidth'
  };

  Object.entries(uiMap).forEach(([id, cfgKey]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const val = config[cfgKey];
    if (typeof val !== 'undefined') {
      el.value = val;
      // If other code listens to 'input' events, you can uncomment the next lines to dispatch one
      // const ev = new Event('input', { bubbles: true, cancelable: true });
      // el.dispatchEvent(ev);
    }
  });

  // Apply styles and re-render preview
  applyConfigToCSS();
  renderPreviewSignature();

  console.log('[Defaults] Applied signature defaults:', defs);
  return true;
}

// Expose friendly names
window.applySigDefaults = applySigDefaults;
window.default = function() { return applySigDefaults(); };
