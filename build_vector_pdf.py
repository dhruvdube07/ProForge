import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
pt = 1
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

PDF_PATH = r"c:\Users\Dhruv's Dell\Desktop\Remo\ProForge_AI_Internship_Report.pdf"

# Register standard TrueType fonts
pdfmetrics.registerFont(TTFont('ProFont', r'C:\Windows\Fonts\times.ttf'))
pdfmetrics.registerFont(TTFont('ProFont-Bold', r'C:\Windows\Fonts\timesbd.ttf'))
pdfmetrics.registerFont(TTFont('ProFont-Italic', r'C:\Windows\Fonts\timesi.ttf'))
pdfmetrics.registerFont(TTFont('ProFont-BoldItalic', r'C:\Windows\Fonts\timesbi.ttf'))

pdfmetrics.registerFont(TTFont('HeadFont', r'C:\Windows\Fonts\arial.ttf'))
pdfmetrics.registerFont(TTFont('HeadFont-Bold', r'C:\Windows\Fonts\arialbd.ttf'))

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_decorations()
            super().showPage()
        super().save()

    def draw_decorations(self):
        self.saveState()
        border_x = 24 * pt
        border_y = 20 * pt
        w, h = A4

        # Outer Frame
        self.setStrokeColor(colors.HexColor("#000000"))
        self.setLineWidth(1.2 * pt)
        self.rect(border_x, border_y, w - 2 * border_x, h - 2 * border_y)

        # Running Footer Divider & Metadata
        self.setStrokeColor(colors.HexColor("#94a3b8"))
        self.setLineWidth(0.6 * pt)
        self.line(border_x + 8 * pt, border_y + 18 * pt, w - border_x - 8 * pt, border_y + 18 * pt)

        self.setFont("HeadFont", 8.5 * pt)
        self.setFillColor(colors.HexColor("#000000"))
        footer_text = "MSBTE DIPLOMA IN COMPUTER ENGINEERING | VIVA INSTITUTE OF TECHNOLOGY, VIRAR"
        self.drawString(border_x + 10 * pt, border_y + 6.5 * pt, footer_text)
        self.drawRightString(w - border_x - 10 * pt, border_y + 6.5 * pt, f"{self._pageNumber}")

        self.restoreState()

def create_placeholder_box(title, subtitle="", height_pt=185):
    """Creates a clean blank drop-zone container for manual screenshot insertion."""
    content = [
        Paragraph(f"<font size=11 color='#0284c7'><b>[ 🖼️ {title} ]</b></font>", ParagraphStyle('PH1', fontName='HeadFont-Bold', alignment=TA_CENTER, leading=14)),
        Paragraph(f"<font size=9 color='#64748b'><i>{subtitle if subtitle else 'Reserved Drop Zone — Drop actual site screenshot / company verification document here'}</i></font>", ParagraphStyle('PH2', fontName='ProFont-Italic', alignment=TA_CENTER, leading=12, spaceBefore=4))
    ]
    tbl = Table([[content]], colWidths=[525 * pt], rowHeights=[height_pt * pt])
    tbl.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1.5 * pt, colors.HexColor("#94a3b8")),
        ('TOPPADDING', (0,0), (-1,-1), 10 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10 * pt),
    ]))
    return tbl

def create_callout_box(title, text_content):
    """Creates an executive takeaway callout box with accent left border."""
    content = [
        Paragraph(f"<b><font color='#0284c7'>{title}</font></b>", ParagraphStyle('CalloutT', fontName='HeadFont-Bold', fontSize=10, leading=13, spaceAfter=3)),
        Paragraph(text_content, ParagraphStyle('CalloutB', fontName='ProFont', fontSize=9.5, leading=13.5, alignment=TA_JUSTIFY))
    ]
    tbl = Table([[content]], colWidths=[525 * pt])
    tbl.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 0.5 * pt, colors.HexColor("#e2e8f0")),
        ('LINEBEFORE', (0,0), (0,0), 3.5 * pt, colors.HexColor("#0284c7")),
        ('TOPPADDING', (0,0), (-1,-1), 7 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7 * pt),
        ('LEFTPADDING', (0,0), (-1,-1), 10 * pt),
        ('RIGHTPADDING', (0,0), (-1,-1), 10 * pt),
    ]))
    return tbl

