import PDFDocument from 'pdfkit';

/**
 * Maps template names to cohesive color palettes.
 */
const layoutBases = ['modern', 'classic', 'creative', 'executive', 'minimalist', 'vibrant gradient', 'bordered slate'];

const colorSchemes = [
  { name: 'Teal Forest', primary: '#0D9488', secondary: '#14B8A6', accent: '#F59E0B', bg: '#F0FDF4', text: '#1F2937', border: '#E5E7EB' },
  { name: 'Royal Navy', primary: '#1E3A8A', secondary: '#3B82F6', accent: '#93C5FD', bg: '#EFF6FF', text: '#1E293B', border: '#DBEAFE' },
  { name: 'Charcoal Minimal', primary: '#1E293B', secondary: '#64748B', accent: '#0F172A', bg: '#FFFFFF', text: '#334155', border: '#F1F5F9' },
  { name: 'Sunset Gradient', primary: '#EA580C', secondary: '#F97316', accent: '#EAB308', bg: '#FFF7ED', text: '#1E293B', border: '#FFEDD5' },
  { name: 'Slate Bordered', primary: '#475569', secondary: '#64748B', accent: '#3B82F6', bg: '#F8FAFC', text: '#0F172A', border: '#CBD5E1' },
  { name: 'Creative Amethyst', primary: '#6D28D9', secondary: '#8B5CF6', accent: '#10B981', bg: '#F5F3FF', text: '#1F2937', border: '#EDE9FE' },
  { name: 'Plum Gold', primary: '#581C87', secondary: '#7E22CE', accent: '#EAB308', bg: '#FAF5FF', text: '#1F2937', border: '#F3E8FF' },
  { name: 'Vintage Sepia', primary: '#451A03', secondary: '#78350F', accent: '#B45309', bg: '#FFFBEB', text: '#1C1917', border: '#FEF3C7' },
  { name: 'Emerald Premium', primary: '#064E3B', secondary: '#059669', accent: '#F59E0B', bg: '#ECFDF5', text: '#0F2922', border: '#D1FAE5' },
  { name: 'Nordic Frost', primary: '#0369A1', secondary: '#0284C7', accent: '#0D9488', bg: '#F0F9FF', text: '#1F2937', border: '#E0F2FE' },
  { name: 'Cyberpunk Pink', primary: '#DB2777', secondary: '#2563EB', accent: '#06B6D4', bg: '#FDF2F8', text: '#0F172A', border: '#FCE7F3' },
  { name: 'Earthy Olive', primary: '#3F6212', secondary: '#4D7C0F', accent: '#854D0E', bg: '#F7FEE7', text: '#1F2937', border: '#ECFDF5' },
  { name: 'Crimson Bold', primary: '#991B1B', secondary: '#B91C1C', accent: '#D97706', bg: '#FFF7ED', text: '#1F2937', border: '#FFEDD5' },
  { name: 'Rose Grace', primary: '#9D174D', secondary: '#C2185B', accent: '#CA8A04', bg: '#FFF1F2', text: '#1F2937', border: '#FFE4E6' },
  { name: 'Steel Tech', primary: '#0F172A', secondary: '#1E293B', accent: '#3B82F6', bg: '#F8FAFC', text: '#0F172A', border: '#CBD5E1' }
];

const generateTemplatesLibrary = () => {
  const lib = [];
  layoutBases.forEach((layout) => {
    colorSchemes.forEach((scheme) => {
      const id = `${layout}-${scheme.name.toLowerCase().replace(/ /g, '-')}`;
      lib.push({
        id,
        layout,
        colors: {
          primary: scheme.primary,
          secondary: scheme.secondary,
          accent: scheme.accent,
          bg: scheme.bg,
          text: scheme.text,
          border: scheme.border
        }
      });
    });
  });
  return lib;
};

const templatesLibrary = generateTemplatesLibrary();

