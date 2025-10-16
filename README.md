# GenerarPiesEmail

Script interno de **SouthGenetics** para generar imágenes de firmas de correo corporativas (pies de email) a partir de una planilla Excel.

---

## 📦 Estructura del proyecto

```
GenerarPiesEmail/
│
├── fuentes/                 # Tipografías utilizadas (Montserrat, OpenSans)
├── iconos/                  # Íconos de contacto (teléfono, email, web, etc.)
├── imagenes_generadas/      # Salida automática de las firmas (no versionada)
├── venv/                    # Entorno virtual local (ignorado por git)
│
├── color.txt                # Color corporativo en formato HEX (ej. 009AAE)
├── datos.xlsx               # Planilla de datos con información del personal
├── logo.png                 # Logo corporativo a usar en cada firma
├── script.py                # Script principal
└── README.md                # Este archivo
```

---

## 🧠 Descripción

El script genera automáticamente una imagen PNG por cada persona listada en `datos.xlsx`, combinando el logo, la información de contacto y los íconos de manera alineada y con proporciones corporativas.

Cada ejecución crea las imágenes dentro de la carpeta `imagenes_generadas/`, la cual **no se versiona** en GitHub (ver `.gitignore`).

---

## ⚙️ Requisitos

- Python 3.11+
- Librerías:
  ```bash
  pip install pandas Pillow openpyxl
  ```

---

## 🧩 Configuración

1. **Color corporativo:**  
   Editar el archivo `color.txt` y dejar el código hexadecimal sin `#`.  
   Ejemplo:
   ```
   009AAE
   ```

2. **Datos del personal (`datos.xlsx`):**  
   Debe contener las siguientes columnas:
   - `Nombre`
   - `Puesto`
   - `Teléfono`
   - `Email`
   - `Dirección`
   - `Página web`

3. **Fuentes y logos:**  
   Asegurarse de que existan las carpetas `fuentes/` y `iconos/` con los archivos necesarios.

---

## ▶️ Ejecución

Activar el entorno virtual y correr el script:

```bash
source venv/bin/activate
python script.py
```

El programa creará una imagen por cada fila del Excel dentro de `imagenes_generadas/`.

---

## 🧹 Limpieza del repositorio

Las imágenes generadas **no se deben commitear**.  
Si en algún momento quedan rastreadas por error, ejecutar:

```bash
git rm -r --cached imagenes_generadas/*.png
echo "imagenes_generadas/" >> .gitignore
git commit -am "chore(repo): remove generated images and update .gitignore"
git push
```

---

## 🛠️ Mantenimiento

- Si se modifica el logo, actualizar `logo.png`.
- Si cambia la tipografía o íconos, colocar los nuevos archivos dentro de sus carpetas respectivas.
- El tamaño, márgenes y proporciones del diseño pueden ajustarse desde las variables definidas al inicio del `script.py` (por ejemplo `IMG_W`, `IMG_H`, `LOGO_MAX_W_RATIO`).

---

## 🔒 Uso interno

Este repositorio y sus componentes son de uso interno exclusivo de **SouthGenetics**.  
No debe ser distribuido ni modificado fuera de los equipos autorizados.
