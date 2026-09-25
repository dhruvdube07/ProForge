# Proforge AI 🚀
### End-to-End Career Intelligence & Branding Suite

Proforge AI is a premium, full-stack platform designed to connect candidate profiling, dynamic portfolio publishing, ATS scoring audits, recruiter outreach, and social brand building under a unified, state-of-the-art AI engine. 

---

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, Vite, Tailwind CSS v3, PostCSS, Lucide Icons, Vanilla CSS transitions (Apple-smooth curves) |
| **Backend** | Node.js, Express, Nodemailer (Zoho SMTP), Groq SDK (Llama 3/Qwen), JWT Auth, PDFKit, JSZip |
| **Database & Auth** | Supabase Database (Profiles/OTPs), Supabase Auth (User registrations) |

---

## 📂 Project Structure

```text
proforge/
├── backend/
│   ├── server.js               # Express server runner
│   ├── supabaseClient.js       # Supabase service role client
│   ├── emailClient.js          # Zoho SMTP transporter & HTML alerts builder
│   ├── groqClient.js           # Groq SDK controller (BYOK integration)
│   ├── pdfGenerator.js         # PDFKit rendering pipeline (A4 scaled pages)
│   ├── loginHistory.js         # Security login audits & IP trackers
│   ├── routes/                 # Express API routing controllers
│   └── middleware/             # RequireAuth JWT token interceptors
├── frontend/
│   ├── index.html              # Font declarations & core entry wrapper
│   ├── src/
│   │   ├── App.jsx             # React routing guards & navigation paths
│   │   ├── main.jsx            # Entry mount point
│   │   ├── components/         # Common inputs, text boxes, and navbar
│   │   ├── pages/              # Hub, Auth, Settings, and sub-AI suite editors
│   │   └── hooks/              # Auth context & Profile custom headers fetching hooks
│   └── index.css               # Apple-smooth UI curves, animations, and 10 visual themes
└── README.md
```

---

## ⭐️ Key Platform Sub-AI Suites

### 1. Remo AI — Smart Resume Builder
* In-place AI bullet points refinement and dynamic A4 PDF page formatting.
* Renders print-ready, multi-page PDFs cleanly with over 105 layout combinations.

### 2. Folio AI — Web Portfolio Publisher
* Customize interactive bio highlights, title overrides, and case study parameters.
* 4 responsive themes: **Bento Grid**, **Cyber Terminal**, **Modern Executive**, and **Clean Glassmorphism**.
* Zero-dependency standalone HTML/CSS/JS export in **`.ZIP`** format via client-side `JSZip`.
* In-page **Open Profile Switcher** to shift candidate records instantly on the fly.

### 3. Talo AI — ATS Alignment Auditor
* Real-time job description parsing and comparative alignment scoring.
* Delivers detailed recommendations, missing keywords, and profile mismatch auditing reports.

### 4. Covo AI — Recruiter Outreach Studio
* Drafts customizable cold emails, recruiter pitches, and LinkedIn InMails tailored to specific profiles.

### 5. Liko AI — LinkedIn Architect
* Generates engaging social posts, bios, and dynamic hook alternatives to boost networking reach.

---

## 🎨 Professional Themes System (Apple-Smooth)
Proforge AI includes **10 premium visual themes** that dynamically randomize on initial site loads or user logins:
* **🌌 Luna Theme**: Deep obsidian & electric cyan highlights.
* **🔮 Moon Theme**: Luminous slate & deep violet amethyst details.
* **☀️ Solara Gold**: Charcoal black & warm golden-yellow solar accents.
* **🌲 Aurora Emerald**: Forest-teal & glowing emerald-green details.
* **🎒 Nebula Crimson**: Cherry-black & glowing ruby-red highlights.
* **⚡ Cyber Neon**: Cyberpunk hot pink & bright cyan details.
* **❄️ Glacier Blue**: Cool gray-blue & arctic ice highlights.
* **🌋 Vulcan Orange**: Obsidian black & volcanic flame orange highlights.
* **🍃 Forest Olive**: Sage-green background & light olive accents.
* **◽ Monochrome Silver**: Pure gray-scale, silver & platinum accents.

*All inputs, button states, and hover transitions are styled with Apple-style snapping spring curves (`cubic-bezier(0.16, 1, 0.3, 1)`) and active tap scaling (`scale(0.97)`).*

---

## 🛡️ Multi-Device Security Alerts
Tracks user login signatures (IP + User-Agent headers). If a user accesses their account from **3+ distinct devices**, or triggers **3+ consecutive logins** on a specific signature, Proforge AI sends an automated security alert email with details (IP, timestamp, browser type) and an account lock action button.

---

## 🔐 Database Setup (Supabase)

Initialize your Supabase database schema by running the following SQL in your **SQL Editor**:

```sql
-- Create OTPs table for signup security verification
CREATE TABLE IF NOT EXISTS otps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create Profiles table for central candidate profile data
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  profession TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  soft_skills JSONB DEFAULT '[]'::jsonb,
  hobbies JSONB DEFAULT '[]'::jsonb,
  interests JSONB DEFAULT '[]'::jsonb,
  strengths JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  goal TEXT,
  personality_traits JSONB DEFAULT '[]'::jsonb,
  values JSONB DEFAULT '[]'::jsonb,
  tagline TEXT,
  bio TEXT,
  template_preference TEXT DEFAULT 'modern',
  font_preference TEXT DEFAULT 'inter',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Disable Row Level Security (RLS) for setup, or configure service policies
ALTER TABLE otps DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

---

## 🚀 How to Run Locally

### 1. Configure Environmental Keys
Create a `.env` file in your `backend/` directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GROQ_API_KEY=your_groq_api_key
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_USER=your_zoho_alert_email
SMTP_PASS=your_zoho_password
```

### 2. Start Backend API Server
```powershell
cd backend
npm install
npm run dev
```
The backend API server launches on [http://localhost:5000](http://localhost:5000).

### 3. Start Frontend Client (Vite)
```powershell
cd frontend
npm install
npm run dev
```
The client app boots on [http://localhost:5173](http://localhost:5173). All API requests proxy seamlessly to the backend server.

---

## ☁️ Deploying to Vercel

ProForge is pre-configured with root `vercel.json` and an automated serverless entry point (`api/index.js`) for seamless zero-config deployment on Vercel:

1. Push your changes to GitHub.
2. In your [Vercel Dashboard](https://vercel.com/dashboard), click **"Add New Project"** and select your repository.
3. Keep the default settings:
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm --prefix frontend install && npm --prefix frontend run build` (configured automatically in `vercel.json`)
   - **Output Directory**: `frontend/dist` (configured automatically in `vercel.json`)
4. *(Optional)* In Project Settings > Environment Variables, configure any optional keys (`GROQ_API_KEY`, `SUPABASE_URL`, etc.). The app includes built-in offline/hybrid storage and a pre-seeded demo account (`demo@profileforge.ai` / `password123`) so authentication and all suites work immediately on Vercel.
5. Click **Deploy**. Vercel will build the frontend SPA and route all `/api/*` endpoints to the serverless Express backend automatically.

