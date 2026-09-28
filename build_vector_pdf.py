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

# Register standard Windows TrueType fonts for clear, sharp vector typography
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

        # 1. Outer Frame
        self.setStrokeColor(colors.HexColor("#000000"))
        self.setLineWidth(1.2 * pt)
        self.rect(border_x, border_y, w - 2 * border_x, h - 2 * border_y)

        # 2. Running Footer Divider & Copyright Text
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.6 * pt)
        self.line(border_x + 8 * pt, border_y + 20 * pt, w - border_x - 8 * pt, border_y + 20 * pt)

        self.setFont("ProFont", 8.5 * pt)
        self.setFillColor(colors.HexColor("#000000"))
        footer_text = "COPYRIGHT © 2026-2027 VIVA INSTITUTE OF TECHNOLOGY, COMPUTER ENGINEERING"
        self.drawString(border_x + 10 * pt, border_y + 8 * pt, footer_text)
        self.drawRightString(w - border_x - 10 * pt, border_y + 8 * pt, f"Page {self._pageNumber} of {total_pages}")

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

    # Typography styles
    title_cover = ParagraphStyle('CoverTitle', fontName='ProFont-Bold', fontSize=24, leading=28, alignment=TA_CENTER, textColor=colors.HexColor("#000000"), spaceAfter=5)
    subtitle_cover = ParagraphStyle('CoverSub', fontName='ProFont-Italic', fontSize=12, leading=15, alignment=TA_CENTER, textColor=colors.HexColor("#1f2937"), spaceAfter=18)
    center_bold_14 = ParagraphStyle('CBold14', fontName='ProFont-Bold', fontSize=14, leading=17, alignment=TA_CENTER, textColor=colors.HexColor("#000000"))
    center_bold_13 = ParagraphStyle('CBold13', fontName='ProFont-Bold', fontSize=13, leading=16, alignment=TA_CENTER, textColor=colors.HexColor("#000000"))
    center_bold_12 = ParagraphStyle('CBold12', fontName='ProFont-Bold', fontSize=12, leading=15, alignment=TA_CENTER, textColor=colors.HexColor("#000000"))
    center_reg_12 = ParagraphStyle('CReg12', fontName='ProFont', fontSize=12, leading=15, alignment=TA_CENTER, textColor=colors.HexColor("#000000"))
    center_reg_11 = ParagraphStyle('CReg11', fontName='ProFont', fontSize=11, leading=14, alignment=TA_CENTER, textColor=colors.HexColor("#000000"))
    chapter_h1 = ParagraphStyle('ChapH1', fontName='ProFont-Bold', fontSize=14, leading=17, alignment=TA_CENTER, spaceBefore=2, spaceAfter=4, textColor=colors.HexColor("#000000"))
    chapter_h2 = ParagraphStyle('ChapH2', fontName='ProFont-Bold', fontSize=11.5, leading=14.5, alignment=TA_CENTER, spaceAfter=10, textColor=colors.HexColor("#000000"))
    
    # Body styles with rich line-heights and coverage
    body = ParagraphStyle('ProBody', fontName='ProFont', fontSize=10, leading=14, alignment=TA_LEFT, spaceAfter=7, textColor=colors.HexColor("#000000"))
    bullet = ParagraphStyle('ProBullet', fontName='ProFont', fontSize=9.5, leading=13.5, alignment=TA_LEFT, leftIndent=16, firstLineIndent=-10, spaceAfter=4, textColor=colors.HexColor("#000000"))
    subhead = ParagraphStyle('ProSubhead', fontName='ProFont-Bold', fontSize=11, leading=14.5, alignment=TA_LEFT, spaceBefore=7, spaceAfter=3, textColor=colors.HexColor("#000000"))
    code_box_style = ParagraphStyle('CodeBox', fontName='ProFont', fontSize=8, leading=11, alignment=TA_LEFT, textColor=colors.HexColor("#1e293b"))

    story = []

    # ==========================================
    # PAGE 1: COVER PAGE
    # ==========================================
    story.append(Spacer(1, 15 * pt))
    story.append(Paragraph("Internship Report submitted in Partial Fulfillment for Diploma In<br/><b>Computer Engineering</b>", center_reg_12))
    story.append(Spacer(1, 25 * pt))
    story.append(Paragraph("PROFORGE", title_cover))
    story.append(Paragraph("End-to-End Career Intelligence &amp; Branding Suite", subtitle_cover))
    story.append(Spacer(1, 8 * pt))
    story.append(Paragraph("Presented By", center_reg_12))
    story.append(Spacer(1, 3 * pt))
    story.append(Paragraph("Dhruv R. Dubey - 25112400240 – TYCO - B", center_bold_13))
    story.append(Spacer(1, 20 * pt))
    story.append(Paragraph("Under the Guidance of", center_reg_12))
    story.append(Spacer(1, 4 * pt))
    story.append(Paragraph("Industry Mentor:- Prof. Harsh Tambade<br/>College Mentor:- Ms. Mansi Patil", center_bold_12))
    story.append(Spacer(1, 25 * pt))

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
    story.append(Spacer(1, 35 * pt))

    story.append(Paragraph("DEPARTMENT OF COMPUTER ENGINEERING", center_bold_12))
    story.append(Spacer(1, 2 * pt))
    story.append(Paragraph("VIVA INSTITUTE OF TECHNOLOGY", center_bold_13))
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
        [Paragraph("<b>Sr.no.</b>", center_bold_12), Paragraph("<b>Content / Topic Title</b>", center_bold_12), Paragraph("<b>Page<br/>no.</b>", center_bold_12)],
        [Paragraph("1", center_reg_11), Paragraph("Abstract", body), Paragraph("3", center_reg_11)],
        [Paragraph("2", center_reg_11), Paragraph("Acknowledgement", body), Paragraph("4", center_reg_11)],
        [Paragraph("3", center_reg_11), Paragraph("Chapter 1: Organization Structure of Industry &amp; General Layout", body), Paragraph("5", center_reg_11)],
        [Paragraph("4", center_reg_11), Paragraph("Chapter 2: Introduction to Industry (History, Services &amp; AI Focus)", body), Paragraph("6-7", center_reg_11)],
        [Paragraph("5", center_reg_11), Paragraph("Chapter 3: Major Software Tools, Specifications &amp; Maintenance", body), Paragraph("8-10", center_reg_11)],
        [Paragraph("6", center_reg_11), Paragraph("Chapter 4: Processes, Methodologies &amp; Material Handling Procedures", body), Paragraph("11-13", center_reg_11)],
        [Paragraph("7", center_reg_11), Paragraph("Chapter 5: Testing, Validation &amp; Quality Assurance Procedures", body), Paragraph("14-16", center_reg_11)],
        [Paragraph("8", center_reg_11), Paragraph("Chapter 6: Safety Procedures, Data Security &amp; Ethical AI Governance", body), Paragraph("17-19", center_reg_11)],
        [Paragraph("9", center_reg_11), Paragraph("Chapter 7: Practical Experiences in Production, Assembly &amp; Testing", body), Paragraph("20-22", center_reg_11)],
        [Paragraph("10", center_reg_11), Paragraph("Chapter 8: Detailed Report of Technical Tasks Undertaken (12 Weeks)", body), Paragraph("23-26", center_reg_11)],
        [Paragraph("11", center_reg_11), Paragraph("Chapter 9: Special &amp; Challenging Experiences, Solutions &amp; Reflections", body), Paragraph("27-28", center_reg_11)],
        [Paragraph("12", center_reg_11), Paragraph("Chapter 10: Conclusion &amp; Future Scope", body), Paragraph("29", center_reg_11)],
        [Paragraph("13", center_reg_11), Paragraph("Chapter 11: References &amp; Sources of Information", body), Paragraph("30", center_reg_11)]
    ]

    toc_tbl = Table(toc_data, colWidths=[50 * pt, 400 * pt, 55 * pt])
    toc_tbl.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1.2 * pt, colors.HexColor("#000000")),
        ('INNERGRID', (0,0), (-1,-1), 0.8 * pt, colors.HexColor("#000000")),
        ('ALIGN', (0,0), (0,-1), 'CENTER'),
        ('ALIGN', (2,0), (2,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5 * pt),
        ('LEFTPADDING', (1,0), (1,-1), 10 * pt),
    ]))
    story.append(toc_tbl)

    # ==========================================
    # PAGE 3: ABSTRACT
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("<u>ABSTRACT</u>", chapter_h1))
    story.append(Spacer(1, 10 * pt))
    story.append(Paragraph(
        "Industrial training is a fundamental component of the diploma curriculum in Computer Engineering, bridging academic concepts with industrial practices and modern technological ecosystems. I completed my intensive twelve-week industrial training at <b>Elite Forums</b>, Vasai (East), from <b>25 May 2026 to 15 August 2026</b>, receiving rigorous hands-on exposure to Modern Web Development, Python Programming, Cloud Backend Systems, and Generative Artificial Intelligence.",
        body
    ))
    story.append(Paragraph(
        "As part of the major technical implementation, I developed <b>PROFORGE — End-to-End Career Intelligence &amp; Branding Suite</b>. The platform addresses critical pain points in modern professional recruitment by integrating six dedicated AI-powered sub-suites: <b>Remo AI</b> (an intelligent resume builder featuring sub-second AI bullet refinement, responsive theme synchronizers, and a strict A4 coordinate-based PDFKit rendering engine), <b>Folio AI</b> (a dynamic portfolio publisher supporting Bento Grid, Cyber Terminal, Modern Executive, and Clean Glassmorphism templates with client-side ZIP packaging via JSZip), <b>Talo AI</b> (an ATS alignment auditor comparing candidate profiles with target job descriptions), <b>Covo AI</b> (a recruiter outreach studio generating personalized cold emails and custom PDF cover letters), <b>Liko AI</b> (a career social media architect), and <b>Mali AI</b> (an automated campaign scheduler and rich-text HTML email studio).",
        body
    ))
    story.append(Paragraph(
        "The system incorporates a robust technology stack comprising React 18, Vite, Tailwind CSS, Node.js, Express REST pipelines, Groq SDK LPU inference (Qwen &amp; Llama 3 models), Supabase PostgreSQL database schemas with JSONB structures, Zoho SMTP mail dispatchers, and active security audit mechanisms tracking IP and User-Agent signatures. The application ensures 100% strict A4 physical page boundary compliance, eliminating PDF clipping and layout collapsing across desktop and print environments.",
        body
    ))
    story.append(Paragraph(
        "This report documents the organizational hierarchy, industrial services, software equipment and specifications, development methodologies, testing strategies, cybersecurity safeguards, 12-week task execution milestones, technical challenges, and conclusions derived from the internship.",
        body
    ))

    # ==========================================
    # PAGE 4: ACKNOWLEDGEMENT
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("<u>ACKNOWLEDGEMENT</u>", chapter_h1))
    story.append(Spacer(1, 12 * pt))
    story.append(Paragraph(
        "I express my deepest gratitude to all individuals and institutions whose guidance, mentorship, and encouragement made the successful completion of this industrial internship and project possible.",
        body
    ))
    story.append(Paragraph(
        "I am particularly grateful to my college mentor, <b>Ms. Mansi Patil</b>, Department of Computer Engineering at VIVA Institute of Technology, for her academic supervision, insightful suggestions, constant encouragement, and continuous support throughout the duration of this industrial training program.",
        body
    ))
    story.append(Paragraph(
        "I extend my sincere thanks to <b>Prof. Harsh Tambade</b>, Founder and CEO of Elite Forums, for granting me the opportunity to undergo this industrial training at the Vasai (East) center. His expertise in Generative AI, cloud system architectures, and full-stack software development provided crucial direction during the architecture of ProForge AI.",
        body
    ))
    story.append(Paragraph(
        "I also thank the esteemed <b>Head of Department</b> and the dedicated faculty members of the Department of Computer Engineering, VIVA Institute of Technology, Virar (East), for providing state-of-the-art academic infrastructure and fostering an environment of technical excellence.",
        body
    ))
    story.append(Paragraph(
        "Lastly, I thank the entire engineering and instructional team at <b>Elite Forums</b> for their collaborative learning culture, practical workshops, and comprehensive feedback that substantially enriched my professional capabilities.",
        body
    ))
    story.append(Spacer(1, 50 * pt))
    sig_data = [
        [Paragraph("<b>Dhruv R. Dubey</b><br/>Enrollment No: 25112400240 – TYCO - B<br/>Department of Computer Engineering<br/>VIVA Institute of Technology, Virar (E)", ParagraphStyle('RightSig', fontName='ProFont', fontSize=10, leading=14, alignment=TA_RIGHT))]
    ]
    sig_tbl = Table(sig_data, colWidths=[500 * pt])
    sig_tbl.setStyle(TableStyle([('ALIGN', (0,0), (-1,-1), 'RIGHT')]))
    story.append(sig_tbl)

    # ==========================================
    # PAGE 5: CHAPTER 1 - ORG STRUCTURE
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 1", chapter_h1))
    story.append(Paragraph("ORGANIZATION STRUCTURE OF INDUSTRY AND GENERAL LAYOUT", chapter_h2))
    
    org_cell_header = ParagraphStyle('OrgHdr', fontName='ProFont-Bold', fontSize=9.5, leading=12, alignment=TA_CENTER, textColor=colors.white)
    org_cell_body = ParagraphStyle('OrgBody', fontName='ProFont', fontSize=8.5, leading=11.5, alignment=TA_CENTER, textColor=colors.black)

    org_data = [
        [Paragraph("<b>Elite Forums</b>", org_cell_header), ""],
        [Paragraph("<b>Founder &amp; CEO</b><br/>Harsh Tambade", org_cell_header), ""],
        [Paragraph("<b>General Manager</b><br/>Jeet Gharat", org_cell_header), Paragraph("<b>COO</b><br/>Siddhant Mandlik", org_cell_header)],
        [Paragraph("<b>Project Manager</b><br/>Suchita Nigam", org_cell_header), ""],
        [Paragraph("<b>Developers Team</b>", org_cell_header), Paragraph("<b>Instructors Team</b>", org_cell_header)],
        [Paragraph("Anshu Jaiswal<br/>Adarsh Pandey<br/>Mithilesh Vichare<br/>Yuvraj Singh", org_cell_body),
         Paragraph("Shreya Mishra<br/>Prathamesh Jakkula<br/>Nandini Singh<br/>Shreya Mulik<br/>Shashank Singh", org_cell_body)]
    ]
    org_tbl = Table(org_data, colWidths=[190 * pt, 190 * pt])
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
    story.append(Spacer(1, 8 * pt))
    story.append(Paragraph(
        "<b>Elite Forums</b> operates as an agile IT consulting and advanced technical education firm based in Vasai (East), Maharashtra. The organization is steered by its Founder and CEO, <b>Harsh Tambade</b>, whose strategic vision anchors the company's innovation in Generative AI, cloud technologies, and full-stack software delivery.",
        body
    ))
    story.append(Paragraph(
        "The executive leadership comprises <b>Jeet Gharat</b> (General Manager) and <b>Siddhant Mandlik</b> (Chief Operating Officer), who oversee operational excellence and industry collaborations. Project execution is spearheaded by <b>Suchita Nigam</b> (Project Manager), coordinating between the core <b>Developers Team</b> (responsible for client architecture and internal SaaS tools) and the <b>Instructors Team</b> (delivering hands-on training in Python, React, and Machine Learning). This clear division ensures optimal agility, rapid prototyping, and close mentorship.",
        body
    ))

    # ==========================================
    # PAGE 6: CHAPTER 2 - INTRO TO INDUSTRY (PART 1)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 2", chapter_h1))
    story.append(Paragraph("INTRODUCTION TO INDUSTRY (HISTORY, SERVICES &amp; WORKFORCE)", chapter_h2))
    
    elite_badge_data = [
        [Paragraph("<font size=14 color='white'><b>ELITE FORUMS</b></font><br/><font size=7.5 color='#d1d5db'><b>UNLOCKING YOUR IT POTENTIAL &bull; VASAI (E), MAHARASHTRA</b></font>", center_bold_12)]
    ]
    elite_tbl = Table(elite_badge_data, colWidths=[280 * pt])
    elite_tbl.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#000000")),
        ('TOPPADDING', (0,0), (-1,-1), 6 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6 * pt),
    ]))
    story.append(elite_tbl)
    story.append(Spacer(1, 8 * pt))

    story.append(Paragraph("Corporate Profile &amp; History", subhead))
    story.append(Paragraph(
        "Elite Forums was established in <b>2023</b> in Mumbai/Vasai, Maharashtra, with the goal of closing the gap between academic IT education and rapid industry transformations. In a short period, it has established itself as an innovative hub for software engineering, web application consulting, and modern AI training.",
        body
    ))
    story.append(Paragraph(
        "Operating with a dedicated team of <b>11 to 50 professionals</b>, Elite Forums maintains a lean, highly adaptable structure. This workforce size allows for rapid decision-making, direct mentorship ratios, and customized software development cycles for startups and corporate clients alike.",
        body
    ))
    story.append(Paragraph("Primary Business Verticals", subhead))
    story.append(Paragraph("1. Technical Training &amp; Upskilling Programs", subhead))
    story.append(Paragraph("• Immersive curricula in <b>Generative AI, Python Programming, React 18, Cloud Databases, and Cybersecurity</b>.", bullet))
    story.append(Paragraph("• Practical workshops focusing on real-world toolchains including <b>Git, GitHub, Supabase, Groq SDK, and Vite</b>.", bullet))
    story.append(Paragraph("• Weekly milestone evaluations including MCQs, coding sprints, and project pitch decks.", bullet))
    story.append(Paragraph("2. IT Consulting &amp; Advisory", subhead))
    story.append(Paragraph("• Technical feasibility analysis and cloud architecture design for small-to-medium enterprises.", bullet))
    story.append(Paragraph("• Modernization of legacy systems into reactive single-page applications (SPAs) with decoupled APIs.", bullet))

    # ==========================================
    # PAGE 7: CHAPTER 2 - INTRO TO INDUSTRY (PART 2)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 2 (CONTINUED)", chapter_h1))
    story.append(Paragraph("CUSTOMIZED IT SOLUTIONS &amp; GENERATIVE AI STRATEGY", chapter_h2))
    
    story.append(Paragraph("3. Customized Software Solutions", subhead))
    story.append(Paragraph("• Development of high-performance web applications with real-time state synchronization and dynamic document compilation.", bullet))
    story.append(Paragraph("• Backend API development with secure JWT session validation, OTP verification, and rate-limiting safeguards.", bullet))
    story.append(Paragraph("• Database architecture using PostgreSQL relational models, indexed JSONB columns, and role-based access control.", bullet))
    story.append(Paragraph("• Automated email dispatch engines and background task scheduling using Zoho SMTP and Node.js timers.", bullet))
    
    story.append(Spacer(1, 10 * pt))
    story.append(Paragraph("Strategic Focus on Generative AI &amp; Intelligent Automation", subhead))
    story.append(Paragraph(
        "Elite Forums places strong strategic emphasis on integrating <b>Large Language Models (LLMs)</b> and <b>Generative AI</b> into functional software products. Rather than treating artificial intelligence as a purely academic exercise, the company emphasizes practical applications—such as automated resume synthesis, ATS semantic matching, dynamic cover letter generation, and contextual email drafting.",
        body
    ))
    story.append(Paragraph(
        "During the training, we explored how high-throughput LPU inference engines (such as Groq's Qwen and Llama 3 models) achieve sub-second response times, making generative AI feasible for real-time user experiences. This applied methodology served as the direct catalyst for developing <b>ProForge AI</b>.",
        body
    ))
    story.append(Paragraph(
        "The company's ethos of continuous learning, rigorous testing, and clean software architecture provided the technical foundation for building high-reliability web services.",
        body
    ))

    # ==========================================
    # PAGE 8: CHAPTER 3 - SOFTWARE TOOLS & SPECIFICATIONS
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 3", chapter_h1))
    story.append(Paragraph("TYPES OF MAJOR EQUIPMENT, HARDWARE &amp; SOFTWARE TOOLS USED", chapter_h2))
    
    story.append(Paragraph(
        "Developing an enterprise-grade web suite requires a carefully selected stack of development tools, runtime environments, and cloud infrastructure. The tools utilized during the internship provided comprehensive exposure to full-stack engineering:",
        body
    ))
    story.append(Paragraph("• <b>Frontend Development:</b> React 18 (Component Architecture), Vite (Build Tool &amp; HMR), Tailwind CSS v3 (Utility Styling), PostCSS, Lucide React (Vector Iconography).", bullet))
    story.append(Paragraph("• <b>Backend Framework:</b> Node.js (V8 Engine Runtime), Express.js (REST API Routing Pipeline), CORS, Dotenv.", bullet))
    story.append(Paragraph("• <b>Database &amp; Authentication:</b> Supabase (Cloud PostgreSQL with JSONB schema), Supabase Auth (JWT verification), Zoho SMTP 6-digit OTP verification.", bullet))
    story.append(Paragraph("• <b>Generative AI Engine:</b> Groq SDK (LPU-accelerated Qwen 2.5 &amp; Llama 3 models for sub-second text analysis and structured JSON synthesis).", bullet))
    story.append(Paragraph("• <b>Document Compilation &amp; Archiving:</b> PDFKit (Server-side vector PDF generation with dynamic A4 coordinate calculations), JSZip (Client-side ZIP packaging).", bullet))
    story.append(Paragraph("• <b>Email Dispatch:</b> Nodemailer with Zoho SMTP transporter, background queue scheduler (<code>emailScheduler.js</code>).", bullet))
    story.append(Paragraph("• <b>Auditing &amp; Monitoring:</b> Custom security tracker (<code>loginHistory.js</code>) logging IP addresses and User-Agent signatures.", bullet))
    story.append(Paragraph("• <b>Developer Tools:</b> Visual Studio Code, Git, GitHub, Postman (API Testing), Chrome DevTools (Performance Profiling).", bullet))

    # ==========================================
    # PAGE 9: CHAPTER 3 - SPECIFICATION TABLE
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 3 (CONTINUED)", chapter_h1))
    story.append(Paragraph("DETAILED SPECIFICATIONS &amp; MAINTENANCE SCHEDULE", chapter_h2))
    
    table_heading_style = ParagraphStyle('TblHdr', fontName='ProFont-Bold', fontSize=8, leading=10, alignment=TA_CENTER, textColor=colors.black)
    table_cell_style = ParagraphStyle('TblCell', fontName='ProFont', fontSize=7.5, leading=9.5, alignment=TA_LEFT, textColor=colors.black)
    table_center_style = ParagraphStyle('TblCenter', fontName='ProFont', fontSize=7.5, leading=9.5, alignment=TA_CENTER, textColor=colors.black)

    tools_grid = [
        [Paragraph("<b>Tool / Technology</b>", table_heading_style),
         Paragraph("<b>Specification</b>", table_heading_style),
         Paragraph("<b>Approx. Cost</b>", table_heading_style),
         Paragraph("<b>Specific Use</b>", table_heading_style),
         Paragraph("<b>Routine Maintenance</b>", table_heading_style)],

        [Paragraph("<b>Workstation</b>", table_cell_style),
         Paragraph("Intel Core i5/i7, 16GB RAM, 512GB NVMe SSD", table_cell_style),
         Paragraph("₹50,000 – ₹65,000", table_center_style),
         Paragraph("Primary development, local server runtime, AI debugging", table_cell_style),
         Paragraph("OS security updates, cache purging, disk health checks", table_cell_style)],

        [Paragraph("<b>React 18 &amp; Vite</b>", table_cell_style),
         Paragraph("SPA framework with lightning-fast HMR", table_cell_style),
         Paragraph("Free (Open Source)", table_center_style),
         Paragraph("Frontend UI dashboards, theme switcher, responsive canvas", table_cell_style),
         Paragraph("npm dependency updates, tree-shaking dead code", table_cell_style)],

        [Paragraph("<b>Node.js &amp; Express</b>", table_cell_style),
         Paragraph("V8 Event-driven non-blocking I/O runtime", table_cell_style),
         Paragraph("Free (Open Source)", table_center_style),
         Paragraph("REST API controllers, token validation, PDF streaming", table_cell_style),
         Paragraph("Monitoring async loops, handling unhandled rejections", table_cell_style)],

        [Paragraph("<b>Groq SDK (AI)</b>", table_cell_style),
         Paragraph("LPU hardware acceleration, Qwen/Llama 3 models", table_cell_style),
         Paragraph("Pay-as-you-go / Free tier", table_center_style),
         Paragraph("Resume parsing, ATS scoring, tone/slider refinement", table_cell_style),
         Paragraph("Multi-model fallback cascade, rate-limit retries", table_cell_style)],

        [Paragraph("<b>Supabase (DB)</b>", table_cell_style),
         Paragraph("PostgreSQL engine with JSONB column support", table_cell_style),
         Paragraph("Free Tier / Pro", table_center_style),
         Paragraph("User profile persistence, OTP tracking, authentication", table_cell_style),
         Paragraph("Automated daily snapshots, index optimization", table_cell_style)],

        [Paragraph("<b>PDFKit Engine</b>", table_cell_style),
         Paragraph("Vector document compiler with absolute coordinates", table_cell_style),
         Paragraph("Free (Open Source)", table_center_style),
         Paragraph("Generating strict A4 print-ready resumes &amp; cover letters", table_cell_style),
         Paragraph("Dynamic coordinate recalculation, margin bounds auditing", table_cell_style)]
    ]

    tools_tbl_obj = Table(tools_grid, colWidths=[80 * pt, 105 * pt, 75 * pt, 120 * pt, 120 * pt])
    tools_tbl_obj.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1.2 * pt, colors.HexColor("#000000")),
        ('INNERGRID', (0,0), (-1,-1), 0.6 * pt, colors.HexColor("#000000")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f3f4f6")),
        ('TOPPADDING', (0,0), (-1,-1), 4 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4 * pt),
        ('LEFTPADDING', (0,0), (-1,-1), 4 * pt),
        ('RIGHTPADDING', (0,0), (-1,-1), 4 * pt),
    ]))
    story.append(tools_tbl_obj)

    # ==========================================
    # PAGE 10: CHAPTER 3 - ASYNCHRONOUS ARCHITECTURE
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 3 (CONTINUED)", chapter_h1))
    story.append(Paragraph("ASYNCHRONOUS PATTERNS &amp; RESILIENT AI PIPELINES", chapter_h2))
    
    story.append(Paragraph("Event-Driven Architecture &amp; Asynchronous JavaScript", subhead))
    story.append(Paragraph(
        "A critical aspect of ProForge's backend design is its use of asynchronous JavaScript (<code>async/await</code> and Promises). Because operations like AI inference, database queries, and PDF compilation involve network latency, blocking the Node.js single thread would freeze the entire server.",
        body
    ))
    story.append(Paragraph(
        "By structuring all API endpoints with asynchronous error handlers and Promise-based cascades, the server handles multiple concurrent user requests smoothly without latency bottlenecks.",
        body
    ))
    story.append(Paragraph("Multi-Model AI Fallback Mechanism", subhead))
    story.append(Paragraph(
        "To guarantee 99.9% uptime for AI features, we designed a multi-model fallback cascade inside <code>groqClient.js</code>. If a model encounters a rate limit (HTTP 429) or transient outage, the request automatically falls back to secondary models before falling back to a deterministic rule-based extractor:",
        body
    ))
    
    code_snippet = """// Sequential Model Fallback Cascade inside backend/groqClient.js
const FALLBACK_MODELS = ['qwen/qwen3.8-27b', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b'];
async function callGroqWithFallback(client, payload) {
  for (const model of FALLBACK_MODELS) {
    try {
      return await client.chat.completions.create({ ...payload, model });
    } catch (err) {
      console.warn(`Model ${model} throttled, cascading to next model...`);
    }
  }
  return generateDeterministicFallbackProfile(payload);
}"""
    code_tbl = Table([[Paragraph(code_snippet.replace('\n', '<br/>').replace(' ', '&nbsp;'), code_box_style)]], colWidths=[480 * pt])
    code_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 0.8 * pt, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 6 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6 * pt),
        ('LEFTPADDING', (0,0), (-1,-1), 8 * pt),
    ]))
    story.append(code_tbl)

    # ==========================================
    # PAGE 11: CHAPTER 4 - METHODOLOGIES & AGILE SPRINTS
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 4", chapter_h1))
    story.append(Paragraph("PROCESSES, METHODOLOGIES &amp; MATERIAL HANDLING PROCEDURES", chapter_h2))
    
    story.append(Paragraph("Software Development Life Cycle (SDLC) at Elite Forums", subhead))
    story.append(Paragraph(
        "In the IT services and software engineering sector, the concept of 'manufacturing' translates directly to the <b>iterative development, testing, and deployment of software products</b>. Elite Forums follows a disciplined <b>Agile-Scrum methodology</b>, breaking complex platform requirements into manageable two-week sprint cycles.",
        body
    ))
    story.append(Paragraph("Agile Methodology in Practice", subhead))
    story.append(Paragraph("• <b>Sprint Planning:</b> Every two weeks, feature backlogs were prioritized, defining sprint goals such as building the resume editor or integrating Zoho SMTP.", bullet))
    story.append(Paragraph("• <b>Daily Standups:</b> Quick synchronization meetings to discuss progress, identify technical blockers, and align interface contracts.", bullet))
    story.append(Paragraph("• <b>Continuous Code Reviews:</b> Pull requests on GitHub were reviewed to enforce clean code standards, component modularity, and security practices.", bullet))
    story.append(Paragraph("• <b>Sprint Demos:</b> Demonstrating functioning prototypes at the end of each milestone to gather feedback and refine UX.", bullet))
    story.append(Paragraph("Digital Asset Management Procedures", subhead))
    story.append(Paragraph("Unlike traditional manufacturing, IT engineering handles digital assets:", body))
    story.append(Paragraph("• <b>Source Code:</b> Version-controlled through GitHub using semantic branch naming (e.g., <code>feat/pdf-pagination</code>, <code>fix/auth-otp</code>).", bullet))
    story.append(Paragraph("• <b>API Schemas:</b> Standardized JSON payloads shared between frontend React components and backend Express controllers.", bullet))

    # ==========================================
    # PAGE 12: CHAPTER 4 - COMPONENT ARCHITECTURE
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 4 (CONTINUED)", chapter_h1))
    story.append(Paragraph("COMPONENT MODULARITY &amp; DESIGN SYSTEM GOVERNANCE", chapter_h2))
    
    story.append(Paragraph("Modular Frontend Component Hierarchy", subhead))
    story.append(Paragraph(
        "A major focus of the technical training was establishing a scalable, reusable component architecture. Rather than writing monolithic page views, UI elements were decoupled into standalone, single-responsibility components:",
        body
    ))
    story.append(Paragraph("• <code>Navbar.jsx</code> &amp; <code>ThemeToggle.jsx</code>: Global navigation bar with synchronized theme and font pickers.", bullet))
    story.append(Paragraph("• <code>TextBox.jsx</code>: Multi-line candidate bio input with pre-filled sample prompt buttons.", bullet))
    story.append(Paragraph("• <code>OTPInput.jsx</code>: 6-digit verification box with auto-focus shifting and clipboard paste support.", bullet))
    story.append(Paragraph("• <code>AmbientBackground.jsx</code>: Dynamic background canvas supporting smooth particle aesthetics across themes.", bullet))
    story.append(Paragraph("• <code>PasswordStrength.jsx</code>: Real-time entropy evaluator validating password complexity.", bullet))

    story.append(Spacer(1, 8 * pt))
    story.append(Paragraph("Design Tokens &amp; Multi-Theme Synchronization", subhead))
    story.append(Paragraph(
        "To support 10 distinct visual schemes (including Cyberpunk Neon, Clean Teal, Midnight Cosmic, and Emerald Premium), ProForge uses centralized CSS custom properties (variables) defined in <code>index.css</code>. Theme switching dynamically updates CSS variables at the root DOM level, automatically applying color changes across all components with smooth cubic-bezier transitions.",
        body
    ))

    # ==========================================
    # PAGE 13: CHAPTER 4 - DATA FLOW & STATE MANAGEMENT
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 4 (CONTINUED)", chapter_h1))
    story.append(Paragraph("FULL-STACK DATA FLOW &amp; SUPABASE INTEGRATION", chapter_h2))
    
    story.append(Paragraph("Data Flow Architecture", subhead))
    story.append(Paragraph(
        "ProForge follows a unidirectional data flow pattern, ensuring predictable state transitions and clean separation between presentation, business logic, and database persistence:",
        body
    ))
    story.append(Paragraph("1. <b>User Input Stage:</b> The candidate enters raw experience notes into <code>TextBox.jsx</code> or edits fields inside <code>Dashboard.jsx</code>.", bullet))
    story.append(Paragraph("2. <b>AI Parsing &amp; Synthesis:</b> The frontend sends a POST request to <code>/api/analyze</code>. The backend passes the prompt to Groq SDK, which returns a validated JSON profile containing structured arrays for experience, skills, education, and projects.", bullet))
    story.append(Paragraph("3. <b>Interactive Refinement:</b> The candidate adjusts sliders (grammar complexity, realism, depth). The frontend calls <code>/api/analyze/refine</code> to rewrite bullet points dynamically.", bullet))
    story.append(Paragraph("4. <b>Cloud Database Storage:</b> Active profiles are persisted into Supabase PostgreSQL tables using JSONB columns, allowing flexible schema evolution.", bullet))
    story.append(Paragraph("5. <b>Document Compilation:</b> When exporting, the frontend requests <code>/api/generate/resume</code>, where PDFKit calculates A4 coordinates and streams the compiled binary PDF back to the browser.", bullet))

    # ==========================================
    # PAGE 14: CHAPTER 5 - TESTING PROCEDURES
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 5", chapter_h1))
    story.append(Paragraph("TESTING, VALIDATION &amp; QUALITY ASSURANCE PROCEDURES", chapter_h2))
    
    story.append(Paragraph("Testing Methodologies &amp; Assessment Formats", subhead))
    story.append(Paragraph(
        "Quality assurance was an integral part of the internship program. Elite Forums conducted weekly assessments to validate conceptual understanding and code reliability. Evaluations combined automated unit tests, manual integration tests, and peer presentations:",
        body
    ))
    story.append(Paragraph("1. <b>Weekly Quizzes &amp; MCQs:</b> Timed assessments testing knowledge of JavaScript ES6 syntax, React component lifecycles, Promise chaining, and Supabase security rules.", body))
    story.append(Paragraph("2. <b>Live Coding Challenges:</b> Real-time problem-solving exercises, such as building stateful counter apps, implementing debounce handlers for search boxes, and parsing JSON payloads.", body))
    story.append(Paragraph("3. <b>API Endpoint Testing with Postman:</b> Validating REST controllers across positive and negative test cases—including missing request bodies, invalid email formats, expired JWT tokens, and rate-limited requests.", body))
    story.append(Paragraph("4. <b>Technical Presentations (PPTs):</b> Interns prepared and delivered presentations on technical topics, enhancing public speaking and client-facing communication skills.", body))

    # ==========================================
    # PAGE 15: CHAPTER 5 - PDF & ATS TESTING
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 5 (CONTINUED)", chapter_h1))
    story.append(Paragraph("PDF RENDERING &amp; ATS ALGORITHM VALIDATION", chapter_h2))
    
    story.append(Paragraph("A4 Coordinate &amp; Pagination Testing in PDFKit", subhead))
    story.append(Paragraph(
        "A critical testing challenge was verifying that the PDF rendering engine respected physical A4 boundaries (595.28 x 841.89 pt). We executed automated test suites generating resumes with varying content lengths (from single-entry junior profiles to extensive senior executive profiles):",
        body
    ))
    story.append(Paragraph("• <b>Boundary Overflow Checks:</b> Validated that sections calculate text heights dynamically (<code>doc.heightOfString()</code>) and trigger page breaks safely before reaching the bottom footer boundary.", bullet))
    story.append(Paragraph("• <b>Two-Column Synchronization:</b> Verified that the left main column and right sidebar render simultaneously on Page 1 without desynchronizing across page boundaries.", bullet))
    story.append(Paragraph("• <b>Typography &amp; Badge Clipping:</b> Tested long strings (e.g., email addresses and LinkedIn URLs) to ensure proper text wrapping without horizontal clipping.", bullet))

    story.append(Spacer(1, 8 * pt))
    story.append(Paragraph("ATS Scoring Algorithm Validation (Talo AI)", subhead))
    story.append(Paragraph(
        "Talo AI's ATS scoring engine was tested against multiple industry job descriptions (Software Engineer, Product Manager, Data Analyst). We verified that keyword extraction accurately identified matching vs missing competencies and produced actionable feedback.",
        body
    ))

    # ==========================================
    # PAGE 16: CHAPTER 5 - SECURITY & CROSS-BROWSER TESTING
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 5 (CONTINUED)", chapter_h1))
    story.append(Paragraph("CROSS-BROWSER COMPATIBILITY &amp; AUTHENTICATION AUDITING", chapter_h2))
    
    story.append(Paragraph("Cross-Browser &amp; Responsive UI Testing", subhead))
    story.append(Paragraph(
        "The frontend application was tested across modern web browsers (Google Chrome, Mozilla Firefox, Microsoft Edge, and Apple Safari) to ensure consistent rendering:",
        body
    ))
    story.append(Paragraph("• <b>DirectWrite &amp; Font Smoothing:</b> Verified that typography mappings and antialiasing rules render crisply across Windows and macOS displays.", bullet))
    story.append(Paragraph("• <b>Responsive Viewports:</b> Tested layout responsiveness across mobile (375px), tablet (768px), and desktop (1440px) screen widths.", bullet))
    story.append(Paragraph("• <b>A4 Preview Canvas Emulation:</b> Confirmed that the on-screen simulated preview (<code>.resume-a4-sheet</code>) mirrors the compiled PDF document at a 1:1 visual ratio.", bullet))

    story.append(Spacer(1, 8 * pt))
    story.append(Paragraph("Authentication &amp; Session Integrity Testing", subhead))
    story.append(Paragraph(
        "We tested the security boundary of the 6-digit OTP verification flow. Test cases confirmed that expired OTPs, brute-force attempts, and tampered JWT tokens were rejected with appropriate HTTP 401/403 status codes.",
        body
    ))

    # ==========================================
    # PAGE 17: CHAPTER 6 - SAFETY & CYBERSECURITY
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 6", chapter_h1))
    story.append(Paragraph("SAFETY PROCEDURES, DATA SECURITY &amp; ETHICAL AI GOVERNANCE", chapter_h2))
    
    story.append(Paragraph("Digital Safety &amp; Cybersecurity Protocols", subhead))
    story.append(Paragraph(
        "Although the internship was in the software services sector, Elite Forums placed strict emphasis on <b>digital safety, credential protection, and cybersecurity hygiene</b>. Interns were trained to uphold industry-standard security protocols across all coding workflows:",
        body
    ))
    story.append(Paragraph("1. <b>Credential Confidentiality:</b> Database service keys, SMTP passwords, and Groq API tokens were isolated within <code>.env</code> files and excluded from version control via <code>.gitignore</code>.", body))
    story.append(Paragraph("2. <b>Input Sanitization:</b> All user inputs across resume fields and outreach forms were sanitized to prevent Cross-Site Scripting (XSS) and SQL injection attacks.", body))
    story.append(Paragraph("3. <b>JWT Authorization Guards:</b> Sensitive endpoints were protected with <code>requireAuth</code> middleware, validating token signatures before processing requests.", body))
    story.append(Paragraph("4. <b>Intrusion Detection System:</b> Implemented <code>loginHistory.js</code> to log IP addresses and User-Agent headers, automatically triggering alerts upon detecting logins from multiple distinct devices.", body))

    # ==========================================
    # PAGE 18: CHAPTER 6 - WORKSPACE & RECOVERY
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 6 (CONTINUED)", chapter_h1))
    story.append(Paragraph("WORKSPACE SAFETY &amp; SYSTEM RECOVERY PROCEDURES", chapter_h2))
    
    story.append(Paragraph("System Backup &amp; Disaster Recovery Procedures", subhead))
    story.append(Paragraph(
        "To ensure business continuity and prevent data loss during development, systematic recovery protocols were maintained:",
        body
    ))
    story.append(Paragraph("• <b>Git Remote Redundancy:</b> All code branches were regularly pushed to GitHub with descriptive commit messages, enabling quick rollbacks if errors arose.", bullet))
    story.append(Paragraph("• <b>Database Snapshots:</b> Supabase PostgreSQL schemas and profile tables were backed up using automated cloud snapshots.", bullet))
    story.append(Paragraph("• <b>Rate-Limit Resilience:</b> Groq API calls were wrapped in try-catch cascades with exponential backoff to handle upstream service interruptions gracefully.", bullet))

    story.append(Spacer(1, 10 * pt))
    story.append(Paragraph("Physical &amp; Ergonomic Workspace Safety", subhead))
    story.append(Paragraph(
        "During offline sessions at the Vasai center, interns followed standard ergonomic and workplace guidelines:",
        body
    ))
    story.append(Paragraph("• Maintaining proper seating posture and scheduled screen breaks to prevent eye fatigue during extended coding sessions.", bullet))
    story.append(Paragraph("• Safe handling of electrical equipment and adherence to building emergency protocols and fire exit routes.", bullet))

    # ==========================================
    # PAGE 19: CHAPTER 6 - ETHICAL AI GOVERNANCE
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 6 (CONTINUED)", chapter_h1))
    story.append(Paragraph("ETHICAL AI GOVERNANCE &amp; RECRUITMENT TRANSPARENCY", chapter_h2))
    
    story.append(Paragraph("Ethical AI Principles in Career Technology", subhead))
    story.append(Paragraph(
        "A dedicated seminar at Elite Forums addressed the ethical considerations of deploying Generative AI in recruitment and career branding. ProForge was designed in accordance with core AI ethics principles:",
        body
    ))
    story.append(Paragraph("1. <b>Factual Integrity:</b> AI prompts were constrained to refine, polish, and highlight candidate achievements without inventing false job titles, companies, or credentials.", body))
    story.append(Paragraph("2. <b>Privacy &amp; Data Ownership:</b> Candidate profiles are owned by the user and never utilized for training public AI models without consent.", body))
    story.append(Paragraph("3. <b>Outreach Transparency:</b> Recruiter emails generated by Covo AI and scheduled by Mali AI adhere to anti-spam best practices, including clear sender identities and professional formatting.", body))
    story.append(Paragraph("4. <b>Fair ATS Alignment:</b> Talo AI provides transparent feedback on genuine skill gaps rather than attempting to 'game' ATS parsers with hidden keywords.", body))

    # ==========================================
    # PAGE 20: CHAPTER 7 - PRACTICAL EXPERIENCES (PART 1)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 7", chapter_h1))
    story.append(Paragraph("PARTICULAR OF PRACTICAL EXPERIENCES IN PRODUCTION &amp; DEVELOPMENT", chapter_h2))
    
    story.append(Paragraph("Full-Cycle Software Engineering Experience", subhead))
    story.append(Paragraph(
        "During the internship, I gained hands-on experience across the entire software development lifecycle, structured into four phases: <b>production, assembly, testing, and maintenance</b>:",
        body
    ))
    story.append(Paragraph("1. Production (Feature Engineering &amp; AI Integration)", subhead))
    story.append(Paragraph("• <b>Remo AI Resume Engine:</b> Developed a dynamic resume builder supporting 105+ design combinations with real-time text synchronization and server-side PDFKit rendering.", bullet))
    story.append(Paragraph("• <b>Folio AI Portfolio Publisher:</b> Created four responsive templates (Bento Grid, Cyber Terminal, Modern Executive, Clean Glassmorphism) with client-side ZIP packaging via JSZip.", bullet))
    story.append(Paragraph("• <b>Talo AI ATS Matcher:</b> Built comparison algorithms parsing job descriptions against candidate profiles to compute percentage scores and keyword recommendations.", bullet))
    story.append(Paragraph("• <b>Covo AI Outreach Studio:</b> Engineered cold email and cover letter generators producing tailored PDF cover letters.", bullet))
    story.append(Paragraph("• <b>Liko AI Social Architect:</b> Created a personal branding tool converting career milestones into engaging LinkedIn posts.", bullet))
    story.append(Paragraph("• <b>Mali AI Campaign Studio:</b> Built a rich-text HTML email composer with Google font options, theme palettes, and background queue scheduling.", bullet))

    # ==========================================
    # PAGE 21: CHAPTER 7 - PRACTICAL EXPERIENCES (PART 2)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 7 (CONTINUED)", chapter_h1))
    story.append(Paragraph("PRACTICAL EXPERIENCES IN SYSTEM ASSEMBLY &amp; INTEGRATION", chapter_h2))
    
    story.append(Paragraph("2. Assembly (System Integration &amp; Middleware)", subhead))
    story.append(Paragraph(
        "The assembly phase focused on integrating frontend views, backend APIs, cloud databases, and AI services into a cohesive, secure platform:",
        body
    ))
    story.append(Paragraph("• <b>API Routing Architecture:</b> Designed modular Express routers (<code>analyzeRoutes.js</code>, <code>profileRoutes.js</code>, <code>generateRoutes.js</code>, <code>authRoutes.js</code>, <code>maliRoutes.js</code>).", bullet))
    story.append(Paragraph("• <b>Database Integration:</b> Connected Supabase PostgreSQL tables using JSONB columns, allowing candidate profiles to store complex nested arrays for experience, education, projects, and certifications.", bullet))
    story.append(Paragraph("• <b>Transactional Email Service:</b> Integrated Nodemailer with Zoho SMTP for reliable 6-digit OTP verification and outreach campaign dispatch.", bullet))
    story.append(Paragraph("• <b>Client-Side Archiving:</b> Integrated JSZip to package standalone portfolio websites with zero external dependencies.", bullet))

    # ==========================================
    # PAGE 22: CHAPTER 7 - PRACTICAL EXPERIENCES (PART 3)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 7 (CONTINUED)", chapter_h1))
    story.append(Paragraph("MAINTENANCE, OPTIMIZATION &amp; DEPLOYMENT READINESS", chapter_h2))
    
    story.append(Paragraph("3. Maintenance &amp; Performance Optimization", subhead))
    story.append(Paragraph(
        "The final operational phase focused on system stability, latency reduction, and routine maintenance:",
        body
    ))
    story.append(Paragraph("• <b>Dependency Auditing:</b> Regularly updated npm packages and resolved peer dependency conflicts.", bullet))
    story.append(Paragraph("• <b>Background Queue Scheduler:</b> Maintained <code>emailScheduler.js</code>, ensuring scheduled email campaigns trigger at specified dates and times without blocking the event loop.", bullet))
    story.append(Paragraph("• <b>Security Audit Monitoring:</b> Audited login attempts using <code>loginHistory.js</code>, verifying multi-device detection alerts.", bullet))
    story.append(Paragraph("• <b>PDF Performance Profiling:</b> Optimized PDFKit rendering pipelines to stream buffers efficiently, reducing memory footprint during peak loads.", bullet))

    # ==========================================
    # PAGE 23: CHAPTER 8 - 12-WEEK ROADMAP (WEEKS 1-4)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 8", chapter_h1))
    story.append(Paragraph("DETAILED REPORT OF TASKS UNDERTAKEN (WEEKS 1 TO 4)", chapter_h2))
    
    story.append(Paragraph("Week 1: Web Foundations, Modern JavaScript &amp; Git Toolchains", subhead))
    story.append(Paragraph(
        "The internship commenced with an intensive review of modern frontend standards, semantic HTML5, CSS box models, and ES6+ JavaScript. We configured development environments in Visual Studio Code, mastered Git command-line workflows (branching, commits, rebasing), and established GitHub repositories for collaborative development.",
        body
    ))
    story.append(Paragraph("Week 2: React 18 Architecture, State Hooks &amp; Vite Tooling", subhead))
    story.append(Paragraph(
        "Week two focused on building responsive user interfaces with React 18 and Vite. We explored component lifecycles, state management with <code>useState</code> and <code>useEffect</code>, custom hooks, and Tailwind CSS utility styling.",
        body
    ))
    story.append(Paragraph("Week 3: Backend REST APIs with Node.js &amp; Express", subhead))
    story.append(Paragraph(
        "We engineered backend services using Node.js and Express. Topics included middleware design, CORS configuration, JSON body parsing, and RESTful routing patterns.",
        body
    ))
    story.append(Paragraph("Week 4: Supabase Database Integration &amp; OTP Authentication", subhead))
    story.append(Paragraph(
        "In week four, we integrated Supabase PostgreSQL for cloud database storage and implemented a passwordless authentication flow using Zoho SMTP 6-digit OTP verification.",
        body
    ))

    # ==========================================
    # PAGE 24: CHAPTER 8 - 12-WEEK ROADMAP (WEEKS 5-8)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 8 (CONTINUED)", chapter_h1))
    story.append(Paragraph("DETAILED REPORT OF TASKS UNDERTAKEN (WEEKS 5 TO 8)", chapter_h2))
    
    story.append(Paragraph("Weeks 5–6: Remo AI Resume Builder &amp; PDFKit Vector Engine", subhead))
    story.append(Paragraph(
        "Weeks five and six marked the development of <b>Remo AI</b>. We built an interactive resume editor and engineered a backend rendering pipeline in <b>PDFKit</b> that maps content onto A4 dimensions with dynamic height calculations. We integrated Groq SDK (Qwen 2.5 &amp; Llama 3) for real-time bullet point refinement and ATS optimization.",
        body
    ))
    story.append(Paragraph("Week 7: Folio AI Web Portfolio Publisher", subhead))
    story.append(Paragraph(
        "Week seven focused on developing <b>Folio AI</b>, building four distinct portfolio designs (Bento Grid, Cyber Terminal, Modern Executive, Clean Glassmorphism). We integrated <b>JSZip</b> for zero-dependency client ZIP downloads containing standalone HTML, CSS, and JS.",
        body
    ))
    story.append(Paragraph("Week 8: Talo AI ATS Alignment Auditor", subhead))
    story.append(Paragraph(
        "In week eight, we developed <b>Talo AI</b>, an ATS comparison engine that evaluates candidate profiles against job descriptions to calculate match scores, detect missing keywords, and suggest targeted bullet rewrites.",
        body
    ))

    # ==========================================
    # PAGE 25: CHAPTER 8 - 12-WEEK ROADMAP (WEEKS 9-11)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 8 (CONTINUED)", chapter_h1))
    story.append(Paragraph("DETAILED REPORT OF TASKS UNDERTAKEN (WEEKS 9 TO 11)", chapter_h2))
    
    story.append(Paragraph("Week 9: Covo AI Outreach Studio &amp; Cover Letter Generator", subhead))
    story.append(Paragraph(
        "During week nine, we developed <b>Covo AI</b>, generating personalized recruiter cold emails, LinkedIn pitches, and dynamic PDF cover letters formatted with professional headers and sign-offs.",
        body
    ))
    story.append(Paragraph("Week 10: Liko AI Social Media &amp; LinkedIn Architect", subhead))
    story.append(Paragraph(
        "Week ten focused on <b>Liko AI</b>, creating a personal branding tool that transforms career milestones into high-engagement LinkedIn posts with customizable hooks, hashtags, and optimized bios.",
        body
    ))
    story.append(Paragraph("Week 11: Mali AI Campaign Studio &amp; Queue Scheduler", subhead))
    story.append(Paragraph(
        "In week eleven, we developed <b>Mali AI</b>, building a visual HTML email composer with 12 Google fonts, 7 theme palettes, dual time pickers (calendar and clock), and an automated background queue scheduler (<code>emailScheduler.js</code>).",
        body
    ))

    # ==========================================
    # PAGE 26: CHAPTER 8 - 12-WEEK ROADMAP (WEEK 12 & SYNTHESIS)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 8 (CONTINUED)", chapter_h1))
    story.append(Paragraph("WEEK 12 MILESTONES &amp; FINAL EVALUATION", chapter_h2))
    
    story.append(Paragraph("Week 12: Security Auditing, Multi-Theme System &amp; Final Evaluation", subhead))
    story.append(Paragraph(
        "The final week focused on cybersecurity hardening, multi-theme visual polish, and technical evaluation. We integrated an active security monitoring system (<code>loginHistory.js</code>) logging IP addresses and User-Agent signatures, issuing multi-device login alerts.",
        body
    ))
    story.append(Paragraph(
        "We also implemented a 10-theme visual design system with cubic-bezier transitions, performed end-to-end regression testing, and presented ProForge AI during the final evaluation at Elite Forums.",
        body
    ))
    story.append(Spacer(1, 10 * pt))
    story.append(Paragraph("Summary of Key Technical Deliverables", subhead))
    story.append(Paragraph("• <b>Remo AI:</b> Resume Studio with 105+ layout options and strict A4 PDF compilation.", bullet))
    story.append(Paragraph("• <b>Folio AI:</b> 4 responsive portfolio templates with zero-dependency ZIP export.", bullet))
    story.append(Paragraph("• <b>Talo AI:</b> ATS alignment engine with keyword gap analysis.", bullet))
    story.append(Paragraph("• <b>Covo AI:</b> Cold outreach studio &amp; dynamic cover letter generator.", bullet))
    story.append(Paragraph("• <b>Liko AI:</b> LinkedIn post generator &amp; bio optimizer.", bullet))
    story.append(Paragraph("• <b>Mali AI:</b> Email campaign composer with background scheduling queue.", bullet))

    # ==========================================
    # PAGE 27: CHAPTER 9 - CHALLENGES & SOLUTIONS (PART 1)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 9", chapter_h1))
    story.append(Paragraph("SPECIAL &amp; CHALLENGING EXPERIENCES ENCOUNTERED DURING TRAINING", chapter_h2))
    
    story.append(Paragraph("Overview of Technical Challenges", subhead))
    story.append(Paragraph(
        "The internship presented several technical challenges that tested our analytical thinking, debugging methodology, and adaptability. Overcoming these hurdles provided the most valuable learning experiences of the program.",
        body
    ))
    story.append(Paragraph("1. Dynamic Coordinate Math &amp; A4 Pagination in PDFKit", subhead))
    story.append(Paragraph(
        "Unlike web browsers where CSS reflows elements automatically, PDFKit requires explicit (X, Y) coordinate positioning on a fixed A4 canvas. When rendering variable amounts of resume data, text elements initially overflowed past page boundaries or split awkwardly across page breaks.",
        body
    ))
    story.append(Paragraph(
        "<b>Solution:</b> We formulated a pre-render calculation function utilizing <code>doc.heightOfString()</code> to measure item block heights before rendering. If an item would exceed the safe bottom boundary (795 pt), the engine automatically starts a new page and renders consistent section headers.",
        body
    ))
    story.append(Paragraph("2. Schema Enforcement from Non-Deterministic LLM Outputs", subhead))
    story.append(Paragraph(
        "Early in the Groq SDK integration, AI models occasionally returned conversational text or markdown code fences instead of pure JSON, causing JSON parsing errors on the backend.",
        body
    ))
    story.append(Paragraph(
        "<b>Solution:</b> We implemented structured system prompting with strict JSON schemas, enforced <code>response_format: { type: 'json_object' }</code>, and created a sanitization helper that strips markdown fences and extracts valid JSON objects.",
        body
    ))

    # ==========================================
    # PAGE 28: CHAPTER 9 - CHALLENGES & SOLUTIONS (PART 2)
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 9 (CONTINUED)", chapter_h1))
    story.append(Paragraph("WORKPLACE REFLECTIONS, TIME MANAGEMENT &amp; LEARNINGS", chapter_h2))
    
    story.append(Paragraph("3. Asynchronous Background Scheduling for Email Campaigns", subhead))
    story.append(Paragraph(
        "Building Mali AI's campaign scheduler required executing background tasks without blocking the Express event loop or relying on heavy external queue infrastructure.",
        body
    ))
    story.append(Paragraph(
        "<b>Solution:</b> We built an internal queue worker (<code>emailScheduler.js</code>) utilizing state transitions ('pending', 'processing', 'sent', 'failed') that runs at periodic intervals, ensuring reliable email dispatches.",
        body
    ))
    story.append(Paragraph("4. Time Management in Collaborative Sprints", subhead))
    story.append(Paragraph(
        "Coordinating full-stack feature development within tight two-week deadlines required balancing UI design, backend logic, and testing simultaneously.",
        body
    ))
    story.append(Paragraph(
        "<b>Solution:</b> Using GitHub Projects and modular feature branching allowed tasks to proceed independently, preventing merge conflicts and improving team velocity.",
        body
    ))
    story.append(Spacer(1, 8 * pt))
    story.append(Paragraph("Workplace Reflections", subhead))
    story.append(Paragraph(
        "The collaborative and fast-paced environment at Elite Forums encouraged continuous experimentation, analytical problem-solving, and adaptability—skills that will be invaluable in my career as a software engineer.",
        body
    ))

    # ==========================================
    # PAGE 29: CHAPTER 10 - CONCLUSION
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 10", chapter_h1))
    story.append(Paragraph("CONCLUSION &amp; FUTURE SCOPE", chapter_h2))
    
    story.append(Paragraph(
        "My twelve-week industrial training at <b>Elite Forums</b> has been a transformative experience, bridging theoretical computer engineering principles with professional software development practices. Working on <b>ProForge AI</b> provided comprehensive exposure to full-stack engineering, generative AI orchestration, dynamic PDF compilation, database administration, and cybersecurity auditing.",
        body
    ))
    story.append(Paragraph(
        "The structured curriculum, weekly coding assessments, and regular mentorship strengthened my core competencies in React 18, Node.js, Express, Groq SDK, Supabase, and PDFKit. Overcoming complex technical hurdles—such as dynamic A4 coordinate calculations and non-blocking background queue scheduling—fostered resilience and structured problem-solving skills.",
        body
    ))
    story.append(Paragraph("Future Enhancements for ProForge AI", subhead))
    story.append(Paragraph("• <b>Multi-Language AI Translation:</b> Extending resume synthesis and outreach generation across global languages.", bullet))
    story.append(Paragraph("• <b>Automated Video Portfolio Generator:</b> Generating short interactive video portfolio reels from candidate profile milestones.", bullet))
    story.append(Paragraph("• <b>AI-Powered Mock Interview Simulator:</b> Interactive voice and text-based interview practice tailored to target job descriptions.", bullet))
    story.append(Paragraph("• <b>Enterprise Team Portals:</b> Multi-user dashboards for university placement cells and recruitment agencies.", bullet))
    story.append(Paragraph(
        "In conclusion, this internship successfully fulfilled all diploma learning objectives and provided a strong professional foundation for my future career in computer engineering.",
        body
    ))

    # ==========================================
    # PAGE 30: CHAPTER 11 - REFERENCES
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("CHAPTER 11", chapter_h1))
    story.append(Paragraph("REFERENCES &amp; SOURCES OF INFORMATION", chapter_h2))
    
    story.append(Paragraph("1. Official Documentation &amp; Technical Standards", subhead))
    story.append(Paragraph("• React 18 Official Documentation – https://react.dev/", bullet))
    story.append(Paragraph("• Vite Frontend Tooling &amp; HMR Guide – https://vitejs.dev/", bullet))
    story.append(Paragraph("• Tailwind CSS Design System Documentation – https://tailwindcss.com/docs", bullet))
    story.append(Paragraph("• Node.js Event Loop &amp; Architecture Reference – https://nodejs.org/docs", bullet))
    story.append(Paragraph("• Express.js Routing &amp; Middleware Reference – https://expressjs.com/", bullet))
    story.append(Paragraph("• Groq SDK LPU Inference &amp; API Guide – https://console.groq.com/docs", bullet))
    story.append(Paragraph("• PDFKit Document Generation Reference – https://pdfkit.org/docs/", bullet))
    story.append(Paragraph("• Supabase Database &amp; Auth Documentation – https://supabase.com/docs", bullet))
    story.append(Paragraph("• Nodemailer Transport Client Documentation – https://nodemailer.com/", bullet))
    story.append(Paragraph("• JSZip Client-Side Zip Library – https://stuk.github.io/jszip/", bullet))

    story.append(Spacer(1, 6 * pt))
    story.append(Paragraph("2. Learning Platforms &amp; Institutional Resources", subhead))
    story.append(Paragraph("• Elite Forums Internal Training Modules &amp; Slide Decks", bullet))
    story.append(Paragraph("• MDN Web Docs (Mozilla Developer Network) – https://developer.mozilla.org/", bullet))
    story.append(Paragraph("• W3C Web Content Accessibility Guidelines (WCAG) 2.1", bullet))

    story.append(Spacer(1, 6 * pt))
    story.append(Paragraph("3. Reference Textbooks", subhead))
    story.append(Paragraph("• <i>JavaScript: The Definitive Guide</i> – David Flanagan, O'Reilly Media", bullet))
    story.append(Paragraph("• <i>Learning React: Modern Patterns for Developing React Apps</i> – Alex Banks &amp; Eve Porcello", bullet))
    story.append(Paragraph("• <i>Designing Data-Intensive Applications</i> – Martin Kleppmann, O'Reilly Media", bullet))

    story.append(Spacer(1, 20 * pt))
    elite_link_data = [
        [Paragraph("<b>Elite Forums: - <font color='#003366'><u>https://in.linkedin.com/company/eliteforums</u></font></b><br/><font size=9 color='#374151'>IT Services &amp; Consulting &bull; Vasai (East), Maharashtra – 401208</font>", center_bold_12)]
    ]
    elite_link_tbl = Table(elite_link_data, colWidths=[420 * pt])
    elite_link_tbl.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 1 * pt, colors.HexColor("#003366")),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('TOPPADDING', (0,0), (-1,-1), 6 * pt),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6 * pt),
    ]))
    story.append(elite_link_tbl)

    doc.build(story, canvasmaker=NumberedCanvas)
    print("30-Page ProForge AI Internship Report PDF successfully generated.")

if __name__ == "__main__":
    generate_pdf()
