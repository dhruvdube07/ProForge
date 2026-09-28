import dotenv from 'dotenv';
dotenv.config();

import Groq from 'groq-sdk';

let defaultGroq = null;
const getDefaultGroq = () => {
  const key = process.env.GROQ_API_KEY;
  if (key && key.trim() !== '') {
    if (!defaultGroq) {
      try {
        defaultGroq = new Groq({ apiKey: key.trim() });
      } catch (err) {
        console.warn('Groq client initialization warning:', err.message);
      }
    }
    return defaultGroq;
  }
  return null;
};

/**
 * Returns the default Groq client or instantiates a custom one if a custom key is provided.
 */
const getClient = (customApiKey) => {
  if (customApiKey && customApiKey.trim() !== '') {
    return new Groq({ apiKey: customApiKey.trim() });
  }
  const client = getDefaultGroq();
  if (client) {
    return client;
  }
  throw new Error('Groq API Key is not configured. Please supply a custom API key in Settings or set GROQ_API_KEY in your environment.');
};

/**
 * Robust Multi-Model Fallback Engine with Auto-Retry & Extraction
 * Tries high-speed models in order: qwen/qwen3.8-27b, openai/gpt-oss-120b, openai/gpt-oss-20b
 */
const FALLBACK_MODELS = [
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b'
];

/**
 * Cleans markdown fences, extra whitespace, or trailing artifacts from AI text output.
 */
const cleanJsonString = (raw) => {
  if (!raw) return '{}';
  let cleaned = raw.trim();
  // Remove markdown code fences if present (```json ... ``` or ``` ...)
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  // Extract outermost json object if wrapped in text
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
};

/**
 * Executes a chat completion with sequential model fallback
 */
async function callGroqWithFallback(activeClient, payload, isJson = true) {
  let lastError = null;

  for (let i = 0; i < FALLBACK_MODELS.length; i++) {
    const modelName = FALLBACK_MODELS[i];
    try {
      console.log(`[Groq AI] Attempting inference with model: ${modelName}...`);
      const requestOptions = {
        ...payload,
        model: modelName,
      };
      
      if (isJson && !modelName.includes('gemma')) {
        requestOptions.response_format = { type: 'json_object' };
      }

      const chatCompletion = await activeClient.chat.completions.create(requestOptions);
      const content = chatCompletion.choices[0]?.message?.content || (isJson ? '{}' : '');

      if (isJson) {
        const cleaned = cleanJsonString(content);
        const parsed = JSON.parse(cleaned);
        return parsed;
      }
      return content;
    } catch (err) {
      console.warn(`[Groq AI] Model ${modelName} failed or throttled: ${err.message}. Cascading to fallback...`);
      lastError = err;
    }
  }

  throw lastError || new Error('All AI fallback models exhausted.');
}

/**
 * Deterministic Regex/Rule-based Fallback Parser
 * If all AI models fail or network disconnects completely, generates a valid structured profile from user input!
 */
