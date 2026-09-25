import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory cache ensures operations never fail even on read-only serverless filesystems
const inMemoryStore = {
  users: null,
  otps: null,
  profiles: null
};

// Determine writable data directory:
// 1. Try backend/data
// 2. Fall back to /tmp/profileforge_data if read-only (standard for AWS Lambda / Vercel Serverless)
let DATA_DIR = path.join(__dirname, 'data');
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const testPath = path.join(DATA_DIR, '.write_test');
  fs.writeFileSync(testPath, '1');
  fs.unlinkSync(testPath);
} catch (err) {
  DATA_DIR = path.join(process.env.TEMP || process.env.TMP || '/tmp', 'profileforge_data');
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (tmpErr) {
    // If even /tmp fails, inMemoryStore handles everything
  }
}

const USERS_FILE = path.join(DATA_DIR, 'local_users.json');
const OTPS_FILE = path.join(DATA_DIR, 'local_otps.json');
const PROFILES_FILE = path.join(DATA_DIR, 'local_profiles.json');
const JWT_SECRET = process.env.JWT_SECRET || 'proforge_dynamic_studio_jwt_secret_2026';

function getMemoryKey(file) {
  if (file.includes('user')) return 'users';
  if (file.includes('otp')) return 'otps';
  if (file.includes('profile')) return 'profiles';
  return null;
}

function readJson(file, fallback = []) {
  const memKey = getMemoryKey(file);
  if (memKey && inMemoryStore[memKey] !== null) {
    return inMemoryStore[memKey];
  }

  try {
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (memKey) inMemoryStore[memKey] = data;
      return data;
    }
    // Check initial seed file in repository backend/data folder
    const repoFile = path.join(__dirname, 'data', path.basename(file));
    if (fs.existsSync(repoFile)) {
      const data = JSON.parse(fs.readFileSync(repoFile, 'utf8'));
      if (memKey) inMemoryStore[memKey] = data;
      return data;
    }
  } catch (err) {
    // Fall back to memory or default
  }

  if (memKey) inMemoryStore[memKey] = fallback;
  return fallback;
}

function writeJson(file, data) {
  const memKey = getMemoryKey(file);
  if (memKey) {
    inMemoryStore[memKey] = data;
  }

  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    // On read-only serverless disk, in-memory store maintains active state
  }
}

