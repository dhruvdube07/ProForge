import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * Sends a freeform user profile description to Groq AI and returns parsed structured JSON.
 * @param {string} userInput - The user's self-description.
 * @returns {Promise<object>} The parsed JSON containing all profile fields.
 */
export const analyzeProfileText = async (userInput) => {
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
2. Keep all arrays concise (3-5 items each).
3. Experience, Education, and Projects arrays should contain realistic detailed mock items if the user's description is brief, so they have a complete template to start with.
4. Do NOT include any markdown code blocks or extra text. Output ONLY the JSON object.

Text to analyze:
"${userInput}"
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
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
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const content = chatCompletion.choices[0]?.message?.content || '{}';
    console.log('Groq Raw Response:', content);
    
    // Parse the JSON object
    const result = JSON.parse(content);
    return result;
  } catch (error) {
    console.error('Error during Groq Profile analysis:', error);
    throw error;
  }
};

/**
 * Refines a base profile JSON using custom slider metrics and company context.
 * @param {object} baseProfile - The parsed profile from Step 1.
 * @param {string} companyContext - Target company/pitch context.
 * @param {object} sliders - Slider values (grammar, depth, realism, creativity, actionVerbs, industryFocus).
 * @returns {Promise<object>} The refined profile JSON.
 */
export const refineProfileText = async (baseProfile, companyContext, sliders) => {
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
3. Output ONLY the JSON. Do not include markdown code blocks.
`;

  try {
    const chatCompletion = await groq.chat.completions.create({
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
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      response_format: { type: 'json_object' }
    });

    const content = chatCompletion.choices[0]?.message?.content || '{}';
    console.log('Groq Refine Raw Response:', content);
    
    return JSON.parse(content);
  } catch (error) {
    console.error('Error during Groq Profile refinement:', error);
    throw error;
  }
};
