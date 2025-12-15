// ==============================
// Constantes de la aplicación
// ==============================

// Icon keys for reference
export const ICON_KEYS = ["phone", "cellphone", "location", "web"];

// Base SVG icons as data URIs (monochrome, uses currentColor)
export const ICON_SVGS = {
  phone:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Im0xNi41NTYgMTIuOTA2bC0uNDU1LjQ1M3MtMS4wODMgMS4wNzYtNC4wMzgtMS44NjJzLTEuODcyLTQuMDE0LTEuODcyLTQuMDE0bC4yODYtLjI4NmMuNzA3LS43MDIuNzc0LTEuODMuMTU3LTIuNjU0TDkuMzc0IDIuODZDOC42MSAxLjg0IDcuMTM1IDEuNzA1IDYuMjYgMi41NzVsLTEuNTcgMS41NmMtLjQzMy40MzItLjcyMy45OS0uNjg4IDEuNjFjLjA5IDEuNTg3LjgwOCA1IDQuODEyIDguOTgyYzQuMjQ3IDQuMjIyIDguMjMyIDQuMzkgOS44NjEgNC4yMzhjLjUxNi0uMDQ4Ljk2NC0uMzEgMS4zMjUtLjY3bDEuNDItMS40MTJjLjk2LS45NTMuNjktMi41ODgtLjUzOC0zLjI1NWwtMS45MS0xLjAzOWMtLjgwNi0uNDM3LTEuNzg3LS4zMDktMi40MTcuMzE3Ii8+PC9zdmc+",
  cellphone:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xOSAxSDV2MjJoMTR6bS01IDIwaC00di0xaDR6bTMtM0g3VjRoMTB6Ii8+PC9zdmc+",
  location:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIj48cGF0aCBkPSJtMTIuNTkzIDIzLjI1OGwtLjAxMS4wMDJsLS4wNzEuMDM1bC0uMDIuMDA0bC0uMDE0LS4wMDRsLS4wNzEtLjAzNXEtLjAxNi0uMDA1LS4wMjQuMDA1bC0uMDA0LjAxbC0uMDE3LjQyOGwuMDA1LjAybC4wMS4wMTNsLjEwNC4wNzRsLjAxNS4wMDRsLjAxMi0uMDA0bC4xMDQtLjA3NGwuMDEyLS4wMTZsLjAwNC0uMDE3bC0uMDE3LS40MjdxLS4wMDQtLjAxNi0uMDE3LS4wMThtLjI2NS0uMTEzbC0uMDEzLjAwMmwtLjE4NS4wOTNsLS4wMS4wMWwtLjAwMy4wMTFsLjAxOC40M2wuMDA1LjAxMmwuMDA4LjAwN2wuMjAxLjA5M3EuMDE5LjAwNS4wMjktLjAwOGwuMDA0LS4wMTRsLS4wMzQtLjYxNHEtLjAwNS0uMDE4LS4wMi0uMDIybS0uNzE1LjAwMmEuMDIuMDIgMCAwIDAtLjAyNy4wMDZsLS4wMDYuMDE0bC0uMDM0LjYxNHEuMDAxLjAxOC4wMTcuMDI0bC4wMTUtLjAwMmwuMjAxLS4wOTNsLjAxLS4wMDhsLjAwNC0uMDExbC4wMTctLjQzbC0uMDAzLS4wMTJsLS4wMS0uMDF6Ii8+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMTIgMmE5IDkgMCAwIDEgOSA5YzAgMy4wNzQtMS42NzYgNS41OS0zLjQ0MiA3LjM5NWEyMC40IDIwLjQgMCAwIDEtMi44NzYgMi40MTZsLS40MjYuMjlsLS4yLjEzM2wtLjM3Ny4yNGwtLjMzNi4yMDVsLS40MTYuMjQyYTEuODcgMS44NyAwIDAgMS0xLjg1NCAwbC0uNDE2LS4yNDJsLS41Mi0uMzJsLS4xOTItLjEyNWwtLjQxLS4yNzNhMjAuNiAyMC42IDAgMCAxLTMuMDkzLTIuNTY2QzQuNjc2IDE2LjU4OSAzIDE0LjA3NCAzIDExYTkgOSAwIDAgMSA5LTltMCA2YTMgMyAwIDEgMCAwIDZhMyAzIDAgMCAwIDAtNiIvPjwvZz48L3N2Zz4=",
  web: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xNi41IDI0YzAgMS45LjA4NSAzLjc0Mi4yNDMgNS41aDE0LjUxNGMuMTU4LTEuNzU4LjI0My0zLjYuMjQzLTUuNXMtLjA4NS0zLjc0Mi0uMjQ0LTUuNUgxNi43NDVjLS4xNiAxLjc1OC0uMjQ1IDMuNi0uMjQ1IDUuNW0tMi43NjctNS41QTY0IDY0IDAgMCAwIDEzLjUgMjRjMCAxLjg4Ni4wOCAzLjcyNy4yMzIgNS41SDIuMTc3QzEuNzM1IDI3Ljc0IDEuNSAyNS44OTcgMS41IDI0cy4yMzUtMy43NC42NzctNS41em0zLjM2Ni0zSDMwLjljLS40NDQtMy4wMjctMS4xMTYtNS43MjYtMS45NDktNy45NDNjLS43NzktMi4wNzMtMS42NjktMy42NDgtMi41OC00LjY3NkMyNS40NTggMS44NDkgMjQuNjUyIDEuNSAyNCAxLjVzLTEuNDU4LjM1LTIuMzcyIDEuMzhjLS45MTEgMS4wMy0xLjgwMSAyLjYwNC0yLjU4IDQuNjc3Yy0uODMzIDIuMjE3LTEuNTA1IDQuOTE2LTEuOTUgNy45NDNtMTcuMTY5IDNjLjE1MyAxLjc3My4yMzMgMy42MTQuMjMzIDUuNXMtLjA4IDMuNzI3LS4yMzIgNS41aDExLjU1NWMuNDQyLTEuNzYuNjc3LTMuNjAzLjY3Ny01LjVzLS4yMzUtMy43NC0uNjc3LTUuNXptMTAuNTczLTNIMzMuOTMxYy0uNDctMy4zODgtMS4yMTQtNi40NS0yLjE3MS04Ljk5OGMtLjYxMS0xLjYyNi0xLjMyMy0zLjA4Mi0yLjEzNC00LjI5M2M2LjkyIDEuNzgyIDEyLjU1IDYuNzczIDE1LjIxMiAxMy4yOTFtLTMwLjc3IDBIMy4xNjFDNS44MjIgOC45ODIgMTEuNDUzIDMuOTkxIDE4LjM3MyAyLjIxYy0uODEgMS4yMS0xLjUyMyAyLjY2Ni0yLjEzNCA0LjI5MmMtLjk1NyAyLjU0OC0xLjcgNS42MS0yLjE3IDguOTk4bS0uMDAzIDE3SDMuMTYxYzIuNjYgNi41MTUgOC4yODYgMTEuNTA0IDE1LjIgMTMuMjg4Yy0uODEtMS4yMS0xLjUyLTIuNjY2LTIuMTMtNC4yOWMtLjk1NS0yLjU1LTEuNjk3LTUuNjEtMi4xNjUtOC45OThtMTQuODk0IDcuOTQ0Yy44My0yLjIxNyAxLjUtNC45MTYgMS45NDQtNy45NDRIMTcuMDk2Yy40NDMgMy4wMjggMS4xMTMgNS43MjcgMS45NDQgNy45NDRjLjc3OCAyLjA3MyAxLjY2NyAzLjY0NyAyLjU4IDQuNjc1Yy45MTIgMS4wMyAxLjcyIDEuMzgxIDIuMzggMS4zODFzMS40NjgtLjM1MSAyLjM4LTEuMzgxYy45MTMtMS4wMjggMS44MDItMi42MDIgMi41OC00LjY3NW0yLjgwOSAxLjA1M2MuOTU1LTIuNTQ4IDEuNjk3LTUuNjEgMi4xNjUtOC45OTdoMTAuOTA1Yy0yLjY2IDYuNTE1LTguMjg2IDExLjUwNC0xNS4yIDEzLjI4OGMuODEtMS4yMSAxLjUyLTIuNjY2IDIuMTMtNC4yOSIvPjwvc3ZnPg==",
};

