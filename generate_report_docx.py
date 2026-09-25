import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_cell_borders(cell, top="single", bottom="single", left="single", right="single", color="000000", sz="4"):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:top w:val="{top}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="{left}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{bottom}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:right w:val="{right}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(tcBorders)

def add_page_border(section):
    sectPr = section._sectPr
    pgBorders = parse_xml(
        f'<w:pgBorders {nsdecls("w")} w:offsetFrom="page">'
        f'<w:top w:val="single" w:sz="12" w:space="24" w:color="000000"/>'
        f'<w:left w:val="single" w:sz="12" w:space="24" w:color="000000"/>'
        f'<w:bottom w:val="single" w:sz="12" w:space="24" w:color="000000"/>'
        f'<w:right w:val="single" w:sz="12" w:space="24" w:color="000000"/>'
        f'</w:pgBorders>'
    )
    sectPr.append(pgBorders)

def build_docx():
    doc = docx.Document()

    for section in doc.sections:
        section.top_margin = Inches(0.9)
        section.bottom_margin = Inches(0.9)
        section.left_margin = Inches(0.9)
        section.right_margin = Inches(0.9)
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)
        section.different_first_page_header_footer = True
        add_page_border(section)

        footer = section.footer
        f_p = footer.paragraphs[0]
        f_p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        f_run = f_p.add_run("COPYRIGHT © 2026-2027 VIVA INSTITUTE OF ENGINEERING & TECHNOLOGY, COMPUTER ENGINEERING")
        f_run.font.name = "Arial"
        f_run.font.size = Pt(8.5)

    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Arial'
    normal_style.font.size = Pt(10.5)
    normal_style.paragraph_format.line_spacing = 1.25
    normal_style.paragraph_format.space_after = Pt(5)

    # ---------------- PAGE 1: COVER ----------------
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(25)
    p.paragraph_format.space_after = Pt(15)
    r = p.add_run("Internship Report submitted in Partial Fulfillment for Diploma In\nComputer Engineering")
    r.font.size = Pt(12)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(30)
    p.paragraph_format.space_after = Pt(6)
    r = p.add_run("PROFORGE")
    r.font.size = Pt(24)
    r.font.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(30)
    r = p.add_run("End-to-End Career Intelligence & Branding Suite")
    r.font.size = Pt(11.5)
    r.font.italic = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(3)
    p.add_run("Presented By").font.size = Pt(11)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(28)
    r = p.add_run("Dhruv R. Dubey - 25112400240 – TYCO - B")
    r.font.size = Pt(12.5)
    r.font.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(4)
    p.add_run("Under the Guidance of").font.size = Pt(11)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(45)
    r = p.add_run("Industry Mentor:- Prof. Harsh Tambade\nCollege Mentor:- Prathamesh Sir")
    r.font.bold = True
    r.font.size = Pt(12)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(40)
    p.paragraph_format.space_after = Pt(3)
    r = p.add_run("DEPARTMENT OF COMPUTER ENGINEERING")
    r.font.bold = True
    r.font.size = Pt(12)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(3)
    r = p.add_run("VIVA INSTITUTE OF ENGINEERING & TECHNOLOGY")
    r.font.bold = True
    r.font.size = Pt(13)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(8)
    r = p.add_run("VIRAR (E), PALGHAR – 401305.")
    r.font.bold = True
    r.font.size = Pt(11)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("2026-2027")
    r.font.bold = True
    r.font.size = Pt(12)

    # ---------------- PAGE 2: INDEX ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(15)
    r = p.add_run("INDEX / TABLE OF CONTENTS")
    r.font.bold = True
    r.font.size = Pt(14)

    table = doc.add_table(rows=14, cols=3)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_widths = [Inches(0.9), Inches(4.5), Inches(0.9)]

    headers = ["Sr.no.", "Content", "Page no."]
    hdr_cells = table.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_margins(hdr_cells[i], 80, 80, 100, 100)
        set_cell_borders(hdr_cells[i])
        p = hdr_cells[i].paragraphs[0]
        p.runs[0].font.bold = True
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if i != 1 else WD_ALIGN_PARAGRAPH.LEFT

    toc_data = [
        ("1", "Abstract", "1"),
        ("2", "Acknowledgement", "2"),
        ("3", "Chapter 1- Organization Structure Of Industry and General Layout", "3"),
        ("4", "Chapter 2- Introduction to Industry/Organization", "4"),
        ("5", "Chapter 3- Major Software Tools Used", "5-7"),
        ("6", "Chapter 4- Processes / Methodologies Followed", "8-9"),
        ("7", "Chapter 5- Testing Of Software", "10-11"),
        ("8", "Chapter 6- Safety Procedures And Cybersecurity", "12-13"),
        ("9", "Chapter 7- Practical Experiences", "14-16"),
        ("10", "Chapter 8- Detailed Report of Tasks Undertaken", "17-20"),
        ("11", "Chapter 9- Challenges And Solutions", "21-23"),
        ("12", "Chapter 10- Conclusion", "24"),
        ("13", "Chapter 11- References", "25")
    ]

    for row_idx, data in enumerate(toc_data, start=1):
        row_cells = table.rows[row_idx].cells
        for col_idx, val in enumerate(data):
            row_cells[col_idx].text = val
            set_cell_margins(row_cells[col_idx], 60, 60, 80, 80)
            set_cell_borders(row_cells[col_idx])
            p = row_cells[col_idx].paragraphs[0]
            if col_idx in [0, 2]:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT

    for row in table.rows:
        for idx, width in enumerate(col_widths):
            row.cells[idx].width = width

    # ---------------- PAGE 3: ABSTRACT ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(18)
    r = p.add_run("ABSTRACT")
    r.font.bold = True
    r.font.underline = True
    r.font.size = Pt(14)

    doc.add_paragraph(
        "Industrial training is an important part of diploma education because it connects classroom learning with practical work. I completed my twelve-week industrial training at Elite Forums, located at Vasai (East), from 25 May 2026 to 15 August 2026, where I received exposure to Web Development, Python Programming and Generative AI. The training included technical learning, practical exercises, assessments, discussions and project-oriented activities."
    )
    doc.add_paragraph(
        "As part of the project work, I worked on the concept of PROFORGE — End-to-End Career Intelligence & Branding Suite, also represented through the ProForge engineering repository. ProForge is a comprehensive career intelligence and automated branding platform designed to connect aspiring engineers and professionals with industry-grade career optimization tools. The platform unifies six specialized sub-suites: Remo AI (smart resume builder with in-place AI bullet refinement and dynamic A4 PDF coordinate rendering), Folio AI (web portfolio publisher featuring Bento Grid, Cyber Terminal, Modern Executive, and Clean Glassmorphism templates with zero-dependency ZIP export), Talo AI (real-time ATS alignment auditor comparing resumes against target job descriptions with keyword gap detection), Covo AI (recruiter outreach studio generating personalized cold emails, LinkedIn pitches, and dynamic PDF cover letters), Liko AI (personal branding LinkedIn post architect and bio optimizer), and Mali AI (visual HTML email composer, Google typography controls, sandbox preview, and background campaign queue scheduling)."
    )
    doc.add_paragraph(
        "The project interface contains an interactive dashboard, visual theme switcher (10 dynamic themes), resume layout customizer (over 105 design permutations), ATS scoring analytics, outreach studio, scheduled email queues, and secure multi-device authentication guards. This report explains the organization structure, industry introduction, software tools, methodologies, testing procedures, safety practices, practical experiences, tasks undertaken, challenges, conclusion and references."
    )
    doc.add_paragraph(
        "The training experience improved my understanding of planning, reusable components, user interface design, validation, version control, deployment, documentation, teamwork and continuous testing."
    )

    # ---------------- PAGE 4: ACKNOWLEDGEMENT ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(20)
    r = p.add_run("Acknowledgement")
    r.font.bold = True
    r.font.underline = True
    r.font.size = Pt(14)

    doc.add_paragraph(
        "We sincerely acknowledge the support and guidance provided by all those who contributed to the successful completion of this project. We are especially grateful to our mentor, Prathamesh Sir, for his valuable assistance, academic guidance, and continuous encouragement throughout the process."
    )
    doc.add_paragraph(
        "We also extend our heartfelt thanks to Prof. Harsh Tambade (Founder and CEO, Elite Forums) for giving us the opportunity to undertake this industrial internship at Elite Forums, Vasai (East), and for providing his technical insights and leadership during the Generative AI and web engineering sessions."
    )
    doc.add_paragraph(
        "We express our sincere gratitude to the faculty and management of the Department of Computer Engineering at VIVA Institute of Engineering & Technology, Virar (E), for their institutional backing, academic platform, and encouragement toward industrial skill acquisition."
    )
    doc.add_paragraph(
        "Finally, we would like to express our appreciation to the entire Elite Forums organization for providing us with comprehensive knowledge, state-of-the-art tools, and practical exposure during the training period."
    )

    p_sig = doc.add_paragraph()
    p_sig.paragraph_format.space_before = Pt(50)
    p_sig.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r = p_sig.add_run("Dhruv R. Dubey\nEnrollment No: 25112400240 – TYCO - B\nDepartment of Computer Engineering\nVIVA Institute of Engineering & Technology")
    r.font.bold = True

    # ---------------- PAGE 5: CHAPTER 1 ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(6)
    r = p.add_run("CHAPTER 1")
    r.font.bold = True
    r.font.size = Pt(14)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(12)
    r = p.add_run("ORGANIZATION STRUCTURE OF INDUSTRY AND GENERAL LAYOUT")
    r.font.bold = True
    r.font.size = Pt(12)

    doc.add_paragraph(
        "Elite Forums is headed by its Founder and CEO, Harsh Tambade. Supporting him in leadership are Jeet Gharat, who serves as the General Manager, and Siddhant Mandlik, the Chief Operating Officer (COO). Day-to-day operations are coordinated by Suchita Nigam, the Project Manager, who supervises two major teams within the organization."
    )
    doc.add_paragraph(
        "The Developers Team includes Anshu Jaiswal, Adarsh Pandey, Mithilesh Vichare, and Yuvraj Singh, while the Instructors Team is composed of Shreya Mishra, Prathamesh Jakkula, Nandini Singh, Shreya Mulik, and Shashank Singh. This well-structured hierarchy ensures effective communication, smooth workflow, and strong collaboration between leadership, management, and execution, ultimately driving efficiency and organizational growth."
    )

    # ---------------- PAGE 6: CHAPTER 2 ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.add_run("CHAPTER 2").font.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(16)
    p.add_run("INTRODUCTION TO INDUSTRY (HISTORY, TYPES OF PRODUCTS AND SERVICES, TURN OVER AND NUMBERS OF EMPLOYEES)").font.bold = True

    p = doc.add_paragraph()
    p.add_run("IT Services and Consulting").font.bold = True
    doc.add_paragraph(
        "The company where I carried out my internship functions in the field of Information Technology services and consulting. It is an independent firm, based in Mumbai/Vasai, Maharashtra, and was established in 2023. Though fairly new, it has made noticeable progress in the areas of IT education, consulting, and solution development."
    )
    doc.add_paragraph(
        "The organization operates with a small but skilled workforce of around 11–50 people, which allows it to remain flexible and efficient. This structure supports quick innovation, faster decisions, and personalized approaches to meet the needs of both learners and business clients. The company places strong emphasis on practical learning for students as well as providing consulting support for businesses to overcome technological challenges."
    )

    p = doc.add_paragraph()
    p.add_run("Range of Services").font.bold = True
    doc.add_paragraph("The services offered by the company are divided into three major categories:")

    p = doc.add_paragraph()
    p.add_run("1. Training Programs").font.bold = True
    doc.add_paragraph("• Focused learning on modern technologies such as Generative AI, Machine Learning, Cybersecurity, Cloud Computing, and Web Development.")
    doc.add_paragraph("• Interactive sessions and coding workshops covering Git, GitHub, APIs, and JavaScript.")
    doc.add_paragraph("• Well-structured modules that include MCQs, quizzes, coding challenges, and project assignments.")
    doc.add_paragraph("• One-on-one guidance to help learners build job-ready skills.")

    p = doc.add_paragraph()
    p.add_run("2. Consultancy Services").font.bold = True
    doc.add_paragraph("• Professional advice for startups and established firms in adopting digital technologies.")
    doc.add_paragraph("• Assistance in creating websites, automation workflows, and scalable IT frameworks.")
    doc.add_paragraph("• Consulting expertise in areas such as cloud solutions, database systems, and AI-driven tools.")

    # ---------------- PAGE 7: CHAPTER 2 CONT ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(15)
    p.add_run("3. Customized IT Solutions").font.bold = True
    doc.add_paragraph("• Developing web and mobile applications based on client needs.")
    doc.add_paragraph("• Offering API-based integrations to improve connectivity between platforms.")
    doc.add_paragraph("• Delivering complete software solutions—from basic front-end structures to advanced user-centric platforms.")
    doc.add_paragraph("• Providing deployment, ongoing maintenance, and security support for enterprise-level applications.")

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(25)
    p.add_run("Strategic Focus on Emerging Technologies & Generative AI").font.bold = True
    doc.add_paragraph(
        "Elite Forums places strong strategic emphasis on the convergence of modern web engineering with Generative AI and Large Language Models (LLMs). Rather than viewing AI as an isolated theoretical concept, the company trains developers to embed AI reasoning directly into full-stack web platforms—such as automated text refinement, ATS scoring algorithms, dynamic document generation, and intelligent campaign dispatching."
    )
    doc.add_paragraph(
        "This hands-on, innovation-driven philosophy provided the foundation for engineering ProForge AI, where complex career intelligence workflows were decoupled into responsive, modular web services with sub-second AI inference."
    )

    # ---------------- PAGE 8: CHAPTER 3 ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.add_run("CHAPTER 3").font.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(14)
    p.add_run("TYPES OF MAJOR EQUIPMENT/RAW MATERIALS/INSTRUMENTS/MACHINES/HARDWARE/SOFTWARE USED IN INDUSTRY WITH THEIR SPECIFICATION, APPROXIMATELY COST, SPECIFIC USE AND ROUTINE MAINTENANCE DONE.").font.bold = True

    doc.add_paragraph(
        "During the course of training, we were introduced to a wide range of tools and technologies that are commonly used in the IT industry. These included both development frameworks and supporting software for building, managing, and analyzing applications."
    )

    doc.add_paragraph("• Frontend Technologies: React 18, Vite, Tailwind CSS v3, PostCSS, Lucide React Icons")
    doc.add_paragraph("• Backend Technologies: Node.js, Express.js REST API pipeline, CORS, Dotenv")
    doc.add_paragraph("• Databases & Storage: Supabase (PostgreSQL relational engine with JSONB columns), Local JSON audit logging")
    doc.add_paragraph("• Version Control: Git, GitHub")
    doc.add_paragraph("• Authentication Services: Supabase Auth, JWT verification guards, Zoho SMTP 6-digit OTP verification")
    doc.add_paragraph("• AI Inference Engine: Groq SDK (Llama 3 70B & Qwen models for sub-second NLP reasoning)")
    doc.add_paragraph("• Document & Archive Engines: PDFKit (dynamic A4 coordinate mapping), JSZip (zero-dependency client bundles)")
    doc.add_paragraph("• Email Dispatch & Scheduling: Nodemailer, Zoho SMTP transporter, background queue scheduler (Mali AI)")
    doc.add_paragraph("• Security & Intrusion Auditing: IP & User-Agent signature trackers, multi-device access alerts")
    doc.add_paragraph("• Developer Environments: Visual Studio Code, Postman API client, Chrome DevTools")

    doc.add_paragraph(
        "This combination of technologies provided us with exposure to full-stack development, generative AI integration, document compilation, and cloud database administration, ensuring a balanced learning experience across different domains of computer engineering."
    )

    # ---------------- PAGE 9: TOOLS TABLE ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(5)
    p.paragraph_format.space_after = Pt(10)
    p.add_run("HARDWARE & SOFTWARE SPECIFICATION TABLE").font.bold = True

    tools_tbl = doc.add_table(rows=8, cols=5)
    tools_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_widths = [Inches(1.1), Inches(1.3), Inches(0.9), Inches(1.5), Inches(1.5)]

    t_headers = ["Equipment / Software", "Specification", "Approx. Cost", "Specific Use", "Routine Maintenance (JS async/await)"]
    for i, t in enumerate(t_headers):
        cell = tools_tbl.rows[0].cells[i]
        cell.text = t
        set_cell_background(cell, "F2F4F7")
        set_cell_margins(cell, 70, 70, 80, 80)
        set_cell_borders(cell)
        p = cell.paragraphs[0]
        p.runs[0].font.bold = True
        p.runs[0].font.size = Pt(8.5)
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    tbl_rows = [
        ("Laptops / Workstations", "Intel i5/i7 processor, 16gb RAM, 512 SSD", "₹45,000 – ₹60,000", "Primary hardware for coding, server runtime, AI testing", "Regular OS updates, disk cleanup, node_modules cache cleaning"),
        ("Git & GitHub", "Cloud-based version control", "Free / Pro ₹350–₹700 per month", "Source code hosting, collaboration, version control", "Repo backup, branch cleanup (async commits & merges)"),
        ("VS Code (IDE)", "Open-source extensible editor", "Free", "Writing, debugging, and testing frontend/backend code", "Extension updates, cache cleaning, settings sync"),
        ("React 18 & Vite", "Component library with lightning HMR", "Free (MIT)", "Web app development (SPA, reactive state, UI themes)", "Updating dependencies via npm/yarn, tree-shaking dead code"),
        ("Node.js & Express", "V8 asynchronous JavaScript runtime", "Free (MIT)", "Backend API routing, token validation, PDF & email pipelines", "Monitoring async request loops and unhandled promise rejections"),
        ("Groq SDK (LLM)", "LPU-accelerated inference engine", "Pay-as-you-go / Free tier", "ATS keyword analysis, bullet point refiners, email drafting", "Handling async rate limits with exponential backoff retries"),
        ("Supabase & PostgreSQL", "Open-source Firebase alternative", "Free tier + Paid (~₹2,000/mo)", "Backend-as-a-Service (auth, JSONB profiles, security)", "Regular DB backups, connection pool health checks, index tuning")
    ]

    for r_i, r_data in enumerate(tbl_rows, start=1):
        for c_i, val in enumerate(r_data):
            cell = tools_tbl.rows[r_i].cells[c_i]
            cell.text = val
            set_cell_margins(cell, 50, 50, 60, 60)
            set_cell_borders(cell)
            p = cell.paragraphs[0]
            p.runs[0].font.size = Pt(8)
            if c_i == 0:
                p.runs[0].font.bold = True
            if c_i == 2:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    for row in tools_tbl.rows:
        for idx, width in enumerate(t_widths):
            row.cells[idx].width = width

    # ---------------- PAGE 10: CHAPTER 4 ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.add_run("CHAPTER 4").font.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(14)
    p.add_run("PROCESSES/MANUFACTURING TECHNIQUES AND METHODOLOGIES AND MATERIAL HANDLING PROCEDURES").font.bold = True

    doc.add_paragraph(
        "In the IT Services and Consulting sector, the concept of manufacturing can be compared to the development and deployment of software systems, where digital solutions such as web applications, APIs, and backend services are created, tested, and delivered to end-users. During my internship at Elite Forums – Web Dev, Python & Generative AI Program, I was exposed to modern software engineering practices that emphasize efficiency, scalability, and reliability in project execution."
    )

    p = doc.add_paragraph()
    p.add_run("1. Software Development Process").font.bold = True
    doc.add_paragraph(
        "The organization primarily follows an Agile workflow, where work is divided into short, iterative sprints. Each sprint involves continuous testing, regular feedback, and incremental improvements. This approach enables faster delivery, flexibility to adapt to changes, and better-quality outcomes."
    )

    p = doc.add_paragraph()
    p.add_run("2. Methodologies in Practice").font.bold = True
    doc.add_paragraph("• Agile & Scrum: Weekly sprint cycles, daily stand-up meetings, and teamwork-driven tasks.")
    doc.add_paragraph("• Version Control (Git/GitHub): Used for branching, merging, and collaborative code management.")
    doc.add_paragraph("• CI/CD Pipelines: Automated testing and deployment ensured quick releases with minimal downtime.")
    doc.add_paragraph("• API-First Development: Applications were designed with modular APIs, improving reusability and system integration.")

    p = doc.add_paragraph()
    p.add_run("3. Handling of Digital Assets").font.bold = True
    doc.add_paragraph("Unlike traditional industries, IT deals with digital resources rather than physical materials. Some key assets included:")
    doc.add_paragraph("• Source Code (GitHub): Managed through proper commits, pull requests, and branching strategies.")
    doc.add_paragraph("• Frontend & Backend Files: HTML templates, Tailwind CSS stylesheets, JavaScript ES6 modules, and React components.")
    doc.add_paragraph("• APIs and Endpoints: Integrated using asynchronous functions (async/await) for smooth data handling.")
    doc.add_paragraph("• Databases (Supabase/PostgreSQL): CRUD operations were performed with secure queries and authentication measures.")

    # ---------------- PAGE 11: CHAPTER 4 CONT ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(15)
    p.add_run("4. Hands-On Learning During Internship").font.bold = True
    doc.add_paragraph("• Built scalable micro-modular projects using React 18 and Vite (Counter App, routing-based applications, multi-page dashboards).")
    doc.add_paragraph("• Configured GitHub repositories for team collaboration, semantic branch management, and continuous version tracking.")
    doc.add_paragraph("• Connected Supabase backend for passwordless OTP authentication and JSONB profile data storage.")
    doc.add_paragraph("• Strengthened JavaScript skills with ES6 concepts, async/await functions, and RESTful API handling.")
    doc.add_paragraph("• Engineered vector document generation pipelines in PDFKit calculating dynamic vertical coordinates and A4 page breaks.")
    doc.add_paragraph("• Integrated Groq SDK for real-time ATS scoring, keyword extraction, and bullet point refinement.")
    doc.add_paragraph("• Took part in MCQ tests, rapid-fire rounds, and coding challenges, which reinforced both theoretical and practical knowledge.")

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(30)
    p.add_run("5. Component Modularity & Design Consistency").font.bold = True
    doc.add_paragraph(
        "A major focus of the technical training was achieving high component reusability and clean architecture. Reusable UI elements—including theme toggle selectors, font pickers, interactive sliders, loaders, and modal dialogs—were systematically decoupled into dedicated component files. This modular pattern ensured that styling updates across the 10 custom themes propagated consistently across all six sub-suites without redundant code rewriting."
    )

    # ---------------- PAGE 12: CHAPTER 5 ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.add_run("CHAPTER 5").font.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(14)
    p.add_run("TESTING AND HANDLING PROCEDURES").font.bold = True

    p = doc.add_paragraph()
    p.add_run("Testing and Evaluation").font.bold = True
    doc.add_paragraph(
        "Testing played a vital role throughout the internship, serving as a continuous measure of both technical growth and problem-solving ability. At Elite Forums, weekly assessments were designed to simulate real-world scenarios and ensure a balance between theoretical understanding and practical application. These evaluations helped strengthen logical reasoning, coding efficiency, and overall confidence in tackling professional challenges."
    )

    p = doc.add_paragraph()
    p.add_run("Weekly Assessment Formats").font.bold = True
    doc.add_paragraph("1. Quizzes: Short, time-bound quizzes were conducted on core topics such as JavaScript fundamentals, Git/GitHub commands, React component lifecycles, and Supabase operations. These quick tests reinforced key concepts and improved recall speed.")
    doc.add_paragraph("2. Multiple Choice Questions (MCQs): MCQs assessed knowledge of workflows, coding syntax, and theoretical aspects of software development. They ensured clarity of concepts while highlighting areas that required revision.")
    doc.add_paragraph("3. Coding Rounds: Hands-on coding challenges required interns to develop small features, debug errors, and handle API calls in real time. For example, tasks included building a Counter App using React or integrating async/await functions. These exercises enhanced analytical thinking and coding proficiency.")
    doc.add_paragraph("4. Mock Exams: Comprehensive tests combined MCQs, descriptive questions, and coding tasks, replicating real evaluation environments. They were designed to check readiness for both academic requirements and industry-level expectations.")
    doc.add_paragraph("5. Presentations (PPTs): Interns were asked to prepare and deliver presentations on technical topics, which not only polished technical communication skills but also improved public speaking, teamwork, and confidence—crucial qualities for client-facing roles in IT.")

    p = doc.add_paragraph()
    p.add_run("Handling & Learning Approaches").font.bold = True
    doc.add_paragraph("• Confidence Building: Exposure to different test formats like quizzes, coding tasks, and presentations promoted both technical mastery and soft skill development.")
    doc.add_paragraph("• Collaborative Learning: After assessments, group discussions and doubt-solving sessions encouraged peer learning, making the training more interactive and engaging.")

    # ---------------- PAGE 13: CHAPTER 6 ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.add_run("CHAPTER 6").font.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(14)
    p.add_run("SAFETY PROCEDURES FOLLOWED AND SAFETY GEARS USED BY INDUSTRY").font.bold = True

    p = doc.add_paragraph()
    p.add_run("Safety Practices During Internship").font.bold = True
    doc.add_paragraph(
        "Although my internship was in the IT consulting and services sector, the organization emphasized that safety—both digital and professional—was an essential part of day-to-day work. Interns were guided to adopt secure habits that protected data, systems, and overall workplace efficiency."
    )

    p = doc.add_paragraph()
    p.add_run("1. Digital Protection").font.bold = True
    doc.add_paragraph("• Confidentiality: Sensitive files, repositories, and API keys were safeguarded, with clear instructions not to share credentials.")
    doc.add_paragraph("• Strong Authentication: Accounts on platforms such as GitHub and Supabase were secured using complex passwords and two-factor verification.")
    doc.add_paragraph("• Coding Security: All code was reviewed regularly to prevent vulnerabilities like SQL injection or XSS. Input sanitization was applied across resume data fields and prompt forms.")
    doc.add_paragraph("• Intrusion Detection & Security Auditing: The platform integrated active security monitoring (loginHistory.js) that logs IP addresses and User-Agent signatures. It automatically triggers warning alerts and flags potential account locks upon detecting access from 3+ distinct devices or consecutive failed logins.")
    doc.add_paragraph("• Data Backup: Repositories and databases were systematically backed up to avoid data loss.")
    doc.add_paragraph("• Safe Browsing Habits: Only verified websites and resources were accessed, preventing exposure to malicious links.")

    p = doc.add_paragraph()
    p.add_run("2. System & Workspace Safety").font.bold = True
    doc.add_paragraph("• Regular Maintenance: Devices were updated with patches, antivirus software, and firewalls.")
    doc.add_paragraph("• Hardware Handling: External devices such as USB drives were used carefully to reduce security risks.")
    doc.add_paragraph("• Ergonomic Care: Proper seating, posture, and screen breaks were encouraged to ensure comfort during long coding hours.")

    p = doc.add_paragraph()
    p.add_run("3. Collaboration & Communication Protocols").font.bold = True
    doc.add_paragraph("• Version Control Discipline: GitHub contributions were monitored through pull requests and code reviews to avoid errors.")
    doc.add_paragraph("• Secure API Use: API requests were handled responsibly to prevent misuse and quota exhaustion.")
    doc.add_paragraph("• Professional Communication: Respectful and clear interaction was maintained in meetings and team discussions.")

    # ---------------- PAGE 14: CHAPTER 6 CONT ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(15)
    p.add_run("4. Emergency Measures").font.bold = True
    doc.add_paragraph("• System Recovery: Backup mechanisms in GitHub and Supabase allowed smooth recovery during technical failures.")
    doc.add_paragraph("• Incident Response: Interns were trained to report breaches, credential leaks, or suspicious activity immediately.")
    doc.add_paragraph("• Workplace Awareness: During offline sessions at the Vasai center, safety guidelines such as fire exits and emergency contacts were explained.")

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(25)
    p.add_run("5. Professional Conduct & Personal Safety").font.bold = True
    doc.add_paragraph("• Adherence to company policies and confidentiality rules was mandatory.")
    doc.add_paragraph("• Online collaboration tools like Slack, Zoom, and Google Meet were used securely.")
    doc.add_paragraph("• While interns were encouraged to be inquisitive, they were advised to remain careful when discussing project-related details outside official channels.")

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(25)
    p.add_run("6. Ethical AI Implementation Protocols").font.bold = True
    doc.add_paragraph(
        "A dedicated discussion at Elite Forums explored ethical guidelines regarding AI usage. When generating resumes, cover letters, and outreach pitches, algorithms were structured to prevent false factual generation, uphold privacy standards for personal contact information, and ensure transparency in automated email scheduling workflows."
    )

    # ---------------- PAGE 15: CHAPTER 7 ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.add_run("CHAPTER 7").font.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(14)
    p.add_run("PARTICULAR OF PRACTICAL EXPERIENCES IN INDUSTRY IF ANY IN PRODUCTION/ASSEMBLY/TESTING/MAINTENANCE").font.bold = True

    p = doc.add_paragraph()
    p.add_run("Practical Experiences During Internship").font.bold = True
    doc.add_paragraph(
        "During my internship at Elite Forums – Generative AI Program, I gained practical exposure to the complete cycle of software development. The work was divided into four main stages—production, assembly, testing, and maintenance—similar to the workflow of traditional industries, but adapted to the IT environment."
    )

    p = doc.add_paragraph()
    p.add_run("1. Production (Development & Implementation)").font.bold = True
    doc.add_paragraph("• Built a basic Counter App and multi-view profile editors in React to understand component design and state management.")
    doc.add_paragraph("• Created both static and dynamic pages in Vite/React, learning how web platforms balance speed with interactivity.")
    doc.add_paragraph("• Implemented API integrations using JavaScript (async/await) for smooth data exchange and error handling.")
    doc.add_paragraph("• Added authentication and database connectivity through Supabase, simulating a real-world backend system.")
    doc.add_paragraph("• Engineered Remo AI: dynamic A4 coordinate calculation in PDFKit ensuring print-ready resumes with zero margin clipping across 105+ layout combinations.")
    doc.add_paragraph("• Developed Folio AI: 4 responsive portfolio designs (Bento Grid, Cyber Terminal, Modern Executive, Clean Glassmorphism) with client-side ZIP packaging via JSZip.")
    doc.add_paragraph("• Implemented Talo AI: ATS alignment algorithms parsing job descriptions vs candidate profiles to generate percentage match scores and keyword gap reports.")

    p = doc.add_paragraph()
    p.add_run("2. Assembly (System Integration & Configuration)").font.bold = True
    doc.add_paragraph("• Integrated different elements such as frontend, backend, APIs, and databases into a unified system.")
    doc.add_paragraph("• Configured GitHub repositories to enable collaboration, version control, and project backups.")
    doc.add_paragraph("• Practiced React routing and layout guards to organize multiple sub-suites into a structured workflow.")
    doc.add_paragraph("• Configured Zoho SMTP mail pipelines for secure 6-digit OTP verification and automated email campaign dispatches.")

    # ---------------- PAGE 16: CHAPTER 7 CONT ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(15)
    p.add_run("3. Testing (Ensuring Quality & Performance)").font.bold = True
    doc.add_paragraph("• Took part in weekly assessments including quizzes, coding rounds, MCQs, and mock exams.")
    doc.add_paragraph("• Performed unit tests for small components (like counter functionality, theme switches) and integration tests for API calls.")
    doc.add_paragraph("• Used debugging tools in VS Code and Postman to troubleshoot and fix issues in JavaScript and Express routes.")
    doc.add_paragraph("• Delivered presentations (PPTs) on technical topics, which helped strengthen communication and technical explanation skills.")
    doc.add_paragraph("• Stress-tested PDFKit rendering across various resume lengths to ensure seamless multi-page pagination.")

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(25)
    p.add_run("4. Maintenance (Ongoing Improvements & Security)").font.bold = True
    doc.add_paragraph("• Regularly updated npm packages and project dependencies to keep systems compatible.")
    doc.add_paragraph("• Managed Supabase databases through CRUD operations and scheduled backups.")
    doc.add_paragraph("• Maintained GitHub repositories by cleaning branches, organizing commits, and configuring workflows.")
    doc.add_paragraph("• Applied JavaScript async/await to maintain stable and responsive applications.")
    doc.add_paragraph("• Followed security practices, including API key management, environment variable configuration, and safe coding guidelines.")
    doc.add_paragraph("• Constructed automated queue workers (emailScheduler.js) monitoring pending emails and dispatching them reliably.")

    # ---------------- PAGE 17: CHAPTER 8 ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.add_run("CHAPTER 8").font.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(14)
    p.add_run("DETAILED REPORT OF THE TASKS UNDERTAKEN DURING THE TRAINING").font.bold = True

    p = doc.add_paragraph()
    p.add_run("Internship Structure and Weekly Progress").font.bold = True
    doc.add_paragraph(
        "The internship at Elite Forums – Generative AI Program was systematically designed in a week-by-week format, gradually building expertise in full-stack development and machine learning. Each stage combined theoretical lessons with practical tasks, ensuring that concepts were not only learned but also applied in real-world scenarios. The journey concluded with industry-level projects that showcased our acquired skills."
    )

    p = doc.add_paragraph()
    p.add_run("Weeks 1–2: Foundations in Full-Stack Development").font.bold = True
    doc.add_paragraph(
        "The training started with full-stack fundamentals (HTML5 boilerplates, CSS layouts, and modern JavaScript), which form the backbone of many modern web applications. Alongside this, I worked on form handling and DOM manipulation to strengthen my basics."
    )
    doc.add_paragraph(
        "I also practiced JavaScript fundamentals such as variables, loops, ES6 features, and asynchronous programming with async/await. Simultaneously, we were introduced to Git and GitHub for version control—learning repository setup, branching, commits, and pull requests."
    )
    doc.add_paragraph(
        "The basics of Node.js and Express were also covered, including routing, middleware pipelines, and RESTful API endpoints. To apply our knowledge, we completed assignments like implementing CRUD operations, which improved our confidence in handling databases and backend integration."
    )

    p = doc.add_paragraph()
    p.add_run("Weeks 3–4: Authentication, Integrations, and Profile Systems").font.bold = True
    doc.add_paragraph(
        "In the third and fourth weeks, the focus shifted toward authentication and system integration. Using Supabase and Nodemailer, we implemented secure login and session handling via 6-digit OTP verification. We also explored rate-limiting strategies to improve scalability and prevent misuse of system resources."
    )
    doc.add_paragraph(
        "Additional integrations included Zoho SMTP for transactional email dispatching and security audit logging. This phase simulated real-world SaaS projects, exposing us to API-driven workflows."
    )
    doc.add_paragraph(
        "We also participated in a Pitch Deck Event, where we learned how to combine technical explanations with effective business presentations. By the end of this stage, we deployed the core foundation for ProForge, bringing together all the concepts learned so far into a functioning full-stack application."
    )

    # ---------------- PAGE 18: CHAPTER 8 CONT ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.add_run("Weeks 5–6: Remo AI Resume Builder & PDFKit Dynamic Coordinate Engine").font.bold = True
    doc.add_paragraph(
        "In the fifth and sixth weeks, the emphasis moved to dynamic document generation and AI integration. We engineered Remo AI, developing a dynamic resume editor with real-time text synchronization. Developed the backend rendering engine in PDFKit, calculating exact A4 coordinate positions, line wraps, font embeddings, and pagination across 105+ layout combinations. Integrated Groq SDK (Llama 3 70B) for real-time resume bullet refinement based on tone and length sliders."
    )

    p = doc.add_paragraph()
    p.add_run("Weeks 7–8: Folio AI Portfolio Studio & Talo AI ATS Alignment Auditor").font.bold = True
    doc.add_paragraph(
        "Weeks seven and eight were application-driven. We developed Folio AI, creating four distinct responsive portfolio templates (Bento Grid, Cyber Terminal, Modern Executive, Clean Glassmorphism). Implemented JSZip for zero-dependency client exports containing clean standalone HTML, CSS, and JS."
    )
    doc.add_paragraph(
        "We then built Talo AI, an ATS matching engine parsing job descriptions vs candidate profiles to compute match scores, identify missing keyword competencies, and generate targeted bullet rewrites."
    )

    p = doc.add_paragraph()
    p.add_run("Week 9: Covo AI Outreach Studio & Liko AI LinkedIn Architect").font.bold = True
    doc.add_paragraph(
        "The ninth week introduced automated recruiter outreach and personal branding. Developed Covo AI for generating personalized cold emails, LinkedIn connection requests, and dynamic PDF cover letters. Created Liko AI, transforming career milestones into engaging social media posts with customizable hooks, hashtags, and LinkedIn bio optimization."
    )

    p = doc.add_paragraph()
    p.add_run("Weeks 10–11: Mali AI Campaign Studio & Background Scheduling Engine").font.bold = True
    doc.add_paragraph(
        "The tenth and eleventh weeks marked the development of Mali AI. Built a visual rich-text HTML email composer with 12 Google fonts, 7 theme palettes, and a simulated browser preview console. Integrated dual time pickers (calendar and clock selectors) and engineered an automated background queue scheduler (emailScheduler.js) that checks pending emails and dispatches them via Zoho SMTP."
    )

    # ---------------- PAGE 19: CHAPTER 8 CONT ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(15)
    p.add_run("Week 12: Security Auditing, Multi-Theme System and Final Evaluation").font.bold = True
    doc.add_paragraph(
        "The final week was dedicated to cybersecurity auditing, visual polish, and project evaluation. We implemented an active security audit monitor (loginHistory.js) tracking IP addresses and User-Agent signatures, issuing email alerts upon multi-device access attempts."
    )
    doc.add_paragraph(
        "We also implemented a visual theme system featuring 10 dynamic color themes with Apple-style cubic-bezier transitions, optimized frontend and backend code, and ensured deployment readiness."
    )
    doc.add_paragraph(
        "The internship concluded with a final project evaluation at Elite Forums, where ProForge was reviewed based on technical accuracy, code modularity, innovation, and presentation quality."
    )

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(30)
    p.add_run("Comprehensive Learning Synthesis").font.bold = True
    doc.add_paragraph(
        "This progressive 12-week roadmap ensured that by the end of the internship, we had strong exposure to modern web development, generative AI orchestration, document generation, and real-world project deployment, making the experience both comprehensive and industry-relevant."
    )

    # ---------------- PAGE 20: CHAPTER 9 ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.add_run("CHAPTER 9").font.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(14)
    p.add_run("SPECIAL/CHALLENGING EXPERIENCES ENCOUNTERED DURING TRAINING IF ANY (MAY INCLUDE STUDENTS LIKING AND DISLIKING OF WORKPLACES)").font.bold = True

    p = doc.add_paragraph()
    p.add_run("Challenges and Learning Experiences").font.bold = True
    doc.add_paragraph(
        "My internship at Elite Forums offered me valuable exposure to both the technical and professional aspects of working in the IT services and consulting sector. The experience was highly rewarding but not without its share of challenges. Many tasks pushed me beyond my comfort zone, testing my patience, adaptability, and problem-solving skills. At the same time, the supportive work environment, structured assessments, and access to advanced tools enabled me to grow as both a learner and a professional."
    )

    p = doc.add_paragraph()
    p.add_run("1. Grasping Dynamic Coordinate Math & Pagination in PDFKit").font.bold = True
    doc.add_paragraph(
        "One of the first difficulties I faced was learning server-side coordinate-based document generation. Unlike web pages where elements flow naturally, PDFKit operates on absolute vector coordinates on a fixed A4 canvas. When rendering resumes with variable amounts of content, text frequently overflowed past the page boundaries or split awkwardly across page breaks. With mentor guidance, I formulated a mathematical coordinate tracker that measures text height (doc.heightOfString()) in advance, automatically adding pages and resetting headers cleanly."
    )

    p = doc.add_paragraph()
    p.add_run("2. Schema Enforcement from Non-Deterministic LLM Responses").font.bold = True
    doc.add_paragraph(
        "Integrating Groq's Llama 3 models for ATS scoring initially led to errors when the model returned conversational markdown instead of pure JSON. Initially, spending hours debugging parsing exceptions was discouraging. However, I adopted systematic prompt framing and backend regex extractors. This structured approach overcame the difficulty and made AI integration one of the highlights of the project."
    )

    p = doc.add_paragraph()
    p.add_run("3. Reliable Background Queue Scheduling for Email Campaigns").font.bold = True
    doc.add_paragraph(
        "Managing scheduled email campaigns in Mali AI without relying on heavy external queue infrastructure required a lightweight yet fail-safe scheduler that would not block the Node.js event loop. Building an internal asynchronous queue scheduler utilizing atomic state transitions ('pending', 'processing', 'sent', 'failed') solved this challenge."
    )

    # ---------------- PAGE 21: CHAPTER 9 CONT ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(15)
    p.add_run("4. Handling Environment Files in CI/CD Deployment").font.bold = True
    doc.add_paragraph(
        "Another challenge was learning how to manage environment (.env) files securely during development and deployment. Early on, I mistakenly pushed sensitive credentials to GitHub, which served as a wake-up call about the importance of cybersecurity, even in smaller projects. I quickly learned to use gitignore, configure environment variables on deployment platforms, and distinguish between development and production setups. Although I initially disliked working on configurations, I later realized their importance and appreciated how these practices improved my attention to detail."
    )

    p = doc.add_paragraph()
    p.add_run("5. Time Management in Collaborative Projects").font.bold = True
    doc.add_paragraph(
        "On the non-technical side, time management in team projects was a significant challenge. Coordinating responsibilities for tasks such as building the multi-suite dashboard or preparing pitch decks often created stressful situations, especially when deadlines overlapped with debugging sessions. While the pressure was difficult at first, I gradually developed teamwork and organizational skills. Tools like GitHub Projects helped streamline task allocation, and I began to value the collaborative aspect of group work as it reflected real industry practices."
    )

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(25)
    p.add_run("Reflections on the Workplace").font.bold = True
    doc.add_paragraph(
        "Overall, I found the environment at Elite Forums to be supportive and learning-oriented. The mentors were approachable, weekly evaluations encouraged consistency, and the exposure to multiple domains—ranging from React to generative AI to Supabase—was immensely valuable. I particularly appreciated the balance between theoretical sessions, coding practice, and project-based learning."
    )
    doc.add_paragraph(
        "On the other hand, the fast pace of training sometimes felt overwhelming, especially when transitioning quickly between diverse technologies. However, this very challenge improved my adaptability, which I believe will be a critical skill in my future career."
    )

    # ---------------- PAGE 22: CHAPTER 10 ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.add_run("CHAPTER 10").font.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(14)
    p.add_run("CONCLUSION").font.bold = True

    doc.add_paragraph(
        "My internship experience at Elite Forums has been both enriching and transformative, blending technical learning with professional growth. Throughout the program, I was introduced to a broad spectrum of domains, including full-stack web development, React 18, Git & GitHub, authentication systems, Generative AI models, PDFKit rendering, and project deployment. Each stage offered exposure to new tools, methodologies, and real-world practices, allowing me to strengthen not only my foundational knowledge but also my advanced technical expertise."
    )
    doc.add_paragraph(
        "The challenges I encountered—such as understanding asynchronous programming, debugging dynamic coordinate pagination in PDFKit, ensuring secure deployments, and managing time during group projects—were not setbacks but steppingstones. They taught me resilience, adaptability, and structured problem-solving, while also building my confidence to handle real-world IT challenges."
    )
    doc.add_paragraph(
        "What I valued most was the balanced approach of the program. The integration of theory, hands-on coding, weekly assessments, and collaborative projects provided a holistic learning experience. This structure mirrored industry workflows and prepared me for the expectations of a professional IT environment. While the pace of training was at times demanding, it ultimately instilled discipline, focus, and a results-driven mindset."
    )
    doc.add_paragraph(
        "Overall, this internship has given me a solid foundation in software development and data-driven problem-solving, while also nurturing essential professional values such as teamwork, accountability, and continuous learning. The opportunity to work with cutting-edge technologies like React, Supabase, Groq AI, and modern backend architectures has broadened my career perspective and motivated me to explore advanced areas of Generative AI and emerging computing technologies."
    )
    doc.add_paragraph(
        "In conclusion, the internship was far more than an academic requirement—it was a life-changing experience that successfully bridged the gap between academic concepts and industry applications. It has equipped me with the skills, confidence, and mindset required to face future challenges in the IT sector and has laid a strong foundation for my journey as a computer engineer."
    )

    # ---------------- PAGE 23: CHAPTER 11 ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.add_run("CHAPTER 11").font.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(14)
    p.add_run("REFERENCES/SOURCE OF INFORMATION").font.bold = True

    p = doc.add_paragraph()
    p.add_run("References / Sources of Information").font.bold = True

    p = doc.add_paragraph()
    p.add_run("1. Official Documentation & Guides").font.bold = True
    doc.add_paragraph("• React 18 Documentation – https://react.dev/")
    doc.add_paragraph("• Vite Next Generation Frontend Tooling – https://vitejs.dev/")
    doc.add_paragraph("• Tailwind CSS Documentation – https://tailwindcss.com/docs")
    doc.add_paragraph("• Node.js Official Documentation – https://nodejs.org/docs")
    doc.add_paragraph("• Express.js API Reference – https://expressjs.com/")
    doc.add_paragraph("• Groq SDK & LPU Inference Docs – https://console.groq.com/docs")
    doc.add_paragraph("• PDFKit Document Generation Guide – https://pdfkit.org/docs/")
    doc.add_paragraph("• Supabase Documentation – https://supabase.com/docs")
    doc.add_paragraph("• Git & GitHub Guides – https://docs.github.com/")
    doc.add_paragraph("• Nodemailer Email Transport Documentation – https://nodemailer.com/")
    doc.add_paragraph("• JSZip Client-Side Zip Library – https://stuk.github.io/jszip/")

    p = doc.add_paragraph()
    p.add_run("2. Learning Platforms").font.bold = True
    doc.add_paragraph("• Elite Forums Internal Training Materials & PPTs")
    doc.add_paragraph("• MDN Web Docs (Mozilla Developer Network) – https://developer.mozilla.org/")
    doc.add_paragraph("• Code Signals – https://codesignal.com/learn/course-paths")
    doc.add_paragraph("• Kaggle Tutorials – https://www.kaggle.com/learn (for AI algorithms & datasets)")

    p = doc.add_paragraph()
    p.add_run("3. Research Papers & Books").font.bold = True
    doc.add_paragraph("• JavaScript: The Definitive Guide – David Flanagan")
    doc.add_paragraph("• Learning React: Functional Web Development with React and Redux – Alex Banks, Eve Porcello")
    doc.add_paragraph("• Hands-On Machine Learning with Scikit-Learn, Keras & TensorFlow – Aurélien Géron")

    # ---------------- PAGE 24: CHAPTER 11 CONT ----------------
    doc.add_page_break()
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(15)
    p.add_run("4. Tools & Software Used").font.bold = True
    doc.add_paragraph("• Visual Studio Code (IDE)")
    doc.add_paragraph("• GitHub (Version Control)")
    doc.add_paragraph("• Node.js & npm (Runtime & Package Management)")
    doc.add_paragraph("• Supabase Cloud Platform")
    doc.add_paragraph("• Postman (REST API Endpoint Testing)")
    doc.add_paragraph("• Chrome DevTools (UI Inspection & Performance Profiling)")

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(80)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("Elite Forums: - https://in.linkedin.com/company/eliteforums\nIT Services & Consulting • Vasai (East), Maharashtra – 401208")
    r.font.bold = True

    output_path = r"c:\Users\Dhruv's Dell\Desktop\Remo\ProForge_AI_Internship_Report.docx"
    doc.save(output_path)
    print("DOCX successfully re-generated.")

if __name__ == "__main__":
    build_docx()
