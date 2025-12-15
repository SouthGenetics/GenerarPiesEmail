import {
  ICON_KEYS,
  ICON_SVGS,
  BRANDS,
  PREVIEW_SAMPLE_BY_BRAND,
  DEFAULT_CONFIG,
  EXPORT_SCALE,
  MANUAL_FORM_FIELDS,
  SLIDER_IDS,
  SLIDER_TO_CONFIG_MAP,
} from "./constants.js";

const recoloredIconsCache = {};
let currentBrandKey = "southgenetics";
let currentBrand = BRANDS[currentBrandKey];
let currentBrandIcons = {};

const config = { ...DEFAULT_CONFIG };

let STATIC_SIG_DEFAULTS = null;

async function loadDefaultsFromFile() {
  try {
    const response = await fetch("defaults.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    STATIC_SIG_DEFAULTS = await response.json();
    return STATIC_SIG_DEFAULTS;
  } catch (error) {
    console.warn("[Defaults] Could not load defaults.json, using fallback values:", error);
    STATIC_SIG_DEFAULTS = {
      nameFontSize: 28,
      roleFontSize: 10,
      contactFontSize: 18,
      gapAfterName: 4,
      gapAfterRole: 6,
      iconSize: 23,
      leftColWidth: 304,
    };
    return STATIC_SIG_DEFAULTS;
  }
}

let excelRows = [];

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
  const sample =
    PREVIEW_SAMPLE_BY_BRAND[currentBrandKey] || PREVIEW_SAMPLE_BY_BRAND["southgenetics"];
  container.innerHTML = "";
  const signature = createSignatureDiv(sample);
  signature.id = "signature-template";
  container.appendChild(signature);
}

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

function addDiagnostics() {
  window.addEventListener(
    "error",
    (e) => {
      const src = (e && e.target && (e.target.src || e.target.href)) || e.filename || "";
      console.warn("[Diagnostics] window error:", e.message || e.type, src);
    },
    true
  );

  window.addEventListener("unhandledrejection", (e) => {
    console.warn("[Diagnostics] unhandledrejection:", e.reason);
  });

  function attachImgLogger(img) {
    if (!img) return;
    img.addEventListener("error", () => {
      console.warn("[Diagnostics] Failed to load image:", img.src);
    });
  }

  try {
    document.querySelectorAll("img").forEach(attachImgLogger);
  } catch {
    // ignore if DOM not ready
  }
}

function recolorSvgDataUri(dataUri, hexColor) {
  const base64Content = dataUri.split(",")[1];
  let svgContent = atob(base64Content);

  svgContent = svgContent.replace(/currentColor/g, hexColor);

  const newBase64 = btoa(svgContent);
  return `data:image/svg+xml;base64,${newBase64}`;
}

async function ensureIconsForBrand(brandKey) {
  if (recoloredIconsCache[brandKey]) return recoloredIconsCache[brandKey];

  const brand = BRANDS[brandKey];
  const iconMap = {};

  for (const key of ICON_KEYS) {
    const originalSvg = ICON_SVGS[key];
    if (originalSvg) {
      iconMap[key] = recolorSvgDataUri(originalSvg, brand.primary);
    }
  }

  recoloredIconsCache[brandKey] = iconMap;
  return iconMap;
}

function updatePreviewBrandAssets() {
  document.querySelectorAll(".sig-icon[data-icon]").forEach((img) => {
    const key = img.dataset.icon;
    if (currentBrandIcons[key]) {
      img.src = currentBrandIcons[key];
    }
  });
  document.querySelectorAll(".sig-logo").forEach((img) => {
    img.src = currentBrand.logo;
    img.alt = currentBrand.label;
    img.addEventListener("error", () => {
      console.warn("[Diagnostics] Failed to load logo:", img.src);
    });
  });
}

