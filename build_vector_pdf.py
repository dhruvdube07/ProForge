import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
pt = 1
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

PDF_PATH = r"c:\Users\Dhruv's Dell\Desktop\Remo\ProForge_AI_Internship_Report.pdf"

# Register authentic Microsoft TrueType fonts for deep, dark, ultra-smooth, pro typography
pdfmetrics.registerFont(TTFont('ProFont', r'C:\Windows\Fonts\arial.ttf'))
pdfmetrics.registerFont(TTFont('ProFont-Bold', r'C:\Windows\Fonts\arialbd.ttf'))
pdfmetrics.registerFont(TTFont('ProFont-Italic', r'C:\Windows\Fonts\ariali.ttf'))
pdfmetrics.registerFont(TTFont('ProFont-BoldItalic', r'C:\Windows\Fonts\arialbi.ttf'))

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_decorations(self, total_pages):
        self.saveState()
        border_x = 32 * pt
        border_y = 28 * pt
        w, h = A4

        # 1. Authentic Sharp Black Outer Frame (1.2pt)
        self.setStrokeColor(colors.HexColor("#000000"))
        self.setLineWidth(1.2 * pt)
        self.rect(border_x, border_y, w - 2 * border_x, h - 2 * border_y)

        # 2. Running Footer Divider & Copyright Text
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.6 * pt)
        self.line(border_x + 8 * pt, border_y + 20 * pt, w - border_x - 8 * pt, border_y + 20 * pt)

        self.setFont("ProFont", 8.5 * pt)
        self.setFillColor(colors.HexColor("#000000"))
        footer_text = "COPYRIGHT © 2026-2027 VIVA INSTITUTE OF ENGINEERING & TECHNOLOGY, COMPUTER ENGINEERING"
        self.drawString(border_x + 10 * pt, border_y + 8 * pt, footer_text)
        self.drawRightString(w - border_x - 10 * pt, border_y + 8 * pt, str(self._pageNumber))

        self.restoreState()

