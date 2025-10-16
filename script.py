import os
import pandas as pd
from PIL import Image, ImageDraw, ImageFont
from openpyxl import load_workbook  # opcional

# =========================
# Rutas
# =========================
current_dir = os.path.dirname(os.path.abspath(__file__))
excel_path = os.path.join(current_dir, 'datos.xlsx')
color_path = os.path.join(current_dir, 'color.txt')
output_dir = os.path.join(current_dir, 'imagenes_generadas')
icons_dir = os.path.join(current_dir, 'iconos')
fonts_dir = os.path.join(current_dir, 'fuentes')
logo_path = os.path.join(current_dir, 'logo.png')

os.makedirs(output_dir, exist_ok=True)

# =========================
# Color corporativo
# =========================
with open(color_path, 'r') as f:
    hex_color = f.read().strip().lstrip('#')
highlight_color = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

# =========================
# Datos
# =========================
df = pd.read_excel(excel_path)

# =========================
# Lienzo y “perillas”
# =========================
IMG_W, IMG_H = 1500, 520
BG = (255, 255, 255)
TC = (0, 0, 0)          # texto
PC = (84, 84, 84)       # puesto

# Márgenes / gaps
LEFT_M, RIGHT_M = 80, 44
TOP_M, BOTTOM_M = 42, 42
DIVIDER_GAP = 36          # espacio entre el borde derecho del logo y el divisor
AFTER_DIVIDER = 44        # espacio del divisor hasta la columna de texto
RIGHT_COL_MIN = 560       # ancho mínimo para la columna derecha
DIVIDER_MAX_RATIO = 0.50  # el divisor nunca más allá del 50% del ancho

# Límites de tamaño del logo (clave para que no invada)
LOGO_MAX_W_RATIO = 0.40   # el logo no debe pasar del 40% del ancho total
LOGO_MAX_H_RATIO = 0.76   # del alto útil (alto menos márgenes)

# Fuentes
montserrat_bold = os.path.join(fonts_dir, 'Montserrat-Bold.ttf')
open_sans = os.path.join(fonts_dir, 'OpenSans-Regular.ttf')

def load_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

NAME_SIZE = 56
ROLE_SIZE = 36
CONTACT_SIZE = 37   # +1 vs antes, un toque más grande

# =========================
# Utilidades de layout
# =========================
def text_w(draw, text, font):
    bbox = draw.textbbox((0, 0), str(text), font=font)
    return bbox[2] - bbox[0]

def wrap(draw, text, font, max_w):
    text = "" if pd.isna(text) else str(text)
    words = text.split()
    if not words:
        return [""]
    lines, cur = [], words[0]
    for token in words[1:]:
        t = f"{cur} {token}"
        if text_w(draw, t, font) <= max_w:
            cur = t
        else:
            lines.append(cur)
            cur = token
    lines.append(cur)
    return lines

def draw_wrapped(draw, x, y, text, font, fill, max_w, line_h=None):
    if line_h is None:
        line_h = int(getattr(font, "size", 32) * 1.12)
    for line in wrap(draw, text, font, max_w):
        draw.text((x, y), line, font=font, fill=fill)
        y += line_h
    return y

def fit_one_line(draw, text, font_path, max_w, start, min_size=34):
    size = start
    while size >= min_size:
        f = load_font(font_path, size)
        if text_w(draw, text, f) <= max_w:
            return f
        size -= 1
    return load_font(font_path, min_size)

def recolor_icon(img_rgba, rgb):
    r, g, b = rgb
    px = img_rgba.load()
    w, h = img_rgba.size
    for i in range(w):
        for j in range(h):
            pr, pg, pb, pa = px[i, j]
            if pa:
                px[i, j] = (r, g, b, pa)
    return img_rgba

def clean(v):
    return "" if pd.isna(v) else str(v).rstrip()