function updateBrandToggleUI(activeKey) {
  document.querySelectorAll(".brand-option").forEach((label) => {
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
  if (typeof updateLivePreview === "function") {
    updateLivePreview();
  } else {
    renderPreviewSignature();
  }
  updatePreviewBrandAssets();
  updateBrandToggleUI(brandKey);
}

document.getElementById("nameSize").addEventListener("input", (e) => {
  config.nameFontSize = parseInt(e.target.value, 10) || config.nameFontSize;
  applyConfigToCSS();
});

document.getElementById("contactSize").addEventListener("input", (e) => {
  config.contactFontSize = parseInt(e.target.value, 10) || config.contactFontSize;
  applyConfigToCSS();
});

document.getElementById("gapName").addEventListener("input", (e) => {
  config.gapAfterName = parseInt(e.target.value, 10) || config.gapAfterName;
  applyConfigToCSS();
});

document.getElementById("gapRole").addEventListener("input", (e) => {
  config.gapAfterRole = parseInt(e.target.value, 10) || config.gapAfterRole;
  applyConfigToCSS();
});

document.getElementById("iconSize").addEventListener("input", (e) => {
  config.iconSize = parseInt(e.target.value, 10) || config.iconSize;
  applyConfigToCSS();
});

document.getElementById("leftWidth").addEventListener("input", (e) => {
  const range = currentBrand.leftWidthRange || { min: 180, max: 480 };
  const value = parseInt(e.target.value, 10);
  config.leftColWidth = Math.min(range.max, Math.max(range.min, value));
  applyConfigToCSS();
});

document.getElementById("roleSize").addEventListener("input", (e) => {
  config.roleFontSize = parseInt(e.target.value, 10) || config.roleFontSize;
  applyConfigToCSS();
});

document.querySelectorAll('input[name="brand"]').forEach((radio) => {
  radio.addEventListener("change", async (e) => {
    if (e.target.checked) {
      await setBrand(e.target.value);
    }
  });
});

document.getElementById("excelInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    excelRows = XLSX.utils.sheet_to_json(sheet);
    alert(`Cargadas ${excelRows.length} filas de Excel.`);
  };
  reader.readAsArrayBuffer(file);
});

function createSignatureDiv(row) {
  const div = document.createElement("div");
  div.className = "signature";

  const left = document.createElement("div");
  left.className = "sig-left";
  const logo = document.createElement("img");
  logo.src = currentBrand.logo;
  logo.className = "sig-logo";
  logo.alt = currentBrand.label;
  logo.addEventListener("error", () => {
    console.warn("[Diagnostics] Failed to load logo (createSignatureDiv):", logo.src);
  });
  left.appendChild(logo);

  const divider = document.createElement("div");
  divider.className = "sig-divider";

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

  function addRow(iconKey, text) {
    if (!text) return;
    const r = document.createElement("div");
    r.className = "sig-row";

    const icon = document.createElement("img");
    icon.className = "sig-icon";
    icon.dataset.icon = iconKey;
    if (currentBrandIcons[iconKey]) {
      icon.src = currentBrandIcons[iconKey];
    } else if (ICON_SVGS[iconKey]) {
      icon.src = ICON_SVGS[iconKey];
    }
    icon.alt = "";
    icon.addEventListener("error", () => {
      console.warn("[Diagnostics] Failed to load icon (addRow):", icon.src);
    });

    const span = document.createElement("span");
    span.textContent = text;

    r.appendChild(icon);
    r.appendChild(span);
    right.appendChild(r);
  }

  addRow("phone", row["Teléfono"]);
  addRow("cellphone", row["Celular"]);
  addRow("location", row["Dirección"]);
  addRow("web", row["Página web"]);

  div.appendChild(left);
  div.appendChild(divider);
  div.appendChild(right);

  return div;
}

addDiagnostics();

loadDefaultsFromFile().catch(console.error);

applyConfigToCSS();
setBrand(currentBrandKey).catch(console.error);
renderPreviewSignature();

function applySigDefaults(inputDefaults) {
  let defs = inputDefaults || window.__sigDefaults;
  if (!defs) {
    try {
      const raw = localStorage.getItem("sigDefaults");
      defs = raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn("[Defaults] Failed to parse localStorage.sigDefaults", e);
    }
  }

  if (!defs) {
    console.warn(
      "[Defaults] No signature defaults found (checked input, window.__sigDefaults, and localStorage). To apply static defaults, call applySigDefaults(STATIC_SIG_DEFAULTS) or window.applySigDefaults(STATIC_SIG_DEFAULTS)."
    );
    return false;
  }

  const safeNum = (v) =>
    (typeof v === "string" || typeof v === "number") && !isNaN(Number(v)) ? Number(v) : undefined;

  const mapping = {
    nameFontSize: "nameFontSize",
    roleFontSize: "roleFontSize",
    contactFontSize: "contactFontSize",
    gapAfterName: "gapAfterName",
    gapAfterRole: "gapAfterRole",
    iconSize: "iconSize",
    leftColWidth: "leftColWidth",
  };

  Object.keys(mapping).forEach((k) => {
    const incoming = defs[k];
    const num = safeNum(incoming);
    if (typeof num !== "undefined") {
      config[mapping[k]] = num;
    }
  });

  Object.entries(SLIDER_TO_CONFIG_MAP).forEach(([id, cfgKey]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const val = config[cfgKey];
    if (typeof val !== "undefined") {
      el.value = val;
    }
  });

  applyConfigToCSS();
  renderPreviewSignature();

  return true;
}

