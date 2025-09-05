import os
import pandas as pd
from PIL import Image, ImageDraw, ImageFont
from openpyxl import load_workbook

# Configuración de carpetas
current_dir = os.path.dirname(os.path.abspath(__file__))
excel_path = os.path.join(current_dir, 'datos.xlsx')
color_path = os.path.join(current_dir, 'color.txt')
output_dir = os.path.join(current_dir, 'imagenes_generadas')
icons_dir = os.path.join(current_dir, 'iconos')
fonts_dir = os.path.join(current_dir, 'fuentes')

os.makedirs(output_dir, exist_ok=True)

# Leer color corporativo
with open(color_path, 'r') as f:
    hex_color = f.read().strip()
highlight_color = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

# Leer datos del Excel
df = pd.read_excel(excel_path)

# Configuración de la imagen
img_width = 2000
img_height = 700
logo_path = os.path.join(current_dir, 'logo.png')

# Colores
background_color = (255, 255, 255)
text_color = (0, 0, 0)
position_color = (84, 84, 84)

# Fuentes
montserrat_bold = os.path.join(fonts_dir, 'Montserrat-Bold.ttf')
open_sans_regular = os.path.join(fonts_dir, 'OpenSans-Regular.ttf')

# Tamaños de fuente
name_font_size = 36
position_font_size = 24
contact_font_size = 26   # ← más grande que antes (20)

name_font = ImageFont.truetype(montserrat_bold, name_font_size)
position_font = ImageFont.truetype(montserrat_bold, position_font_size)
contact_font = ImageFont.truetype(open_sans_regular, contact_font_size)

for index, row in df.iterrows():
    img = Image.new('RGB', (img_width, img_height), background_color)
    draw = ImageDraw.Draw(img)

    # Logo (1.5x más grande, centrado vertical a la izquierda)
    try:
        logo = Image.open(logo_path).convert("RGBA")
        logo_height = int(250 * 1.5)  # antes 250, ahora 375
        logo_width = int(logo.width * (logo_height / logo.height))
        logo = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
        logo_y = (img_height - logo_height) // 2
        img.paste(logo, (150, logo_y), logo)
    except FileNotFoundError:
        print(f"No se encontró logo.png en {current_dir}")

    # Línea divisoria (65% del ancho)
    divider_x = int(img_width * 0.65)
    draw.line(
        [(divider_x, 80), (divider_x, img_height - 80)],
        fill=highlight_color, width=4
    )

    # Bloque de texto (a la derecha de la línea)
    x_position = divider_x + 80
    y_position = 150

    # Nombre
    draw.text((x_position, y_position), f"{row['Nombre']}", fill=text_color, font=name_font)
    y_position += 60

    # Puesto
    draw.text((x_position, y_position), f"{row['Puesto']}", fill=position_color, font=position_font)
    y_position += 120  # más espacio antes de los contactos

    # Datos de contacto
    contact_items = []
    icons = []
    if 'Teléfono' in df.columns and pd.notna(row['Teléfono']):
        contact_items.append(row['Teléfono'])
        icons.append('phone')

    if 'Email' in df.columns and pd.notna(row['Email']):
        contact_items.append(row['Email'])
        icons.append('email')

    if 'Dirección' in df.columns and pd.notna(row['Dirección']):
        contact_items.append(row['Dirección'])
        icons.append('location')

    if 'Página web' in df.columns and pd.notna(row['Página web']):
        contact_items.append(row['Página web'])
        icons.append('web')

    icon_size = (50, 50)  # iconos más grandes también

    for i, item in enumerate(contact_items):
        if i < len(icons):
            icon_path = os.path.join(icons_dir, f"{icons[i]}.png")
            try:
                icon = Image.open(icon_path).convert("RGBA")
                icon = icon.resize(icon_size, Image.Resampling.LANCZOS)
                # Recolorear icono al color corporativo
                data = [
                    (*highlight_color, px[3]) if px[3] > 0 else px
                    for px in icon.getdata()
                ]
                icon.putdata(data)
                img.paste(icon, (x_position, y_position), icon)
            except FileNotFoundError:
                pass

        draw.text(
            (x_position + 70, y_position + 8),  # más separación del icono
            f"{item}",
            fill=text_color,
            font=contact_font
        )
        y_position += 85  # más espacio entre cada línea

    # Guardar imagen
    output_path = os.path.join(output_dir, f"{row['Nombre']}.png")
    img.save(output_path, 'PNG', dpi=(300, 300), quality=100)

print(f"Imágenes generadas en: {output_dir}")
