import os
import pandas as pd
from PIL import Image, ImageDraw, ImageFont
from openpyxl import load_workbook  # si no lo usás, podés quitar esta importación

# =========================
# Configuración de carpetas
# =========================
current_dir = os.path.dirname(os.path.abspath(__file__))
excel_path = os.path.join(current_dir, 'datos.xlsx')
color_path = os.path.join(current_dir, 'color.txt')
output_dir = os.path.join(current_dir, 'imagenes_generadas')
icons_dir = os.path.join(current_dir, 'iconos')
fonts_dir = os.path.join(current_dir, 'fuentes')

os.makedirs(output_dir, exist_ok=True)

# =========================
# Leer color corporativo
# =========================
with open(color_path, 'r') as f:
    hex_color = f.read().strip().lstrip('#')
highlight_color = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

# =========================
# Leer datos del Excel
# =========================
df = pd.read_excel(excel_path)

# =========================
# Configuración de la imagen
# =========================
img_width = 2000
img_height = 700
logo_path = os.path.join(current_dir, 'logo.png')

# Colores
background_color = (255, 255, 255)
text_color = (0, 0, 0)
position_color = (84, 84, 84)

# Fuentes (con fallback simple)
montserrat_bold_path = os.path.join(fonts_dir, 'Montserrat-Bold.ttf')
open_sans_regular_path = os.path.join(fonts_dir, 'OpenSans-Regular.ttf')

def load_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        # Fallback en sistemas sin esas fuentes
        return ImageFont.load_default()

# Tamaños base
name_font_size = 54
position_font_size = 36
contact_font_size = 32

name_font_base = load_font(montserrat_bold_path, name_font_size)
position_font = load_font(montserrat_bold_path, position_font_size)
contact_font = load_font(open_sans_regular_path, contact_font_size)

# =========================
# Helpers de layout
# =========================
RIGHT_MARGIN = 60
TOP_MARGIN = 80
BOTTOM_MARGIN = 80
LEFT_MARGIN = 150
GAP_AFTER_DIVIDER = 80

def text_width(draw, text, font):
    # ancho en px (usa textbbox para medir)
    bbox = draw.textbbox((0, 0), str(text), font=font)
    return bbox[2] - bbox[0]

def wrap_to_width(draw, text, font, max_w):
    """Rompe texto en palabras para que no supere max_w por línea."""
    text = "" if pd.isna(text) else str(text)
    lines = []
    for paragraph in text.split("\n"):
        if not paragraph:
            lines.append("")
            continue
        words = paragraph.split(" ")
        cur = ""
        for token in words:
            t = (cur + " " + token).strip()
            if text_width(draw, t, font) <= max_w or cur == "":
                cur = t
            else:
                lines.append(cur)
                cur = token
        if cur:
            lines.append(cur)
    return lines

def draw_wrapped(draw, x, y, text, font, fill, max_w, line_h=None):
    if line_h is None:
        line_h = int(getattr(font, "size", 32) * 1.1)
    for line in wrap_to_width(draw, text, font, max_w):
        draw.text((x, y), line, font=font, fill=fill)
        y += line_h
    return y  # devuelve el nuevo y

def fit_font_size(draw, text, font_path, target_px, start_size, min_size=26):
    """Reduce tamaño hasta que el texto entre en una línea de target_px."""
    size = start_size
    while size > min_size:
        f = load_font(font_path, size)
        if text_width(draw, str(text), f) <= target_px:
            return f
        size -= 1
    return load_font(font_path, min_size)