// Configuración de marcas
export const BRANDS = {
  southgenetics: {
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
    leftWidthRange: { min: 180, max: 480 },
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
    leftWidthRange: { min: 180, max: 340 },
  },
};

// Datos de muestra para preview por marca
export const PREVIEW_SAMPLE_BY_BRAND = {
  southgenetics: {
    Nombre: "Juan Pérez",
    Puesto: "Representante de ventas",
    Teléfono: "+52 55 1234 5678",
    Celular: "+52 55 0000 0000",
    Email: "ventas@southgenetics.com",
    Dirección:
      "World Trade Center México – Montecito 50, piso 20 of. 314 y 15.\nBenito Juárez, Col. Nápoles. CP 03180",
    "Página web": "www.southgenetics.com",
  },
  "pacific-genomics": {
    Nombre: "Ana Torres",
    Puesto: "Business Development",
    Teléfono: "+52 55 3210 4321",
    Celular: "+52 55 8888 9999",
    Email: "contact@pacificgenomics.com",
    Dirección:
      "World Trade Center México – Montecito 50, piso 20 of. 314 y 15.\nBenito Juárez, Col. Nápoles. CP 03180",
    "Página web": "www.pacificgenomics.com",
  },
};

// Configuración inicial de estilos
export const DEFAULT_CONFIG = {
  nameFontSize: 28,
  roleFontSize: 14,
  contactFontSize: 14,
  gapAfterName: 4,
  gapAfterRole: 6,
  iconSize: 20,
  lineGap: 6,
  signatureWidth: 800,
  signatureHeight: 220,
  leftColWidth: 260,
};

// Escala de exportación de imágenes
export const EXPORT_SCALE = 4;

// IDs de campos del formulario manual
export const MANUAL_FORM_FIELDS = [
  "manualNombre",
  "manualPuesto",
  "manualTelefono",
  "manualCelular",
  "manualDireccion",
  "manualWeb",
];

// IDs de sliders
export const SLIDER_IDS = [
  "nameSize",
  "roleSize",
  "contactSize",
  "gapName",
  "gapRole",
  "iconSize",
  "leftWidth",
];

// Mapeo de sliders a claves de config
export const SLIDER_TO_CONFIG_MAP = {
  nameSize: "nameFontSize",
  roleSize: "roleFontSize",
  contactSize: "contactFontSize",
  gapName: "gapAfterName",
  gapRole: "gapAfterRole",
  iconSize: "iconSize",
  leftWidth: "leftColWidth",
};
