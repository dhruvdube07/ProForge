# ProfileForge 🚀
### AI Resume & Personal Branding Studio

ProfileForge is a premium, full-stack application designed to craft professional resumes, cover letters, HTML email signatures, and LinkedIn bios using state-of-the-art AI analysis.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React, Vite, Tailwind CSS v3, PostCSS, Lucide Icons, HTML5, Vanilla CSS transitions |
| **Backend** | Node.js, Express, Nodemailer (Zoho SMTP), Groq SDK (Llama 3 JSON Mode), JWT Auth, PDFKit |
| **Database & Auth** | Supabase Database (Profiles/OTPs), Supabase Auth (User registrations) |

---

## 📂 Project Structure

```text
profileforge/
├── backend/
│   ├── server.js               # Entry server launcher
│   ├── supabaseClient.js       # Admin client connection
│   ├── emailClient.js          # Zoho SMTP helper
│   ├── groqClient.js           # Groq AI text analyzer
│   ├── pdfGenerator.js         # PDF resume & cover letter styles
│   ├── routes/                 # API controllers
│   └── middleware/             # Authentications
├── frontend/
│   ├── index.html              # Core font imports & HTML wrapper
│   ├── tailwind.config.js      # Emerald/Midnight colors mapping
│   ├── src/
│   │   ├── App.jsx             # Route guards & layout definitions
│   │   ├── main.jsx            # Entry point
│   │   ├── components/         # Reusable inputs, badge selectors
│   │   ├── pages/              # Landing, dashboards, histories
│   │   └── hooks/              # Custom context states
└── README.md
```

---

## 🔐 Database Setup (Supabase)

Copy and run this SQL query in your **Supabase SQL Editor** to create the required tables:

```sql
-- Create OTPs table to manage logins
CREATE TABLE IF NOT EXISTS otps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create Profiles table for personal branding versions
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

-- Disable Row Level Security (RLS) for testing, or set policies for service role bypass
ALTER TABLE otps DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

---

## 🚀 How to Run Locally

### 1. Install & Start Backend

Navigate to the `backend/` directory, install packages, and boot the server:

```powershell
cd backend
npm install
npm run dev
```

The backend server starts on [http://localhost:5000](http://localhost:5000).

### 2. Install & Start Frontend

Open a new shell, navigate to the `frontend/` directory, install packages, and start Vite:

```powershell
cd frontend
npm install
npm run dev
```

The frontend client starts on [http://localhost:5173](http://localhost:5173). It proxies API traffic directly to the backend.