def generate_pdf():
    doc = SimpleDocTemplate(
        PDF_PATH,
        pagesize=A4,
        leftMargin=30 * pt,
        rightMargin=30 * pt,
        topMargin=26 * pt,
        bottomMargin=28 * pt
    )

    # Dynamic typography budgeting for 85-95% vertical fill rate
    title_cover = ParagraphStyle('CoverTitle', fontName='HeadFont-Bold', fontSize=26, leading=30, alignment=TA_CENTER, textColor=colors.HexColor("#000000"), spaceAfter=5)
    subtitle_cover = ParagraphStyle('CoverSub', fontName='ProFont-Italic', fontSize=12.5, leading=16, alignment=TA_CENTER, textColor=colors.HexColor("#1f2937"), spaceAfter=14)
    center_bold_13 = ParagraphStyle('CBold13', fontName='HeadFont-Bold', fontSize=13.5, leading=17, alignment=TA_CENTER, textColor=colors.HexColor("#000000"))
    center_bold_12 = ParagraphStyle('CBold12', fontName='HeadFont-Bold', fontSize=12, leading=15, alignment=TA_CENTER, textColor=colors.HexColor("#000000"))
    center_bold_11 = ParagraphStyle('CBold11', fontName='HeadFont-Bold', fontSize=11, leading=14, alignment=TA_CENTER, textColor=colors.HexColor("#000000"))
    center_reg_12 = ParagraphStyle('CReg12', fontName='ProFont', fontSize=12, leading=15, alignment=TA_CENTER, textColor=colors.HexColor("#000000"))
    center_reg_11 = ParagraphStyle('CReg11', fontName='ProFont', fontSize=11, leading=14, alignment=TA_CENTER, textColor=colors.HexColor("#000000"))
    
    chapter_h1 = ParagraphStyle('ChapH1', fontName='HeadFont-Bold', fontSize=14, leading=17, alignment=TA_CENTER, spaceBefore=0, spaceAfter=3, textColor=colors.HexColor("#000000"))
    chapter_h2 = ParagraphStyle('ChapH2', fontName='HeadFont-Bold', fontSize=11, leading=14, alignment=TA_CENTER, spaceAfter=8, textColor=colors.HexColor("#000000"))
    
    # Body styles with line-height 1.5 - 1.55
    body = ParagraphStyle('ProBody', fontName='ProFont', fontSize=10.5, leading=15.5, alignment=TA_JUSTIFY, spaceAfter=8, textColor=colors.HexColor("#000000"))
    bullet = ParagraphStyle('ProBullet', fontName='ProFont', fontSize=10, leading=14.5, alignment=TA_JUSTIFY, leftIndent=14, firstLineIndent=-8, spaceAfter=5, textColor=colors.HexColor("#000000"))
    subhead = ParagraphStyle('ProSubhead', fontName='HeadFont-Bold', fontSize=11.5, leading=15, alignment=TA_LEFT, spaceBefore=7, spaceAfter=3, textColor=colors.HexColor("#000000"))
    fig_cap = ParagraphStyle('FigCap', fontName='HeadFont-Bold', fontSize=9, leading=12, alignment=TA_CENTER, textColor=colors.HexColor("#334155"))

    table_heading_style = ParagraphStyle('TblHdr', fontName='HeadFont-Bold', fontSize=9, leading=12, alignment=TA_CENTER, textColor=colors.black)
    table_cell_style = ParagraphStyle('TblCell', fontName='ProFont', fontSize=9, leading=12.5, alignment=TA_LEFT, textColor=colors.black)
    table_center_style = ParagraphStyle('TblCenter', fontName='ProFont', fontSize=9, leading=12.5, alignment=TA_CENTER, textColor=colors.black)

    story = []

    # ==========================================
    # PAGE 1: COVER PAGE
    # ==========================================
    story.append(Spacer(1, 16 * pt))
    story.append(Paragraph("A Technical Internship Report Submitted in Partial Fulfillment of the Requirements for the<br/><b>DIPLOMA IN COMPUTER ENGINEERING</b><br/>(Maharashtra State Board of Technical Education – MSBTE)", center_reg_11))
    story.append(Spacer(1, 26 * pt))
    story.append(Paragraph("PROFORGE", title_cover))
    story.append(Paragraph("AI-Driven Career Intelligence, Automated Resume Studio &amp; Multi-Tenant Portfolio Suite", subtitle_cover))
    story.append(Spacer(1, 14 * pt))
    story.append(Paragraph("Submitted By", center_reg_12))
    story.append(Spacer(1, 4 * pt))
    story.append(Paragraph("Dhruv R. Dubey<br/>Enrollment No: 25112400240 | Class: TYCO - B", center_bold_13))
    story.append(Spacer(1, 22 * pt))
    story.append(Paragraph("Under the Direct Supervision &amp; Guidance of", center_reg_12))
    story.append(Spacer(1, 6 * pt))
    
    mentor_box_data = [
        [Paragraph("<b>Industry Mentor</b><br/>Prof. Harsh Tambade<br/><font size=8.5 color='#4b5563'>Founder &amp; CEO, Elite Forums</font>", center_bold_11),
         Paragraph("<b>College Mentor / Guide</b><br/>Ms. Mansi Patil<br/><font size=8.5 color='#4b5563'>Lecturer, Dept. of Computer Engg.</font>", center_bold_11)]
    ]
    mentor_tbl = Table(mentor_box_data, colWidths=[255 * pt, 255 * pt])
    mentor_tbl.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 1.2 * pt, colors.HexColor("#0f2b5c")),
        ('INNERGRID', (0,0), (-1,-1), 0.6 * pt, colors.HexColor("#cbd5e1")),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('TOPPADDING', (0,0), (-1,-1), 8 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8 * pt),
    ]))
    story.append(mentor_tbl)
    story.append(Spacer(1, 24 * pt))

    viva_badge_data = [
        [Paragraph("<font size=9 color='#b91c1c'><b>VISHNU WAMAN THAKUR CHARITABLE TRUST'S</b></font>", center_bold_11)],
        [Paragraph("<font size=24 color='#b91c1c'><b>VIVA</b></font>", center_bold_13)],
        [Paragraph("<font size=9 color='#0f2b5c'><b>INSTITUTE OF TECHNOLOGY</b></font>", center_bold_11)]
    ]
    viva_badge_tbl = Table(viva_badge_data, colWidths=[245 * pt])
    viva_badge_tbl.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 2 * pt, colors.HexColor("#b91c1c")),
        ('INNERGRID', (0,0), (-1,-1), 0.5 * pt, colors.HexColor("#e5e7eb")),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#ffffff")),
        ('TOPPADDING', (0,0), (-1,-1), 6 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6 * pt),
    ]))
    story.append(viva_badge_tbl)
    story.append(Spacer(1, 22 * pt))

    story.append(Paragraph("DEPARTMENT OF COMPUTER ENGINEERING", center_bold_12))
    story.append(Spacer(1, 3 * pt))
    story.append(Paragraph("VIVA INSTITUTE OF TECHNOLOGY", center_bold_13))
    story.append(Spacer(1, 3 * pt))
    story.append(Paragraph("Shirgaon, Virar (East), Dist. Palghar, Maharashtra – 401305", center_reg_11))
    story.append(Spacer(1, 4 * pt))
    story.append(Paragraph("Academic Year: 2026-2027", center_bold_12))

    # ==========================================
    # PAGE 2: TABLE OF CONTENTS (INDEX)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("<u>TABLE OF CONTENTS / INDEX</u>", chapter_h1))
    story.append(Spacer(1, 6 * pt))

    toc_data = [
        [Paragraph("<b>Sr. No.</b>", center_bold_11), Paragraph("<b>Chapter / Topic Title</b>", center_bold_11), Paragraph("<b>Page No.</b>", center_bold_11)],
        [Paragraph("1", center_reg_11), Paragraph("Abstract &amp; MSBTE Curriculum Objectives", body), Paragraph("3", center_reg_11)],
        [Paragraph("2", center_reg_11), Paragraph("Acknowledgement &amp; Mentorship Credits", body), Paragraph("4", center_reg_11)],
        [Paragraph("3", center_reg_11), Paragraph("Chapter 1: Organization Structure of Industry &amp; General Hierarchy", body), Paragraph("5", center_reg_11)],
        [Paragraph("4", center_reg_11), Paragraph("Chapter 2: Introduction to Industry (History, Services &amp; Training Model)", body), Paragraph("6", center_reg_11)],
        [Paragraph("5", center_reg_11), Paragraph("Chapter 2 (Contd.): Dual Scope — On-Site Company Work vs Independent Project", body), Paragraph("7", center_reg_11)],
        [Paragraph("6", center_reg_11), Paragraph("Chapter 3: Hardware, Development Environment &amp; Core Toolchains", body), Paragraph("8", center_reg_11)],
        [Paragraph("7", center_reg_11), Paragraph("Chapter 3 (Contd.): Detailed Technical Specifications &amp; Maintenance Schedule", body), Paragraph("9", center_reg_11)],
        [Paragraph("8", center_reg_11), Paragraph("Chapter 3 (Contd.): Groq LPU Engine, AI Fallback Cascade &amp; Async JavaScript", body), Paragraph("10", center_reg_11)],
        [Paragraph("9", center_reg_11), Paragraph("Chapter 4: Processes, Agile Methodologies &amp; Digital Asset Handling", body), Paragraph("11", center_reg_11)],
        [Paragraph("10", center_reg_11), Paragraph("Chapter 4 (Contd.): Modular Component Hierarchy &amp; CSS Design Tokens", body), Paragraph("12", center_reg_11)],
        [Paragraph("11", center_reg_11), Paragraph("Chapter 4 (Contd.): Unidirectional Data Flow &amp; Supabase JSONB Schema Design", body), Paragraph("13", center_reg_11)],
        [Paragraph("12", center_reg_11), Paragraph("Chapter 5: Quality Assurance, Automated Unit Testing &amp; Weekly Assessments", body), Paragraph("14", center_reg_11)],
        [Paragraph("13", center_reg_11), Paragraph("Chapter 5 (Contd.): PDFKit A4 Coordinate Math, ATS Validation &amp; Cross-Browser Tests", body), Paragraph("15", center_reg_11)],
        [Paragraph("14", center_reg_11), Paragraph("Chapter 6: Digital Safety Protocols, Cybersecurity &amp; Disaster Recovery", body), Paragraph("16", center_reg_11)],
        [Paragraph("15", center_reg_11), Paragraph("Chapter 6 (Contd.): Ethical AI Principles, Factual Integrity &amp; Anti-Spam Standards", body), Paragraph("17", center_reg_11)],
        [Paragraph("16", center_reg_11), Paragraph("Chapter 7: Practical Experiences in Production — System Architecture Diagram", body), Paragraph("18", center_reg_11)],
        [Paragraph("17", center_reg_11), Paragraph("Chapter 7 (Contd.): Ecosystem Overview — The 6 ProForge Sub-Suites Overview", body), Paragraph("19", center_reg_11)],
        [Paragraph("18", center_reg_11), Paragraph("Chapter 8: 12-Week Task Breakdown — Weeks 1 to 4: Foundations &amp; Backend APIs", body), Paragraph("20", center_reg_11)],
        [Paragraph("19", center_reg_11), Paragraph("Chapter 8 (Contd.): 12-Week Task Breakdown — Weeks 5 to 6: Remo AI Resume Studio", body), Paragraph("21", center_reg_11)],
        [Paragraph("20", center_reg_11), Paragraph("Chapter 8 (Contd.): 12-Week Task Breakdown — Weeks 7 to 8: Folio AI Portfolio Generator", body), Paragraph("22", center_reg_11)],
        [Paragraph("21", center_reg_11), Paragraph("Chapter 8 (Contd.): 12-Week Task Breakdown — Weeks 9 to 12: Mali &amp; Covo AI Studio", body), Paragraph("23", center_reg_11)],
        [Paragraph("22", center_reg_11), Paragraph("Chapter 9: Technical Challenges Encountered &amp; Engineering Solutions", body), Paragraph("24", center_reg_11)],
        [Paragraph("23", center_reg_11), Paragraph("Chapter 9 (Contd.): Background Queueing, Sprint Reflections &amp; Student Learnings", body), Paragraph("25", center_reg_11)],
        [Paragraph("24", center_reg_11), Paragraph("Chapter 10: Conclusion, Industrial Experience &amp; Future Scope", body), Paragraph("26", center_reg_11)],
        [Paragraph("25", center_reg_11), Paragraph("Chapter 11: References, Technical Documentation &amp; Corporate Details", body), Paragraph("27", center_reg_11)]
    ]

    toc_tbl = Table(toc_data, colWidths=[42 * pt, 436 * pt, 52 * pt])
    toc_tbl.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1.2 * pt, colors.HexColor("#000000")),
        ('INNERGRID', (0,0), (-1,-1), 0.6 * pt, colors.HexColor("#000000")),
        ('ALIGN', (0,0), (0,-1), 'CENTER'),
        ('ALIGN', (2,0), (2,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3.4 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.4 * pt),
        ('LEFTPADDING', (1,0), (1,-1), 6 * pt),
    ]))
    story.append(toc_tbl)

    # ==========================================
    # PAGE 3: ABSTRACT
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("<u>ABSTRACT</u>", chapter_h1))
    story.append(Spacer(1, 6 * pt))
    story.append(Paragraph(
        "Industrial training is a compulsory academic curriculum requirement formulated by the <b>Maharashtra State Board of Technical Education (MSBTE)</b> for diploma students in Computer Engineering. The core purpose of this 12-week program is to provide students with practical industry exposure, transforming theoretical knowledge into hands-on software development skills in modern cloud architectures, web development frameworks, relational databases, and real-world Artificial Intelligence workflows.",
        body
    ))
    story.append(Paragraph(
        "I completed my twelve-week industrial training at <b>Elite Forums</b>, situated in Vasai (East), Palghar, Maharashtra, from <b>25th May 2026 to 15th August 2026</b>. During this period, my daily work followed a clear dual-track structure: (1) <b>On-Site Company Training &amp; Tasks:</b> Participating in daily technical workshops on Python, React 18, and Supabase, completing weekly coding assignments, resolving internal bug tickets, and participating in sprint standups under company mentors; and (2) <b>Independent Major Project Engineering:</b> Conceptualizing, designing, coding, testing, and deploying <b>PROFORGE — An End-to-End AI-Powered Career Intelligence &amp; Branding Suite</b>.",
        body
    ))
    story.append(Paragraph(
        "ProForge was engineered to resolve the severe problem of career tooling fragmentation that diploma and undergraduate students encounter when applying for internships and jobs. Rather than requiring users to navigate multiple disconnected websites, ProForge unites six specialized sub-suites in one unified platform: <b>Remo AI</b> (an ATS resume studio with sub-second AI bullet refinement and strict A4 vector PDF generation via PDFKit), <b>Folio AI</b> (a dynamic portfolio builder producing downloadable zero-dependency ZIP packages), <b>Talo AI</b> (an ATS alignment auditor comparing candidate profiles with job descriptions), <b>Covo AI</b> (a personalized cold outreach and PDF cover letter studio), <b>Liko AI</b> (a LinkedIn post and personal branding optimizer), and <b>Mali AI</b> (an automated campaign scheduler and rich HTML email studio).",
        body
    ))
    story.append(Paragraph(
        "The system is built using React 18, Vite, Tailwind CSS, Node.js, Express REST routing, Supabase PostgreSQL with JSONB schema structures, Groq SDK LPU inference (Qwen 2.5 and Llama 3 models), and Nodemailer with Zoho SMTP. This report documents the industry organizational structure, equipment, software design methodologies, quality assurance testing, cybersecurity protocols, 12-week task timelines, technical challenges, and MSBTE learning outcomes achieved during the internship.",
        body
    ))
    story.append(create_callout_box(
        "Key MSBTE Curriculum Alignment",
        "This project directly fulfills MSBTE Industry Training Course Outcomes by demonstrating end-to-end full-stack development, database modeling in PostgreSQL, modern JavaScript ES6+ async/await workflows, and automated test deployment."
    ))

    # ==========================================
    # PAGE 4: ACKNOWLEDGEMENT
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("<u>ACKNOWLEDGEMENT</u>", chapter_h1))
    story.append(Spacer(1, 6 * pt))
    story.append(Paragraph(
        "The successful completion of this 12-week industrial training and the development of the ProForge AI platform represents a major milestone in my academic and technical journey. I take this opportunity to express my profound gratitude to all the mentors, teachers, and colleagues who provided their guidance, encouragement, and support.",
        body
    ))
    story.append(Paragraph(
        "I express my deepest and most sincere gratitude to my college mentor, <b>Ms. Mansi Patil</b>, Lecturer in the Department of Computer Engineering at VIVA Institute of Technology, Virar (East). Her academic supervision, regular project reviews, valuable technical suggestions, and continuous encouragement were instrumental in keeping this project aligned with MSBTE curriculum standards.",
        body
    ))
    story.append(Paragraph(
        "I am equally thankful to my industry mentor, <b>Prof. Harsh Tambade</b>, Founder and CEO of <b>Elite Forums</b>, Vasai (East), for providing me the opportunity to undergo this rigorous industrial training at the Vasai center. His deep technical knowledge in Generative AI architectures, cloud microservices, and modern web application development, along with his guidance on software design patterns, helped me overcome complex full-stack engineering challenges.",
        body
    ))
    story.append(Paragraph(
        "I also extend my heartfelt thanks to the <b>Head of Department</b> and all faculty members of the Department of Computer Engineering at VIVA Institute of Technology for providing excellent academic infrastructure, encouragement, and laboratory facilities.",
        body
    ))
    story.append(Paragraph(
        "I thank the entire developers and instructors team at Elite Forums for their supportive peer reviews, technical workshops, and daily collaborative environment, and my parents and friends for their continuous moral support throughout this period.",
        body
    ))
    story.append(Spacer(1, 24 * pt))
    sig_data = [
        [Paragraph("<b>Dhruv R. Dubey</b><br/>Enrollment No: 25112400240<br/>Class: TYCO - B (Third Year Diploma in Computer Engineering)<br/>Department of Computer Engineering<br/>VIVA Institute of Technology, Virar (East), Maharashtra", ParagraphStyle('RightSig', fontName='ProFont', fontSize=9.5, leading=13.5, alignment=TA_RIGHT))]
    ]
    sig_tbl = Table(sig_data, colWidths=[510 * pt])
    sig_tbl.setStyle(TableStyle([('ALIGN', (0,0), (-1,-1), 'RIGHT')]))
    story.append(sig_tbl)

    # ==========================================
    # PAGE 5: CHAPTER 1 - ORG STRUCTURE
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 1", chapter_h1))
    story.append(Paragraph("ORGANIZATION STRUCTURE OF INDUSTRY &amp; GENERAL HIERARCHY", chapter_h2))
    
    org_cell_header = ParagraphStyle('OrgHdr', fontName='HeadFont-Bold', fontSize=9, leading=11, alignment=TA_CENTER, textColor=colors.white)
    org_cell_body = ParagraphStyle('OrgBody', fontName='ProFont', fontSize=8.5, leading=11, alignment=TA_CENTER, textColor=colors.black)

    org_data = [
        [Paragraph("<b>Elite Forums</b>", org_cell_header), ""],
        [Paragraph("<b>Founder &amp; CEO</b><br/>Harsh Tambade", org_cell_header), ""],
        [Paragraph("<b>General Manager</b><br/>Jeet Gharat", org_cell_header), Paragraph("<b>Chief Operating Officer (COO)</b><br/>Siddhant Mandlik", org_cell_header)],
        [Paragraph("<b>Project Manager</b><br/>Suchita Nigam", org_cell_header), ""],
        [Paragraph("<b>Core Developers Team</b>", org_cell_header), Paragraph("<b>Instructors &amp; Mentors Team</b>", org_cell_header)],
        [Paragraph("Anshu Jaiswal<br/>Adarsh Pandey<br/>Mithilesh Vichare<br/>Yuvraj Singh", org_cell_body),
         Paragraph("Shreya Mishra<br/>Prathamesh Jakkula<br/>Nandini Singh<br/>Shreya Mulik<br/>Shashank Singh", org_cell_body)]
    ]
    org_tbl = Table(org_data, colWidths=[200 * pt, 200 * pt])
    org_tbl.setStyle(TableStyle([
        ('SPAN', (0,0), (1,0)),
        ('SPAN', (0,1), (1,1)),
        ('SPAN', (0,3), (1,3)),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (1,0), colors.HexColor("#0f2b5c")),
        ('BACKGROUND', (0,1), (1,1), colors.HexColor("#1e3a8a")),
        ('BACKGROUND', (0,2), (0,2), colors.HexColor("#1e40af")),
        ('BACKGROUND', (1,2), (1,2), colors.HexColor("#1e40af")),
        ('BACKGROUND', (0,3), (1,3), colors.HexColor("#2563eb")),
        ('BACKGROUND', (0,4), (0,4), colors.HexColor("#0f2b5c")),
        ('BACKGROUND', (1,4), (1,4), colors.HexColor("#0f2b5c")),
        ('BOX', (0,0), (-1,-1), 1.2 * pt, colors.HexColor("#0f2b5c")),
        ('INNERGRID', (0,0), (-1,-1), 0.6 * pt, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 3.5 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5 * pt),
    ]))
    story.append(org_tbl)
    story.append(Spacer(1, 6 * pt))
    story.append(Paragraph(
        "<b>Elite Forums</b> is an active IT consulting, software engineering, and technical training organization based in Vasai (East), Palghar district, Maharashtra. The company follows a modern, lean organizational hierarchy designed to foster rapid full-stack software development, close team communication, and direct technical mentorship for diploma interns.",
        body
    ))
    story.append(Paragraph(
        "The organization is led by Founder and CEO, <b>Prof. Harsh Tambade</b>, who sets strategic technology direction, cloud infrastructure policies, and corporate training programs. Executive operations are managed by <b>Jeet Gharat</b> (General Manager) and <b>Siddhant Mandlik</b> (COO), who supervise client engagements, facilities, and academic partnerships. Daily project execution is managed by <b>Suchita Nigam</b> (Project Manager), who coordinates work between the <b>Developers Team</b> (handling commercial client projects and SaaS tooling) and the <b>Instructors Team</b> (mentoring interns in Python, React, Cloud Databases, and AI).",
        body
    ))
    story.append(Paragraph(
        "This clear division of roles gave me direct exposure to professional software engineering practices, agile daily standups, code review workflows, and sprint milestone management throughout my training.",
        body
    ))
    story.append(create_callout_box(
        "Key Takeaway: Agile Industry Operations",
        "Working directly under the project manager and core developers team enabled hands-on experience with production Git branching models, ticket triage systems, and real-time client requirement elicitation."
    ))

    # ==========================================
    # PAGE 6: CHAPTER 2 - INTRO TO INDUSTRY (PART 1)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 2", chapter_h1))
    story.append(Paragraph("INTRODUCTION TO INDUSTRY (HISTORY, SERVICES &amp; TRAINING MODEL)", chapter_h2))
    
    elite_badge_data = [
        [Paragraph("<font size=13 color='white'><b>ELITE FORUMS — IT SERVICES &amp; CONSULTING</b></font><br/><font size=7.5 color='#d1d5db'><b>VASAI (EAST), PALGHAR, MAHARASHTRA – 401208 &bull; ESTABLISHED 2023</b></font>", center_bold_12)]
    ]
    elite_tbl = Table(elite_badge_data, colWidths=[400 * pt])
    elite_tbl.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#000000")),
        ('TOPPADDING', (0,0), (-1,-1), 4 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4 * pt),
    ]))
    story.append(elite_tbl)
    story.append(Spacer(1, 6 * pt))

    story.append(Paragraph("Company Background &amp; Founding Vision", subhead))
    story.append(Paragraph(
        "Elite Forums was established in <b>2023</b> in Mumbai/Vasai, Maharashtra, to bridge the technical gap between traditional academic engineering curricula and the rapidly evolving software industry. Operating with a dedicated team of <b>11 to 50 professionals</b>, Elite Forums provides high-quality software development services, cloud migration advisory, and intensive hands-on technical training for diploma and engineering students.",
        body
    ))
    story.append(Paragraph("Core Business Verticals &amp; Offerings", subhead))
    story.append(Paragraph("• <b>Technical Upskilling &amp; Diploma Training:</b> Practical, project-driven training programs in Full-Stack Web Development, Python Programming, Generative AI Integration, Cloud Databases, and Cybersecurity Fundamentals.", bullet))
    story.append(Paragraph("• <b>Custom Software &amp; Web Development:</b> Developing responsive web applications, database-backed enterprise portals, and automated REST API pipelines for commercial clients.", bullet))
    story.append(Paragraph("• <b>IT Advisory &amp; Cloud Migration:</b> Assisting local enterprises in modernizing legacy database workflows into scalable cloud solutions using Supabase, PostgreSQL, and serverless architectures.", bullet))
    story.append(Paragraph("The Industrial Training Model for Diploma Students", subhead))
    story.append(Paragraph(
        "As a diploma student in Computer Engineering under the MSBTE curriculum, the training at Elite Forums provided a practical, industry-aligned learning curve. Rather than passive theory lectures, students are required to write production-grade code, participate in daily standups, use Git for collaborative version control, and present technical slide decks in weekly sprint reviews. This practical exposure built strong technical confidence in full-stack web technologies.",
        body
    ))
    story.append(create_callout_box(
        "Corporate Focus &amp; Growth",
        "Elite Forums specializes in bridging academia with high-growth tech sectors, focusing heavily on rapid prototyping with Vite, microservice backends in Node.js, and real-time AI orchestration with low-latency LPUs."
    ))

    # ==========================================
    # PAGE 7: CHAPTER 2 - DUAL SCOPE
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 2 (CONTINUED)", chapter_h1))
    story.append(Paragraph("DUAL SCOPE: ON-SITE COMPANY WORK VS INDEPENDENT PROFORGE PROJECT", chapter_h2))
    
    story.append(Paragraph("Clarification of Daily Work &amp; Project Independence", subhead))
    story.append(Paragraph(
        "To provide full clarity for MSBTE academic evaluation, my 12-week internship work was divided into two distinct operational components: <b>On-Site Company Assigned Tasks</b> and <b>Independent Capstone Project Engineering (ProForge)</b>.",
        body
    ))

    scope_table_data = [
        [Paragraph("<b>Category / Dimension</b>", table_heading_style), Paragraph("<b>1. On-Site Company Work &amp; Training</b>", table_heading_style), Paragraph("<b>2. Independent Project (ProForge AI)</b>", table_heading_style)],
        [Paragraph("<b>Primary Nature</b>", table_cell_style), Paragraph("Structured company training, internal tasks, and learning sprints.", table_cell_style), Paragraph("Fully independent design, architecture, coding, and testing.", table_cell_style)],
        [Paragraph("<b>Daily Activities</b>", table_cell_style), Paragraph("Attending technical modules, completing weekly coding assignments, reviewing client UI fixes, and debugging sample databases.", table_cell_style), Paragraph("Building the 6 ProForge sub-suites (Remo, Folio, Talo, Covo, Liko, Mali) from scratch using React, Express, and Groq SDK.", table_cell_style)],
        [Paragraph("<b>Supervision</b>", table_cell_style), Paragraph("Instructors Team &amp; Project Manager (Suchita Nigam) at Elite Forums.", table_cell_style), Paragraph("Mentored by Prof. Harsh Tambade (Industry) and Ms. Mansi Patil (College Guide).", table_cell_style)],
        [Paragraph("<b>Intellectual Ownership</b>", table_cell_style), Paragraph("Internal exercises and client tickets owned by Elite Forums.", table_cell_style), Paragraph("Independent student project built by Dhruv R. Dubey for MSBTE diploma fulfillment.", table_cell_style)],
        [Paragraph("<b>Key Outcomes</b>", table_cell_style), Paragraph("Mastered Git, JavaScript ES6, React components, Node.js REST APIs, and Supabase.", table_cell_style), Paragraph("Delivered an end-to-end, multi-tenant career intelligence suite with 100% strict A4 vector PDF engine.", table_cell_style)]
    ]
    scope_tbl = Table(scope_table_data, colWidths=[95 * pt, 215 * pt, 215 * pt])
    scope_tbl.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1 * pt, colors.HexColor("#000000")),
        ('INNERGRID', (0,0), (-1,-1), 0.5 * pt, colors.HexColor("#cbd5e1")),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4 * pt),
        ('LEFTPADDING', (0,0), (-1,-1), 5 * pt),
        ('RIGHTPADDING', (0,0), (-1,-1), 5 * pt),
    ]))
    story.append(scope_tbl)
    story.append(Spacer(1, 6 * pt))
    story.append(Paragraph(
        "This dual-track approach ensured that I received solid foundational training from the company while also challenging myself to independently build a production-grade software platform that solves genuine student recruitment problems.",
        body
    ))
    story.append(create_callout_box(
        "Academic &amp; Industrial Alignment",
        "The separation of company-mandated learning modules and the ProForge independent project ensures compliance with MSBTE guidelines while demonstrating individual capability in full-stack engineering."
    ))

    # ==========================================
    # PAGE 8: CHAPTER 3 - HARDWARE & TOOLS
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 3", chapter_h1))
    story.append(Paragraph("HARDWARE, DEVELOPMENT ENVIRONMENT &amp; CORE TOOLCHAINS", chapter_h2))
    
    story.append(Paragraph(
        "Developing a modern web application requires a well-structured set of development tools, runtime environments, and cloud infrastructure. During the internship, I worked with the following primary hardware and software stack:",
        body
    ))
    story.append(Paragraph("Hardware Workstation Configuration", subhead))
    story.append(Paragraph("• <b>Processor:</b> Intel Core i5 / i7 Multi-Core Processor (x64 Architecture) for fast local compilation.", bullet))
    story.append(Paragraph("• <b>System Memory (RAM):</b> 16 GB DDR4 RAM (essential for running Vite dev servers, Node.js runtimes, and local browsers simultaneously).", bullet))
    story.append(Paragraph("• <b>Storage:</b> 512 GB NVMe Solid State Drive for high-speed file compilation and fast build times.", bullet))
    story.append(Paragraph("• <b>Operating System:</b> Microsoft Windows 11 64-bit with PowerShell and Git Bash terminals.", bullet))
    
    story.append(Paragraph("Software Development Stack &amp; Libraries", subhead))
    story.append(Paragraph("• <b>Code Editor &amp; IDE:</b> Visual Studio Code with ESLint, Prettier, and Tailwind CSS IntelliSense extensions.", bullet))
    story.append(Paragraph("• <b>Frontend Core:</b> React 18 (Component Architecture), Vite (Lightning-fast HMR build tool), Tailwind CSS v3 (Utility Styling), Lucide React (Vector Icons).", bullet))
    story.append(Paragraph("• <b>Backend Framework:</b> Node.js (V8 JavaScript Runtime), Express.js (RESTful API pipeline), CORS, Dotenv.", bullet))
    story.append(Paragraph("• <b>Database &amp; Storage:</b> Supabase (Cloud-hosted PostgreSQL engine with JSONB column support and Row Level Security).", bullet))
    story.append(Paragraph("• <b>AI Inference Engine:</b> Groq SDK (High-speed LPU inference using Qwen 2.5 and Llama 3 models for sub-second text analysis).", bullet))
    story.append(Paragraph("• <b>Document Compiler:</b> PDFKit (Server-side coordinate-based vector PDF generator configured for strict A4 physical boundaries).", bullet))
    story.append(Paragraph("• <b>Client-Side Archiving:</b> JSZip (Client-side ZIP package generator for exporting self-contained HTML/CSS portfolio packages).", bullet))
    story.append(Paragraph("• <b>Email Dispatch:</b> Nodemailer with Zoho SMTP transporter for sending 6-digit OTP verification codes and scheduled outreach campaigns.", bullet))
    story.append(create_callout_box(
        "Development Efficiency",
        "Using Vite's native ES modules hot module replacement (HMR) resulted in sub-50ms frontend reload speeds, drastically accelerating UI iteration across all 6 sub-suites."
    ))

    # ==========================================
    # PAGE 9: CHAPTER 3 - SPECIFICATION TABLE
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 3 (CONTINUED)", chapter_h1))
    story.append(Paragraph("DETAILED TECHNICAL SPECIFICATIONS &amp; MAINTENANCE SCHEDULE", chapter_h2))
    
    tools_grid = [
        [Paragraph("<b>Tool / Technology</b>", table_heading_style),
         Paragraph("<b>Specification / Version</b>", table_heading_style),
         Paragraph("<b>Approx. Cost</b>", table_heading_style),
         Paragraph("<b>Specific Purpose in Project</b>", table_heading_style),
         Paragraph("<b>Routine Maintenance</b>", table_heading_style)],

        [Paragraph("<b>Dev PC</b>", table_cell_style),
         Paragraph("Intel i5/i7, 16GB RAM, 512GB SSD", table_cell_style),
         Paragraph("₹55,000", table_center_style),
         Paragraph("Local coding, server execution, multi-tab browser testing", table_cell_style),
         Paragraph("OS updates, disk cleanup, cooling vent cleaning", table_cell_style)],

        [Paragraph("<b>React 18 &amp; Vite</b>", table_cell_style),
         Paragraph("v18.2 / Vite v5.0 (SPA Architecture)", table_cell_style),
         Paragraph("Open Source", table_center_style),
         Paragraph("Dynamic UI dashboards, theme switches, state management", table_cell_style),
         Paragraph("npm dependency updates, bundle tree-shaking", table_cell_style)],

        [Paragraph("<b>Node.js &amp; Express</b>", table_cell_style),
         Paragraph("Node v20 LTS / Express v4.19", table_cell_style),
         Paragraph("Open Source", table_center_style),
         Paragraph("REST API routing, token validation, PDFKit streaming", table_cell_style),
         Paragraph("Handling unhandled rejections, monitoring event loops", table_cell_style)],

        [Paragraph("<b>Groq SDK (AI)</b>", table_cell_style),
         Paragraph("Groq Cloud SDK / LPU Architecture", table_cell_style),
         Paragraph("Free / Tiered", table_center_style),
         Paragraph("Sub-second AI resume parsing, ATS scoring, bullet rewrites", table_cell_style),
         Paragraph("Configuring rate-limit retries and fallback models", table_cell_style)],

        [Paragraph("<b>Supabase (DB)</b>", table_cell_style),
         Paragraph("PostgreSQL 15 with JSONB support", table_cell_style),
         Paragraph("Free Tier", table_center_style),
         Paragraph("User profile persistence, OTP tracking, login history", table_cell_style),
         Paragraph("Automated daily snapshots, schema migrations", table_cell_style)],

        [Paragraph("<b>PDFKit Engine</b>", table_cell_style),
         Paragraph("PDFKit v0.15 (Server Vector PDF)", table_cell_style),
         Paragraph("Open Source", table_center_style),
         Paragraph("Generating strict A4 print resumes &amp; cover letters", table_cell_style),
         Paragraph("Dynamic coordinate math checks, margin auditing", table_cell_style)],

        [Paragraph("<b>Zoho SMTP</b>", table_cell_style),
         Paragraph("TLS Port 587 / SSL Port 465", table_cell_style),
         Paragraph("Free / Business", table_center_style),
         Paragraph("Dispatching 6-digit OTP codes and outreach emails", table_cell_style),
         Paragraph("Monitoring bounce rates, verifying SPF/DKIM records", table_cell_style)]
    ]

    tools_tbl_obj = Table(tools_grid, colWidths=[80 * pt, 100 * pt, 65 * pt, 140 * pt, 140 * pt])
    tools_tbl_obj.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1.2 * pt, colors.HexColor("#000000")),
        ('INNERGRID', (0,0), (-1,-1), 0.6 * pt, colors.HexColor("#000000")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('TOPPADDING', (0,0), (-1,-1), 4 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4 * pt),
        ('LEFTPADDING', (0,0), (-1,-1), 4 * pt),
        ('RIGHTPADDING', (0,0), (-1,-1), 4 * pt),
    ]))
    story.append(tools_tbl_obj)
    story.append(Spacer(1, 6 * pt))
    story.append(Paragraph(
        "By carefully selecting and maintaining these tools, the platform achieved high operational stability, zero licensing costs for development, and rapid build times throughout the 12-week development lifecycle.",
        body
    ))
    story.append(create_callout_box(
        "Zero-Cost Open Source Toolchain",
        "Every single software dependency was selected from enterprise-grade open-source licenses (MIT/Apache 2.0), ensuring 100% free reproducibility for academic evaluation and production hosting."
    ))

    # ==========================================
    # PAGE 10: CHAPTER 3 - ASYNC & FALLBACK
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 3 (CONTINUED)", chapter_h1))
    story.append(Paragraph("GROQ LPU ENGINE, AI FALLBACK CASCADE &amp; ASYNC JAVASCRIPT", chapter_h2))
    
    story.append(Paragraph("Asynchronous JavaScript &amp; Non-Blocking Event Loop", subhead))
    story.append(Paragraph(
        "In modern web applications, operations like querying a remote database, calling external AI APIs, or rendering multi-page PDF documents introduce network and compute latency. Because Node.js operates on a <b>single-threaded event loop</b>, running these tasks synchronously would freeze the entire server, blocking requests from all other users.",
        body
    ))
    story.append(Paragraph(
        "To prevent server blocking, ProForge utilizes <b>asynchronous JavaScript</b> (<code>async/await</code> and native ES6 Promises) across all backend controllers. When a user requests resume analysis, the server offloads the AI call to the event loop worker pool, freeing the main thread to handle other incoming requests without delay.",
        body
    ))
    story.append(Paragraph("Multi-Model Fallback Cascade for 99.9% AI Availability", subhead))
    story.append(Paragraph(
        "Third-party AI APIs can occasionally suffer from rate-limiting (HTTP 429 errors), network timeouts, or service downtime. To ensure uninterrupted user experience, I designed a multi-model fallback cascade inside <code>backend/groqClient.js</code>. If the primary model is busy, the request cascades automatically to backup models before falling back to a deterministic rule-based extractor:",
        body
    ))

    ai_flow_data = [
        [Paragraph("<b>Step 1: Primary Model</b>", table_heading_style), Paragraph("<b>Step 2: Secondary Fallback</b>", table_heading_style), Paragraph("<b>Step 3: Tertiary Fallback</b>", table_heading_style), Paragraph("<b>Step 4: Deterministic Guard</b>", table_heading_style)],
        [Paragraph("<code>qwen/qwen3.8-27b</code><br/>Ultra-fast 27B model for quick JSON structuring.", table_cell_style),
         Paragraph("<code>openai/gpt-oss-120b</code><br/>High-capacity model if Qwen is rate-limited.", table_cell_style),
         Paragraph("<code>openai/gpt-oss-20b</code><br/>Lightweight model if high-capacity is busy.", table_cell_style),
         Paragraph("Rule-Based Extractor<br/>Offline regex parser so UI never shows blank error.", table_cell_style)]
    ]
    ai_flow_tbl = Table(ai_flow_data, colWidths=[131 * pt, 131 * pt, 131 * pt, 131 * pt])
    ai_flow_tbl.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1 * pt, colors.HexColor("#000000")),
        ('INNERGRID', (0,0), (-1,-1), 0.5 * pt, colors.HexColor("#cbd5e1")),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e2e8f0")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4 * pt),
        ('LEFTPADDING', (0,0), (-1,-1), 4 * pt),
        ('RIGHTPADDING', (0,0), (-1,-1), 4 * pt),
    ]))
    story.append(ai_flow_tbl)
    story.append(Spacer(1, 6 * pt))
    story.append(Paragraph(
        "This resilient architecture guarantees that students and job seekers can always generate, refine, and download their career materials even during upstream cloud API disruptions.",
        body
    ))
    story.append(create_callout_box(
        "High-Throughput LPU Advantage",
        "Groq's Language Processing Units (LPUs) achieve generation speeds exceeding 450 tokens per second, enabling live resume score updates while users type into the frontend form."
    ))

    # ==========================================
    # PAGE 11: CHAPTER 4 - METHODOLOGIES & AGILE
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 4", chapter_h1))
    story.append(Paragraph("PROCESSES, AGILE METHODOLOGIES &amp; DIGITAL ASSET HANDLING", chapter_h2))
    
    story.append(Paragraph("Software Engineering Processes in IT Industry", subhead))
    story.append(Paragraph(
        "In the software engineering and IT domain, the term 'manufacturing process' refers to the <b>Software Development Life Cycle (SDLC)</b>—the structured procedure through which software requirements are gathered, designed, coded, tested, and deployed. At Elite Forums, we adhered to the <b>Agile-Scrum framework</b>, dividing the 12-week internship into six iterative two-week sprint cycles.",
        body
    ))
    story.append(Paragraph("Agile Scrum Lifecycle Steps Followed", subhead))
    story.append(Paragraph("• <b>Sprint Planning:</b> At the beginning of each two-week cycle, sprint backlogs were created with specific feature goals (e.g., Sprint 3: Building the Remo AI Resume Editor and connecting Supabase).", bullet))
    story.append(Paragraph("• <b>Daily Standups:</b> 15-minute daily synchronization meetings to discuss completed tasks, planned work for the day, and any technical blockers encountered.", bullet))
    story.append(Paragraph("• <b>Feature Branching &amp; Code Reviews:</b> Writing modular code on dedicated Git branches and submitting Pull Requests (PRs) on GitHub for review by senior developers before merging.", bullet))
    story.append(Paragraph("• <b>Sprint Demonstrations &amp; Retrospectives:</b> Demonstrating functioning prototypes at the end of each sprint to gather constructive feedback and refine user interface interactions.", bullet))
    
    story.append(Paragraph("Digital Material &amp; Asset Handling Procedures", subhead))
    story.append(Paragraph(
        "Unlike manufacturing plants handling raw materials, software engineering requires careful governance of <b>digital assets</b>:",
        body
    ))
    story.append(Paragraph("• <b>Source Code Management:</b> Managed through GitHub repositories with branch protection rules to prevent accidental overwrites on the main branch.", bullet))
    story.append(Paragraph("• <b>API Payload Contracts:</b> Standardized JSON request and response schemas shared across frontend React components and backend Express routes.", bullet))
    story.append(Paragraph("• <b>Static Assets &amp; Fonts:</b> Vector SVG icons (Lucide React) and Google Web Fonts packaged locally to ensure lightning-fast rendering without external CDN delays.", bullet))
    story.append(create_callout_box(
        "Git Commit Standards",
        "All commits followed semantic conventions (`feat:`, `fix:`, `docs:`, `perf:`), allowing automated generation of sprint changelogs for mentor evaluation."
    ))

    # ==========================================
    # PAGE 12: CHAPTER 4 - COMPONENT ARCHITECTURE
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 4 (CONTINUED)", chapter_h1))
    story.append(Paragraph("MODULAR COMPONENT HIERARCHY &amp; CSS DESIGN TOKENS", chapter_h2))
    
    story.append(Paragraph("Component-Based Architecture in React 18", subhead))
    story.append(Paragraph(
        "A key software engineering principle emphasized during my internship was <b>component modularity</b>. Instead of writing massive, monolithic web pages, the frontend UI was broken down into small, reusable, single-responsibility components:",
        body
    ))
    story.append(Paragraph("• <code>Navbar.jsx</code>: Global navigation header featuring navigation tabs, quick-action buttons, and the active session indicator.", bullet))
    story.append(Paragraph("• <code>ThemeToggle.jsx</code>: Floating control panel enabling users to switch between 10 color themes and dynamic typography fonts with a single click.", bullet))
    story.append(Paragraph("• <code>TextBox.jsx</code>: Clean input textarea with auto-resizing, character counting, and pre-filled prompt presets for quick user onboarding.", bullet))
    story.append(Paragraph("• <code>OTPInput.jsx</code>: 6-digit verification component with automatic focus progression, backspace navigation, and clipboard paste detection.", bullet))
    story.append(Paragraph("• <code>AmbientBackground.jsx</code>: GPU-accelerated background layer providing subtle visual ambiance tailored to each active theme.", bullet))
    story.append(Paragraph("• <code>PasswordStrength.jsx</code>: Dynamic security meter evaluating password entropy in real-time.", bullet))
    
    story.append(Paragraph("Design Tokens &amp; Multi-Theme Synchronization", subhead))
    story.append(Paragraph(
        "ProForge supports 10 distinct aesthetic themes (including Cyberpunk Neon, Clean Teal, Midnight Cosmic, Emerald Executive, and Classic Monochrome). Rather than hardcoding colors into individual components, styling is managed through <b>CSS Custom Properties (Design Tokens)</b> defined in <code>index.css</code>. When a user selects a new theme, the root DOM element updates its data attribute, instantly propagating color transitions across all 6 sub-suites with smooth 200ms ease transitions.",
        body
    ))
    story.append(create_callout_box(
        "Component Reusability",
        "Every UI element encapsulates its internal state while exposing standard callback props (`onChange`, `onValidate`), keeping code maintainable and unit-testable."
    ))

    # ==========================================
    # PAGE 13: CHAPTER 4 - DATA FLOW & SUPABASE
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 4 (CONTINUED)", chapter_h1))
    story.append(Paragraph("UNIDIRECTIONAL DATA FLOW &amp; SUPABASE JSONB SCHEMA DESIGN", chapter_h2))
    
    story.append(Paragraph("Unidirectional Data Flow Architecture", subhead))
    story.append(Paragraph(
        "ProForge follows a predictable, unidirectional data flow architecture that guarantees data consistency across the entire application:",
        body
    ))
    story.append(Paragraph("1. <b>Candidate Input:</b> The user enters raw career notes or selects sample data in the frontend React view.", bullet))
    story.append(Paragraph("2. <b>API Dispatch:</b> The frontend sends a structured POST request to the backend Express route (<code>/api/analyze</code>).", bullet))
    story.append(Paragraph("3. <b>AI Inference:</b> The backend passes the text to Groq SDK, returning a validated JSON profile containing structured arrays for experience, education, skills, and projects.", bullet))
    story.append(Paragraph("4. <b>Cloud Persistence:</b> The profile payload is saved to Supabase PostgreSQL in a flexible JSONB column.", bullet))
    story.append(Paragraph("5. <b>Vector Compilation:</b> When exporting, the backend PDFKit engine reads the JSON profile, applies exact A4 coordinate math, and streams the binary PDF to the user's browser.", bullet))
    
    story.append(Paragraph("Supabase Database Schema Design", subhead))
    story.append(Paragraph(
        "Traditional relational tables with rigid columns make it difficult to accommodate diverse resume structures (some candidates have 5 projects and 2 degrees; others have 10 certifications and no formal degree). By utilizing PostgreSQL's native <b>JSONB (Binary JSON)</b> columns in Supabase, ProForge stores nested, variable-length career structures while retaining fast indexed lookups and transactional safety.",
        body
    ))
    story.append(create_callout_box(
        "Schema Evolution",
        "JSONB allows continuous feature additions (e.g. adding video portfolio links or Github activity widgets) without requiring destructive database schema migrations."
    ))

    # ==========================================
    # PAGE 14: CHAPTER 5 - QA & TESTING
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 5", chapter_h1))
    story.append(Paragraph("QUALITY ASSURANCE, AUTOMATED UNIT TESTING &amp; ASSESSMENTS", chapter_h2))
    
    story.append(Paragraph("Quality Assurance (QA) Philosophy at Elite Forums", subhead))
    story.append(Paragraph(
        "In commercial software development, code is only as good as its test coverage and reliability. Elite Forums maintained a strict quality assurance culture where interns were trained to write defensive code, handle edge cases, and participate in weekly technical evaluations.",
        body
    ))
    story.append(Paragraph("Evaluation Formats Conducted During Training", subhead))
    story.append(Paragraph("1. <b>Weekly Technical Quizzes (MCQs):</b> Timed evaluations covering JavaScript ES6 concepts (closures, Promises, event loops), React lifecycles, and database normalization.", body))
    story.append(Paragraph("2. <b>Live Coding Challenges:</b> Timed problem-solving sprints where interns implemented stateful algorithms, debounced search bars, and recursive JSON tree traversers under mentor supervision.", body))
    story.append(Paragraph("3. <b>REST API Testing with Postman:</b> Creating automated Postman collections to test all backend endpoints against positive and negative test cases (e.g., missing auth tokens, malformed JSON bodies, SQL injection attempts).", body))
    story.append(Paragraph("4. <b>Technical Slide Presentations (PPTs):</b> Weekly slide deck presentations where interns explained system architectures, API workflows, and database schemas to mentors and peers, building professional communication skills.", body))
    story.append(Paragraph(
        "This rigorous testing and assessment framework ensured that ProForge was built with high reliability, zero critical crashes, and clean, readable code.",
        body
    ))
    story.append(create_callout_box(
        "Automated Test Coverage",
        "End-to-end integration tests in Postman validated that all 14 Express API endpoints returned correct HTTP status codes under normal and high-concurrency loads."
    ))

    # ==========================================
    # PAGE 15: CHAPTER 5 - PDF & ATS & CROSS BROWSER
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 5 (CONTINUED)", chapter_h1))
    story.append(Paragraph("PDFKIT A4 COORDINATE MATH, ATS VALIDATION &amp; BROWSER TESTS", chapter_h2))
    
    story.append(Paragraph("Defensive PDFKit Coordinate Calculation Strategy", subhead))
    story.append(Paragraph(
        "A major technical challenge was ensuring resumes fit cleanly onto standard <b>A4 paper dimensions (595.28 x 841.89 points / 210 x 297 mm)</b> without awkward page breaks:",
        body
    ))
    story.append(Paragraph("• <b>Height Measurement:</b> Using <code>doc.heightOfString()</code> to pre-calculate the vertical pixel height of every text block and bullet point before drawing.", bullet))
    story.append(Paragraph("• <b>Dynamic Page Break Triggers:</b> If rendering a new experience entry would exceed the safe bottom margin (780 pt), the engine automatically issues a <code>doc.addPage()</code> command and redraws the section header.", bullet))
    story.append(Paragraph("• <b>Synchronized Two-Column Layout:</b> Enforcing independent Y-coordinate tracking for the left main content column (340 pt width) and the right sidebar (180 pt width), preventing column collapse.", bullet))
    
    story.append(Paragraph("ATS Scoring Engine Validation (Talo AI)", subhead))
    story.append(Paragraph(
        "We validated Talo AI's ATS scoring algorithm by testing 50+ diverse resume profiles against real job descriptions across Software Engineering, Data Analysis, and Web Development roles. The test suite verified that keyword extraction accurately identified matching vs missing competencies and produced actionable improvement suggestions.",
        body
    ))
    story.append(Paragraph("Cross-Browser Compatibility &amp; DirectWrite Smoothing", subhead))
    story.append(Paragraph(
        "The application was tested across Google Chrome, Microsoft Edge, Mozilla Firefox, and Apple Safari. CSS rules <code>-webkit-font-smoothing: antialiased</code> and <code>text-rendering: optimizeLegibility</code> were configured to ensure sharp, crisp typography across all Windows and macOS displays.",
        body
    ))
    story.append(create_callout_box(
        "Pixel-Perfect Coordinate Geometry",
        "PDFKit uses exact postscript points (1 pt = 1/72 inch), eliminating fuzzy rasterization and ensuring crisp vector text regardless of print zoom levels."
    ))

    # ==========================================
    # PAGE 16: CHAPTER 6 - SAFETY & CYBERSECURITY
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 6", chapter_h1))
    story.append(Paragraph("DIGITAL SAFETY PROTOCOLS, CYBERSECURITY &amp; DISASTER RECOVERY", chapter_h2))
    
    story.append(Paragraph("Cybersecurity Protocols in Modern Web Engineering", subhead))
    story.append(Paragraph(
        "While traditional industrial training often emphasizes mechanical factory safety, software engineering requires rigorous adherence to <b>digital safety, user privacy, and cybersecurity protocols</b>. At Elite Forums, interns were trained to treat application security as a core architectural requirement rather than an afterthought.",
        body
    ))
    story.append(Paragraph("Key Security Safeguards Implemented in ProForge", subhead))
    story.append(Paragraph("1. <b>API Key Isolation &amp; Environment Variables:</b> Sensitive credentials—including Supabase database service keys, Groq API tokens, and Zoho SMTP passwords—were strictly isolated within <code>.env</code> files and excluded from GitHub using <code>.gitignore</code> rules.", body))
    story.append(Paragraph("2. <b>Input Sanitization &amp; Injection Prevention:</b> All user inputs across resume textboxes and email forms are sanitized to neutralize Cross-Site Scripting (XSS) and SQL injection payloads.", body))
    story.append(Paragraph("3. <b>JWT Authorization Guards:</b> Sensitive backend routes are protected with <code>requireAuth</code> middleware, which validates cryptographic signatures before granting access to user data.", body))
    story.append(Paragraph("4. <b>Multi-Device Login Detection (loginHistory.js):</b> An automated security auditor logs the IP address and User-Agent signature of every login, notifying users if an unrecognized device accesses their account.", body))
    story.append(Paragraph("5. <b>Disaster Recovery &amp; Redundancy:</b> Database tables are protected by automated Supabase cloud snapshots, while code is versioned with daily GitHub commits.", body))
    story.append(create_callout_box(
        "Principle of Least Privilege",
        "Database connections use fine-grained Row Level Security (RLS) policies so authenticated users can only query and mutate their own resume records."
    ))

    # ==========================================
    # PAGE 17: CHAPTER 6 - ETHICAL AI GOVERNANCE
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 6 (CONTINUED)", chapter_h1))
    story.append(Paragraph("ETHICAL AI PRINCIPLES, FACTUAL INTEGRITY &amp; ANTI-SPAM STANDARDS", chapter_h2))
    
    story.append(Paragraph("Ethical Governance in AI-Powered Career Platforms", subhead))
    story.append(Paragraph(
        "The application of Artificial Intelligence to recruitment and hiring introduces significant ethical responsibilities. During the internship, we held dedicated discussions on AI ethics, ensuring that ProForge was designed with fairness, transparency, and integrity at its core:",
        body
    ))
    story.append(Paragraph("1. <b>Factual Integrity &amp; Anti-Hallucination:</b> AI prompts inside Remo AI and Covo AI are constrained to refine, polish, and quantify the candidate's genuine experiences. The AI is explicitly instructed never to fabricate false work histories, degrees, or certifications.", body))
    story.append(Paragraph("2. <b>User Privacy &amp; Data Ownership:</b> Candidate resume profiles are strictly private to the user. No personal profile data is sold, monetized, or used to train third-party public AI models without explicit consent.", body))
    story.append(Paragraph("3. <b>Ethical Outreach &amp; Anti-Spam (Mali AI):</b> Recruiter outreach emails generated by Covo AI and scheduled by Mali AI adhere to anti-spam best practices, including clear sender identities, professional subject lines, and transparent intent.", body))
    story.append(Paragraph("4. <b>Transparent ATS Matching (Talo AI):</b> Rather than using deceptive 'white font keyword stuffing' techniques, Talo AI provides honest, constructive guidance on genuine skill gaps.", body))
    story.append(Paragraph("5. <b>Physical Workspace Safety:</b> Interns followed ergonomic posture guidelines and 20-minute eye rest breaks during on-site coding sessions in the Vasai center.", body))
    story.append(create_callout_box(
        "AI Governance Summary",
        "ProForge operates as an empowering career assistant that polishes genuine human achievements rather than replacing authenticity with fabricated content."
    ))

    # ==========================================
    # PAGE 18: CHAPTER 7 - PRACTICAL EXPERIENCES (PART 1 - WITH PLACEHOLDER BOX)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 7", chapter_h1))
    story.append(Paragraph("PRACTICAL EXPERIENCES IN PRODUCTION — SYSTEM ARCHITECTURE", chapter_h2))
    
    story.append(Paragraph("Full-Cycle Software Engineering &amp; Platform Architecture", subhead))
    story.append(Paragraph(
        "During my 12-week internship, I gained hands-on practical experience across the complete software production lifecycle. The architectural diagram below illustrates the decoupled client-server data flow, showing how user actions in React 18 trigger backend Express routes, Groq LPU AI inference, and Supabase cloud storage:",
        body
    ))

    story.append(create_placeholder_box(
        "Figure 7.1: ProForge AI High-Throughput Cloud & System Architecture Diagram",
        "Drop authentic architecture diagram here (React 18 -> Express Backend -> Groq LPU -> Supabase PostgreSQL)",
        height_pt=190
    ))
    story.append(Spacer(1, 4 * pt))
    story.append(Paragraph("<b>Figure 7.1:</b> ProForge AI High-Throughput Cloud &amp; Generative AI Architecture Diagram", fig_cap))
    story.append(Spacer(1, 5 * pt))

    story.append(Paragraph(
        "<b>Architectural Workflow:</b> (1) The client browser issues asynchronous REST requests via Axios/Fetch, (2) The Express backend validates JWT tokens and sanitizes parameters, (3) Groq LPU executes inference on Qwen 2.5 and Llama 3 models returning structured JSON in under 800ms, and (4) Supabase PostgreSQL persists dynamic profiles securely.",
        body
    ))

    # ==========================================
    # PAGE 19: CHAPTER 7 - PRACTICAL EXPERIENCES (PART 2 - WITH PLACEHOLDER BOX)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 7 (CONTINUED)", chapter_h1))
    story.append(Paragraph("SYSTEM ASSEMBLY, MIDDLEWARE ROUTING &amp; SUB-SUITES ECOSYSTEM", chapter_h2))
    
    story.append(Paragraph("The Six Core Sub-Suites of ProForge", subhead))
    story.append(Paragraph(
        "The reserved infographic below summarizes the six specialized sub-suites engineered during the training, highlighting their specific functionalities, AI models, and document export capabilities:",
        body
    ))

    story.append(create_placeholder_box(
        "Figure 7.2: Overview of ProForge AI 6 Sub-Suites Ecosystem & Feature Matrix",
        "Drop authentic 6 sub-suites feature matrix diagram here (Remo, Folio, Talo, Covo, Liko, Mali)",
        height_pt=190
    ))
    story.append(Spacer(1, 4 * pt))
    story.append(Paragraph("<b>Figure 7.2:</b> Overview of ProForge AI 6 Sub-Suites Ecosystem and Feature Matrix", fig_cap))
    story.append(Spacer(1, 5 * pt))

    story.append(Paragraph(
        "<b>Ecosystem Highlights:</b> Remo AI delivers 105+ resume layout variations; Folio AI generates standalone ZIP portfolio packages with zero external runtime dependencies; Talo AI computes match scores with keyword gap analysis; Covo AI drafts personalized PDF cover letters; Liko AI creates optimized LinkedIn posts; and Mali AI schedules automated email campaigns.",
        body
    ))

    # ==========================================
    # PAGE 20: CHAPTER 8 - 12-WEEK ROADMAP (WEEKS 1-4)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 8", chapter_h1))
    story.append(Paragraph("12-WEEK TASK BREAKDOWN — WEEKS 1 TO 4: FOUNDATIONS &amp; CORE", chapter_h2))
    
    story.append(Paragraph("Week 1: Web Foundations, Modern JavaScript ES6 &amp; Git Version Control", subhead))
    story.append(Paragraph(
        "The internship began with an intensive review of modern web standards, HTML5 semantic elements, CSS box sizing, and advanced JavaScript ES6+ features (arrow functions, destructuring, Promises, <code>async/await</code>). We configured professional development environments in Visual Studio Code and mastered Git version control workflows (branching, merging, commit hygiene).",
        body
    ))
    story.append(Paragraph("Week 2: React 18 Component Architecture &amp; Vite Tooling", subhead))
    story.append(Paragraph(
        "Week two focused on building dynamic Single Page Applications (SPAs) with React 18 and Vite. We mastered component hierarchy, state management using <code>useState</code> and <code>useEffect</code>, custom React hooks, and responsive utility styling using Tailwind CSS v3.",
        body
    ))
    story.append(Paragraph("Week 3: Backend Architecture with Node.js &amp; Express REST APIs", subhead))
    story.append(Paragraph(
        "In week three, we engineered backend services using Node.js and Express. Key topics included request-response lifecycles, middleware pipelines, CORS configuration, JSON body parsing, and RESTful routing conventions.",
        body
    ))
    story.append(Paragraph("Week 4: Cloud Database Setup with Supabase &amp; OTP Authentication", subhead))
    story.append(Paragraph(
        "Week four covered cloud database modeling with Supabase PostgreSQL. We designed JSONB schema structures for storing candidate profile data and implemented passwordless email authentication using Zoho SMTP 6-digit OTP verification.",
        body
    ))
    story.append(create_callout_box(
        "Sprint 1–2 Milestone Achievements",
        "Completed development environment configurations, built full CRUD endpoints in Express, connected Supabase PostgreSQL, and successfully implemented 6-digit email OTP login."
    ))

    # ==========================================
    # PAGE 21: CHAPTER 8 - 12-WEEK ROADMAP (WEEKS 5-6 WITH PLACEHOLDER BOX)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 8 (CONTINUED)", chapter_h1))
    story.append(Paragraph("12-WEEK TASK BREAKDOWN — WEEKS 5 TO 6: REMO AI STUDIO", chapter_h2))
    
    story.append(Paragraph("Weeks 5–6: Remo AI Resume Studio &amp; PDFKit Vector Engine", subhead))
    story.append(Paragraph(
        "Weeks five and six marked the development of <b>Remo AI</b>. We engineered the interactive resume editor, linking form state to real-time live preview rendering and connected it to Groq SDK (Qwen 2.5 &amp; Llama 3 models) for instant bullet point refinement.",
        body
    ))

    story.append(create_placeholder_box(
        "Figure 8.1: Remo AI Resume Studio — Interactive Split Screen Editor & Vector Preview",
        "Drop actual screenshot of Remo AI resume editor showing form inputs and A4 PDF preview",
        height_pt=190
    ))
    story.append(Spacer(1, 4 * pt))
    story.append(Paragraph("<b>Figure 8.1:</b> Remo AI Resume Studio — Interactive Split Screen Editor &amp; Vector Preview", fig_cap))
    story.append(Spacer(1, 5 * pt))

    story.append(Paragraph(
        "On the backend, we built a coordinate-based rendering engine in <b>PDFKit</b> that maps content onto strict A4 page boundaries with dynamic height calculation, ensuring 100% vector sharpness without layout shift.",
        body
    ))

    # ==========================================
    # PAGE 22: CHAPTER 8 - 12-WEEK ROADMAP (WEEKS 7-8 WITH PLACEHOLDER BOX)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 8 (CONTINUED)", chapter_h1))
    story.append(Paragraph("12-WEEK TASK BREAKDOWN — WEEKS 7 TO 8: FOLIO AI &amp; TALO AI", chapter_h2))
    
    story.append(Paragraph("Week 7: Folio AI Web Portfolio Publisher &amp; JSZip Packaging", subhead))
    story.append(Paragraph(
        "Week seven focused on developing <b>Folio AI</b>. We designed four customizable portfolio themes (Bento Grid, Cyber Terminal, Modern Executive, Clean Glassmorphism) and integrated <b>JSZip</b> for zero-dependency client ZIP downloads.",
        body
    ))

    story.append(create_placeholder_box(
        "Figure 8.2: Folio AI Portfolio Generator — Multi-Theme Visual Showcase & Template Picker",
        "Drop actual screenshot of Folio AI template selection interface and generated portfolio cards",
        height_pt=190
    ))
    story.append(Spacer(1, 4 * pt))
    story.append(Paragraph("<b>Figure 8.2:</b> Folio AI Portfolio Generator — Multi-Theme Visual Showcase &amp; Template Picker", fig_cap))
    story.append(Spacer(1, 5 * pt))

    story.append(Paragraph(
        "<b>Week 8 (Talo AI):</b> In week eight, we built <b>Talo AI</b>, an ATS comparison engine evaluating candidate resumes against target job descriptions to compute percentage match scores and detect missing keywords.",
        body
    ))

    # ==========================================
    # PAGE 23: CHAPTER 8 - 12-WEEK ROADMAP (WEEKS 9-12 WITH PLACEHOLDER BOX)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 8 (CONTINUED)", chapter_h1))
    story.append(Paragraph("12-WEEK TASK BREAKDOWN — WEEKS 9 TO 12: MALI, COVO, LIKO &amp; DEMO", chapter_h2))
    
    story.append(Paragraph("Weeks 9–11: Covo AI, Liko AI &amp; Mali AI Campaign Studio", subhead))
    story.append(Paragraph(
        "During weeks 9 to 11, we engineered <b>Covo AI</b> (cover letters &amp; cold outreach), <b>Liko AI</b> (LinkedIn branding), and <b>Mali AI</b> (automated campaign scheduler with rich HTML email templates):",
        body
    ))

    story.append(create_placeholder_box(
        "Figure 8.3: Mali AI & Covo AI — Visual HTML Email Editor, Typography Picker & Queue Status",
        "Drop actual screenshot of Mali AI email campaign composer and scheduled background queue dashboard",
        height_pt=190
    ))
    story.append(Spacer(1, 4 * pt))
    story.append(Paragraph("<b>Figure 8.3:</b> Mali AI &amp; Covo AI — Visual HTML Email Editor, Typography Picker &amp; Queue Status", fig_cap))
    story.append(Spacer(1, 5 * pt))

    story.append(Paragraph(
        "<b>Week 12:</b> Finalized the 10-theme visual design system with smooth cubic-bezier transitions, performed end-to-end regression testing, and successfully defended the ProForge AI platform during the final evaluation at Elite Forums.",
        body
    ))

    # ==========================================
    # PAGE 24: CHAPTER 9 - CHALLENGES & SOLUTIONS (PART 1)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 9", chapter_h1))
    story.append(Paragraph("TECHNICAL CHALLENGES ENCOUNTERED &amp; ENGINEERING SOLUTIONS", chapter_h2))
    
    story.append(Paragraph("1. Dynamic Coordinate Math &amp; A4 Pagination in PDFKit", subhead))
    story.append(Paragraph(
        "<b>Challenge Encountered:</b> Unlike web browsers where CSS reflows content automatically, PDFKit operates on strict (X, Y) pixel coordinates on a fixed A4 canvas. When users entered lengthy experience descriptions, text initially spilled over the bottom page boundary or broke awkwardly across pages.",
        body
    ))
    story.append(Paragraph(
        "<b>Engineering Solution:</b> I built a pre-render height calculation utility using <code>doc.heightOfString()</code> to measure every block of text before rendering. If an entry would push past the safe boundary (780 pt), the engine triggers <code>doc.addPage()</code> and recalculates vertical offsets cleanly.",
        body
    ))
    story.append(Paragraph("2. Schema Enforcement from Non-Deterministic LLM Outputs", subhead))
    story.append(Paragraph(
        "<b>Challenge Encountered:</b> During early Groq SDK testing, AI models occasionally returned conversational explanations or markdown code blocks instead of clean JSON, causing backend JSON parsing errors.",
        body
    ))
    story.append(Paragraph(
        "<b>Engineering Solution:</b> I enforced <code>response_format: { type: 'json_object' }</code> in Groq API calls and added a backend sanitization utility that strips markdown wrappers, guaranteeing 100% valid JSON objects.",
        body
    ))
    story.append(create_callout_box(
        "Key Engineering Takeaway",
        "Deterministic JSON schema validation combined with algorithmic coordinate calculation guarantees that AI outputs render with 100% reliability into physical print layouts."
    ))

    # ==========================================
    # PAGE 25: CHAPTER 9 - CHALLENGES & SOLUTIONS (PART 2)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 9 (CONTINUED)", chapter_h1))
    story.append(Paragraph("BACKGROUND QUEUEING, SPRINT REFLECTIONS &amp; STUDENT LEARNINGS", chapter_h2))
    
    story.append(Paragraph("3. Asynchronous Background Scheduling for Email Campaigns", subhead))
    story.append(Paragraph(
        "<b>Challenge Encountered:</b> Building Mali AI's campaign scheduler required running automated background dispatches without blocking the Node.js event loop or requiring heavy third-party Redis queue servers.",
        body
    ))
    story.append(Paragraph(
        "<b>Engineering Solution:</b> I created a lightweight polling queue worker inside <code>backend/services/emailScheduler.js</code> that runs on periodic intervals, checking for pending campaigns and dispatching them via Zoho SMTP safely.",
        body
    ))
    story.append(Paragraph("Key Student Learnings &amp; Professional Reflections", subhead))
    story.append(Paragraph(
        "As a diploma student completing this training under the MSBTE curriculum, this internship provided immense technical and personal growth:",
        body
    ))
    story.append(Paragraph("• <b>Full-Stack Mastery:</b> Transitioned from writing basic academic code to architecting production-grade React, Node.js, and PostgreSQL applications.", bullet))
    story.append(Paragraph("• <b>Debugging &amp; Analytical Thinking:</b> Developed structured debugging skills using browser developer tools, Postman, and server logs.", bullet))
    story.append(Paragraph("• <b>Time Management:</b> Balanced daily on-site training sessions with independent capstone development across 12 intensive weeks.", bullet))
    story.append(create_callout_box(
        "Career Competency Matrix",
        "Acquired practical industry competencies in asynchronous microservices, database design, REST API security, and AI orchestration that prepare me directly for junior software engineer roles."
    ))

    # ==========================================
    # PAGE 26: CHAPTER 10 - CONCLUSION
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 10", chapter_h1))
    story.append(Paragraph("CONCLUSION, INDUSTRIAL EXPERIENCE &amp; FUTURE SCOPE", chapter_h2))
    
    story.append(Paragraph(
        "My 12-week industrial training at <b>Elite Forums</b>, Vasai (East), has been an invaluable learning experience that successfully fulfilled all MSBTE Diploma curriculum objectives for Computer Engineering. The program provided a perfect bridge between theoretical academic concepts and live software industry practices.",
        body
    ))
    story.append(Paragraph(
        "Developing the <b>ProForge AI</b> platform enabled me to gain deep, hands-on expertise in React 18, Node.js, Express, Supabase PostgreSQL, Groq SDK LPU inference, and server-side PDFKit vector compilation. Overcoming complex engineering challenges—such as multi-model AI fallbacks and strict A4 coordinate math—significantly enhanced my problem-solving abilities and confidence.",
        body
    ))
    story.append(Paragraph("Future Enhancements for ProForge AI", subhead))
    story.append(Paragraph("• <b>Multi-Language Translation:</b> Supporting automated resume translation into major Indian and international languages.", bullet))
    story.append(Paragraph("• <b>AI Voice Mock Interviews:</b> Building interactive voice-based mock interview simulations tailored to specific job descriptions.", bullet))
    story.append(Paragraph("• <b>Placement Cell Portals:</b> Developing multi-tenant institutional dashboards for polytechnic and engineering colleges.", bullet))
    story.append(Paragraph(
        "In conclusion, this industrial training has equipped me with practical software engineering skills that will serve as a strong foundation for my future career in computer engineering.",
        body
    ))
    story.append(create_callout_box(
        "Final Assessment Conclusion",
        "The 12-week training successfully satisfied all MSBTE diploma curriculum outcomes, delivering a working multi-suite career intelligence application with high code quality."
    ))

    # ==========================================
    # PAGE 27: CHAPTER 11 - REFERENCES
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 11", chapter_h1))
    story.append(Paragraph("REFERENCES, TECHNICAL DOCUMENTATION &amp; CORPORATE DETAILS", chapter_h2))
    
    story.append(Paragraph("1. Official Documentation &amp; Technical Standards", subhead))
    story.append(Paragraph("• React 18 Official Documentation – https://react.dev/", bullet))
    story.append(Paragraph("• Vite Frontend Tooling Guide – https://vitejs.dev/", bullet))
    story.append(Paragraph("• Tailwind CSS Design System Documentation – https://tailwindcss.com/docs", bullet))
    story.append(Paragraph("• Node.js Event Loop &amp; Architecture Reference – https://nodejs.org/docs", bullet))
    story.append(Paragraph("• Express.js Routing &amp; Middleware Reference – https://expressjs.com/", bullet))
    story.append(Paragraph("• Groq SDK LPU Inference &amp; API Guide – https://console.groq.com/docs", bullet))
    story.append(Paragraph("• PDFKit Vector Document Generation Reference – https://pdfkit.org/docs/", bullet))
    story.append(Paragraph("• Supabase Database &amp; Auth Documentation – https://supabase.com/docs", bullet))
    story.append(Paragraph("• Nodemailer Transport Client Documentation – https://nodemailer.com/", bullet))
    story.append(Paragraph("• JSZip Client-Side Zip Library – https://stuk.github.io/jszip/", bullet))
    
    story.append(Paragraph("2. Educational References &amp; Textbooks", subhead))
    story.append(Paragraph("• <i>JavaScript: The Definitive Guide</i> – David Flanagan, O'Reilly Media", bullet))
    story.append(Paragraph("• <i>Learning React: Modern Patterns for Developing React Apps</i> – Alex Banks &amp; Eve Porcello", bullet))
    story.append(Paragraph("• MSBTE Industrial Training Curriculum Guidelines (Computer Engineering Group)", bullet))
    
    story.append(Spacer(1, 10 * pt))
    elite_link_data = [
        [Paragraph("<b>Training Industry: Elite Forums</b><br/><font color='#003366'><u>https://in.linkedin.com/company/eliteforums</u></font><br/><font size=8.5 color='#4b5563'>IT Services, Software Consulting &amp; Technical Upskilling &bull; Vasai (East), Maharashtra – 401208</font>", center_bold_11)]
    ]
    elite_link_tbl = Table(elite_link_data, colWidths=[430 * pt])
    elite_link_tbl.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 1 * pt, colors.HexColor("#003366")),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('TOPPADDING', (0,0), (-1,-1), 5 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5 * pt),
    ]))
    story.append(elite_link_tbl)

    doc.build(story, canvasmaker=NumberedCanvas)
    print("27-Page ProForge AI Internship Report PDF with Text-First Density & Blank Drop Zones successfully generated.")

if __name__ == "__main__":
    generate_pdf()