# =========================
# Render
# =========================
for idx, row in df.iterrows():
    img = Image.new('RGB', (IMG_W, IMG_H), BG)
    draw = ImageDraw.Draw(img)

    # --- Logo: escala respetando alto y ancho máximos permitidos ---
    logo_right = LEFT_M
    try:
        logo = Image.open(logo_path).convert("RGBA")

        usable_h = IMG_H - TOP_M - BOTTOM_M
        max_logo_h = int(usable_h * LOGO_MAX_H_RATIO)
        max_logo_w = int(IMG_W * LOGO_MAX_W_RATIO)

        # escala respetando ambos límites (alto y ancho)
        scale_h = max_logo_h / logo.height
        scale_w = max_logo_w / logo.width
        scale = min(scale_h, scale_w, 1.0)  # nunca agrandar más allá del 100%

        logo_w = int(logo.width * scale)
        logo_h = int(logo.height * scale)
        logo = logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
        logo_y = (IMG_H - logo_h) // 2
        img.paste(logo, (LEFT_M, logo_y), logo)
        logo_right = LEFT_M + logo_w
    except FileNotFoundError:
        pass

    # --- Divisor adaptativo (no invadir la derecha) ---
    # Propuesta base: pegado al logo + gap
    divider_x = logo_right + DIVIDER_GAP
    # Límite 1: ratio máximo
    divider_x = min(divider_x, int(IMG_W * DIVIDER_MAX_RATIO))
    # Límite 2: reservar ancho mínimo a la derecha
    divider_x = min(divider_x, IMG_W - RIGHT_M - RIGHT_COL_MIN - AFTER_DIVIDER)
    # Límite 3: mínimo lógico por si el logo es muy chico
    divider_x = max(divider_x, LEFT_M + 220)

    draw.line([(divider_x, TOP_M), (divider_x, IMG_H - BOTTOM_M)],
              fill=highlight_color, width=4)

    # --- Columna derecha ---
    col_x = divider_x + AFTER_DIVIDER
    col_w = IMG_W - RIGHT_M - col_x
    y = TOP_M + 44

    name_txt = clean(row.get('Nombre', ''))
    role_txt = clean(row.get('Puesto', ''))

    name_font = fit_one_line(draw, name_txt, montserrat_bold, col_w, NAME_SIZE, min_size=40)
    y = draw_wrapped(draw, col_x, y, name_txt, name_font, TC, col_w,
                     line_h=int(getattr(name_font, "size", 40) * 1.08))
    y += 6

    role_font = load_font(montserrat_bold, ROLE_SIZE)
    y = draw_wrapped(draw, col_x, y, role_txt, role_font, PC, col_w,
                     line_h=int(ROLE_SIZE * 1.10))
    y += 10

    # Contacto
    contact_font = load_font(open_sans, CONTACT_SIZE)
    line_h = int(CONTACT_SIZE * 1.12)
    icon_size = (58, 58)  # un toque más chico que antes para ganar aire
    line_gap = 12

    items, icons = [], []
    if 'Teléfono' in df.columns and pd.notna(row['Teléfono']):
        items.append(clean(row['Teléfono'])); icons.append('phone')
    if 'Email' in df.columns and pd.notna(row['Email']):
        items.append(clean(row['Email'])); icons.append('email')
    if 'Dirección' in df.columns and pd.notna(row['Dirección']):
        items.append(clean(row['Dirección'])); icons.append('location')
    if 'Página web' in df.columns and pd.notna(row['Página web']):
        items.append(clean(row['Página web'])); icons.append('web')

    for i, item in enumerate(items):
        tx = col_x + icon_size[0] + 14
        max_w_item = IMG_W - RIGHT_M - tx
        lines = wrap(draw, item, contact_font, max_w_item)
        text_total_h = max(line_h * len(lines), line_h)
        block_h = max(icon_size[1], text_total_h)

        # icon
        if i < len(icons):
            icon_path = os.path.join(icons_dir, f"{icons[i]}.png")
            try:
                icon = Image.open(icon_path).convert("RGBA").resize(icon_size, Image.Resampling.LANCZOS)
                icon = recolor_icon(icon, highlight_color)
                icon_y = y + (block_h - icon_size[1]) // 2
                img.paste(icon, (int(col_x), int(icon_y)), icon)
            except FileNotFoundError:
                pass

        # text
        ty = y + (block_h - text_total_h) // 2
        for line in lines:
            draw.text((tx, ty), line, font=contact_font, fill=TC)
            ty += line_h

        y += block_h + line_gap

    # Guardar
    name_out = clean(row.get('Nombre', f'img_{idx}')).replace('/', '-')
    out_path = os.path.join(output_dir, f"{name_out}.png")
    img.save(out_path, 'PNG', dpi=(300, 300), quality=100)

print(f"Imágenes generadas en: {output_dir}")