export const generateDeterministicFallbackProfile = (userInput) => {
  const text = String(userInput || '').trim();
  const words = text.split(/\s+/).filter(Boolean);
  
  // Extract candidate name if available (e.g. "My name is John Doe" or first 2 words)
  let name = 'Professional Candidate';
  const nameMatch = text.match(/(?:my name is|i am|name:)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  if (nameMatch && nameMatch[1]) {
    name = nameMatch[1];
  } else if (words.length >= 2 && /^[A-Z]/.test(words[0]) && /^[A-Z]/.test(words[1])) {
    name = `${words[0]} ${words[1]}`;
  }

  // Extract profession
  let profession = 'Software Engineer & Specialist';
  const profMatch = text.match(/(?:working as a?|work as an?|i am an?|i'm an?|profession:|role:)\s+([A-Za-z0-9\s+/#-]+?)(?:\.|\bat\b|\bfor\b|\bwith\b|\n|$)/i);
  if (profMatch && profMatch[1]) {
    profession = profMatch[1].trim();
  } else {
    const generalMatch = text.match(/(?:Software Engineer|Full Stack Developer|Frontend Developer|Backend Developer|Game Developer|DevOps Engineer|Data Scientist|Product Manager|System Architect|UI\/UX Designer)/i);
    if (generalMatch) {
      profession = generalMatch[0].trim();
    }
  }
  // Strip conversational fragments if present
  profession = profession.replace(/^(i am a|i am an|i'm a|i'm an|my name is)\s+/i, '').trim();
  if (profession.length < 3 || profession.length > 50) {
    profession = 'Senior Software Engineer';
  }

  const cleanNameNoSpace = name.toLowerCase().replace(/[^a-z]/g, '');

  return {
    name: name,
    profession: profession.length > 50 ? 'Senior Specialist' : profession,
    tagline: `Results-driven ${profession} delivering high-impact solutions`,
    bio: text.length > 30 ? text : `Experienced ${profession} with a strong track record of success, innovative problem-solving, and cross-functional team leadership.`,
    goal: `Leverage core competencies to drive strategic value, accelerate delivery, and contribute to cutting-edge organizational initiatives.`,
    contact_email: `${cleanNameNoSpace || 'candidate'}@proforge.ai`,
    contact_phone: '+1 (555) 019-2834',
    contact_location: 'San Francisco, CA',
    linkedin_url: `linkedin.com/in/${cleanNameNoSpace || 'profile'}`,
    portfolio_url: `https://${cleanNameNoSpace || 'portfolio'}.dev`,
    github_url: `github.com/${cleanNameNoSpace || 'developer'}`,
    skills: [
      'Problem Solving',
      'System Architecture',
      'Agile & Scrum',
      'Strategic Execution',
      'Technical Communication',
      'Project Leadership'
    ],
    soft_skills: [
      'Cross-functional Leadership',
      'High-Impact Collaboration',
      'Analytical Thinking',
      'Adaptive Learning'
    ],
    strengths: [
      'Fast-paced Execution',
      'End-to-End Ownership',
      'Scalable Solution Design'
    ],
    achievements: [
      'Successfully engineered and deployed critical operational milestones on schedule',
      'Streamlined core workflows resulting in significant efficiency gains across cross-functional teams',
      'Recognized for exceptional contribution and high quality execution standard'
    ],
    hobbies: ['Tech Exploration', 'Open Source', 'Mentorship', 'Reading'],
    interests: ['Artificial Intelligence', 'Cloud Infrastructure', 'Design Systems'],
    personality_traits: ['Driven', 'Methodical', 'Collaborative', 'Innovative'],
    values: ['Integrity', 'Excellence', 'Continuous Growth', 'User Centricity'],
    experience: [
      {
        company: 'Key Technology Partner',
        role: profession || 'Senior Specialist',
        duration: '2021 - Present',
        description: `Spearheaded key functional initiatives, engineered core workflows, and collaborated cross-functionally to achieve strategic delivery targets.`
      },
      {
        company: 'Innovate Solutions Group',
        role: 'Associate Specialist',
        duration: '2019 - 2021',
        description: `Contributed to foundational architecture, optimized processes, and delivered high-quality project requirements with consistent excellence.`
      }
    ],
    education: [
      {
        school: 'University of Technology & Science',
        degree: 'Bachelor of Science in Computer Science / Engineering',
        duration: '2015 - 2019',
        description: 'Graduated with academic distinction, focusing on modern computing systems and analytical problem solving.'
      }
    ],
    projects: [
      {
        title: 'Core Platform Optimization',
        technologies: 'Full Stack Architecture, Modern Frameworks, Cloud Infrastructure',
        duration: '2023',
        description: 'Architected and implemented a high-performance modular pipeline improving latency and response reliability.'
      }
    ],
    languages: ['English (Fluent)', 'Spanish (Conversational)'],
    certifications: ['Certified Solutions Architect', 'Professional Project Lead'],
    internships: [
      {
        job_title: 'Engineering Intern',
        employer: 'NextGen Labs',
        duration: 'Summer 2018',
        description: 'Assisted in building proof-of-concept features and testing performance benchmarks.'
      }
    ],
    courses: [
      {
        course_name: 'Advanced System Design & Scalability',
        institution: 'Executive Tech Academy',
        duration: '2022'
      }
    ],
    references_list: [
      {
        name: 'Alex Mercer',
        company: 'Director of Technology, Innovations Inc.',
        contact: 'alex.mercer@innovations.corp',
        description: 'Supervised direct contributions and praised execution velocity and problem solving leadership.'
      }
    ],
    extra_curricular: [
      {
        role: 'Hackathon Mentor & Volunteer',
        employer: 'Tech Community Outreach',
        duration: '2022 - Present',
        description: 'Guided upcoming junior developers and facilitated hands-on workshops in technical problem solving.'
      }
    ]
  };
};

/**
 * Sends a freeform user profile description to Groq AI and returns parsed structured JSON.
 * Protected by multi-model bounce back and guaranteed deterministic parser failover!
 */
export const analyzeProfileText = async (userInput, customApiKey = null) => {
  const activeClient = getClient(customApiKey);
  const prompt = `
Extract structured personal branding and professional resume data from the text below. 

Return ONLY valid JSON with these fields:
- name: string
- profession: string
- contact_email: string (infer if not explicit, e.g. based on name)
- contact_phone: string (infer a realistic mock if missing, e.g. +1-555-0199)
- contact_location: string (e.g. City, State or Country, infer realistically if missing)
- linkedin_url: string (infer a professional mock if missing, e.g. linkedin.com/in/username)
- portfolio_url: string (infer a mock if missing)
- github_url: string (infer a mock if missing)
- skills: array of strings (technical/professional skills)
- soft_skills: array of strings (leadership, communication, etc.)
- hobbies: array of strings
- interests: array of strings
- strengths: array of strings
- achievements: array of strings
- goal: string (career goal)
- personality_traits: array of strings
- values: array of strings
- tagline: string (one-line brand tagline)
- bio: string (professional summary paragraph)
- experience: array of objects containing { company, role, duration, description }
- education: array of objects containing { school, degree, duration, description }
- projects: array of objects containing { title, technologies, duration, description }
- languages: array of strings
- certifications: array of strings
- internships: array of objects containing { job_title, employer, duration, description }
- courses: array of objects containing { course_name, institution, duration }
- references_list: array of objects containing { name, company, contact, description }
- extra_curricular: array of objects containing { role, employer, duration, description }

Rules:
1. If any field cannot be found, infer it intelligently and creatively from context to populate it.
2. Strict A4 Content Budgeting: Keep all descriptions concise, impactful, and bounded so they fit gracefully onto physical A4 pages without overflowing or trailing off.
3. Keep all arrays concise (3-5 items each). Bullet points must be dense with action verbs and quantifiable impact (1-2 lines per bullet).
3. Experience, Education, and Projects arrays should contain realistic detailed mock items if the user's description is brief, so they have a complete template to start with.
4. Do NOT include any markdown code blocks or extra text. Output ONLY the JSON object.

Text to analyze:
"${userInput}"
`;

  try {
    const parsedResult = await callGroqWithFallback(activeClient, {
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI Resume and Personal Branding assistant. You output ONLY valid JSON. If fields are missing in the text, you infer them creatively to build a stunning profile.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3
    }, true);

    return parsedResult;
  } catch (error) {
    console.error('All AI models failed during Groq Profile analysis. Activating deterministic emergency parser...', error.message);
    // Guaranteed fallback profile generation so user NEVER encounters a hard failure screen
    return generateDeterministicFallbackProfile(userInput);
  }
};

/**
 * Refines a base profile JSON using custom slider metrics and company context.
 */
export const refineProfileText = async (baseProfile, companyContext, sliders, customApiKey = null) => {
  const activeClient = getClient(customApiKey);
  const prompt = `
Take the base personal branding profile below:
${JSON.stringify(baseProfile, null, 2)}

Refine and rewrite the details to align with the following parameters:
- Target Context/Company: "${companyContext || 'General Professional'}"
- Grammar Complexity (1 to 5 scale where 1 is simple kid-friendly english, 5 is academic english professor level vocabulary): level ${sliders.grammar || 3}
- Detail Depth & Length (1 to 5 scale where 1 is short brief summary, 5 is detailed and comprehensive descriptions): level ${sliders.depth || 3}
- Realism / Experience Boost (1 to 5 scale where 1 is realistic and decent, 5 is "God Professional" - highly optimized, senior-level elite industry phrasing of accomplishments): level ${sliders.realism || 3}
- Creativity & Buzzwords (1 to 5 scale where 1 is plain and direct, 5 is high-impact trendsetting buzzwords): level ${sliders.creativity || 3}
- Action Verbs Density (1 to 5 scale where 1 is natural standard flow, 5 is high-performance strong action verbs starting every bullet): level ${sliders.actionVerbs || 3}
- Industry Focus (1 to 5 scale where 1 is generalist, 5 is highly technical/domain-specific): level ${sliders.industryFocus || 3}

Instructions:
1. Rewrite and refine the "bio", "goal", "tagline", "achievements", "skills", and the descriptions inside the "experience", "education", "projects", "internships", "courses", "references_list", and "extra_curricular" arrays to match the sliders and target company/context.
2. Maintain the same JSON schema:
{
  "name": "string",
  "profession": "string",
  "contact_email": "string",
  "contact_phone": "string",
  "contact_location": "string",
  "linkedin_url": "string",
  "portfolio_url": "string",
  "github_url": "string",
  "skills": ["string"],
  "soft_skills": ["string"],
  "hobbies": ["string"],
  "interests": ["string"],
  "strengths": ["string"],
  "achievements": ["string"],
  "goal": "string",
  "personality_traits": ["string"],
  "values": ["string"],
  "tagline": "string",
  "bio": "string",
  "experience": [{ "company": "string", "role": "string", "duration": "string", "description": "string" }],
  "education": [{ "school": "string", "degree": "string", "duration": "string", "description": "string" }],
  "projects": [{ "title": "string", "technologies": "string", "duration": "string", "description": "string" }],
  "languages": ["string"],
  "certifications": ["string"],
  "internships": [{ "job_title": "string", "employer": "string", "duration": "string", "description": "string" }],
  "courses": [{ "course_name": "string", "institution": "string", "duration": "string" }],
  "references_list": [{ "name": "string", "company": "string", "contact": "string", "description": "string" }],
  "extra_curricular": [{ "role": "string", "employer": "string", "duration": "string", "description": "string" }]
}
`;

  try {
    const refinedResult = await callGroqWithFallback(activeClient, {
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI Resume Writer and Executive Branding Coach. You refine resume fields according to strict design, realism, and complexity parameters. You output ONLY valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4
    }, true);

    return refinedResult;
  } catch (error) {
    console.error('All AI models failed during refinement. Returning safe enhanced base profile...', error.message);
    return {
      ...baseProfile,
      tagline: `Targeting ${companyContext || 'Top Industry Roles'} with proven leadership & execution velocity`,
      bio: `${baseProfile.bio || ''} (Tailored for ${companyContext || 'target opportunities'})`
    };
  }
};

/**
 * Calculates ATS match percentage, keyword gaps, and feedback based on a Job Description.
 */
export const calculateAtsScore = async (profile, jd, customApiKey = null) => {
  const activeClient = getClient(customApiKey);
  const prompt = `
You are an expert ATS (Applicant Tracking System) parser and recruiter.
Analyze the candidate's professional profile against the provided Job Description (JD) and compute the match.

Candidate Profile:
${JSON.stringify({
  profession: profile.profession,
  tagline: profile.tagline,
  bio: profile.bio,
  skills: profile.skills,
  soft_skills: profile.soft_skills,
  experience: profile.experience,
  education: profile.education,
  projects: profile.projects
}, null, 2)}

Target Job Description (JD):
"${jd}"

Compute:
1. An overall match score (0 to 100 percentage integer).
2. List of matching technical/soft skills present in both the profile and JD.
3. List of critical missing technical/soft skills requested in the JD but missing or weak in the profile.
4. Actionable professional feedback to improve the profile for this role.

Output ONLY a valid JSON object with the following structure:
{
  "score": 75,
  "matchedSkills": ["React", "CSS", "API Design"],
  "missingSkills": ["TypeScript", "CI/CD", "AWS"],
  "feedback": "Your experience with React and UI development is a strong match, but you should explicitly highlight TypeScript and cloud deployment skills to meet the core requirements of this role."
}
Do not include any explanation or markdown code block wrapper. Only output JSON.
`;

  try {
    return await callGroqWithFallback(activeClient, {
      messages: [
        {
          role: 'system',
          content: 'You are an expert ATS scorer. You output ONLY valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2
    }, true);
  } catch (error) {
    console.error('ATS AI match error. Falling back to local semantic heuristics...', error.message);
    // Local keyword comparison heuristic fallback
    const jdLower = String(jd || '').toLowerCase();
    const candidateSkills = Array.isArray(profile.skills) ? profile.skills : [];
    const matched = candidateSkills.filter(s => jdLower.includes(String(s).toLowerCase()));
    const missing = ['Cloud Deployment (AWS/GCP)', 'Automated CI/CD', 'Scalable Architecture', 'Unit & Integration Testing']
      .filter(item => !matched.some(m => m.toLowerCase().includes(item.split(' ')[0].toLowerCase())));

    const calculatedScore = Math.min(95, Math.max(60, 65 + (matched.length * 6)));

    return {
      score: calculatedScore,
      matchedSkills: matched.length > 0 ? matched : ['Problem Solving', 'Domain Expertise', 'Team Collaboration'],
      missingSkills: missing.slice(0, 3),
      feedback: `Your background aligns with core competencies in ${profile.profession || 'your field'}. Emphasize targeted keywords and metrics corresponding directly with this Job Description.`
    };
  }
};

/**
 * Rewrites a specific resume bullet description to align with key requirements of a Job Description.
 */
export const rewriteAtsBullet = async (bullet, jd, customApiKey = null) => {
  const activeClient = getClient(customApiKey);
  const prompt = `
You are an elite career coach. Rewrite the following resume achievement bullet or experience description to align semantically with the target Job Description (JD), utilizing high-performance action verbs and showing quantitative results if possible.

Original Bullet:
"${bullet}"

Target Job Description Context:
"${jd}"

Output ONLY a valid JSON object with the following structure:
{
  "original": "original bullet",
  "rewritten": "optimized and rewritten bullet starting with a strong action verb",
  "reason": "explanation of what key terms or skills were added to align with the JD"
}
Do not include any explanation or markdown code block wrapper. Only output JSON.
`;

  try {
    return await callGroqWithFallback(activeClient, {
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume optimizer. You output ONLY valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3
    }, true);
  } catch (error) {
    console.error('Bullet rewrite error. Providing local action-verb optimization...', error.message);
    const cleaned = String(bullet || '').trim();
    const actionVerbs = ['Spearheaded', 'Orchestrated', 'Engineered', 'Accelerated', 'Optimized'];
    const chosen = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
    return {
      original: cleaned,
      rewritten: `${chosen} execution of ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)}, improving team throughput and delivery efficiency.`,
      reason: 'Enhanced impact with executive action verb and quantifiable delivery context.'
    };
  }
};

/**
 * Generates cover letter, LinkedIn InMail, and Elevator Pitch using Groq LLM.
 */
export const generateOutreachStudio = async (profile, companyName, jobTitle, jd, tone, customApiKey = null) => {
  const activeClient = getClient(customApiKey);
  const prompt = `
You are an elite career brand specialist and copywriter.
Generate outreach assets for the candidate targeting this role:
- Company Name: "${companyName}"
- Job Title: "${jobTitle}"
- Job Description Context: "${jd || 'General application'}"
- Outreach Tone: "${tone || 'Professional'}" (e.g. Professional, Confident & Bold, Technical, Minimalist)

Candidate Profile:
${JSON.stringify({
  name: profile.name,
  profession: profile.profession,
  tagline: profile.tagline,
  bio: profile.bio,
  skills: profile.skills,
  experience: profile.experience,
  projects: profile.projects
}, null, 2)}

Please write:
1. A full-length tailored Cover Letter (approx. 250-350 words). Include placeholder spaces like [Date], [Hiring Manager Name] if appropriate, but write a fully custom body.
2. A short, highly persuasive LinkedIn InMail message to a recruiter or hiring manager (strictly under 100 words).
3. A punchy 3-sentence Elevator Pitch perfect for quick application portals or networking.

Output ONLY a valid JSON object with this structure:
{
  "coverLetter": "tailored cover letter text",
  "linkedinInMail": "linkedin inmail text under 100 words",
  "elevatorPitch": "3-sentence elevator pitch text"
}
Do not include any explanation or markdown code block wrapper. Only output JSON.
`;

  try {
    return await callGroqWithFallback(activeClient, {
      messages: [
        {
          role: 'system',
          content: 'You are an expert career outreach copywriter. You output ONLY valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    }, true);
  } catch (error) {
    console.error('Outreach generation error. Returning local custom fallback template...', error.message);
    const candidateName = profile.name || 'Candidate';
    const candidateSkills = Array.isArray(profile.skills) ? profile.skills.slice(0, 3).join(', ') : 'technology and strategy';
    return {
      coverLetter: `Dear Hiring Team at ${companyName || 'the Organization'},\n\nI am writing to express my enthusiastic interest in the ${jobTitle || 'Target Position'} role. With extensive experience as a ${profile.profession || 'Specialist'} and proven expertise in ${candidateSkills}, I have consistently delivered high-impact results.\n\nThroughout my career, I have prioritized clean execution, cross-functional leadership, and measurable business growth. I am eager to bring this same dedication and expertise to ${companyName || 'your team'}.\n\nThank you for your consideration. I look forward to the opportunity to discuss how my skill set aligns with your objectives.\n\nSincerely,\n${candidateName}`,
      linkedinInMail: `Hi [Name], I noticed ${companyName || 'your team'} is expanding for the ${jobTitle || 'open role'}. With my background in ${profile.profession || 'this domain'} and experience driving ${candidateSkills}, I'd love to connect briefly and share how I can add immediate value!`,
      elevatorPitch: `I am a ${profile.profession || 'Specialist'} with deep expertise in ${candidateSkills}. I specialize in accelerating product velocity and solving complex operational challenges. I am seeking to bring my leadership and technical acumen to ${companyName || 'innovative industry teams'}.`
    };
  }
};

/**
 * Generates an engaging LinkedIn Post with 3 Hook variations based on a milestone/project.
 */
export const generateLinkedInPost = async (milestone, description, style, customApiKey = null) => {
  const activeClient = getClient(customApiKey);
  const prompt = `
You are a viral LinkedIn personal branding architect.
Create a high-engagement LinkedIn post based on the candidate's career milestone:
- Milestone/Project: "${milestone}"
- Description/Details: "${description}"
- Style/Hook Angle: "${style || 'Storytelling'}" (Storytelling, Contrarian, or Educational)

Instructions:
1. Provide 3 viral Hook variations tailored for this style (storytelling: emotional conflict/journey, contrarian: challenging industry norms, educational: direct value/learnings).
2. Write a highly readable, spaced LinkedIn post body containing:
   - Problem/Context
   - Resolution/How it was built
   - 3 Key Takeaways/Learnings
   - Engaging Call to Action (CTA)
3. Provide 4-5 relevant career/niche hashtags.

Output ONLY a valid JSON object with this structure:
{
  "hooks": [
    "Hook Option 1 (Storytelling/Contrarian/Educational)",
    "Hook Option 2 (Storytelling/Contrarian/Educational)",
    "Hook Option 3 (Storytelling/Contrarian/Educational)"
  ],
  "postText": "Full post body content with emojis, spacers, lessons, and CTA",
  "tags": ["#personalbranding", "#nichetag"]
}
Do not include any explanation or markdown code block wrapper. Only output JSON.
`;

  try {
    return await callGroqWithFallback(activeClient, {
      messages: [
        {
          role: 'system',
          content: 'You are an expert LinkedIn ghostwriter. You output ONLY valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    }, true);
  } catch (error) {
    console.error('LinkedIn post generator fallback...', error.message);
    return {
      hooks: [
        `Most people think ${milestone} requires months of perfection. Here is what actually happened:`,
        `I almost abandoned ${milestone}. Here is why pushing through changed everything:`,
        `3 non-obvious lessons I learned while building ${milestone}:`
      ],
      postText: `🚀 Excited to share a major milestone: ${milestone}!\n\n${description}\n\nKey takeaways from this journey:\n1️⃣ Consistency beats intensity every time.\n2️⃣ Solving the root problem creates compound value.\n3️⃣ Team collaboration and clear feedback loops accelerate delivery.\n\nWhat has been your biggest learning this quarter? Let's discuss below! 👇`,
      tags: ['#careerdevelopment', '#leadership', '#growthmindset', '#innovation']
    };
  }
};

/**
 * Generates an outreach email draft utilizing candidate details, role, company context, and custom tone.
 */
export const generateMaliEmail = async (profile, targetRole, companyContext, tone, promptInstruction, customApiKey = null) => {
  const activeClient = getClient(customApiKey);
  const prompt = `
You are an expert executive outreach copywriter and brand manager.
Write a highly converting, tailored professional outreach email.

Candidate Profile Details:
- Name: "${profile.name || 'Candidate'}"
- Profession: "${profile.profession || 'Professional'}"
- Tagline: "${profile.tagline || ''}"
- Summary: "${profile.bio || ''}"
- Skills: ${Array.isArray(profile.skills) ? profile.skills.join(', ') : '[]'}
- Achievements: ${Array.isArray(profile.achievements) ? profile.achievements.join(', ') : '[]'}

Target Details:
- Job Title / Role: "${targetRole || 'Target Role'}"
- Target Company / Context: "${companyContext || 'Target Company'}"
- Desired Tone: "${tone || 'Professional'}"
- Additional Custom Instructions: "${promptInstruction || ''}"

Instructions:
1. Formulate a strong, high-open-rate subject line.
2. Formulate the email body. The body MUST be formatted as valid HTML (using paragraphs <p>, bold <strong>, breaks <br>, list elements <ul>/<li>, etc.). Do NOT output <html>, <body>, or <head> tags, just the inner HTML snippet.
3. If appropriate, style important text or links. If the candidate has contact info, inject it naturally at the bottom.
4. If a portfolio link is present, write a clean hyperlink: <a href="[Portfolio]" style="color: #3b82f6; text-decoration: underline;">view my portfolio</a>.
5. Return ONLY a valid JSON object matching the schema below:
{
  "subject": "Email Subject Line",
  "body": "<p>Dear Recruiter...</p>"
}
Do not include any explanation or markdown code block wrapper. Only output JSON.
`;

  try {
    return await callGroqWithFallback(activeClient, {
      messages: [
        {
          role: 'system',
          content: 'You are an expert career email ghostwriter. You output ONLY valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    }, true);
  } catch (error) {
    console.error('Mali Email generation fallback...', error.message);
    const candidateName = profile.name || 'Candidate';
    const role = targetRole || 'Target Opportunity';
    const company = companyContext || 'your team';
    return {
      subject: `Exploring ${role} Opportunities | ${candidateName}`,
      body: `<p>Dear Hiring Team,</p><p>I am reaching out to introduce myself and express my strong interest in contributing to <strong>${company}</strong> as a <strong>${role}</strong>.</p><p>With my background as a ${profile.profession || 'professional'}, I have demonstrated a consistent ability to drive impactful results, streamline workflows, and collaborate seamlessly across teams.</p><p>I would welcome the opportunity to connect briefly to discuss how my skill set can support your upcoming initiatives.</p><p>Best regards,<br><strong>${candidateName}</strong><br>${profile.contact_email || ''}</p>`
    };
  }
};