const getColors = (templateId) => {
  const match = templatesLibrary.find(t => t.id === templateId?.toLowerCase());
  if (match) return match.colors;

  switch (templateId?.toLowerCase()) {
    case 'classic':
      return { primary: '#1F2937', secondary: '#4B5563', accent: '#9CA3AF', bg: '#F9FAFB', text: '#111827', border: '#E5E7EB' };
    case 'creative':
      return { primary: '#6C5CE7', secondary: '#A29BFE', accent: '#F59E0B', bg: '#FAF5FF', text: '#2D3748', border: '#E2E8F0' };
    case 'executive':
      return { primary: '#0F766E', secondary: '#0D9488', accent: '#B45309', bg: '#F4FBF9', text: '#1F2937', border: '#E5E7EB' };
    case 'minimalist':
      return { primary: '#1E293B', secondary: '#64748B', accent: '#0F172A', bg: '#FFFFFF', text: '#334155', border: '#F1F5F9' };
    case 'vibrant gradient':
      return { primary: '#EA580C', secondary: '#F97316', accent: '#EAB308', bg: '#FFF7ED', text: '#1E293B', border: '#FFEDD5' };
    case 'bordered slate':
      return { primary: '#475569', secondary: '#64748B', accent: '#3B82F6', bg: '#F8FAFC', text: '#0F172A', border: '#CBD5E1' };
    case 'corporate navy':
      return { primary: '#1E3A8A', secondary: '#3B82F6', accent: '#93C5FD', bg: '#EFF6FF', text: '#1E293B', border: '#DBEAFE' };
    case 'clean teal':
      return { primary: '#0D9488', secondary: '#14B8A6', accent: '#F59E0B', bg: '#F0FDF4', text: '#1F2937', border: '#DCFCE7' };
    case 'emerald premium':
      return { primary: '#064E3B', secondary: '#059669', accent: '#F59E0B', bg: '#ECFDF5', text: '#0F2922', border: '#D1FAE5' };
    case 'steel minimalist':
      return { primary: '#334155', secondary: '#475569', accent: '#64748B', bg: '#F8FAFC', text: '#0F172A', border: '#E2E8F0' };
    case 'midnight cosmic':
      return { primary: '#1E1B4B', secondary: '#4338CA', accent: '#A855F7', bg: '#FAF5FF', text: '#0F172A', border: '#E9D5FF' };
    case 'cyberpunk neon':
      return { primary: '#DB2777', secondary: '#2563EB', accent: '#06B6D4', bg: '#FDF2F8', text: '#0F172A', border: '#FCE7F3' };
    case 'startup neon':
      return { primary: '#7C3AED', secondary: '#10B981', accent: '#F59E0B', bg: '#F5F3FF', text: '#1F2937', border: '#EDE9FE' };
    case 'amethyst':
      return { primary: '#6D28D9', secondary: '#8B5CF6', accent: '#10B981', bg: '#F5F3FF', text: '#1F2937', border: '#EDE9FE' };
    case 'plum royale':
      return { primary: '#581C87', secondary: '#7E22CE', accent: '#EAB308', bg: '#FAF5FF', text: '#1F2937', border: '#F3E8FF' };
    case 'coral bright':
      return { primary: '#F43F5E', secondary: '#FB7185', accent: '#0D9488', bg: '#FFF1F2', text: '#1F2937', border: '#FFE4E6' };
    case 'metro grid':
      return { primary: '#DC2626', secondary: '#EF4444', accent: '#2563EB', bg: '#FEF2F2', text: '#1F2937', border: '#FEE2E2' };
    case 'golden royal':
      return { primary: '#854D0E', secondary: '#A16207', accent: '#CA8A04', bg: '#FEFCE8', text: '#1F2937', border: '#FEF9C3' };
    case 'royal gold':
      return { primary: '#1E293B', secondary: '#854D0E', accent: '#CA8A04', bg: '#FEFCE8', text: '#0F172A', border: '#FEF9C3' };
    case 'vintage editorial':
      return { primary: '#451A03', secondary: '#78350F', accent: '#B45309', bg: '#FFFBEB', text: '#1C1917', border: '#FEF3C7' };
    case 'forest timber':
      return { primary: '#3F6212', secondary: '#4D7C0F', accent: '#854D0E', bg: '#F7FEE7', text: '#1F2937', border: '#ECFDF5' };
    case 'autumn glow':
      return { primary: '#991B1B', secondary: '#B91C1C', accent: '#D97706', bg: '#FFF7ED', text: '#1F2937', border: '#FFEDD5' };
    case 'rose elegant':
      return { primary: '#9D174D', secondary: '#C2185B', accent: '#CA8A04', bg: '#FFF1F2', text: '#1F2937', border: '#FFE4E6' };
    case 'sheriff gold':
      return { primary: '#166534', secondary: '#15803D', accent: '#CA8A04', bg: '#F0FDF4', text: '#1F2937', border: '#DCFCE7' };
    case 'nordic ice':
      return { primary: '#0369A1', secondary: '#0284C7', accent: '#0D9488', bg: '#F0F9FF', text: '#1F2937', border: '#E0F2FE' };
    case 'minimal sans':
      return { primary: '#000000', secondary: '#404040', accent: '#737373', bg: '#FFFFFF', text: '#171717', border: '#E5E5E5' };
    case 'carbon tech':
      return { primary: '#0F172A', secondary: '#1E293B', accent: '#3B82F6', bg: '#F8FAFC', text: '#0F172A', border: '#CBD5E1' };
    case 'modern':
    default:
      return { primary: '#0D9488', secondary: '#14B8A6', accent: '#F59E0B', bg: '#F0FDF4', text: '#1F2937', border: '#E5E7EB' };
  }
};

const getLayoutStructure = (templateId) => {
  const match = templatesLibrary.find(t => t.id === templateId?.toLowerCase());
  if (match) return match.layout;

  const t = templateId?.toLowerCase() || 'modern';
  if (t === 'modern' || t === 'corporate navy' || t === 'clean teal') return 'modern';
  if (t === 'classic' || t === 'golden royal' || t === 'royal gold' || t === 'vintage editorial') return 'classic';
  if (t === 'creative' || t === 'cyberpunk neon' || t === 'startup neon' || t === 'midnight cosmic' || t === 'plum royale' || t === 'amethyst') return 'creative';
  if (t === 'executive' || t === 'emerald premium') return 'executive';
  if (t === 'minimalist' || t === 'nordic ice' || t === 'steel minimalist' || t === 'minimal sans') return 'minimalist';
  if (t === 'vibrant gradient') return 'vibrant gradient';
  return 'bordered slate';
};

const serifFonts = [
  'lora', 'playfair display', 'merriweather', 'pt serif', 'georgia', 'garamond',
  'crimson text', 'bitter', 'cinzel', 'noto serif', 'cormorant garamond', 'eb garamond',
  'cardo', 'domine', 'dm serif display', 'playfair', 'libre baskerville', 'arvo',
  'zilla slab', 'tinos', 'alfa slab one', 'poly', 'prata', 'alice', 'quattrocento',
  'vollkorn', 'neuton', 'noto serif georgian'
];

const monoFonts = [
  'fira code', 'source code pro', 'courier prime', 'inconsolata', 'roboto mono',
  'share tech mono', 'space mono', 'ibm plex mono', 'pt mono', 'jetbrains mono',
  'anonymous pro', 'nova mono', 'major mono display', 'cutive mono', 'vt323',
  'dejavu sans mono'
];

const getPdfFont = (fontPreference) => {
  const f = fontPreference?.toLowerCase() || 'inter';
  if (serifFonts.includes(f)) {
    return {
      regular: 'Times-Roman',
      bold: 'Times-Bold',
      italic: 'Times-Italic'
    };
  }
  if (monoFonts.includes(f)) {
    return {
      regular: 'Courier',
      bold: 'Courier-Bold',
      italic: 'Courier-Oblique'
    };
  }
  return {
    regular: 'Helvetica',
    bold: 'Helvetica-Bold',
    italic: 'Helvetica-Oblique'
  };
};

/**
 * Helper to safely parse JSON field arrays.
 */