# =========================
# Render por fila
# =========================
for index, row in df.iterrows():
    img = Image.new('RGB', (img_width, img_height), background_color)
    draw = ImageDraw.Draw(img)

    # --- Logo: escala por alto disponible y respeta márgenes ---
    logo_right = LEFT_MARGIN
    try:
        logo = Image.open(logo_path).convert("RGBA")
        max_logo_h = int((img_height - TOP_MARGIN - BOTTOM_MARGIN) * 0.7)  # 70% del alto útil
        scale = max_logo_h / logo.height
        logo_w = int(logo.width * scale)
        logo_h = int(logo.height * scale)
        logo = logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
        logo_y = (img_height - logo_h) // 2
        img.paste(logo, (LEFT_MARGIN, logo_y), logo)
        logo_right = LEFT_MARGIN + logo_w
    except FileNotFoundError:
        print(f"[WARN] No se encontró logo.png en {current_dir}")

    # --- Línea divisoria: después del logo + holgura, nunca menos del 52% ---
    divider_x = max(logo_right + 120, int(img_width * 0.52))
    draw.line([(divider_x, TOP_MARGIN), (divider_x, img_height - BOTTOM_MARGIN)],
              fill=highlight_color, width=4)

    # --- Columna derecha segura (con wrapping y margen derecho) ---
    x_position = divider_x + GAP_AFTER_DIVIDER
    max_text_w = img_width - RIGHT_MARGIN - x_position

    y_position = TOP_MARGIN + 70  # respirito arriba

    # Nombre: auto-fit si no entra en una línea
    name_text = f"{row.get('Nombre', '')}"
    name_font_fit = fit_font_size(draw, name_text, montserrat_bold_path, max_text_w,
                                  start_size=name_font_size, min_size=40)
    y_position = draw_wrapped(draw, x_position, y_position, name_text, name_font_fit,
                              text_color, max_text_w, line_h=int(getattr(name_font_fit, "size", 40) * 1.1))
    y_position += 10

    # Puesto
    puesto_text = f"{row.get('Puesto', '')}"
    y_position = draw_wrapped(draw, x_position, y_position, puesto_text, position_font,
                              position_color, max_text_w, line_h=int(getattr(position_font, "size", 36) * 1.15))
    y_position += 20

    # Datos de contacto
    contact_items = []
    icons = []

    if 'Teléfono' in df.columns and pd.notna(row['Teléfono']):
        contact_items.append(str(row['Teléfono']))
        icons.append('phone')
    if 'Email' in df.columns and pd.notna(row['Email']):
        contact_items.append(str(row['Email']))
        icons.append('email')
    if 'Dirección' in df.columns and pd.notna(row['Dirección']):
        contact_items.append(str(row['Dirección']))
        icons.append('location')
    if 'Página web' in df.columns and pd.notna(row['Página web']):
        contact_items.append(str(row['Página web']))
        icons.append('web')

    icon_size = (60, 60)
    line_gap = 25

    icon_size = (60, 60)
    line_gap = 25

    for i, item in enumerate(contact_items):
        tx = x_position + icon_size[0] + 20
        max_w_item = img_width - RIGHT_MARGIN - tx
        line_h = int(getattr(contact_font, "size", 32) * 1.15)

        # 1) Calculamos las líneas envueltas y su altura total
        lines = wrap_to_width(draw, item, contact_font, max_w_item)
        text_total_h = max(line_h * max(1, len(lines)), line_h)

        icon_h = icon_size[1]
        icon_w = icon_size[0]

        # 2) Elegimos el alto "contenedor" y centramos ambos dentro de él
        block_h = max(icon_h, text_total_h)
        # offset vertical para centrar cada elemento en el bloque
        icon_y = y_position + (block_h - icon_h) // 2
        text_y = y_position + (block_h - text_total_h) // 2

        # 3) Pegar ícono (recoloreado) centrado al bloque
        if i < len(icons):
            icon_path = os.path.join(icons_dir, f"{icons[i]}.png")
            try:
                icon = Image.open(icon_path).convert("RGBA").resize(icon_size, Image.Resampling.LANCZOS)
                icon.putdata([(*highlight_color, px[3]) if px[3] else px for px in icon.getdata()])
                img.paste(icon, (int(x_position), int(icon_y)), icon)
            except FileNotFoundError:
                pass

        # 4) Dibujar el bloque de texto centrado al ícono
        ty = text_y
        for line in lines:
            draw.text((tx, ty), line, font=contact_font, fill=text_color)
            ty += line_h

        # 5) Avanzar a la siguiente fila (debajo del bloque más alto)
        y_position += block_h + line_gap


        # Guardar imagen
        nombre_salida = row.get('Nombre', f'img_{index}').replace('/', '-')
        output_path = os.path.join(output_dir, f"{nombre_salida}.png")
        img.save(output_path, 'PNG', dpi=(300, 300), quality=100)

print(f"Imágenes generadas en: {output_dir}")