function lockSliders() {
  SLIDER_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.disabled = true;
  });
  document.getElementById("btnApplyDefaults").style.display = "none";
  document.getElementById("btnUnlockSliders").style.display = "inline-block";
}

function unlockSliders() {
  SLIDER_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.disabled = false;
  });
  document.getElementById("btnApplyDefaults").style.display = "inline-block";
  document.getElementById("btnUnlockSliders").style.display = "none";
}

document.getElementById("btnApplyDefaults").addEventListener("click", async () => {
  if (!STATIC_SIG_DEFAULTS) {
    await loadDefaultsFromFile();
  }
  applySigDefaults(STATIC_SIG_DEFAULTS);
  lockSliders();
});

document.getElementById("btnUnlockSliders").addEventListener("click", () => {
  unlockSliders();
});

document.getElementById("btnDownloadTemplate").addEventListener("click", () => {
  const headers = ["Nombre", "Puesto", "Teléfono", "Celular", "Dirección", "Página web"];
  const sampleRow = [
    "Juan Pérez",
    "Representante de ventas",
    "'+52 55 1234 5678",
    "'+52 55 0000 0000",
    "World Trade Center México – Montecito 50, piso 20 of. 314 y 15. Benito Juárez, Col. Nápoles. CP 03180",
    "www.southgenetics.com",
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, sampleRow]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Firmas");
  XLSX.writeFile(wb, "plantilla_firmas.xlsx");
});

function getManualFormData() {
  const getValueOrPlaceholder = (id) => {
    const el = document.getElementById(id);
    return el.value.trim() || el.placeholder || "";
  };
  return {
    Nombre: getValueOrPlaceholder("manualNombre"),
    Puesto: getValueOrPlaceholder("manualPuesto"),
    Teléfono: getValueOrPlaceholder("manualTelefono"),
    Celular: getValueOrPlaceholder("manualCelular"),
    Dirección: getValueOrPlaceholder("manualDireccion"),
    "Página web": getValueOrPlaceholder("manualWeb"),
  };
}

async function updateLivePreview() {
  const formData = getManualFormData();
  currentBrandIcons = await ensureIconsForBrand(currentBrandKey);
  const container = document.getElementById("preview-container");
  container.innerHTML = "";
  const signature = createSignatureDiv(formData);
  signature.id = "signature-template";
  container.appendChild(signature);
}

MANUAL_FORM_FIELDS.forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("input", updateLivePreview);
  }
});

document.getElementById("btnDownloadZip").addEventListener("click", async () => {
  currentBrandIcons = await ensureIconsForBrand(currentBrandKey);

  const hidden = document.getElementById("hidden-signatures");
  hidden.innerHTML = "";

  const zip = new JSZip();
  let rowsToProcess = [];

  if (excelRows.length > 0) {
    rowsToProcess = excelRows;
  } else {
    const formData = getManualFormData();
    rowsToProcess = [formData];
  }

  for (const row of rowsToProcess) {
    const sigDiv = createSignatureDiv(row);
    hidden.appendChild(sigDiv);

    await new Promise((res) => setTimeout(res, 50));

    sigDiv.classList.add("export-clean");
    const canvas = await html2canvas(sigDiv, { scale: EXPORT_SCALE });
    sigDiv.classList.remove("export-clean");

    const dataURL = canvas.toDataURL("image/png");

    if (!dataURL.startsWith("data:image/png;base64,")) {
      console.warn("Fallo al generar imagen para", row["Nombre"], dataURL);
      hidden.removeChild(sigDiv);
      continue;
    }

    const base64Data = dataURL.split(",")[1];
    const fileName = (row["Nombre"] || "firma").replace(/[/\\?%*:|"<>]/g, "_") + ".png";
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

updateLivePreview();