const parseArray = (field) => {
  if (Array.isArray(field)) return field;
  try {
    if (typeof field === 'string') {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    // Ignore
  }
  return [];
};

/**
 * Draws a structured experience/education/projects section in the PDF.
 */
const drawStructuredSection = (doc, title, items, x, y, width, colors, fonts) => {
  if (!items || !Array.isArray(items) || items.length === 0) return y;
  
  if (y > 720) { doc.addPage(); y = 36; }
  
  doc.fillColor(colors.primary).font(fonts.bold).fontSize(10.5).text(title.toUpperCase(), x, y);
  doc.strokeColor(colors.primary).lineWidth(0.75).moveTo(x, y + 12).lineTo(x + width, y + 12).stroke();
  y += 16;

  items.forEach((item) => {
    if (y > 740) { doc.addPage(); y = 36; }
    
    const roleVal = item.role || item.degree || item.title || '';
    const companyVal = item.company || item.school || item.technologies || '';
    const durationVal = item.duration || '';
    
    // Role / Title line
    if (roleVal) {
      doc.fillColor(colors.primary).font(fonts.bold).fontSize(9).text(roleVal, x, y, { width });
      y += 11;
    }
    
    // Sub-header line: Company/School/Tech - Duration
    let subHeader = '';
    if (companyVal && durationVal) subHeader = `${companyVal}   |   ${durationVal}`;
    else subHeader = companyVal || durationVal;
    
    if (subHeader) {
      doc.fillColor(colors.secondary).font(fonts.bold).fontSize(8).text(subHeader, x, y, { width });
      y += 11;
    }
    
    // Description paragraph
    if (item.description) {
      doc.fillColor(colors.text).font(fonts.regular).fontSize(8.5).text(item.description, x, y, { width, align: 'justify', lineGap: 1.25 });
      y += doc.heightOfString(item.description, { width, lineGap: 1.25 }) + 6;
    } else {
      y += 3;
    }
  });

  return y + 6;
};

/**
 * Draws a grid of badges for skills, languages, or certifications in the PDF.
 */
const drawBadgeList = (doc, title, items, x, y, width, colors, fonts) => {
  if (!items || !Array.isArray(items) || items.length === 0) return y;
  
  if (y > 720) { doc.addPage(); y = 36; }
  doc.fillColor(colors.primary).font(fonts.bold).fontSize(10).text(title.toUpperCase(), x, y);
  doc.strokeColor(colors.primary).lineWidth(0.75).moveTo(x, y + 11).lineTo(x + width, y + 11).stroke();
  y += 15;
  
  let currentX = x;
  const gap = 4;
  items.forEach(item => {
    const textStr = String(item);
    const itemWidth = doc.widthOfString(textStr, { size: 7.5 }) + 8;
    if (currentX + itemWidth > x + width) {
      currentX = x;
      y += 13;
    }
    if (y > 750) { doc.addPage(); y = 36; currentX = x; }
    
    doc.rect(currentX, y, itemWidth, 10).fill(colors.bg);
    doc.fillColor(colors.primary).font(fonts.regular).fontSize(7.5).text(textStr, currentX + 4, y + 1.5);
    currentX += itemWidth + gap;
  });
  
  return y + 16;
};

/**
 * Generates a PDF resume based on the profile data.
 * @param {object} profile - The profile database record.
 * @returns {Promise<Buffer>} The generated PDF as a buffer.
 */
export const generateResumePdf = (profile) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4', bufferPages: true });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', err => reject(err));

    const colors = getColors(profile.template_preference);
    const fonts = getPdfFont(profile.font_preference);

    // Profile Fields
    const name = profile.name || 'Your Name';
    const profession = profile.profession || 'Profession';
    const tagline = profile.tagline || '';
    const bio = profile.bio || '';
    const goal = profile.goal || '';
    const skills = parseArray(profile.skills);
    const softSkills = parseArray(profile.soft_skills);
    const strengths = parseArray(profile.strengths);
    const achievements = parseArray(profile.achievements);
    const hobbies = parseArray(profile.hobbies);
    const interests = parseArray(profile.interests);
    const personality = parseArray(profile.personality_traits);

    const contactEmail = profile.contact_email || '';
    const contactPhone = profile.contact_phone || '';
    const contactLocation = profile.contact_location || '';
    const linkedinUrl = profile.linkedin_url || '';
    const portfolioUrl = profile.portfolio_url || '';
    const githubUrl = profile.github_url || '';
    
    const experience = parseArray(profile.experience);
    const education = parseArray(profile.education);
    const projects = parseArray(profile.projects);
    const languages = parseArray(profile.languages);
    const certifications = parseArray(profile.certifications);
    const internships = parseArray(profile.internships);
    const courses = parseArray(profile.courses);
    const referencesList = parseArray(profile.references_list);
    const extraCurricular = parseArray(profile.extra_curricular);

    const template = getLayoutStructure(profile.template_preference);

    if (template === 'modern') {
      // MODERN: Two-column layout
      // Draw left header band
      doc.rect(0, 0, 595, 100).fill(colors.bg);

      // Name & Profession
      doc.fillColor(colors.primary)
         .font(fonts.bold)
         .fontSize(24)
         .text(name, 40, 25);
      
      doc.fillColor(colors.text)
         .font(fonts.regular)
         .fontSize(12)
         .text(profession, 40, 55);

      if (tagline) {
        doc.fillColor(colors.accent)
           .font(fonts.italic)
           .fontSize(10)
           .text(`"${tagline}"`, 40, 72);
      }

      // Column widths
      const leftColX = 40;
      const leftColWidth = 320;
      const rightColX = 380;
      const rightColWidth = 175;
      
      let leftY = 120;
      let rightY = 120;

      // LEFT COLUMN
      // About Me
      if (bio) {
        doc.fillColor(colors.primary).font(fonts.bold).fontSize(14).text('About Me', leftColX, leftY);
        doc.strokeColor(colors.primary).lineWidth(1).moveTo(leftColX, leftY + 16).lineTo(leftColX + leftColWidth, leftY + 16).stroke();
        leftY += 24;
        doc.fillColor(colors.text).font(fonts.regular).fontSize(10).text(bio, leftColX, leftY, { width: leftColWidth, align: 'justify', lineGap: 3 });
        leftY += doc.heightOfString(bio, { width: leftColWidth, lineGap: 3 }) + 20;
      }

      // Professional Goal
      if (goal) {
        doc.fillColor(colors.primary).font(fonts.bold).fontSize(14).text('Career Goal', leftColX, leftY);
        doc.strokeColor(colors.primary).lineWidth(1).moveTo(leftColX, leftY + 16).lineTo(leftColX + leftColWidth, leftY + 16).stroke();
        leftY += 24;
        doc.fillColor(colors.text).font(fonts.regular).fontSize(10).text(goal, leftColX, leftY, { width: leftColWidth, align: 'justify', lineGap: 3 });
        leftY += doc.heightOfString(goal, { width: leftColWidth, lineGap: 3 }) + 20;
      }

      // Experience
      leftY = drawStructuredSection(doc, 'Experience', experience, leftColX, leftY, leftColWidth, colors, fonts);

      // Internships
      leftY = drawStructuredSection(doc, 'Internships', internships, leftColX, leftY, leftColWidth, colors, fonts);

      // Projects
      leftY = drawStructuredSection(doc, 'Projects', projects, leftColX, leftY, leftColWidth, colors, fonts);

      // Education
      leftY = drawStructuredSection(doc, 'Education', education, leftColX, leftY, leftColWidth, colors, fonts);

      // Courses
      leftY = drawStructuredSection(doc, 'Courses', courses, leftColX, leftY, leftColWidth, colors, fonts);

      // Extra-Curricular Activities
      leftY = drawStructuredSection(doc, 'Extra-Curricular Activities', extraCurricular, leftColX, leftY, leftColWidth, colors, fonts);

      // Achievements
      if (achievements.length > 0) {
        doc.fillColor(colors.primary).font(fonts.bold).fontSize(14).text('Key Achievements', leftColX, leftY);
        doc.strokeColor(colors.primary).lineWidth(1).moveTo(leftColX, leftY + 16).lineTo(leftColX + leftColWidth, leftY + 16).stroke();
        leftY += 24;
        achievements.forEach((ach) => {
          doc.fillColor(colors.primary).fontSize(12).text('•', leftColX, leftY);
          doc.fillColor(colors.text).font(fonts.regular).fontSize(10).text(ach, leftColX + 12, leftY, { width: leftColWidth - 12 });
          leftY += doc.heightOfString(ach, { width: leftColWidth - 12 }) + 8;
        });
        leftY += 12;
      }

      // RIGHT COLUMN - CONTACT INFO
      const contactItems = [];
      if (contactEmail) contactItems.push(`Email: ${contactEmail}`);
      if (contactPhone) contactItems.push(`Phone: ${contactPhone}`);
      if (contactLocation) contactItems.push(`Loc: ${contactLocation}`);
      if (linkedinUrl) contactItems.push(`LinkedIn: ${linkedinUrl}`);
      if (portfolioUrl) contactItems.push(`Web: ${portfolioUrl}`);
      if (githubUrl) contactItems.push(`GitHub: ${githubUrl}`);

      if (contactItems.length > 0) {
        doc.fillColor(colors.primary).font(fonts.bold).fontSize(12).text('CONTACT', rightColX, rightY);
        doc.strokeColor(colors.primary).lineWidth(1).moveTo(rightColX, rightY + 14).lineTo(rightColX + rightColWidth, rightY + 14).stroke();
        rightY += 20;
        contactItems.forEach(item => {
          doc.fillColor(colors.text).font(fonts.regular).fontSize(9).text(item, rightColX, rightY, { width: rightColWidth });
          rightY += 14;
        });
        rightY += 12;
      }

      // Skills
      if (skills.length > 0) {
        doc.fillColor(colors.primary).font(fonts.bold).fontSize(12).text('TECHNICAL SKILLS', rightColX, rightY);
        rightY += 16;
        skills.forEach(skill => {
          doc.fillColor(colors.text).font(fonts.regular).fontSize(9).text(skill, rightColX, rightY);
          rightY += 14;
        });
        rightY += 12;
      }

      // Languages
      rightY = drawBadgeList(doc, 'Languages', languages, rightColX, rightY, rightColWidth, colors, fonts);

      // Certifications
      rightY = drawBadgeList(doc, 'Certifications', certifications, rightColX, rightY, rightColWidth, colors, fonts);

      // Soft Skills
      if (softSkills.length > 0) {
        doc.fillColor(colors.primary).font(fonts.bold).fontSize(12).text('SOFT SKILLS', rightColX, rightY);
        rightY += 16;
        softSkills.forEach(skill => {
          doc.fillColor(colors.text).font(fonts.regular).fontSize(9).text(skill, rightColX, rightY);
          rightY += 14;
        });
        rightY += 12;
      }

      // Strengths
      if (strengths.length > 0) {
        doc.fillColor(colors.primary).font(fonts.bold).fontSize(12).text('CORE STRENGTHS', rightColX, rightY);
        rightY += 16;
        strengths.forEach(str => {
          doc.fillColor(colors.text).font(fonts.regular).fontSize(9).text(str, rightColX, rightY);
          rightY += 14;
        });
        rightY += 12;
      }

      // References
      rightY = drawStructuredSection(doc, 'References', referencesList, rightColX, rightY, rightColWidth, colors, fonts);

    } else if (template === 'classic') {
      // CLASSIC: Traditional, formal, one-column
      doc.fillColor(colors.primary)
         .font(fonts.bold)
         .fontSize(26)
         .text(name, { align: 'center' });
      
      doc.fillColor(colors.secondary)
         .font(fonts.regular)
         .fontSize(14)
         .text(profession, { align: 'center', paragraphGap: 8 });

      if (tagline) {
        doc.fillColor(colors.accent)
           .font(fonts.italic)
           .fontSize(10)
           .text(`"${tagline}"`, { align: 'center', paragraphGap: 20 });
      }

      let y = doc.y + 10;
      const fullWidth = 515;

      // Draw centered contact bar
      const contactItems = [];
      if (contactEmail) contactItems.push(contactEmail);
      if (contactPhone) contactItems.push(contactPhone);
      if (contactLocation) contactItems.push(contactLocation);
      if (linkedinUrl) contactItems.push(linkedinUrl);
      if (portfolioUrl) contactItems.push(portfolioUrl);
      if (githubUrl) contactItems.push(githubUrl);
      
      if (contactItems.length > 0) {
        doc.fillColor(colors.secondary)
           .font(fonts.regular)
           .fontSize(9)
           .text(contactItems.join('   |   '), 40, y, { align: 'center', width: fullWidth });
        y += 20;
      }

      // Section drawing function for single column
      const drawSection = (title, content, type = 'text') => {
        if (!content || (Array.isArray(content) && content.length === 0)) return;
        doc.fillColor(colors.primary).font(fonts.bold).fontSize(14).text(title, 40, y);
        doc.strokeColor(colors.primary).lineWidth(1).moveTo(40, y + 16).lineTo(40 + fullWidth, y + 16).stroke();
        y += 24;

        if (type === 'text') {
          doc.fillColor(colors.text).font(fonts.regular).fontSize(10).text(content, 40, y, { width: fullWidth, align: 'justify', lineGap: 2 });
          y += doc.heightOfString(content, { width: fullWidth, lineGap: 2 }) + 20;
        } else if (type === 'list') {
          content.forEach(item => {
            doc.fillColor(colors.primary).fontSize(10).text('•', 40, y);
            doc.fillColor(colors.text).font(fonts.regular).fontSize(10).text(item, 52, y, { width: fullWidth - 12 });
            y += doc.heightOfString(item, { width: fullWidth - 12 }) + 6;
          });
          y += 14;
        } else if (type === 'badges') {
          // Draw badges in flow layout
          let badgeX = 40;
          const badgeGap = 8;
          content.forEach(item => {
            const itemWidth = doc.widthOfString(item, { size: 9 }) + 14;
            if (badgeX + itemWidth > 40 + fullWidth) {
              badgeX = 40;
              y += 18;
            }
            doc.rect(badgeX, y, itemWidth, 14).fill(colors.bg);
            doc.fillColor(colors.primary).font(fonts.regular).fontSize(9).text(item, badgeX + 7, y + 2.5);
            badgeX += itemWidth + badgeGap;
          });
          y += 26;
        }
      };

      drawSection('About Me', bio, 'text');
      drawSection('Career Objective', goal, 'text');
      y = drawStructuredSection(doc, 'Experience', experience, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Internships', internships, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Projects', projects, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Education', education, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Courses', courses, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Extra-Curricular Activities', extraCurricular, 40, y, fullWidth, colors, fonts);
      drawSection('Skills & Expertise', [...skills, ...softSkills], 'badges');
      y = drawBadgeList(doc, 'Languages', languages, 40, y, fullWidth, colors, fonts);
      y = drawBadgeList(doc, 'Certifications', certifications, 40, y, fullWidth, colors, fonts);
      drawSection('Key Accomplishments', achievements, 'list');
      drawSection('Core Strengths', strengths, 'badges');
      drawSection('Interests & Values', [...interests, ...values, ...personality], 'badges');
      y = drawStructuredSection(doc, 'References', referencesList, 40, y, fullWidth, colors, fonts);

    } else if (template === 'creative') {
      // CREATIVE: Vibrant colored top bar & fun layouts
      doc.rect(0, 0, 595, 120).fill(colors.primary);

      // Name & Profession in header
      doc.fillColor('#FFFFFF')
         .font(fonts.bold)
         .fontSize(28)
         .text(name, 40, 30);
      
      doc.fillColor(colors.secondary)
         .font(fonts.regular)
         .fontSize(14)
         .text(profession, 40, 65);

      if (tagline) {
        doc.fillColor(colors.accent)
           .font(fonts.italic)
           .fontSize(10)
           .text(`"${tagline}"`, 40, 85);
      }

      let y = 140;
      const fullWidth = 515;

      // Draw contact bar below creative header band
      const contactItems = [];
      if (contactEmail) contactItems.push(contactEmail);
      if (contactPhone) contactItems.push(contactPhone);
      if (contactLocation) contactItems.push(contactLocation);
      if (linkedinUrl) contactItems.push(linkedinUrl);
      if (portfolioUrl) contactItems.push(portfolioUrl);
      if (githubUrl) contactItems.push(githubUrl);
      
      if (contactItems.length > 0) {
        doc.fillColor(colors.primary)
           .font(fonts.regular)
           .fontSize(9)
           .text(contactItems.join('   |   '), 40, y, { align: 'center', width: fullWidth });
        y += 20;
      }

      const drawCreativeSection = (title, content, type = 'text') => {
        if (!content || (Array.isArray(content) && content.length === 0)) return;
        
        doc.fillColor(colors.primary).font(fonts.bold).fontSize(14).text(title, 40, y);
        doc.rect(40, y + 16, 40, 3).fill(colors.accent);
        y += 26;

        if (type === 'text') {
          doc.fillColor(colors.text).font(fonts.regular).fontSize(10).text(content, 40, y, { width: fullWidth, align: 'justify', lineGap: 3 });
          y += doc.heightOfString(content, { width: fullWidth, lineGap: 3 }) + 20;
        } else if (type === 'list') {
          content.forEach(item => {
            doc.fillColor(colors.accent).fontSize(10).text('✦', 40, y);
            doc.fillColor(colors.text).font(fonts.regular).fontSize(10).text(item, 55, y, { width: fullWidth - 15 });
            y += doc.heightOfString(item, { width: fullWidth - 15 }) + 6;
          });
          y += 14;
        } else if (type === 'badges') {
          let badgeX = 40;
          const badgeGap = 8;
          content.forEach(item => {
            const itemWidth = doc.widthOfString(item, { size: 9 }) + 16;
            if (badgeX + itemWidth > 40 + fullWidth) {
              badgeX = 40;
              y += 22;
            }
            doc.roundedRect(badgeX, y, itemWidth, 16, 4).fill(colors.primary);
            doc.fillColor('#FFFFFF').font(fonts.regular).fontSize(8.5).text(item, badgeX + 8, y + 3.5);
            badgeX += itemWidth + badgeGap;
          });
          y += 28;
        }
      };

      drawCreativeSection('Creative Summary', bio, 'text');
      drawCreativeSection('Core Goals', goal, 'text');
      y = drawStructuredSection(doc, 'Experience', experience, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Internships', internships, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Projects', projects, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Education', education, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Courses', courses, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Extra-Curricular Activities', extraCurricular, 40, y, fullWidth, colors, fonts);
      drawCreativeSection('Skills', skills, 'badges');
      y = drawBadgeList(doc, 'Languages', languages, 40, y, fullWidth, colors, fonts);
      y = drawBadgeList(doc, 'Certifications', certifications, 40, y, fullWidth, colors, fonts);
      drawCreativeSection('Achievements', achievements, 'list');
      drawCreativeSection('Personality & Strengths', [...strengths, ...personality], 'badges');
      drawCreativeSection('Personal Interests', [...hobbies, ...interests], 'badges');
      y = drawStructuredSection(doc, 'References', referencesList, 40, y, fullWidth, colors, fonts);

    } else if (template === 'executive') {
      // EXECUTIVE: Deep professional layout with prominent accent lines
      // Top header structure
      doc.fillColor(colors.primary)
         .font(fonts.bold)
         .fontSize(24)
         .text(name, 40, 40);

      doc.fillColor(colors.text)
         .font(fonts.regular)
         .fontSize(12)
         .text(profession.toUpperCase(), 40, 68, { characterSpacing: 1.5 });

      if (tagline) {
        doc.fillColor(colors.accent)
           .font(fonts.italic)
           .fontSize(10.5)
           .text(`"${tagline}"`, 40, 85);
      }

      // Thick double borders
      doc.strokeColor(colors.primary).lineWidth(2).moveTo(40, 105).lineTo(555, 105).stroke();
      doc.strokeColor(colors.accent).lineWidth(1).moveTo(40, 109).lineTo(555, 109).stroke();

      let y = 125;
      const fullWidth = 515;

      // Draw contact bar
      const contactItems = [];
      if (contactEmail) contactItems.push(contactEmail);
      if (contactPhone) contactItems.push(contactPhone);
      if (contactLocation) contactItems.push(contactLocation);
      if (linkedinUrl) contactItems.push(linkedinUrl);
      if (portfolioUrl) contactItems.push(portfolioUrl);
      if (githubUrl) contactItems.push(githubUrl);
      
      if (contactItems.length > 0) {
        doc.fillColor(colors.primary)
           .font(fonts.regular)
           .fontSize(9)
           .text(contactItems.join('   |   '), 40, y, { align: 'center', width: fullWidth });
        y += 20;
      }

      const drawExecutiveSection = (title, content, type = 'text') => {
        if (!content || (Array.isArray(content) && content.length === 0)) return;

        doc.fillColor(colors.primary).font(fonts.bold).fontSize(13).text(title.toUpperCase(), 40, y, { characterSpacing: 1 });
        doc.strokeColor(colors.border).lineWidth(0.5).moveTo(40, y + 14).lineTo(555, y + 14).stroke();
        y += 20;

        if (type === 'text') {
          doc.fillColor(colors.text).font(fonts.regular).fontSize(9.5).text(content, 40, y, { width: fullWidth, align: 'justify', lineGap: 2.5 });
          y += doc.heightOfString(content, { width: fullWidth, lineGap: 2.5 }) + 18;
        } else if (type === 'list') {
          content.forEach(item => {
            doc.rect(40, y + 3, 4, 4).fill(colors.primary);
            doc.fillColor(colors.text).font(fonts.regular).fontSize(9.5).text(item, 52, y, { width: fullWidth - 12 });
            y += doc.heightOfString(item, { width: fullWidth - 12 }) + 5;
          });
          y += 12;
        } else if (type === 'badges') {
          let badgeX = 40;
          const badgeGap = 6;
          content.forEach(item => {
            const itemWidth = doc.widthOfString(item, { size: 8.5 }) + 12;
            if (badgeX + itemWidth > 40 + fullWidth) {
              badgeX = 40;
              y += 18;
            }
            doc.rect(badgeX, y, itemWidth, 14).fill(colors.bg);
            doc.strokeColor(colors.primary).lineWidth(0.5).rect(badgeX, y, itemWidth, 14).stroke();
            doc.fillColor(colors.primary).font(fonts.regular).fontSize(8.5).text(item, badgeX + 6, y + 2.5);
            badgeX += itemWidth + badgeGap;
          });
          y += 24;
        }
      };

      drawExecutiveSection('Executive Summary', bio, 'text');
      drawExecutiveSection('Strategic Objectives', goal, 'text');
      y = drawStructuredSection(doc, 'Experience', experience, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Internships', internships, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Projects', projects, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Education', education, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Courses', courses, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Extra-Curricular Activities', extraCurricular, 40, y, fullWidth, colors, fonts);
      drawExecutiveSection('Core Competencies', [...skills, ...softSkills], 'badges');
      y = drawBadgeList(doc, 'Languages', languages, 40, y, fullWidth, colors, fonts);
      y = drawBadgeList(doc, 'Certifications', certifications, 40, y, fullWidth, colors, fonts);
      drawExecutiveSection('Key Achievements & Milestones', achievements, 'list');
      drawExecutiveSection('Leadership Strengths & Core Values', [...strengths, ...values], 'badges');
      y = drawStructuredSection(doc, 'References', referencesList, 40, y, fullWidth, colors, fonts);
    } else if (template === 'minimalist') {
      // MINIMALIST: Very simple B&W, centered header, generous line heights
      doc.fillColor(colors.accent)
         .font(fonts.bold)
         .fontSize(22)
         .text(name.toUpperCase(), { align: 'center', characterSpacing: 1 });
      
      doc.fillColor(colors.secondary)
         .font(fonts.regular)
         .fontSize(10)
         .text(profession.toUpperCase(), { align: 'center', characterSpacing: 1.5, paragraphGap: 6 });

      if (tagline) {
        doc.fillColor(colors.secondary)
           .font(fonts.italic)
           .fontSize(8.5)
           .text(`"${tagline}"`, { align: 'center', paragraphGap: 24 });
      }

      let y = doc.y + 10;
      const fullWidth = 515;

      // Draw contact details centered
      const contactItems = [];
      if (contactEmail) contactItems.push(contactEmail);
      if (contactPhone) contactItems.push(contactPhone);
      if (contactLocation) contactItems.push(contactLocation);
      if (linkedinUrl) contactItems.push(linkedinUrl);
      if (portfolioUrl) contactItems.push(portfolioUrl);
      if (githubUrl) contactItems.push(githubUrl);
      
      if (contactItems.length > 0) {
        doc.fillColor(colors.secondary)
           .font(fonts.regular)
           .fontSize(8.5)
           .text(contactItems.join('   •   '), 40, y, { align: 'center', width: fullWidth });
        y += 18;
      }

      const drawMinimalSection = (title, content, type = 'text') => {
        if (!content || (Array.isArray(content) && content.length === 0)) return;
        
        doc.fillColor(colors.primary).font(fonts.bold).fontSize(11).text(title.toUpperCase(), 40, y, { characterSpacing: 0.5 });
        y += 14;

        if (type === 'text') {
          doc.fillColor(colors.text).font(fonts.regular).fontSize(9).text(content, 40, y, { width: fullWidth, align: 'justify', lineGap: 3 });
          y += doc.heightOfString(content, { width: fullWidth, lineGap: 3 }) + 16;
        } else if (type === 'list') {
          content.forEach(item => {
            doc.fillColor(colors.secondary).fontSize(8).text('—', 40, y + 1);
            doc.fillColor(colors.text).font(fonts.regular).fontSize(9).text(item, 52, y, { width: fullWidth - 12, lineGap: 2 });
            y += doc.heightOfString(item, { width: fullWidth - 12, lineGap: 2 }) + 5;
          });
          y += 10;
        } else if (type === 'badges') {
          // Flow words separated by bullets
          doc.fillColor(colors.text).font(fonts.regular).fontSize(9);
          const listStr = content.join('   •   ');
          doc.text(listStr, 40, y, { width: fullWidth, lineGap: 3 });
          y += doc.heightOfString(listStr, { width: fullWidth, lineGap: 3 }) + 16;
        }
      };

      drawMinimalSection('About', bio, 'text');
      drawMinimalSection('Objective', goal, 'text');
      y = drawStructuredSection(doc, 'Experience', experience, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Internships', internships, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Projects', projects, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Education', education, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Courses', courses, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Extra-Curricular Activities', extraCurricular, 40, y, fullWidth, colors, fonts);
      drawMinimalSection('Skills & Areas', [...skills, ...softSkills], 'badges');
      y = drawBadgeList(doc, 'Languages', languages, 40, y, fullWidth, colors, fonts);
      y = drawBadgeList(doc, 'Certifications', certifications, 40, y, fullWidth, colors, fonts);
      drawMinimalSection('Achievements', achievements, 'list');
      drawMinimalSection('Strengths', strengths, 'badges');
      y = drawStructuredSection(doc, 'References', referencesList, 40, y, fullWidth, colors, fonts);

    } else if (template === 'vibrant gradient') {
      // VIBRANT GRADIENT: Orange/Sunset top border stripes & gold colors
      doc.rect(0, 0, 595, 6).fill('#EA580C');
      doc.rect(0, 6, 595, 4).fill('#F97316');
      doc.rect(0, 10, 595, 2).fill('#EAB308');

      // Title & Profession
      doc.fillColor(colors.primary)
         .font(fonts.bold)
         .fontSize(24)
         .text(name, 40, 32);
      
      doc.fillColor(colors.secondary)
         .font(fonts.regular)
         .fontSize(12)
         .text(profession, 40, 58);

      if (tagline) {
        doc.fillColor(colors.accent)
           .font(fonts.italic)
           .fontSize(9.5)
           .text(`"${tagline}"`, 40, 74);
      }

      // Divider line
      doc.strokeColor(colors.border).lineWidth(1).moveTo(40, 94).lineTo(555, 94).stroke();

      let y = 110;
      const fullWidth = 515;

      // Draw contact details
      const contactItems = [];
      if (contactEmail) contactItems.push(contactEmail);
      if (contactPhone) contactItems.push(contactPhone);
      if (contactLocation) contactItems.push(contactLocation);
      if (linkedinUrl) contactItems.push(linkedinUrl);
      if (portfolioUrl) contactItems.push(portfolioUrl);
      if (githubUrl) contactItems.push(githubUrl);
      
      if (contactItems.length > 0) {
        doc.fillColor(colors.secondary)
           .font(fonts.regular)
           .fontSize(9)
           .text(contactItems.join('   |   '), 40, y, { align: 'center', width: fullWidth });
        y += 20;
      }

      const drawGradientSection = (title, content, type = 'text') => {
        if (!content || (Array.isArray(content) && content.length === 0)) return;
        
        doc.fillColor(colors.primary).font(fonts.bold).fontSize(13).text(title, 40, y);
        doc.rect(40, y + 16, 25, 2).fill(colors.accent);
        y += 24;

        if (type === 'text') {
          doc.fillColor(colors.text).font(fonts.regular).fontSize(9.5).text(content, 40, y, { width: fullWidth, align: 'justify', lineGap: 3 });
          y += doc.heightOfString(content, { width: fullWidth, lineGap: 3 }) + 18;
        } else if (type === 'list') {
          content.forEach(item => {
            doc.fillColor(colors.secondary).fontSize(10).text('☀️', 40, y + 1);
            doc.fillColor(colors.text).font(fonts.regular).fontSize(9.5).text(item, 56, y, { width: fullWidth - 16, lineGap: 2 });
            y += doc.heightOfString(item, { width: fullWidth - 16, lineGap: 2 }) + 6;
          });
          y += 12;
        } else if (type === 'badges') {
          let badgeX = 40;
          const badgeGap = 6;
          content.forEach(item => {
            const itemWidth = doc.widthOfString(item, { size: 8.5 }) + 14;
            if (badgeX + itemWidth > 40 + fullWidth) {
              badgeX = 40;
              y += 20;
            }
            doc.roundedRect(badgeX, y, itemWidth, 14, 3).fill(colors.bg);
            doc.fillColor(colors.primary).font(fonts.regular).fontSize(8.5).text(item, badgeX + 7, y + 2.5);
            badgeX += itemWidth + badgeGap;
          });
          y += 24;
        }
      };

      drawGradientSection('Summary', bio, 'text');
      drawGradientSection('Goals', goal, 'text');
      y = drawStructuredSection(doc, 'Experience', experience, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Internships', internships, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Projects', projects, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Education', education, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Courses', courses, 40, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Extra-Curricular Activities', extraCurricular, 40, y, fullWidth, colors, fonts);
      drawGradientSection('Skills', [...skills, ...softSkills], 'badges');
      y = drawBadgeList(doc, 'Languages', languages, 40, y, fullWidth, colors, fonts);
      y = drawBadgeList(doc, 'Certifications', certifications, 40, y, fullWidth, colors, fonts);
      drawGradientSection('Accomplishments', achievements, 'list');
      drawGradientSection('Strengths', strengths, 'badges');
      y = drawStructuredSection(doc, 'References', referencesList, 40, y, fullWidth, colors, fonts);

    } else if (template === 'bordered slate') {
      // BORDERED SLATE: Enclose sections in fine slate-bordered cards
      doc.fillColor(colors.primary)
         .font(fonts.bold)
         .fontSize(24)
         .text(name, 45, 30);
      
      doc.fillColor(colors.secondary)
         .font(fonts.regular)
         .fontSize(11)
         .text(profession.toUpperCase(), 45, 56, { characterSpacing: 1 });

      let y = 80;
      const fullWidth = 505;
      const marginX = 45;

      // Draw contact details card
      const contactItems = [];
      if (contactEmail) contactItems.push(`Email: ${contactEmail}`);
      if (contactPhone) contactItems.push(`Phone: ${contactPhone}`);
      if (contactLocation) contactItems.push(`Location: ${contactLocation}`);
      if (linkedinUrl) contactItems.push(`LinkedIn: ${linkedinUrl}`);
      if (portfolioUrl) contactItems.push(`Portfolio: ${portfolioUrl}`);
      if (githubUrl) contactItems.push(`GitHub: ${githubUrl}`);
      
      if (contactItems.length > 0) {
        doc.roundedRect(marginX, y, fullWidth, 42, 6)
           .strokeColor(colors.border)
           .lineWidth(1)
           .stroke();
        doc.fillColor(colors.text).font(fonts.regular).fontSize(8.5);
        doc.text(contactItems.slice(0, 3).join('   |   '), marginX + 12, y + 10, { width: fullWidth - 24, align: 'center' });
        doc.text(contactItems.slice(3).join('   |   '), marginX + 12, y + 24, { width: fullWidth - 24, align: 'center' });
        y += 54;
      }

      const drawBorderedSection = (title, content, type = 'text') => {
        if (!content || (Array.isArray(content) && content.length === 0)) return;

        // Pre-calculate section height to draw box
        let contentHeight = 18; // title size + padding
        if (type === 'text') {
          contentHeight += doc.heightOfString(content, { width: fullWidth - 24, lineGap: 3.5 });
        } else if (type === 'list') {
          content.forEach(item => {
            contentHeight += doc.heightOfString(item, { width: fullWidth - 36, lineGap: 2 }) + 6;
          });
        } else if (type === 'badges') {
          let tempX = marginX + 12;
          let tempY = 0;
          content.forEach(item => {
            const itemWidth = doc.widthOfString(item, { size: 8 }) + 12;
            if (tempX + itemWidth > marginX + fullWidth - 12) {
              tempX = marginX + 12;
              tempY += 18;
            }
            tempX += itemWidth + 6;
          });
          contentHeight += tempY + 18;
        }

        // Draw card boundary
        const cardHeight = contentHeight + 20;
        doc.roundedRect(marginX, y, fullWidth, cardHeight, 6)
           .strokeColor(colors.border)
           .lineWidth(1)
           .stroke();

        // Fill Title
        doc.fillColor(colors.primary).font(fonts.bold).fontSize(10.5).text(title.toUpperCase(), marginX + 12, y + 10, { characterSpacing: 0.5 });
        let sectionY = y + 26;

        if (type === 'text') {
          doc.fillColor(colors.text).font(fonts.regular).fontSize(9).text(content, marginX + 12, sectionY, { width: fullWidth - 24, align: 'justify', lineGap: 3.5 });
        } else if (type === 'list') {
          content.forEach(item => {
            doc.rect(marginX + 12, sectionY + 3, 3, 3).fill(colors.accent);
            doc.fillColor(colors.text).font(fonts.regular).fontSize(9).text(item, marginX + 22, sectionY, { width: fullWidth - 36, lineGap: 2 });
            sectionY += doc.heightOfString(item, { width: fullWidth - 36, lineGap: 2 }) + 6;
          });
        } else if (type === 'badges') {
          let badgeX = marginX + 12;
          content.forEach(item => {
            const itemWidth = doc.widthOfString(item, { size: 8 }) + 12;
            if (badgeX + itemWidth > marginX + fullWidth - 12) {
              badgeX = marginX + 12;
              sectionY += 18;
            }
            doc.rect(badgeX, sectionY, itemWidth, 13).fill(colors.bg);
            doc.strokeColor(colors.primary).lineWidth(0.5).rect(badgeX, sectionY, itemWidth, 13).stroke();
            doc.fillColor(colors.primary).font(fonts.regular).fontSize(8).text(item, badgeX + 6, sectionY + 2.5);
            badgeX += itemWidth + 6;
          });
        }

        y += cardHeight + 12;
      };

      drawBorderedSection('Profile Bio', bio, 'text');
      drawBorderedSection('Strategic Objective', goal, 'text');
      y = drawStructuredSection(doc, 'Experience', experience, marginX, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Internships', internships, marginX, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Projects', projects, marginX, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Education', education, marginX, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Courses', courses, marginX, y, fullWidth, colors, fonts);
      y = drawStructuredSection(doc, 'Extra-Curricular Activities', extraCurricular, marginX, y, fullWidth, colors, fonts);
      drawBorderedSection('Skills Catalog', [...skills, ...softSkills], 'badges');
      y = drawBadgeList(doc, 'Languages', languages, marginX, y, fullWidth, colors, fonts);
      y = drawBadgeList(doc, 'Certifications', certifications, marginX, y, fullWidth, colors, fonts);
      drawBorderedSection('Key Achievements', achievements, 'list');
      drawBorderedSection('Personality & Strengths', [...strengths, ...values], 'badges');
      y = drawStructuredSection(doc, 'References', referencesList, marginX, y, fullWidth, colors, fonts);
    }

    doc.end();
  });
};

/**
 * Generates a PDF cover letter based on the profile data and dynamic user custom fields.
 * @param {object} profile - The profile database record.
 * @param {string} companyName - The recipient company.
 * @param {string} jobTitle - The target job role.
 * @param {string} letterContent - The generated or edited cover letter body text.
 * @returns {Promise<Buffer>} The generated PDF as a buffer.
 */
export const generateCoverLetterPdf = (profile, companyName, jobTitle, letterContent) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', err => reject(err));

    const colors = getColors(profile.template_preference);
    const fonts = getPdfFont(profile.font_preference);

    const name = profile.name || 'Your Name';
    const profession = profile.profession || 'Profession';
    const email = profile.email || '';

    // Sender Info Header
    doc.fillColor(colors.primary).font(fonts.bold).fontSize(20).text(name);
    doc.fillColor(colors.secondary).font(fonts.regular).fontSize(11).text(profession);
    if (email) {
      doc.fillColor(colors.accent).fontSize(9.5).text(`Email: ${email}`);
    }

    // Horizontal line separator
    doc.strokeColor(colors.border).lineWidth(1).moveTo(50, 105).lineTo(545, 105).stroke();

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let y = 125;
    doc.fillColor(colors.text).font(fonts.regular).fontSize(10).text(today, 50, y);
    y += 24;

    // Recipient Info
    doc.fillColor(colors.primary).font(fonts.bold).fontSize(10.5).text('To,', 50, y);
    y += 14;
    doc.fillColor(colors.text).font(fonts.regular).text(`Hiring Team / Recruiting Manager`, 50, y);
    y += 14;
    doc.text(companyName || 'Target Company', 50, y);
    y += 30;

    // Subject
    doc.fillColor(colors.primary).font(fonts.bold).text(`Subject: Application for ${jobTitle || 'Target Role'} Position`, 50, y);
    y += 25;

    // Salutation
    doc.fillColor(colors.text).font(fonts.regular).fontSize(10.5).text('Dear Hiring Manager,', 50, y);
    y += 25;

    // Letter Content Body
    const cleanLetter = letterContent || `I am writing to express my strong interest in the ${jobTitle || 'Target Role'} position at ${companyName || 'Target Company'}. Given my background as a ${profession || 'professional'}, I am excited about the opportunity to contribute to your team.`;
    
    doc.text(cleanLetter, 50, y, { width: 495, align: 'justify', lineGap: 4 });
    y += doc.heightOfString(cleanLetter, { width: 495, lineGap: 4 }) + 30;

    // Sign off
    doc.text('Sincerely,', 50, y);
    y += 24;
    doc.font(fonts.bold).text(name, 50, y);

    doc.end();
  });
};