def generate_pdf():
    doc = SimpleDocTemplate(
        PDF_PATH,
        pagesize=A4,
        leftMargin=44 * pt,
        rightMargin=44 * pt,
        topMargin=40 * pt,
        bottomMargin=42 * pt
    )

    # Deep, Solid, Smooth Typography (Natural TA_LEFT prevents any weird gaps or stretched letters)
    title_cover = ParagraphStyle(
        'CoverTitle',
        fontName='ProFont-Bold',
        fontSize=24,
        leading=28,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#000000"),
        spaceAfter=5
    )

    subtitle_cover = ParagraphStyle(
        'CoverSub',
        fontName='ProFont-Italic',
        fontSize=12,
        leading=15,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#1f2937"),
        spaceAfter=20
    )

    center_bold_14 = ParagraphStyle(
        'CBold14', fontName='ProFont-Bold', fontSize=14, leading=17, alignment=TA_CENTER, textColor=colors.HexColor("#000000")
    )
    center_bold_13 = ParagraphStyle(
        'CBold13', fontName='ProFont-Bold', fontSize=13, leading=16, alignment=TA_CENTER, textColor=colors.HexColor("#000000")
    )
    center_bold_12 = ParagraphStyle(
        'CBold12', fontName='ProFont-Bold', fontSize=12, leading=15, alignment=TA_CENTER, textColor=colors.HexColor("#000000")
    )
    center_reg_12 = ParagraphStyle(
        'CReg12', fontName='ProFont', fontSize=12, leading=15, alignment=TA_CENTER, textColor=colors.HexColor("#000000")
    )
    center_reg_11 = ParagraphStyle(
        'CReg11', fontName='ProFont', fontSize=11, leading=14, alignment=TA_CENTER, textColor=colors.HexColor("#000000")
    )

    chapter_h1 = ParagraphStyle(
        'ChapH1',
        fontName='ProFont-Bold',
        fontSize=14,
        leading=17,
        alignment=TA_CENTER,
        spaceBefore=2,
        spaceAfter=4,
        textColor=colors.HexColor("#000000")
    )

    chapter_h2 = ParagraphStyle(
        'ChapH2',
        fontName='ProFont-Bold',
        fontSize=11.5,
        leading=14.5,
        alignment=TA_CENTER,
        spaceAfter=11,
        textColor=colors.HexColor("#000000")
    )

    # Body: 10.5pt, leading 14.5pt, deep dark pure black, TA_LEFT to guarantee ZERO letter gaps
    body = ParagraphStyle(
        'ProBody',
        fontName='ProFont',
        fontSize=10.5,
        leading=14.5,
        alignment=TA_LEFT,
        spaceAfter=7,
        textColor=colors.HexColor("#000000")
    )

    bullet = ParagraphStyle(
        'ProBullet',
        fontName='ProFont',
        fontSize=10,
        leading=14,
        alignment=TA_LEFT,
        leftIndent=16,
        firstLineIndent=-10,
        spaceAfter=4,
        textColor=colors.HexColor("#000000")
    )

    subhead = ParagraphStyle(
        'ProSubhead',
        fontName='ProFont-Bold',
        fontSize=11,
        leading=14.5,
        alignment=TA_LEFT,
        spaceBefore=7,
        spaceAfter=3,
        textColor=colors.HexColor("#000000")
    )

    story = []

    # ==========================================
    # PAGE 1: COVER PAGE
    # ==========================================
    story.append(Spacer(1, 15 * pt))
    story.append(Paragraph("Internship Report submitted in Partial Fulfillment for Diploma In<br/><b>Computer Engineering</b>", center_reg_12))
    story.append(Spacer(1, 30 * pt))
    story.append(Paragraph("PROFORGE", title_cover))
    story.append(Paragraph("End-to-End Career Intelligence &amp; Branding Suite", subtitle_cover))
    story.append(Spacer(1, 8 * pt))
    story.append(Paragraph("Presented By", center_reg_12))
    story.append(Spacer(1, 3 * pt))
    story.append(Paragraph("Dhruv R. Dubey - 25112400240 – TYCO - B", center_bold_13))
    story.append(Spacer(1, 24 * pt))
    story.append(Paragraph("Under the Guidance of", center_reg_12))
    story.append(Spacer(1, 4 * pt))
    story.append(Paragraph("Industry Mentor:- Prof. Harsh Tambade<br/>College Mentor:- Prathamesh Sir", center_bold_12))
    story.append(Spacer(1, 30 * pt))

    # VIVA College Shield Box
    viva_badge_data = [
        [Paragraph("<font size=8.5 color='#b91c1c'><b>VISHNU WAMAN THAKUR CHARITABLE TRUST'S</b></font>", center_bold_12)],
        [Paragraph("<font size=22 color='#b91c1c'><b>VIVA</b></font>", center_bold_14)],
        [Paragraph("<font size=8.5 color='#0f2b5c'><b>INSTITUTE OF TECHNOLOGY</b></font>", center_bold_12)]
    ]
    viva_badge_tbl = Table(viva_badge_data, colWidths=[230 * pt])
    viva_badge_tbl.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 2.5 * pt, colors.HexColor("#b91c1c")),
        ('INNERGRID', (0,0), (-1,-1), 0.5 * pt, colors.HexColor("#e5e7eb")),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#ffffff")),
        ('TOPPADDING', (0,0), (-1,-1), 4 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4 * pt),
    ]))
    story.append(viva_badge_tbl)
    story.append(Spacer(1, 40 * pt))

    story.append(Paragraph("DEPARTMENT OF COMPUTER ENGINEERING", center_bold_12))
    story.append(Spacer(1, 2 * pt))
    story.append(Paragraph("VIVA INSTITUTE OF ENGINEERING &amp; TECHNOLOGY", center_bold_13))
    story.append(Spacer(1, 2 * pt))
    story.append(Paragraph("VIRAR (E), PALGHAR – 401305.", center_bold_12))
    story.append(Spacer(1, 4 * pt))
    story.append(Paragraph("2026-2027", center_bold_13))

    # ==========================================
    # PAGE 2: TABLE OF CONTENTS (INDEX)
    # ==========================================
    story.append(PageBreak())
    story.append(Spacer(1, 8 * pt))

    toc_data = [
        [Paragraph("<b>Sr.no.</b>", center_bold_12), Paragraph("<b>Content</b>", center_bold_12), Paragraph("<b>Page<br/>no.</b>", center_bold_12)],
        [Paragraph("1", center_reg_11), Paragraph("Abstract", body), Paragraph("1", center_reg_11)],
        [Paragraph("2", center_reg_11), Paragraph("Acknowledgement", body), Paragraph("2", center_reg_11)],
        [Paragraph("3", center_reg_11), Paragraph("Chapter 1- Organization Structure Of Industry and General Layout", body), Paragraph("3", center_reg_11)],
        [Paragraph("4", center_reg_11), Paragraph("Chapter 2- Introduction to Industry/Organization", body), Paragraph("4", center_reg_11)],
        [Paragraph("5", center_reg_11), Paragraph("Chapter 3- Major Software Tools Used", body), Paragraph("5-7", center_reg_11)],
        [Paragraph("6", center_reg_11), Paragraph("Chapter 4- Processes / Methodologies Followed", body), Paragraph("8-9", center_reg_11)],
        [Paragraph("7", center_reg_11), Paragraph("Chapter 5- Testing Of Software", body), Paragraph("10-11", center_reg_11)],
        [Paragraph("8", center_reg_11), Paragraph("Chapter 6- Safety Procedures And Cybersecurity", body), Paragraph("12-13", center_reg_11)],
        [Paragraph("9", center_reg_11), Paragraph("Chapter 7- Practical Experiences", body), Paragraph("14-16", center_reg_11)],
        [Paragraph("10", center_reg_11), Paragraph("Chapter 8- Detailed Report of Tasks Undertaken", body), Paragraph("17-20", center_reg_11)],
        [Paragraph("11", center_reg_11), Paragraph("Chapter 9- Challenges And Solutions", body), Paragraph("21-23", center_reg_11)],
        [Paragraph("12", center_reg_11), Paragraph("Chapter 10- Conclusion", body), Paragraph("24", center_reg_11)],
        [Paragraph("13", center_reg_11), Paragraph("Chapter 11- References", body), Paragraph("25", center_reg_11)]
    ]

    toc_tbl = Table(toc_data, colWidths=[55 * pt, 390 * pt, 55 * pt])
    toc_tbl.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1.2 * pt, colors.HexColor("#000000")),
        ('INNERGRID', (0,0), (-1,-1), 0.8 * pt, colors.HexColor("#000000")),
        ('ALIGN', (0,0), (0,-1), 'CENTER'),
        ('ALIGN', (2,0), (2,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 6 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6 * pt),
        ('LEFTPADDING', (1,0), (1,-1), 10 * pt),
    ]))
    story.append(toc_tbl)

    # ==========================================
    # PAGE 3: ABSTRACT
    # ==========================================
    story.append(PageBreak())
    story.append(Spacer(1, 12 * pt))
    story.append(Paragraph("<u>ABSTRACT</u>", chapter_h1))
    story.append(Spacer(1, 14 * pt))

    story.append(Paragraph(
        "Industrial training is an important part of diploma education because it connects classroom learning with practical work. I completed my twelve-week industrial training at <b>Elite Forums</b>, located at Vasai (East), from <b>25 May 2026 to 15 August 2026</b>, where I received exposure to Web Development, Python Programming and Generative AI. The training included technical learning, practical exercises, assessments, discussions and project-oriented activities.",
        body
    ))
    story.append(Paragraph(
        "As part of the project work, I worked on the concept of <b>PROFORGE — End-to-End Career Intelligence &amp; Branding Suite</b>, also represented through the ProForge engineering repository. ProForge is a comprehensive career intelligence and automated branding platform designed to connect aspiring engineers and professionals with industry-grade career optimization tools. The platform unifies six specialized sub-suites: <b>Remo AI</b> (smart resume builder with in-place AI bullet refinement and dynamic A4 PDF coordinate rendering), <b>Folio AI</b> (web portfolio publisher featuring Bento Grid, Cyber Terminal, Modern Executive, and Clean Glassmorphism templates with zero-dependency ZIP export), <b>Talo AI</b> (real-time ATS alignment auditor comparing resumes against target job descriptions with keyword gap detection), <b>Covo AI</b> (recruiter outreach studio generating personalized cold emails, LinkedIn pitches, and dynamic PDF cover letters), <b>Liko AI</b> (personal branding LinkedIn post architect and bio optimizer), and <b>Mali AI</b> (visual HTML email composer, Google typography controls, sandbox preview, and background campaign queue scheduling).",
        body
    ))
    story.append(Paragraph(
        "The project interface contains an interactive dashboard, visual theme switcher (10 dynamic themes), resume layout customizer (over 105 design permutations), ATS scoring analytics, outreach studio, scheduled email queues, and secure multi-device authentication guards. This report explains the organization structure, industry introduction, software tools, methodologies, testing procedures, safety practices, practical experiences, tasks undertaken, challenges, conclusion and references.",
        body
    ))
    story.append(Paragraph(
        "The training experience improved my understanding of planning, reusable components, user interface design, validation, version control, deployment, documentation, teamwork and continuous testing.",
        body
    ))

    # ==========================================
    # PAGE 4: ACKNOWLEDGEMENT
    # ==========================================
    story.append(PageBreak())
    story.append(Spacer(1, 15 * pt))
    story.append(Paragraph("<u>Acknowledgement</u>", chapter_h1))
    story.append(Spacer(1, 18 * pt))

    story.append(Paragraph(
        "We sincerely acknowledge the support and guidance provided by all those who contributed to the successful completion of this project. We are especially grateful to our mentor, <b>Prathamesh Sir</b>, for his valuable assistance, academic guidance, and continuous encouragement throughout the process.",
        body
    ))
    story.append(Paragraph(
        "We also extend our heartfelt thanks to <b>Prof. Harsh Tambade</b> (Founder and CEO, Elite Forums) for giving us the opportunity to undertake this industrial internship at Elite Forums, Vasai (East), and for providing his technical insights and leadership during the Generative AI and web engineering sessions.",
        body
    ))
    story.append(Paragraph(
        "We express our sincere gratitude to the faculty and management of the <b>Department of Computer Engineering at VIVA Institute of Engineering &amp; Technology, Virar (E)</b>, for their institutional backing, academic platform, and encouragement toward industrial skill acquisition.",
        body
    ))
    story.append(Paragraph(
        "Finally, we would like to express our appreciation to the entire <b>Elite Forums</b> organization for providing us with comprehensive knowledge, state-of-the-art tools, and practical exposure during the training period.",
        body
    ))
    story.append(Spacer(1, 80 * pt))

    sig_data = [
        [Paragraph("<b>Dhruv R. Dubey</b><br/>Enrollment No: 25112400240 – TYCO - B<br/>Department of Computer Engineering<br/>VIVA Institute of Engineering &amp; Technology", ParagraphStyle('RightSig', fontName='ProFont', fontSize=10.5, leading=14.5, alignment=TA_RIGHT))]
    ]
    sig_tbl = Table(sig_data, colWidths=[500 * pt])
    sig_tbl.setStyle(TableStyle([('ALIGN', (0,0), (-1,-1), 'RIGHT')]))
    story.append(sig_tbl)

    # ==========================================
    # PAGE 5: CHAPTER 1 - ORG STRUCTURE
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 1", chapter_h1))
    story.append(Spacer(1, 4 * pt))

    org_cell_header = ParagraphStyle('OrgHdr', fontName='ProFont-Bold', fontSize=10, leading=12.5, alignment=TA_CENTER, textColor=colors.white)
    org_cell_body = ParagraphStyle('OrgBody', fontName='ProFont', fontSize=9, leading=12, alignment=TA_CENTER, textColor=colors.black)

    org_data = [
        [Paragraph("<b>Elite Forums</b>", org_cell_header), ""],
        [Paragraph("<b>Founder &amp; CEO</b><br/>Harsh Tambade", org_cell_header), ""],
        [Paragraph("<b>General Manager</b><br/>Jeet Gharat", org_cell_header), Paragraph("<b>COO</b><br/>Siddhant Mandlik", org_cell_header)],
        [Paragraph("<b>Project Manager</b><br/>Suchita Nigam", org_cell_header), ""],
        [Paragraph("<b>Developers</b>", org_cell_header), Paragraph("<b>Instructors</b>", org_cell_header)],
        [Paragraph("Anshu Jaiswal<br/>Adarsh Pandey<br/>Mithilesh Vichare<br/>Yuvraj Singh", org_cell_body),
         Paragraph("Shreya Mishra<br/>Prathamesh Jakkula<br/>Nandini Singh<br/>Shreya Mulik<br/>Shashank Singh", org_cell_body)]
    ]
    org_tbl = Table(org_data, colWidths=[185 * pt, 185 * pt])
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
        ('TOPPADDING', (0,0), (-1,-1), 4 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4 * pt),
    ]))
    story.append(org_tbl)
    story.append(Spacer(1, 10 * pt))

    story.append(Paragraph("ORGANIZATION STRUCTURE OF INDUSTRY AND GENERAL LAYOUT", chapter_h2))
    story.append(Paragraph(
        "<b>Elite Forums</b> is headed by its Founder and CEO, <b>Harsh Tambade</b>. Supporting him in leadership are <b>Jeet Gharat</b>, who serves as the General Manager, and <b>Siddhant Mandlik</b>, the Chief Operating Officer (COO). Day-to-day operations are coordinated by <b>Suchita Nigam</b>, the Project Manager, who supervises two major teams within the organization.",
        body
    ))
    story.append(Paragraph(
        "The <b>Developers Team</b> includes Anshu Jaiswal, Adarsh Pandey, Mithilesh Vichare, and Yuvraj Singh, while the <b>Instructors Team</b> is composed of Shreya Mishra, Prathamesh Jakkula, Nandini Singh, Shreya Mulik, and Shashank Singh. This well-structured hierarchy ensures effective communication, smooth workflow, and strong collaboration between leadership, management, and execution, ultimately driving efficiency and organizational growth.",
        body
    ))

    # ==========================================
    # PAGE 6: CHAPTER 2 - INTRO TO INDUSTRY
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 2", chapter_h1))
    story.append(Paragraph("INTRODUCTION TO INDUSTRY (HISTORY, TYPES OF PRODUCTS AND SERVICES, TURN OVER AND NUMBERS OF EMPLOYEES)", chapter_h2))

    elite_badge_data = [
        [Paragraph("<font size=15 color='white'><b>ELITE FORUMS</b></font><br/><font size=7.5 color='#d1d5db'><b>UNLOCKING YOUR IT POTENTIAL</b></font>", center_bold_12)]
    ]
    elite_tbl = Table(elite_badge_data, colWidths=[250 * pt])
    elite_tbl.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#000000")),
        ('TOPPADDING', (0,0), (-1,-1), 8 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8 * pt),
    ]))
    story.append(elite_tbl)
    story.append(Spacer(1, 8 * pt))

    story.append(Paragraph("IT Services and Consulting", subhead))
    story.append(Paragraph(
        "The company where I carried out my internship functions in the field of <b>Information Technology services and consulting</b>. It is an independent firm, based in Mumbai/Vasai, Maharashtra, and was established in <b>2023</b>. Though fairly new, it has made noticeable progress in the areas of <b>IT education, consulting, and solution development</b>.",
        body
    ))
    story.append(Paragraph(
        "The organization operates with a small but skilled workforce of around <b>11–50 people</b>, which allows it to remain flexible and efficient. This structure supports <b>quick innovation, faster decisions, and personalized approaches</b> to meet the needs of both learners and business clients. The company places strong emphasis on <b>practical learning for students</b> as well as providing <b>consulting support for businesses</b> to overcome technological challenges.",
        body
    ))

    story.append(Paragraph("Range of Services", subhead))
    story.append(Paragraph("The services offered by the company are divided into three major categories:", body))
    story.append(Paragraph("1. Training Programs", subhead))
    story.append(Paragraph("• Focused learning on modern technologies such as <b>Generative AI, Machine Learning, Cybersecurity, Cloud Computing, and Web Development</b>.", bullet))
    story.append(Paragraph("• Interactive sessions and coding workshops covering <b>Git, GitHub, APIs, and JavaScript</b>.", bullet))
    story.append(Paragraph("• Well-structured modules that include <b>MCQs, quizzes, coding challenges, and project assignments</b>.", bullet))
    story.append(Paragraph("• One-on-one guidance to help learners build job-ready skills.", bullet))

    story.append(Paragraph("2. Consultancy Services", subhead))
    story.append(Paragraph("• Professional advice for startups and established firms in adopting digital technologies.", bullet))
    story.append(Paragraph("• Assistance in creating websites, automation workflows, and scalable IT frameworks.", bullet))
    story.append(Paragraph("• Consulting expertise in areas such as cloud solutions, database systems, and AI-driven tools.", bullet))

    # ==========================================
    # PAGE 7: CHAPTER 2 CONT
    # ==========================================
    story.append(PageBreak())
    story.append(Spacer(1, 10 * pt))
    story.append(Paragraph("3. Customized IT Solutions", subhead))
    story.append(Paragraph("• Developing web and mobile applications based on client needs.", bullet))
    story.append(Paragraph("• Offering <b>API-based integrations</b> to improve connectivity between platforms.", bullet))
    story.append(Paragraph("• Delivering complete software solutions—from basic front-end structures to advanced user-centric platforms.", bullet))
    story.append(Paragraph("• Providing <b>deployment, ongoing maintenance, and security support</b> for enterprise-level applications.", bullet))

    story.append(Spacer(1, 18 * pt))
    story.append(Paragraph("Strategic Focus on Emerging Technologies &amp; Generative AI", subhead))
    story.append(Paragraph(
        "Elite Forums places strong strategic emphasis on the convergence of modern web engineering with <b>Generative AI and Large Language Models (LLMs)</b>. Rather than viewing AI as an isolated theoretical concept, the company trains developers to embed AI reasoning directly into full-stack web platforms—such as automated text refinement, ATS scoring algorithms, dynamic document generation, and intelligent campaign dispatching.",
        body
    ))
    story.append(Paragraph(
        "This hands-on, innovation-driven philosophy provided the foundation for engineering <b>ProForge AI</b>, where complex career intelligence workflows were decoupled into responsive, modular web services with sub-second AI inference.",
        body
    ))

    # ==========================================
    # PAGE 8: CHAPTER 3 - TOOLS
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 3", chapter_h1))
    story.append(Paragraph("TYPES OF MAJOR EQUIPMENT/RAW MATERIALS/INSTRUMENTS/MACHINES/HARDWARE/SOFTWARE USED IN INDUSTRY WITH THEIR SPECIFICATION, APPROXIMATELY COST, SPECIFIC USE AND ROUTINE MAINTENANCE DONE.", chapter_h2))

    story.append(Paragraph(
        "During the course of training, we were introduced to a wide range of <b>tools and technologies</b> that are commonly used in the IT industry. These included both development frameworks and supporting software for building, managing, and analyzing applications.",
        body
    ))

    story.append(Paragraph("• <b>Frontend Technologies:</b> React 18, Vite, Tailwind CSS v3, PostCSS, Lucide React Icons", bullet))
    story.append(Paragraph("• <b>Backend Technologies:</b> Node.js, Express.js REST API pipeline, CORS, Dotenv", bullet))
    story.append(Paragraph("• <b>Databases &amp; Storage:</b> Supabase (PostgreSQL relational engine with JSONB columns), Local JSON audit logging", bullet))
    story.append(Paragraph("• <b>Version Control:</b> Git, GitHub", bullet))
    story.append(Paragraph("• <b>Authentication Services:</b> Supabase Auth, JWT verification guards, Zoho SMTP 6-digit OTP verification", bullet))
    story.append(Paragraph("• <b>AI Inference Engine:</b> Groq SDK (Llama 3 70B &amp; Qwen models for sub-second NLP reasoning)", bullet))
    story.append(Paragraph("• <b>Document &amp; Archive Engines:</b> PDFKit (dynamic A4 coordinate mapping), JSZip (zero-dependency client bundles)", bullet))
    story.append(Paragraph("• <b>Email Dispatch &amp; Scheduling:</b> Nodemailer, Zoho SMTP transporter, background queue scheduler (Mali AI)", bullet))
    story.append(Paragraph("• <b>Security &amp; Intrusion Auditing:</b> IP &amp; User-Agent signature trackers, multi-device access alerts", bullet))
    story.append(Paragraph("• <b>Developer Environments:</b> Visual Studio Code, Postman API client, Chrome DevTools", bullet))

    story.append(Paragraph(
        "This combination of technologies provided us with exposure to full-stack development, generative AI integration, document compilation, and cloud database administration, ensuring a balanced learning experience across different domains of computer engineering.",
        body
    ))

    # ==========================================
    # PAGE 9: TOOLS SPECIFICATION TABLE
    # ==========================================
    story.append(PageBreak())
    story.append(Spacer(1, 4 * pt))

    table_heading_style = ParagraphStyle('TblHdr', fontName='ProFont-Bold', fontSize=8.5, leading=11, alignment=TA_CENTER, textColor=colors.black)
    table_cell_style = ParagraphStyle('TblCell', fontName='ProFont', fontSize=8, leading=10.5, alignment=TA_LEFT, textColor=colors.black)
    table_center_style = ParagraphStyle('TblCenter', fontName='ProFont', fontSize=8, leading=10.5, alignment=TA_CENTER, textColor=colors.black)

    tools_grid = [
        [Paragraph("<b>Equipment / Software</b>", table_heading_style),
         Paragraph("<b>Specification</b>", table_heading_style),
         Paragraph("<b>Approx. Cost</b>", table_heading_style),
         Paragraph("<b>Specific Use</b>", table_heading_style),
         Paragraph("<b>Routine Maintenance (Explained with JS async/await)</b>", table_heading_style)],

        [Paragraph("<b>Laptops / Workstations</b>", table_cell_style),
         Paragraph("Intel i5/i7 processor, 16gb RAM, 512 SSD", table_cell_style),
         Paragraph("₹45,000 – ₹60,000", table_center_style),
         Paragraph("Primary hardware for coding, server runtime, AI testing", table_cell_style),
         Paragraph("Regular OS updates, disk cleanup, node_modules cache cleaning", table_cell_style)],

        [Paragraph("<b>Git &amp; GitHub</b>", table_cell_style),
         Paragraph("Cloud-based version control", table_cell_style),
         Paragraph("Free / Pro ₹350–₹700 per month", table_center_style),
         Paragraph("Source code hosting, collaboration, version control", table_cell_style),
         Paragraph("Repo backup, branch cleanup (async commits &amp; merges)", table_cell_style)],

        [Paragraph("<b>VS Code (IDE)</b>", table_cell_style),
         Paragraph("Open-source extensible editor", table_cell_style),
         Paragraph("Free", table_center_style),
         Paragraph("Writing, debugging, and testing frontend/backend code", table_cell_style),
         Paragraph("Extension updates, cache cleaning, settings sync", table_cell_style)],

        [Paragraph("<b>React 18 &amp; Vite</b>", table_cell_style),
         Paragraph("Component library with lightning HMR", table_cell_style),
         Paragraph("Free (MIT)", table_center_style),
         Paragraph("Web app development (SPA, reactive state, UI themes)", table_cell_style),
         Paragraph("Updating dependencies via npm/yarn, tree-shaking dead code", table_cell_style)],

        [Paragraph("<b>Node.js &amp; Express</b>", table_cell_style),
         Paragraph("V8 asynchronous JavaScript runtime", table_cell_style),
         Paragraph("Free (MIT)", table_center_style),
         Paragraph("Backend API routing, token validation, PDF &amp; email pipelines", table_cell_style),
         Paragraph("Monitoring async request loops and unhandled promise rejections", table_cell_style)],

        [Paragraph("<b>Groq SDK (LLM)</b>", table_cell_style),
         Paragraph("LPU-accelerated inference engine", table_cell_style),
         Paragraph("Pay-as-you-go / Free tier", table_center_style),
         Paragraph("ATS keyword analysis, bullet point refiners, email drafting", table_cell_style),
         Paragraph("Handling async rate limits with exponential backoff retries", table_cell_style)],

        [Paragraph("<b>Supabase &amp; PostgreSQL</b>", table_cell_style),
         Paragraph("Open-source Firebase alternative", table_cell_style),
         Paragraph("Free tier + Paid (~₹2,000/mo)", table_center_style),
         Paragraph("Backend-as-a-Service (auth, JSONB profiles, security)", table_cell_style),
         Paragraph("Regular DB backups, connection pool health checks, index tuning", table_cell_style)]
    ]

    tools_tbl_obj = Table(tools_grid, colWidths=[90 * pt, 105 * pt, 75 * pt, 115 * pt, 115 * pt])
    tools_tbl_obj.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1.2 * pt, colors.HexColor("#000000")),
        ('INNERGRID', (0,0), (-1,-1), 0.7 * pt, colors.HexColor("#000000")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f3f4f6")),
        ('TOPPADDING', (0,0), (-1,-1), 5 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5 * pt),
        ('LEFTPADDING', (0,0), (-1,-1), 4 * pt),
        ('RIGHTPADDING', (0,0), (-1,-1), 4 * pt),
    ]))
    story.append(tools_tbl_obj)

    # ==========================================
    # PAGE 10: CHAPTER 4 - METHODOLOGIES
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 4", chapter_h1))
    story.append(Paragraph("PROCESSES/MANUFACTURING TECHNIQUES AND METHODOLOGIES AND MATERIAL HANDLING PROCEDURES", chapter_h2))

    story.append(Paragraph(
        "In the IT Services and Consulting sector, the concept of manufacturing can be compared to the <b>development and deployment of software systems</b>, where digital solutions such as web applications, APIs, and backend services are created, tested, and delivered to end-users. During my internship at Elite Forums – Web Dev, Python &amp; Generative AI Program, I was exposed to modern software engineering practices that emphasize efficiency, scalability, and reliability in project execution.",
        body
    ))

    story.append(Paragraph("1. Software Development Process", subhead))
    story.append(Paragraph(
        "The organization primarily follows an <b>Agile workflow</b>, where work is divided into short, iterative sprints. Each sprint involves continuous testing, regular feedback, and incremental improvements. This approach enables <b>faster delivery, flexibility to adapt to changes</b>, and better-quality outcomes.",
        body
    ))

    story.append(Paragraph("2. Methodologies in Practice", subhead))
    story.append(Paragraph("• <b>Agile &amp; Scrum:</b> Weekly sprint cycles, daily stand-up meetings, and teamwork-driven tasks.", bullet))
    story.append(Paragraph("• <b>Version Control (Git/GitHub):</b> Used for branching, merging, and collaborative code management.", bullet))
    story.append(Paragraph("• <b>CI/CD Pipelines:</b> Automated testing and deployment ensured quick releases with minimal downtime.", bullet))
    story.append(Paragraph("• <b>API-First Development:</b> Applications were designed with modular APIs, improving reusability and system integration.", bullet))

    story.append(Paragraph("3. Handling of Digital Assets", subhead))
    story.append(Paragraph("Unlike traditional industries, IT deals with <b>digital resources</b> rather than physical materials. Some key assets included:", body))
    story.append(Paragraph("• <b>Source Code (GitHub):</b> Managed through proper commits, pull requests, and branching strategies.", bullet))
    story.append(Paragraph("• <b>Frontend &amp; Backend Files:</b> HTML templates, Tailwind CSS stylesheets, JavaScript ES6 modules, and React components.", bullet))
    story.append(Paragraph("• <b>APIs and Endpoints:</b> Integrated using asynchronous functions (<code>async/await</code>) for smooth data handling.", bullet))
    story.append(Paragraph("• <b>Databases (Supabase/PostgreSQL):</b> CRUD operations were performed with secure queries and authentication measures.", bullet))

    # ==========================================
    # PAGE 11: CHAPTER 4 CONT
    # ==========================================
    story.append(PageBreak())
    story.append(Spacer(1, 10 * pt))
    story.append(Paragraph("4. Hands-On Learning During Internship", subhead))
    story.append(Paragraph("• Built scalable micro-modular projects using <b>React 18 and Vite</b> (Counter App, routing-based applications, multi-page dashboards).", bullet))
    story.append(Paragraph("• Configured <b>GitHub repositories</b> for team collaboration, semantic branch management, and continuous version tracking.", bullet))
    story.append(Paragraph("• Connected <b>Supabase backend</b> for passwordless OTP authentication and JSONB profile data storage.", bullet))
    story.append(Paragraph("• Strengthened JavaScript skills with <b>ES6 concepts, async/await functions, and RESTful API handling</b>.", bullet))
    story.append(Paragraph("• Engineered vector document generation pipelines in <b>PDFKit</b> calculating dynamic vertical coordinates and A4 page breaks.", bullet))
    story.append(Paragraph("• Integrated <b>Groq SDK</b> for real-time ATS scoring, keyword extraction, and bullet point refinement.", bullet))
    story.append(Paragraph("• Took part in <b>MCQ tests, rapid-fire rounds, and coding challenges</b>, which reinforced both theoretical and practical knowledge.", bullet))

    story.append(Spacer(1, 20 * pt))
    story.append(Paragraph("5. Component Modularity &amp; Design Consistency", subhead))
    story.append(Paragraph(
        "A major focus of the technical training was achieving high component reusability and clean architecture. Reusable UI elements—including theme toggle selectors, font pickers, interactive sliders, loaders, and modal dialogs—were systematically decoupled into dedicated component files. This modular pattern ensured that styling updates across the 10 custom themes propagated consistently across all six sub-suites without redundant code rewriting.",
        body
    ))

    # ==========================================
    # PAGE 12: CHAPTER 5 - TESTING
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 5", chapter_h1))
    story.append(Paragraph("TESTING AND HANDLING PROCEDURES", chapter_h2))

    story.append(Paragraph("Testing and Evaluation", subhead))
    story.append(Paragraph(
        "Testing played a vital role throughout the internship, serving as a continuous measure of both technical growth and problem-solving ability. At Elite Forums, weekly assessments were designed to simulate real-world scenarios and ensure a balance between theoretical understanding and practical application. These evaluations helped strengthen logical reasoning, coding efficiency, and overall confidence in tackling professional challenges.",
        body
    ))

    story.append(Paragraph("Weekly Assessment Formats", subhead))
    story.append(Paragraph("<b>1. Quizzes:</b> Short, time-bound quizzes were conducted on core topics such as <b>JavaScript fundamentals, Git/GitHub commands, React component lifecycles, and Supabase operations</b>. These quick tests reinforced key concepts and improved recall speed.", body))
    story.append(Paragraph("<b>2. Multiple Choice Questions (MCQs):</b> MCQs assessed knowledge of workflows, coding syntax, and theoretical aspects of software development. They ensured clarity of concepts while highlighting areas that required revision.", body))
    story.append(Paragraph("<b>3. Coding Rounds:</b> Hands-on coding challenges required interns to develop small features, debug errors, and handle API calls in real time. For example, tasks included building a Counter App using React or integrating async/await functions. These exercises enhanced analytical thinking and coding proficiency.", body))
    story.append(Paragraph("<b>4. Mock Exams:</b> Comprehensive tests combined MCQs, descriptive questions, and coding tasks, replicating real evaluation environments. They were designed to check readiness for both academic requirements and industry-level expectations.", body))
    story.append(Paragraph("<b>5. Presentations (PPTs):</b> Interns were asked to prepare and deliver presentations on technical topics, which not only polished technical communication skills but also improved public speaking, teamwork, and confidence—crucial qualities for client-facing roles in IT.", body))

    story.append(Paragraph("Handling &amp; Learning Approaches", subhead))
    story.append(Paragraph("• <b>Confidence Building:</b> Exposure to different test formats like quizzes, coding tasks, and presentations promoted both technical mastery and soft skill development.", bullet))
    story.append(Paragraph("• <b>Collaborative Learning:</b> After assessments, group discussions and doubt-solving sessions encouraged peer learning, making the training more interactive and engaging.", bullet))

    # ==========================================
    # PAGE 13: CHAPTER 6 - SAFETY & CYBERSECURITY
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 6", chapter_h1))
    story.append(Paragraph("SAFETY PROCEDURES FOLLOWED AND SAFETY GEARS USED BY INDUSTRY", chapter_h2))

    story.append(Paragraph("Safety Practices During Internship", subhead))
    story.append(Paragraph(
        "Although my internship was in the IT consulting and services sector, the organization emphasized that <b>safety—both digital and professional—was an essential part of day-to-day work</b>. Interns were guided to adopt secure habits that protected data, systems, and overall workplace efficiency.",
        body
    ))

    story.append(Paragraph("1. Digital Protection", subhead))
    story.append(Paragraph("• <b>Confidentiality:</b> Sensitive files, repositories, and API keys were safeguarded, with clear instructions not to share credentials.", bullet))
    story.append(Paragraph("• <b>Strong Authentication:</b> Accounts on platforms such as GitHub and Supabase were secured using complex passwords and two-factor verification.", bullet))
    story.append(Paragraph("• <b>Coding Security:</b> All code was reviewed regularly to prevent vulnerabilities like SQL injection or XSS. Input sanitization was applied across resume data fields and prompt forms.", bullet))
    story.append(Paragraph("• <b>Intrusion Detection &amp; Security Auditing:</b> The platform integrated active security monitoring (<code>loginHistory.js</code>) that logs IP addresses and User-Agent signatures. It automatically triggers warning alerts and flags potential account locks upon detecting access from 3+ distinct devices or consecutive failed logins.", bullet))
    story.append(Paragraph("• <b>Data Backup:</b> Repositories and databases were systematically backed up to avoid data loss.", bullet))
    story.append(Paragraph("• <b>Safe Browsing Habits:</b> Only verified websites and resources were accessed, preventing exposure to malicious links.", bullet))

    story.append(Paragraph("2. System &amp; Workspace Safety", subhead))
    story.append(Paragraph("• <b>Regular Maintenance:</b> Devices were updated with patches, antivirus software, and firewalls.", bullet))
    story.append(Paragraph("• <b>Hardware Handling:</b> External devices such as USB drives were used carefully to reduce security risks.", bullet))
    story.append(Paragraph("• <b>Ergonomic Care:</b> Proper seating, posture, and screen breaks were encouraged to ensure comfort during long coding hours.", bullet))

    story.append(Paragraph("3. Collaboration &amp; Communication Protocols", subhead))
    story.append(Paragraph("• <b>Version Control Discipline:</b> GitHub contributions were monitored through pull requests and code reviews to avoid errors.", bullet))
    story.append(Paragraph("• <b>Secure API Use:</b> API requests were handled responsibly to prevent misuse and quota exhaustion.", bullet))
    story.append(Paragraph("• <b>Professional Communication:</b> Respectful and clear interaction was maintained in meetings and team discussions.", bullet))

    # ==========================================
    # PAGE 14: CHAPTER 6 CONT
    # ==========================================
    story.append(PageBreak())
    story.append(Spacer(1, 10 * pt))
    story.append(Paragraph("4. Emergency Measures", subhead))
    story.append(Paragraph("• <b>System Recovery:</b> Backup mechanisms in GitHub and Supabase allowed smooth recovery during technical failures.", bullet))
    story.append(Paragraph("• <b>Incident Response:</b> Interns were trained to report breaches, credential leaks, or suspicious activity immediately.", bullet))
    story.append(Paragraph("• <b>Workplace Awareness:</b> During offline sessions at the Vasai center, safety guidelines such as fire exits and emergency contacts were explained.", bullet))

    story.append(Spacer(1, 15 * pt))
    story.append(Paragraph("5. Professional Conduct &amp; Personal Safety", subhead))
    story.append(Paragraph("• <b>Adherence to company policies</b> and confidentiality rules was mandatory.", bullet))
    story.append(Paragraph("• <b>Online collaboration tools</b> like Slack, Zoom, and Google Meet were used securely.", bullet))
    story.append(Paragraph("• While interns were encouraged to be inquisitive, they were advised to remain careful when discussing project-related details outside official channels.", bullet))

    story.append(Spacer(1, 15 * pt))
    story.append(Paragraph("6. Ethical AI Implementation Protocols", subhead))
    story.append(Paragraph(
        "A dedicated discussion at Elite Forums explored ethical guidelines regarding AI usage. When generating resumes, cover letters, and outreach pitches, algorithms were structured to prevent false factual generation, uphold privacy standards for personal contact information, and ensure transparency in automated email scheduling workflows.",
        body
    ))

    # ==========================================
    # PAGE 15: CHAPTER 7 - PRACTICAL EXPERIENCES
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 7", chapter_h1))
    story.append(Paragraph("PARTICULAR OF PRACTICAL EXPERIENCES IN INDUSTRY IF ANY IN PRODUCTION/ASSEMBLY/TESTING/MAINTENANCE", chapter_h2))

    story.append(Paragraph("Practical Experiences During Internship", subhead))
    story.append(Paragraph(
        "During my internship at Elite Forums – Generative AI Program, I gained practical exposure to the complete cycle of software development. The work was divided into four main stages—<b>production, assembly, testing, and maintenance</b>—similar to the workflow of traditional industries, but adapted to the IT environment.",
        body
    ))

    story.append(Paragraph("1. Production (Development &amp; Implementation)", subhead))
    story.append(Paragraph("• Built a basic Counter App and multi-view profile editors in React to understand <b>component design and state management</b>.", bullet))
    story.append(Paragraph("• Created both static and dynamic pages in Vite/React, learning how web platforms balance <b>speed with interactivity</b>.", bullet))
    story.append(Paragraph("• Implemented API integrations using JavaScript (<code>async/await</code>) for smooth data exchange and error handling.", bullet))
    story.append(Paragraph("• Added authentication and database connectivity through <b>Supabase</b>, simulating a real-world backend system.", bullet))
    story.append(Paragraph("• Engineered <b>Remo AI</b>: dynamic A4 coordinate calculation in PDFKit ensuring print-ready resumes with zero margin clipping across 105+ layout combinations.", bullet))
    story.append(Paragraph("• Developed <b>Folio AI</b>: 4 responsive portfolio designs (Bento Grid, Cyber Terminal, Modern Executive, Clean Glassmorphism) with client-side ZIP packaging via JSZip.", bullet))
    story.append(Paragraph("• Implemented <b>Talo AI</b>: ATS alignment algorithms parsing job descriptions vs candidate profiles to generate percentage match scores and keyword gap reports.", bullet))

    story.append(Paragraph("2. Assembly (System Integration &amp; Configuration)", subhead))
    story.append(Paragraph("• Integrated different elements such as frontend, backend, APIs, and databases into a unified system.", bullet))
    story.append(Paragraph("• Configured <b>GitHub repositories</b> to enable collaboration, version control, and project backups.", bullet))
    story.append(Paragraph("• Practiced React routing and layout guards to organize multiple sub-suites into a structured workflow.", bullet))
    story.append(Paragraph("• Configured <b>Zoho SMTP mail pipelines</b> for secure 6-digit OTP verification and automated email campaign dispatches.", bullet))

    # ==========================================
    # PAGE 16: CHAPTER 7 CONT
    # ==========================================
    story.append(PageBreak())
    story.append(Spacer(1, 10 * pt))
    story.append(Paragraph("3. Testing (Ensuring Quality &amp; Performance)", subhead))
    story.append(Paragraph("• Took part in weekly assessments including quizzes, coding rounds, MCQs, and mock exams.", bullet))
    story.append(Paragraph("• Performed <b>unit tests for small components</b> (like counter functionality, theme switches) and integration tests for API calls.", bullet))
    story.append(Paragraph("• Used debugging tools in VS Code and Postman to troubleshoot and fix issues in JavaScript and Express routes.", bullet))
    story.append(Paragraph("• Delivered presentations (PPTs) on technical topics, which helped strengthen communication and technical explanation skills.", bullet))
    story.append(Paragraph("• Stress-tested PDFKit rendering across various resume lengths to ensure seamless multi-page pagination.", bullet))

    story.append(Spacer(1, 15 * pt))
    story.append(Paragraph("4. Maintenance (Ongoing Improvements &amp; Security)", subhead))
    story.append(Paragraph("• Regularly updated npm packages and project dependencies to keep systems compatible.", bullet))
    story.append(Paragraph("• Managed Supabase databases through CRUD operations and scheduled backups.", bullet))
    story.append(Paragraph("• Maintained GitHub repositories by cleaning branches, organizing commits, and configuring workflows.", bullet))
    story.append(Paragraph("• Applied JavaScript <code>async/await</code> to maintain stable and responsive applications.", bullet))
    story.append(Paragraph("• Followed security practices, including API key management, environment variable configuration, and safe coding guidelines.", bullet))
    story.append(Paragraph("• Constructed automated queue workers (<code>emailScheduler.js</code>) monitoring pending emails and dispatching them reliably.", bullet))

    # ==========================================
    # PAGE 17: CHAPTER 8 - DETAILED REPORT
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 8", chapter_h1))
    story.append(Paragraph("DETAILED REPORT OF THE TASKS UNDERTAKEN DURING THE TRAINING", chapter_h2))

    story.append(Paragraph("Internship Structure and Weekly Progress", subhead))
    story.append(Paragraph(
        "The internship at Elite Forums – Generative AI Program was systematically designed in a <b>week-by-week format</b>, gradually building expertise in full-stack development and machine learning. Each stage combined theoretical lessons with practical tasks, ensuring that concepts were not only learned but also applied in real-world scenarios. The journey concluded with industry-level projects that showcased our acquired skills.",
        body
    ))

    story.append(Paragraph("Weeks 1–2: Foundations in Full-Stack Development", subhead))
    story.append(Paragraph(
        "The training started with full-stack fundamentals (HTML5 boilerplates, CSS layouts, and modern JavaScript), which form the backbone of many modern web applications. Alongside this, I worked on form handling and DOM manipulation to strengthen my basics.",
        body
    ))
    story.append(Paragraph(
        "I also practiced JavaScript fundamentals such as variables, loops, ES6 features, and asynchronous programming with <code>async/await</code>. Simultaneously, we were introduced to <b>Git and GitHub</b> for version control—learning repository setup, branching, commits, and pull requests.",
        body
    ))
    story.append(Paragraph(
        "The basics of Node.js and Express were also covered, including routing, middleware pipelines, and RESTful API endpoints. To apply our knowledge, we completed assignments like implementing CRUD operations, which improved our confidence in handling databases and backend integration.",
        body
    ))

    story.append(Paragraph("Weeks 3–4: Authentication, Integrations, and Profile Systems", subhead))
    story.append(Paragraph(
        "In the third and fourth weeks, the focus shifted toward <b>authentication and system integration</b>. Using Supabase and Nodemailer, we implemented secure login and session handling via 6-digit OTP verification. We also explored rate-limiting strategies to improve scalability and prevent misuse of system resources.",
        body
    ))
    story.append(Paragraph(
        "Additional integrations included <b>Zoho SMTP for transactional email dispatching</b> and security audit logging. This phase simulated real-world SaaS projects, exposing us to API-driven workflows.",
        body
    ))
    story.append(Paragraph(
        "We also participated in a <b>Pitch Deck Event</b>, where we learned how to combine technical explanations with effective business presentations. By the end of this stage, we deployed the core foundation for ProForge, bringing together all the concepts learned so far into a functioning full-stack application.",
        body
    ))

    # ==========================================
    # PAGE 18: CHAPTER 8 CONT
    # ==========================================
    story.append(PageBreak())
    story.append(Spacer(1, 10 * pt))
    story.append(Paragraph("Weeks 5–6: Remo AI Resume Builder &amp; PDFKit Dynamic Coordinate Engine", subhead))
    story.append(Paragraph(
        "In the fifth and sixth weeks, the emphasis moved to dynamic document generation and AI integration. We engineered <b>Remo AI</b>, developing a dynamic resume editor with real-time text synchronization. Developed the backend rendering engine in <b>PDFKit</b>, calculating exact A4 coordinate positions, line wraps, font embeddings, and pagination across 105+ layout combinations. Integrated <b>Groq SDK</b> (Llama 3 70B) for real-time resume bullet refinement based on tone and length sliders.",
        body
    ))

    story.append(Paragraph("Weeks 7–8: Folio AI Portfolio Studio &amp; Talo AI ATS Alignment Auditor", subhead))
    story.append(Paragraph(
        "Weeks seven and eight were application-driven. We developed <b>Folio AI</b>, creating four distinct responsive portfolio templates (Bento Grid, Cyber Terminal, Modern Executive, Clean Glassmorphism). Implemented <b>JSZip</b> for zero-dependency client exports containing clean standalone HTML, CSS, and JS.",
        body
    ))
    story.append(Paragraph(
        "We then built <b>Talo AI</b>, an ATS matching engine parsing job descriptions vs candidate profiles to compute match scores, identify missing keyword competencies, and generate targeted bullet rewrites.",
        body
    ))

    story.append(Paragraph("Week 9: Covo AI Outreach Studio &amp; Liko AI LinkedIn Architect", subhead))
    story.append(Paragraph(
        "The ninth week introduced automated recruiter outreach and personal branding. Developed <b>Covo AI</b> for generating personalized cold emails, LinkedIn connection requests, and dynamic PDF cover letters. Created <b>Liko AI</b>, transforming career milestones into engaging social media posts with customizable hooks, hashtags, and LinkedIn bio optimization.",
        body
    ))

    story.append(Paragraph("Weeks 10–11: Mali AI Campaign Studio &amp; Background Scheduling Engine", subhead))
    story.append(Paragraph(
        "The tenth and eleventh weeks marked the development of <b>Mali AI</b>. Built a visual rich-text HTML email composer with 12 Google fonts, 7 theme palettes, and a simulated browser preview console. Integrated dual time pickers (calendar and clock selectors) and engineered an automated background queue scheduler (<code>emailScheduler.js</code>) that checks pending emails and dispatches them via Zoho SMTP.",
        body
    ))

    # ==========================================
    # PAGE 19: CHAPTER 8 CONT
    # ==========================================
    story.append(PageBreak())
    story.append(Spacer(1, 10 * pt))
    story.append(Paragraph("Week 12: Security Auditing, Multi-Theme System and Final Evaluation", subhead))
    story.append(Paragraph(
        "The final week was dedicated to cybersecurity auditing, visual polish, and project evaluation. We implemented an <b>active security audit monitor</b> (<code>loginHistory.js</code>) tracking IP addresses and User-Agent signatures, issuing email alerts upon multi-device access attempts.",
        body
    ))
    story.append(Paragraph(
        "We also implemented a <b>visual theme system</b> featuring 10 dynamic color themes with Apple-style cubic-bezier transitions, optimized frontend and backend code, and ensured deployment readiness.",
        body
    ))
    story.append(Paragraph(
        "The internship concluded with a <b>final project evaluation</b> at Elite Forums, where ProForge was reviewed based on technical accuracy, code modularity, innovation, and presentation quality.",
        body
    ))

    story.append(Spacer(1, 20 * pt))
    story.append(Paragraph("Comprehensive Learning Synthesis", subhead))
    story.append(Paragraph(
        "This progressive 12-week roadmap ensured that by the end of the internship, we had strong exposure to <b>modern web development, generative AI orchestration, document generation, and real-world project deployment</b>, making the experience both comprehensive and industry-relevant.",
        body
    ))

    # ==========================================
    # PAGE 20: CHAPTER 9 - CHALLENGES
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 9", chapter_h1))
    story.append(Paragraph("SPECIAL/CHALLENGING EXPERIENCES ENCOUNTERED DURING TRAINING IF ANY (MAY INCLUDE STUDENTS LIKING AND DISLIKING OF WORKPLACES)", chapter_h2))

    story.append(Paragraph("Challenges and Learning Experiences", subhead))
    story.append(Paragraph(
        "My internship at Elite Forums offered me valuable exposure to both the technical and professional aspects of working in the IT services and consulting sector. The experience was highly rewarding but not without its share of challenges. Many tasks pushed me beyond my comfort zone, testing my patience, adaptability, and problem-solving skills. At the same time, the supportive work environment, structured assessments, and access to advanced tools enabled me to grow as both a learner and a professional.",
        body
    ))

    story.append(Paragraph("1. Grasping Dynamic Coordinate Math &amp; Pagination in PDFKit", subhead))
    story.append(Paragraph(
        "One of the first difficulties I faced was learning server-side coordinate-based document generation. Unlike web pages where elements flow naturally, PDFKit operates on absolute vector coordinates on a fixed A4 canvas. When rendering resumes with variable amounts of content, text frequently overflowed past the page boundaries or split awkwardly across page breaks. With mentor guidance, I formulated a mathematical coordinate tracker that measures text height (<code>doc.heightOfString()</code>) in advance, automatically adding pages and resetting headers cleanly.",
        body
    ))

    story.append(Paragraph("2. Schema Enforcement from Non-Deterministic LLM Responses", subhead))
    story.append(Paragraph(
        "Integrating Groq's Llama 3 models for ATS scoring initially led to errors when the model returned conversational markdown instead of pure JSON. Initially, spending hours debugging parsing exceptions was discouraging. However, I adopted systematic prompt framing and backend regex extractors. This structured approach overcame the difficulty and made AI integration one of the highlights of the project.",
        body
    ))

    story.append(Paragraph("3. Reliable Background Queue Scheduling for Email Campaigns", subhead))
    story.append(Paragraph(
        "Managing scheduled email campaigns in Mali AI without relying on heavy external queue infrastructure required a lightweight yet fail-safe scheduler that would not block the Node.js event loop. Building an internal asynchronous queue scheduler utilizing atomic state transitions ('pending', 'processing', 'sent', 'failed') solved this challenge.",
        body
    ))

    # ==========================================
    # PAGE 21: CHAPTER 9 CONT
    # ==========================================
    story.append(PageBreak())
    story.append(Spacer(1, 10 * pt))
    story.append(Paragraph("4. Handling Environment Files in CI/CD Deployment", subhead))
    story.append(Paragraph(
        "Another challenge was learning how to manage environment (<code>.env</code>) files securely during development and deployment. Early on, I mistakenly pushed sensitive credentials to GitHub, which served as a wake-up call about the importance of cybersecurity, even in smaller projects. I quickly learned to use <code>gitignore</code>, configure environment variables on deployment platforms, and distinguish between development and production setups. Although I initially disliked working on configurations, I later realized their importance and appreciated how these practices improved my attention to detail.",
        body
    ))

    story.append(Paragraph("5. Time Management in Collaborative Projects", subhead))
    story.append(Paragraph(
        "On the non-technical side, time management in team projects was a significant challenge. Coordinating responsibilities for tasks such as building the multi-suite dashboard or preparing pitch decks often created stressful situations, especially when deadlines overlapped with debugging sessions. While the pressure was difficult at first, I gradually developed teamwork and organizational skills. Tools like GitHub Projects helped streamline task allocation, and I began to value the collaborative aspect of group work as it reflected real industry practices.",
        body
    ))

    story.append(Spacer(1, 15 * pt))
    story.append(Paragraph("Reflections on the Workplace", subhead))
    story.append(Paragraph(
        "Overall, I found the environment at Elite Forums to be supportive and learning-oriented. The mentors were approachable, weekly evaluations encouraged consistency, and the exposure to multiple domains—ranging from React to generative AI to Supabase—was immensely valuable. I particularly appreciated the balance between theoretical sessions, coding practice, and project-based learning.",
        body
    ))
    story.append(Paragraph(
        "On the other hand, the fast pace of training sometimes felt overwhelming, especially when transitioning quickly between diverse technologies. However, this very challenge improved my adaptability, which I believe will be a critical skill in my future career.",
        body
    ))

    # ==========================================
    # PAGE 22: CHAPTER 10 - CONCLUSION
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 10", chapter_h1))
    story.append(Paragraph("CONCLUSION", chapter_h2))

    story.append(Paragraph(
        "My internship experience at <b>Elite Forums</b> has been both enriching and transformative, blending technical learning with professional growth. Throughout the program, I was introduced to a broad spectrum of domains, including full-stack web development, React 18, Git &amp; GitHub, authentication systems, Generative AI models, PDFKit rendering, and project deployment. Each stage offered exposure to new tools, methodologies, and real-world practices, allowing me to strengthen not only my foundational knowledge but also my advanced technical expertise.",
        body
    ))
    story.append(Paragraph(
        "The challenges I encountered—such as understanding asynchronous programming, debugging dynamic coordinate pagination in PDFKit, ensuring secure deployments, and managing time during group projects—were not setbacks but steppingstones. They taught me resilience, adaptability, and structured problem-solving, while also building my confidence to handle real-world IT challenges.",
        body
    ))
    story.append(Paragraph(
        "What I valued most was the <b>balanced approach of the program</b>. The integration of theory, hands-on coding, weekly assessments, and collaborative projects provided a holistic learning experience. This structure mirrored industry workflows and prepared me for the expectations of a professional IT environment. While the pace of training was at times demanding, it ultimately instilled discipline, focus, and a results-driven mindset.",
        body
    ))
    story.append(Paragraph(
        "Overall, this internship has given me a solid foundation in software development and data-driven problem-solving, while also nurturing essential professional values such as teamwork, accountability, and continuous learning. The opportunity to work with cutting-edge technologies like React, Supabase, Groq AI, and modern backend architectures has broadened my career perspective and motivated me to explore advanced areas of Generative AI and emerging computing technologies.",
        body
    ))
    story.append(Paragraph(
        "In conclusion, the internship was far more than an academic requirement—it was a life-changing experience that successfully bridged the gap between academic concepts and industry applications. It has equipped me with the skills, confidence, and mindset required to face future challenges in the IT sector and has laid a strong foundation for my journey as a computer engineer.",
        body
    ))

    # ==========================================
    # PAGE 23: CHAPTER 11 - REFERENCES
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 11", chapter_h1))
    story.append(Paragraph("REFERENCES/SOURCE OF INFORMATION", chapter_h2))

    story.append(Paragraph("References / Sources of Information", subhead))
    story.append(Paragraph("1. Official Documentation &amp; Guides", subhead))
    story.append(Paragraph("• React 18 Documentation – https://react.dev/", bullet))
    story.append(Paragraph("• Vite Next Generation Frontend Tooling – https://vitejs.dev/", bullet))
    story.append(Paragraph("• Tailwind CSS Documentation – https://tailwindcss.com/docs", bullet))
    story.append(Paragraph("• Node.js Official Documentation – https://nodejs.org/docs", bullet))
    story.append(Paragraph("• Express.js API Reference – https://expressjs.com/", bullet))
    story.append(Paragraph("• Groq SDK &amp; LPU Inference Docs – https://console.groq.com/docs", bullet))
    story.append(Paragraph("• PDFKit Document Generation Guide – https://pdfkit.org/docs/", bullet))
    story.append(Paragraph("• Supabase Documentation – https://supabase.com/docs", bullet))
    story.append(Paragraph("• Git &amp; GitHub Guides – https://docs.github.com/", bullet))
    story.append(Paragraph("• Nodemailer Email Transport Documentation – https://nodemailer.com/", bullet))
    story.append(Paragraph("• JSZip Client-Side Zip Library – https://stuk.github.io/jszip/", bullet))

    story.append(Paragraph("2. Learning Platforms", subhead))
    story.append(Paragraph("• Elite Forums Internal Training Materials &amp; PPTs", bullet))
    story.append(Paragraph("• MDN Web Docs (Mozilla Developer Network) – https://developer.mozilla.org/", bullet))
    story.append(Paragraph("• Code Signals – https://codesignal.com/learn/course-paths", bullet))
    story.append(Paragraph("• Kaggle Tutorials – https://www.kaggle.com/learn (for AI algorithms &amp; datasets)", bullet))

    story.append(Paragraph("3. Research Papers &amp; Books", subhead))
    story.append(Paragraph("• <i>JavaScript: The Definitive Guide</i> – David Flanagan", bullet))
    story.append(Paragraph("• <i>Learning React: Functional Web Development with React and Redux</i> – Alex Banks, Eve Porcello", bullet))
    story.append(Paragraph("• <i>Hands-On Machine Learning with Scikit-Learn, Keras &amp; TensorFlow</i> – Aurélien Géron", bullet))

    # ==========================================
    # PAGE 24: CHAPTER 11 CONT
    # ==========================================
    story.append(PageBreak())
    story.append(Spacer(1, 10 * pt))
    story.append(Paragraph("4. Tools &amp; Software Used", subhead))
    story.append(Paragraph("• Visual Studio Code (IDE)", bullet))
    story.append(Paragraph("• GitHub (Version Control)", bullet))
    story.append(Paragraph("• Node.js &amp; npm (Runtime &amp; Package Management)", bullet))
    story.append(Paragraph("• Supabase Cloud Platform", bullet))
    story.append(Paragraph("• Postman (REST API Endpoint Testing)", bullet))
    story.append(Paragraph("• Chrome DevTools (UI Inspection &amp; Performance Profiling)", bullet))

    story.append(Spacer(1, 140 * pt))
    elite_link_data = [
        [Paragraph("<b>Elite Forums: - <font color='#003366'><u>https://in.linkedin.com/company/eliteforums</u></font></b><br/><font size=9.5 color='#374151'>IT Services &amp; Consulting &bull; Vasai (East), Maharashtra – 401208</font>", center_bold_12)]
    ]
    elite_link_tbl = Table(elite_link_data, colWidths=[400 * pt])
    elite_link_tbl.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(elite_link_tbl)

    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF with deep, smooth, dark pro typography successfully compiled.")

if __name__ == "__main__":
    generate_pdf()
