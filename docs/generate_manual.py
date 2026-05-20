"""
Genera el Manual de Uso del Panel de Administración de Nahui Ollin Inc.
Salida: docs/Manual-Panel-Admin-Nahui-Ollin.pdf

Diseño basado en la paleta del sitio:
  deep-blue #174A7C, turquoise #1FB7B6, heart #E63946, warm #FFF8F3
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, Image, Flowable
)
from reportlab.pdfgen import canvas


# --- Paleta -----------------------------------------------------------------
DEEP_BLUE = HexColor("#174A7C")
TURQUOISE = HexColor("#1FB7B6")
HEART     = HexColor("#E63946")
WARM      = HexColor("#FFF8F3")
SLATE_50  = HexColor("#F8FAFC")
SLATE_100 = HexColor("#F1F5F9")
SLATE_200 = HexColor("#E2E8F0")
SLATE_400 = HexColor("#94A3B8")
SLATE_600 = HexColor("#475569")
SLATE_800 = HexColor("#1E293B")
WHITE     = HexColor("#FFFFFF")


# --- Estilos de párrafo ------------------------------------------------------
base = getSampleStyleSheet()

styles = {
    "h1": ParagraphStyle(
        "h1", parent=base["Heading1"],
        fontName="Helvetica-Bold", fontSize=28, leading=34,
        textColor=DEEP_BLUE, spaceAfter=8, spaceBefore=0, alignment=TA_LEFT,
    ),
    "h2": ParagraphStyle(
        "h2", parent=base["Heading2"],
        fontName="Helvetica-Bold", fontSize=20, leading=26,
        textColor=DEEP_BLUE, spaceAfter=10, spaceBefore=20, alignment=TA_LEFT,
    ),
    "h3": ParagraphStyle(
        "h3", parent=base["Heading3"],
        fontName="Helvetica-Bold", fontSize=14, leading=18,
        textColor=DEEP_BLUE, spaceAfter=6, spaceBefore=14, alignment=TA_LEFT,
    ),
    "eyebrow": ParagraphStyle(
        "eyebrow", parent=base["Normal"],
        fontName="Helvetica-Bold", fontSize=10, leading=12,
        textColor=TURQUOISE, spaceAfter=4, alignment=TA_LEFT,
    ),
    "body": ParagraphStyle(
        "body", parent=base["Normal"],
        fontName="Helvetica", fontSize=11, leading=16,
        textColor=SLATE_800, spaceAfter=8, alignment=TA_LEFT,
    ),
    "body_justify": ParagraphStyle(
        "body_justify", parent=base["Normal"],
        fontName="Helvetica", fontSize=11, leading=16,
        textColor=SLATE_800, spaceAfter=8, alignment=TA_JUSTIFY,
    ),
    "muted": ParagraphStyle(
        "muted", parent=base["Normal"],
        fontName="Helvetica-Oblique", fontSize=10, leading=14,
        textColor=SLATE_600, spaceAfter=6,
    ),
    "step_num": ParagraphStyle(
        "step_num", parent=base["Normal"],
        fontName="Helvetica-Bold", fontSize=18, leading=22,
        textColor=WHITE, alignment=TA_CENTER,
    ),
    "step_title": ParagraphStyle(
        "step_title", parent=base["Normal"],
        fontName="Helvetica-Bold", fontSize=13, leading=16,
        textColor=DEEP_BLUE, spaceAfter=4,
    ),
    "step_body": ParagraphStyle(
        "step_body", parent=base["Normal"],
        fontName="Helvetica", fontSize=11, leading=15,
        textColor=SLATE_800,
    ),
    "tip_title": ParagraphStyle(
        "tip_title", parent=base["Normal"],
        fontName="Helvetica-Bold", fontSize=11, leading=14,
        textColor=DEEP_BLUE, spaceAfter=4,
    ),
    "tip_body": ParagraphStyle(
        "tip_body", parent=base["Normal"],
        fontName="Helvetica", fontSize=10, leading=14,
        textColor=SLATE_800,
    ),
    "cover_title": ParagraphStyle(
        "cover_title", parent=base["Heading1"],
        fontName="Helvetica-Bold", fontSize=42, leading=48,
        textColor=WHITE, alignment=TA_LEFT, spaceAfter=10,
    ),
    "cover_sub": ParagraphStyle(
        "cover_sub", parent=base["Normal"],
        fontName="Helvetica", fontSize=16, leading=22,
        textColor=WHITE, alignment=TA_LEFT, spaceAfter=4,
    ),
    "cover_brand": ParagraphStyle(
        "cover_brand", parent=base["Normal"],
        fontName="Helvetica-Bold", fontSize=14, leading=18,
        textColor=TURQUOISE, alignment=TA_LEFT, spaceAfter=20,
    ),
}


# --- Componentes visuales ----------------------------------------------------
def hr(color=TURQUOISE, width=15*cm, thickness=2):
    """Una línea separadora delgada."""
    t = Table([[""]], colWidths=[width], rowHeights=[0.1])
    t.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), thickness, color),
    ]))
    return t


def step_box(num: str, title: str, body: str):
    """Caja de paso numerado con burbuja turquesa a la izquierda."""
    bubble = Table(
        [[Paragraph(num, styles["step_num"])]],
        colWidths=[1.2*cm], rowHeights=[1.2*cm],
    )
    bubble.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), TURQUOISE),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ROUNDEDCORNERS", [6, 6, 6, 6]),
    ]))

    content = [
        Paragraph(title, styles["step_title"]),
        Paragraph(body, styles["step_body"]),
    ]

    outer = Table(
        [[bubble, content]],
        colWidths=[1.6*cm, None],
    )
    outer.setStyle(TableStyle([
        ("VALIGN", (0, 0), (0, -1), "TOP"),
        ("VALIGN", (1, 0), (1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
    ]))
    return outer


def info_card(title: str, body_lines: list, bg=SLATE_50, accent=TURQUOISE):
    """Tarjeta con barra lateral de color de acento."""
    inner_content = [Paragraph(title, styles["tip_title"])]
    for line in body_lines:
        inner_content.append(Paragraph(line, styles["tip_body"]))

    inner = Table([[c] for c in inner_content], colWidths=[14.5*cm])
    inner.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))

    outer = Table([[inner]], colWidths=[15*cm])
    outer.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("LINEBEFORE", (0, 0), (0, -1), 4, accent),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    return outer


def section_title(eyebrow: str, title: str):
    """Encabezado de sección con eyebrow turquesa + título azul + línea."""
    return [
        Paragraph(eyebrow.upper(), styles["eyebrow"]),
        Paragraph(title, styles["h1"]),
        hr(),
        Spacer(1, 12),
    ]


def url_pill(text: str):
    """Estilo monoespaciado tipo código."""
    return Paragraph(
        f'<font face="Courier" color="#174A7C"><b>{text}</b></font>',
        styles["body"],
    )


# --- Layout: Cover, header, footer ------------------------------------------
def draw_cover(canv, doc):
    """Portada con banda de gradiente simulada."""
    w, h = A4
    # Banda diagonal turquesa decorativa
    canv.setFillColor(DEEP_BLUE)
    canv.rect(0, 0, w, h, stroke=0, fill=1)

    # Banda turquesa lateral
    canv.setFillColor(TURQUOISE)
    canv.rect(0, 0, 1.5*cm, h, stroke=0, fill=1)

    # Marca de agua circular
    canv.setStrokeColor(TURQUOISE)
    canv.setLineWidth(1)
    canv.circle(w - 4*cm, h - 4*cm, 3.5*cm, stroke=1, fill=0)
    canv.circle(w - 4*cm, h - 4*cm, 5*cm, stroke=1, fill=0)


def draw_page_chrome(canv, doc):
    """Header + footer para páginas internas."""
    w, h = A4
    # Header: linea superior fina turquesa
    canv.setFillColor(TURQUOISE)
    canv.rect(0, h - 0.4*cm, w, 0.4*cm, stroke=0, fill=1)

    # Header: nombre de marca
    canv.setFont("Helvetica-Bold", 9)
    canv.setFillColor(DEEP_BLUE)
    canv.drawString(2*cm, h - 1.1*cm, "NAHUI OLLIN INC")
    canv.setFont("Helvetica", 9)
    canv.setFillColor(SLATE_400)
    canv.drawRightString(w - 2*cm, h - 1.1*cm, "Manual del Panel de Administración")

    # Footer: número de página
    canv.setFont("Helvetica", 9)
    canv.setFillColor(SLATE_400)
    canv.drawCentredString(w / 2, 1*cm, f"— {doc.page} —")

    # Footer: marca
    canv.setFont("Helvetica-Oblique", 8)
    canv.drawString(2*cm, 1*cm, "nahuiollininc.org")


# --- Contenido --------------------------------------------------------------
def build_story():
    story = []

    # ============ PORTADA ============
    story.append(Spacer(1, 6*cm))
    story.append(Paragraph("Manual", styles["cover_title"]))
    story.append(Paragraph("del Panel de Administración", styles["cover_title"]))
    story.append(Spacer(1, 0.5*cm))
    story.append(Paragraph("Guía paso a paso para gestionar el contenido del sitio web", styles["cover_sub"]))
    story.append(Spacer(1, 2*cm))
    story.append(Paragraph("NAHUI OLLIN INC", styles["cover_brand"]))
    story.append(PageBreak())

    # ============ ÍNDICE ============
    story.extend(section_title("Índice", "¿Qué vas a encontrar?"))
    toc = [
        ("1.", "Cómo ingresar al panel"),
        ("2.", "Recorrido por el panel"),
        ("3.", "Galería: agregar, editar y ordenar"),
        ("4.", "Evangelización"),
        ("5.", "Cartas Referenciales"),
        ("6.", "Historias y Acciones"),
        ("7.", "Cómo subir imágenes/videos con Cloudinary"),
        ("8.", "Consejos finales"),
    ]
    toc_data = [[Paragraph(f'<b><font color="#1FB7B6">{n}</font></b>', styles["body"]),
                 Paragraph(t, styles["body"])] for n, t in toc]
    toc_table = Table(toc_data, colWidths=[1*cm, 14*cm])
    toc_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(toc_table)
    story.append(PageBreak())

    # ============ 1. INGRESAR ============
    story.extend(section_title("Paso 1", "Cómo ingresar al panel"))
    story.append(Paragraph(
        "El panel de administración es el lugar desde donde podés actualizar el contenido del "
        "sitio web (fotos, testimonios, cartas, etc.) sin necesidad de tocar el código.",
        styles["body_justify"]))
    story.append(Spacer(1, 8))

    story.append(step_box("1",
        "Abrí el panel en tu navegador",
        "Ingresá a <b>nahuiollininc.org/admin/login</b> desde Chrome, Firefox o Safari."))
    story.append(step_box("2",
        "Escribí tu correo y contraseña",
        "Usá los datos que te dimos al crear tu cuenta de administrador."))
    story.append(step_box("3",
        "Hacé clic en \"Iniciar sesión\"",
        "Si los datos son correctos, vas a entrar al panel automáticamente. "
        "Si te equivocás, el sistema te avisa para que vuelvas a intentar."))

    story.append(Spacer(1, 12))
    story.append(info_card(
        "Si olvidaste tu contraseña",
        ["Por ahora, contactá a la persona técnica de tu equipo para que te la reestablezca. "
         "Próximamente vamos a habilitar recuperación automática."],
        bg=SLATE_50, accent=HEART))
    story.append(PageBreak())

    # ============ 2. RECORRIDO ============
    story.extend(section_title("Paso 2", "Recorrido por el panel"))
    story.append(Paragraph(
        "Una vez dentro, vas a ver una barra de menú a la izquierda con 6 secciones. "
        "Cada una controla una parte del sitio público.",
        styles["body_justify"]))
    story.append(Spacer(1, 12))

    sections = [
        ("Resumen", "Vista general con métricas: cuántos testimonios, fotos, cartas y acciones tenés cargadas."),
        ("Testimonios", "Las historias de niños y familias acompañadas (con fotos antes/después)."),
        ("Evangelización", "Fotos y videos del acompañamiento espiritual."),
        ("Cartas Referenciales", "Cartas de respaldo de la fundación."),
        ("Acciones", "Las 6 acciones principales que muestra la página de inicio."),
        ("Galería", "El mosaico de imágenes y videos de la sección \"Momentos que dejan huella\"."),
    ]
    rows = [[Paragraph(f"<b>{name}</b>", styles["tip_title"]),
             Paragraph(desc, styles["tip_body"])] for name, desc in sections]
    t = Table(rows, colWidths=[4.5*cm, 10.5*cm])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 0), (-1, -1), SLATE_50),
        ("LINEBELOW", (0, 0), (-1, -2), 0.5, SLATE_200),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(t)
    story.append(PageBreak())

    # ============ 3. GALERÍA ============
    story.extend(section_title("Paso 3", "Galería: agregar, editar y ordenar"))
    story.append(Paragraph(
        "La sección <b>Galería</b> controla las fotos y videos que aparecen en \"Momentos que dejan huella\" "
        "del sitio público. Acá podés agregar imágenes nuevas, cambiar el orden, ocultar las que no querés "
        "que se vean y eliminar las que sobran.",
        styles["body_justify"]))

    story.append(Paragraph("Cómo agregar una imagen o video", styles["h3"]))
    story.append(step_box("1",
        "Conseguí un link (URL) de la imagen o video",
        "Necesitás tener la foto subida a algún lugar en internet (por ejemplo Cloudinary — "
        "ver paso 7 más adelante). Cuando tengas el link, lo copiás."))
    story.append(step_box("2",
        "Pegá el link en el campo \"URL\"",
        "Arriba de la galería vas a ver una caja que dice <b>\"Agregar por URL\"</b>. "
        "Pegá ahí el link que copiaste."))
    story.append(step_box("3",
        "Escribí una descripción (opcional)",
        "Si querés que abajo de la foto aparezca un texto, escribilo en el campo "
        "<b>\"Descripción\"</b>. Si lo dejás vacío, no se muestra nada."))
    story.append(step_box("4",
        "Elegí el tipo: Imagen o Video",
        "El sistema lo detecta automáticamente por la extensión del archivo, "
        "pero podés cambiarlo manualmente si hace falta."))
    story.append(step_box("5",
        "Hacé clic en \"Agregar\"",
        "Listo. La nueva imagen aparece al final del listado. La podés mover de lugar "
        "cambiando el número de orden."))
    story.append(PageBreak())

    # Galería - continuación
    story.extend(section_title("Paso 3 (cont.)", "Editar las que ya están cargadas"))

    story.append(Paragraph("Cambiar el orden", styles["h3"]))
    story.append(Paragraph(
        "Cada imagen tiene un número arriba a la izquierda. Ese número indica la posición en la galería. "
        "Cambialo y la imagen se mueve. Por ejemplo: si querés que una imagen aparezca primero, ponele "
        "el número 1.",
        styles["body_justify"]))

    story.append(Paragraph("Editar la descripción", styles["h3"]))
    story.append(Paragraph(
        "Debajo de cada imagen hay un campo de texto con la descripción actual. "
        "Hacé clic, escribí el texto nuevo y hacé clic afuera del campo (o apretá Tab). "
        "Se guarda solo. Si la dejás vacía, no se va a mostrar ninguna descripción en el sitio.",
        styles["body_justify"]))

    story.append(Paragraph("Ocultar sin eliminar", styles["h3"]))
    story.append(Paragraph(
        "El ícono del ojo (👁) oculta o muestra la imagen en el sitio público sin borrarla del panel. "
        "Útil para guardar contenido que no querés que se vea ahora pero podés querer mostrar después.",
        styles["body_justify"]))

    story.append(Paragraph("Eliminar definitivamente", styles["h3"]))
    story.append(Paragraph(
        "El botón rojo del basurero (🗑) elimina la imagen para siempre. El sistema te va a pedir "
        "confirmación antes de borrar.",
        styles["body_justify"]))

    story.append(Spacer(1, 10))
    story.append(info_card(
        "Importante",
        ["Eliminar es una acción irreversible. Si tenés dudas, mejor ocultá la imagen en lugar de borrarla."],
        bg=HexColor("#FEF2F2"), accent=HEART))
    story.append(PageBreak())

    # ============ 4. EVANGELIZACIÓN ============
    story.extend(section_title("Paso 4", "Evangelización"))
    story.append(Paragraph(
        "Esta sección controla la galería que aparece en la página <b>/evangelizacion</b> del sitio. "
        "Funciona exactamente igual que la Galería principal.",
        styles["body_justify"]))
    story.append(Spacer(1, 8))
    story.append(info_card(
        "Tip",
        ["Usá esta sección para mostrar fotos de bautismo, catequesis, primera comunión, confirmación "
         "u otras actividades de acompañamiento espiritual."],
        bg=SLATE_50, accent=TURQUOISE))

    story.append(Spacer(1, 20))

    # ============ 5. CARTAS ============
    story.extend(section_title("Paso 5", "Cartas Referenciales"))
    story.append(Paragraph(
        "Acá subís cartas y testimonios escritos que respaldan el trabajo de la fundación. "
        "Pueden ser fotos escaneadas de cartas en papel o documentos digitales. Aparecen "
        "en la página <b>/cartas-referenciales</b> del sitio.",
        styles["body_justify"]))
    story.append(Spacer(1, 8))
    story.append(info_card(
        "Tip",
        ["Para cartas escaneadas, asegurate de que el texto sea legible antes de subirla. "
         "Lo ideal es escanearlas a 300 DPI."],
        bg=SLATE_50, accent=TURQUOISE))
    story.append(PageBreak())

    # ============ 6. HISTORIAS Y ACCIONES ============
    story.extend(section_title("Paso 6", "Historias y Acciones"))

    story.append(Paragraph("Testimonios (Historias)", styles["h3"]))
    story.append(Paragraph(
        "En esta sección agregás los relatos de niños y familias acompañadas. "
        "Cada testimonio tiene:",
        styles["body_justify"]))
    bullets_hist = [
        "<b>Título:</b> el nombre o frase principal (ej: \"La historia de Yoselin\").",
        "<b>Fecha:</b> opcional, el período del acompañamiento.",
        "<b>Descripción:</b> el relato completo.",
        "<b>Imágenes:</b> podés subir fotos sueltas o un set \"antes / después\".",
    ]
    for b in bullets_hist:
        story.append(Paragraph(f'<font color="#1FB7B6">•</font> {b}', styles["body"]))

    story.append(Paragraph("Acciones", styles["h3"]))
    story.append(Paragraph(
        "Las 6 tarjetas que se ven en la página de inicio bajo el título "
        "\"Lo que hacemos\". Cada una tiene un ícono, un título corto, una descripción "
        "breve y una imagen de fondo. Editá las existentes en lugar de borrar y crear "
        "nuevas: el sitio está pensado para mostrar exactamente 6.",
        styles["body_justify"]))

    story.append(PageBreak())

    # ============ 7. CLOUDINARY ============
    story.extend(section_title("Paso 7", "Cómo subir imágenes y videos con Cloudinary"))
    story.append(Paragraph(
        "El panel necesita un <b>link (URL)</b> para cada imagen o video que querés mostrar. "
        "Como no podés subir archivos directamente al panel, vas a usar un servicio externo "
        "llamado <b>Cloudinary</b> que es gratis para uso normal y muy fácil.",
        styles["body_justify"]))

    story.append(Spacer(1, 6))
    story.append(info_card(
        "¿Qué es Cloudinary?",
        ["Cloudinary es un \"depósito\" en internet donde guardás tus fotos y videos. "
         "Te da un link público para cada archivo, y ese link es el que pegás en el panel."],
        bg=SLATE_50, accent=TURQUOISE))
    story.append(Spacer(1, 14))

    story.append(Paragraph("Crear tu cuenta (solo la primera vez)", styles["h3"]))
    story.append(step_box("1",
        "Andá a cloudinary.com",
        "Hacé clic en <b>\"Sign Up Free\"</b> arriba a la derecha."))
    story.append(step_box("2",
        "Llená el formulario",
        "Email, contraseña, y un nombre de cuenta (puede ser <b>nahuiollin</b> o lo que prefieras). "
        "No hace falta tarjeta de crédito."))
    story.append(step_box("3",
        "Confirmá tu correo",
        "Vas a recibir un email de Cloudinary. Hacé clic en el botón para confirmar."))

    story.append(PageBreak())

    # Cloudinary - subir
    story.extend(section_title("Paso 7 (cont.)", "Subir una imagen o video"))

    story.append(step_box("1",
        "Entrá a tu panel de Cloudinary",
        "Iniciá sesión en <b>cloudinary.com</b>. Vas a ver tu \"Dashboard\". En el menú "
        "lateral, hacé clic en <b>\"Media Library\"</b> (Biblioteca de medios)."))
    story.append(step_box("2",
        "Subí el archivo",
        "Hacé clic en el botón azul <b>\"Upload\"</b> arriba a la derecha. "
        "Podés arrastrar el archivo o seleccionarlo desde tu computadora. "
        "Funciona con JPG, PNG, WEBP, MP4, MOV, WEBM."))
    story.append(step_box("3",
        "Esperá que termine la carga",
        "Vas a ver una barra de progreso. Cuando aparece una tilde verde, el archivo "
        "está listo."))
    story.append(step_box("4",
        "Copiá el link del archivo",
        "Hacé clic sobre la imagen o video que acabás de subir. A la derecha aparece "
        "un panel con información. Buscá el campo que dice <b>\"Secure URL\"</b> o "
        "<b>\"URL\"</b> y hacé clic en el ícono de copiar (📋). Algo así:"))

    story.append(Spacer(1, 4))
    story.append(url_pill("https://res.cloudinary.com/nahuiollin/image/upload/v1234567/abc.jpg"))

    story.append(Spacer(1, 10))
    story.append(step_box("5",
        "Pegá el link en el admin del sitio",
        "Volvé al panel de Nahui Ollin (la sección de Galería, Evangelización o Cartas) "
        "y pegá ese link en el campo <b>\"URL\"</b>. Agregá una descripción si querés "
        "y dale a <b>\"Agregar\"</b>. ¡Listo!"))

    story.append(PageBreak())

    # ============ 8. TIPS FINALES ============
    story.extend(section_title("Paso 8", "Consejos finales"))

    tips = [
        ("Tamaños recomendados",
         "Para fotos de galería: al menos <b>1200×1200 px</b>. Para videos: <b>720p o 1080p</b>. "
         "Cloudinary optimiza automáticamente."),
        ("Formatos soportados",
         "Imágenes: JPG, PNG, WEBP. Videos: MP4, WEBM, MOV. Otros formatos pueden no funcionar."),
        ("Cuándo usar la descripción",
         "Si la foto necesita contexto (lugar, evento, fecha) ponele descripción. "
         "Si es decorativa, dejala vacía y queda más limpio."),
        ("Antes de eliminar, mejor ocultá",
         "Si dudás, usá el ícono del ojo para esconder la imagen sin borrarla. "
         "Si la querés mostrar de nuevo, hacés clic de nuevo en el ojo."),
        ("Cambiar el orden",
         "Las imágenes se muestran ordenadas por el número de orden, de menor a mayor. "
         "Numerá las más importantes con 1, 2, 3..."),
        ("Guardado automático",
         "Las descripciones se guardan cuando hacés clic afuera del campo. "
         "No hay botón \"Guardar\" — todo es automático."),
    ]
    for title, body in tips:
        story.append(info_card(title, [body], bg=SLATE_50, accent=TURQUOISE))
        story.append(Spacer(1, 6))

    story.append(Spacer(1, 20))
    story.append(hr(thickness=1, color=SLATE_200))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "<i>Si tenés dudas o algo no funciona como esperás, contactá al equipo técnico.</i>",
        styles["muted"]))
    story.append(Paragraph(
        '<b><font color="#1FB7B6">Nahui Ollin Inc</font></b> · nahuiollininc.org',
        styles["body"]))

    return story


# --- Main -------------------------------------------------------------------
def main():
    output = "docs/Manual-Panel-Admin-Nahui-Ollin.pdf"

    doc = SimpleDocTemplate(
        output,
        pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2*cm, bottomMargin=1.8*cm,
        title="Manual del Panel de Administración - Nahui Ollin Inc",
        author="Nahui Ollin Inc",
        subject="Guía de uso del panel de administración del sitio web",
    )

    def page_handler(canv, doc_):
        # Página 1 es portada
        if doc_.page == 1:
            draw_cover(canv, doc_)
        else:
            draw_page_chrome(canv, doc_)

    doc.build(build_story(), onFirstPage=page_handler, onLaterPages=page_handler)
    print(f"PDF generado: {output}")


if __name__ == "__main__":
    main()