// Initial seed demo user
(function seedDefaultUser() {
  const users = readJson(USERS_FILE, []);
  if (!users.some(u => u.email === 'demo@profileforge.ai')) {
    const demoUser = {
      id: 'demo-user-proforge-001',
      email: 'demo@profileforge.ai',
      passwordHash: hashPassword('password123'),
      firstName: 'Alex',
      lastName: 'Morgan',
      name: 'Alex Morgan',
      gender: 'luna',
      createdAt: new Date().toISOString()
    };
    users.push(demoUser);
    writeJson(USERS_FILE, users);

    // Also seed a demo profile
    const profiles = readJson(PROFILES_FILE, []);
    if (!profiles.some(p => p.user_id === demoUser.id)) {
      profiles.push({
        id: 'demo-profile-001',
        user_id: demoUser.id,
        name: 'Alex Morgan',
        profession: 'Senior Full Stack Engineer',
        tagline: 'Building High-Scale Cloud & AI Distributed Systems',
        bio: 'Passionate software architect with 6+ years of experience leading engineering teams, optimizing low-latency architectures, and deploying production LLM agents.',
        goal: 'Transition into Principal Architect role to design world-class AI developer tools.',
        contact_email: 'alex.morgan@example.com',
        contact_phone: '+1 (555) 019-2834',
        contact_location: 'San Francisco, CA',
        linkedin_url: 'https://linkedin.com/in/alexmorgan-demo',
        portfolio_url: 'https://alexmorgan.dev',
        github_url: 'https://github.com/alexmorgan-demo',
        skills: ['React', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL'],
        soft_skills: ['Engineering Leadership', 'System Architecture', 'Cross-Functional Collaboration'],
        strengths: ['High-Performance Systems', 'Rapid Prototyping', 'Product Velocity'],
        achievements: ['Scaled microservices to 10M+ daily active requests with 99.99% uptime', 'Reduced cloud infrastructure compute costs by 38%'],
        hobbies: ['Open Source', 'Chess', 'Rock Climbing'],
        interests: ['Generative AI', 'Compiler Design', 'Distributed Consensus'],
        personality_traits: ['Analytical', 'Pragmatic', 'High Ownership'],
        values: ['Craftsmanship', 'Continuous Learning', 'User Empathy'],
        experience: [
          {
            company: 'Veloce Cloud Systems',
            role: 'Lead Full Stack Engineer',
            duration: '2022 - Present',
            description: 'Architected real-time streaming pipeline processing 50K events/sec using Node.js and Redis.'
          },
          {
            company: 'NextGen Fintech',
            role: 'Senior Software Engineer',
            duration: '2019 - 2022',
            description: 'Built customer-facing transactional dashboard in React and Tailwind with sub-100ms load times.'
          }
        ],
        education: [
          {
            school: 'University of California, Berkeley',
            degree: 'B.S. in Computer Science',
            duration: '2015 - 2019',
            description: 'Graduated Magna Cum Laude. Focused on Distributed Systems and Machine Learning.'
          }
        ],
        projects: [
          {
            title: 'NeuralFlow AI Gateway',
            technologies: 'Node.js, Groq API, WebSockets, Tailwind',
            duration: '2024',
            description: 'Open-source reverse proxy caching LLM completions with dynamic semantic hashing.'
          }
        ],
        languages: ['English (Native)', 'Spanish (Conversational)'],
        certifications: ['AWS Certified Solutions Architect - Professional', 'Certified Kubernetes Administrator (CKA)'],
        template_preference: 'modern-teal-forest',
        font_preference: 'plus jakarta sans',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      writeJson(PROFILES_FILE, profiles);
    }
  }
})();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'pf_salt').digest('hex');
}

export const localStore = {
  // --- USERS ---
  findUserByEmail(email) {
    const users = readJson(USERS_FILE, []);
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserById(id) {
    const users = readJson(USERS_FILE, []);
    return users.find(u => u.id === id);
  },

  createUser({ email, password, firstName, lastName, gender }) {
    const users = readJson(USERS_FILE, []);
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'user_' + Date.now(),
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      gender: gender || 'luna',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeJson(USERS_FILE, users);
    return newUser;
  },

  validatePassword(user, password) {
    if (!user || !user.passwordHash) return false;
    return user.passwordHash === hashPassword(password);
  },

  updatePassword(email, newPassword) {
    const users = readJson(USERS_FILE, []);
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) {
      throw new Error('User not found');
    }
    users[idx].passwordHash = hashPassword(newPassword);
    users[idx].updatedAt = new Date().toISOString();
    writeJson(USERS_FILE, users);
    return users[idx];
  },

  generateToken(user) {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        first_name: user.firstName,
        last_name: user.lastName,
        gender: user.gender
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
  },

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  },

  // --- OTPS ---
  saveOtp(email, otp, expiresAt) {
    const otps = readJson(OTPS_FILE, []);
    const filtered = otps.filter(o => o.email.toLowerCase() !== email.toLowerCase());
    filtered.push({
      email: email.toLowerCase(),
      otp,
      expiresAt: expiresAt || new Date(Date.now() + 10 * 60 * 1000).toISOString()
    });
    writeJson(OTPS_FILE, filtered);
  },

  verifyOtp(email, otp) {
    const otps = readJson(OTPS_FILE, []);
    const now = new Date().toISOString();
    const matchIndex = otps.findIndex(
      o => o.email.toLowerCase() === email.toLowerCase() && o.otp === otp && o.expiresAt > now
    );
    if (matchIndex === -1) {
      return false;
    }
    // Remove used OTP
    otps.splice(matchIndex, 1);
    writeJson(OTPS_FILE, otps);
    return true;
  },

  // --- PROFILES ---
  getProfilesByUser(userId) {
    const profiles = readJson(PROFILES_FILE, []);
    return profiles.filter(p => p.user_id === userId);
  },

  getProfileById(id) {
    const profiles = readJson(PROFILES_FILE, []);
    return profiles.find(p => p.id === id);
  },

  saveProfile(profileData, userId) {
    const profiles = readJson(PROFILES_FILE, []);
    const now = new Date().toISOString();

    if (profileData.id) {
      const idx = profiles.findIndex(p => p.id === profileData.id);
      if (idx !== -1) {
        profiles[idx] = {
          ...profiles[idx],
          ...profileData,
          updated_at: now
        };
        writeJson(PROFILES_FILE, profiles);
        return profiles[idx];
      }
    }

    // New profile
    const newProfile = {
      ...profileData,
      id: profileData.id || (crypto.randomUUID ? crypto.randomUUID() : 'prof_' + Date.now()),
      user_id: userId,
      created_at: now,
      updated_at: now
    };
    profiles.push(newProfile);
    writeJson(PROFILES_FILE, profiles);
    return newProfile;
  },

  deleteProfile(id, userId) {
    const profiles = readJson(PROFILES_FILE, []);
    const filtered = profiles.filter(p => !(p.id === id && p.user_id === userId));
    writeJson(PROFILES_FILE, filtered);
    return true;
  }
};
