import { PortfolioData, skillLevelColors } from './portfolio-types';

const generateMinimalCSS = (data: PortfolioData): string => `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --bg: #050a0a;
    --accent: #26d9d9;
    --text: #e5e5e5;
    --text-muted: #737373;
    --card-bg: #0d1212;
    --border: rgba(38, 217, 217, 0.1);
  }
  body {
    font-family: 'Public Sans', -apple-system, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    line-height: 1.6;
  }
  .container { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; }
  h1, h2, h3 { font-family: 'Be Vietnam Pro', sans-serif; }
  h1 { font-size: 3rem; font-weight: 700; margin-bottom: 1rem; }
  h2 { font-size: 1.5rem; font-weight: 600; margin-bottom: 1.5rem; }
  .bio { color: var(--text-muted); max-width: 600px; margin-bottom: 3rem; font-size: 1.1rem; }
  .section { margin-bottom: 4rem; }
  .skills { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .skill {
    padding: 0.5rem 1rem;
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .skill-dot { width: 8px; height: 8px; border-radius: 50%; }
  .projects { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
  .project {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.5rem;
  }
  .project h3 { font-size: 1.125rem; margin-bottom: 0.5rem; }
  .project p { color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1rem; }
  .tech-stack { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
  .tech { font-size: 0.75rem; padding: 0.25rem 0.5rem; background: rgba(38, 217, 217, 0.1); border-radius: 4px; color: var(--accent); }
  .project-links { display: flex; gap: 1rem; }
  .project-links a { color: var(--accent); text-decoration: none; font-size: 0.875rem; }
  .project-links a:hover { text-decoration: underline; }
  .social-links { display: flex; gap: 1.5rem; margin-top: 3rem; }
  .social-links a { color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
  .social-links a:hover { color: var(--accent); }
  .avatar { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 1.5rem; border: 2px solid var(--border); }
  @media (max-width: 640px) {
    .container { padding: 2rem 1rem; }
    h1 { font-size: 2rem; }
    .projects { grid-template-columns: 1fr; }
  }
`;

const generateGlassmorphismCSS = (data: PortfolioData): string => `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --bg: #050a0a;
    --accent: #26d9d9;
    --text: #f5f5f5;
    --text-muted: rgba(245, 245, 245, 0.6);
    --card-bg: linear-gradient(135deg, rgba(10, 18, 18, 0.95), rgba(15, 28, 28, 0.95));
    --border: rgba(38, 217, 217, 0.08);
    --glass-border: rgba(255, 255, 255, 0.06);
  }
  body {
    font-family: 'Public Sans', -apple-system, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    line-height: 1.6;
  }
  .bg-grid {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(38, 217, 217, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(38, 217, 217, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
    z-index: 0;
  }
  .container { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; }
  h1, h2, h3 { font-family: 'Be Vietnam Pro', sans-serif; }
  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #fff 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  h2 {
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  h2::before {
    content: '';
    width: 4px;
    height: 1.5rem;
    background: var(--accent);
    border-radius: 2px;
  }
  .bio {
    color: var(--text-muted);
    max-width: 600px;
    margin-bottom: 3rem;
    font-size: 1.1rem;
    line-height: 1.8;
  }
  .section { margin-bottom: 4rem; }
  .skills { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .skill {
    padding: 0.625rem 1.25rem;
    background: var(--card-bg);
    backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }
  .skill:hover {
    border-color: var(--accent);
    box-shadow: 0 0 20px rgba(38, 217, 217, 0.1);
    transform: translateY(-2px);
  }
  .skill-dot { width: 8px; height: 8px; border-radius: 50%; }
  .projects { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 1.5rem; }
  .project {
    background: var(--card-bg);
    backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 2rem;
    transition: all 0.3s;
  }
  .project:hover {
    border-color: rgba(38, 217, 217, 0.2);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(38, 217, 217, 0.05);
  }
  .project h3 { font-size: 1.25rem; margin-bottom: 0.75rem; }
  .project p { color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.25rem; line-height: 1.7; }
  .tech-stack { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; }
  .tech {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
    background: rgba(38, 217, 217, 0.1);
    border: 1px solid rgba(38, 217, 217, 0.2);
    border-radius: 6px;
    color: var(--accent);
  }
  .project-links { display: flex; gap: 1.25rem; }
  .project-links a {
    color: var(--accent);
    text-decoration: none;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    transition: opacity 0.2s;
  }
  .project-links a:hover { opacity: 0.8; }
  .social-links { display: flex; gap: 1.5rem; margin-top: 3rem; }
  .social-links a {
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: var(--card-bg);
    backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    transition: all 0.2s;
  }
  .social-links a:hover {
    color: var(--accent);
    border-color: var(--accent);
  }
  .avatar {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1.5rem;
    border: 3px solid var(--border);
    box-shadow: 0 0 40px rgba(38, 217, 217, 0.1);
  }
  @media (max-width: 640px) {
    .container { padding: 2rem 1rem; }
    h1 { font-size: 2.25rem; }
    .projects { grid-template-columns: 1fr; }
    .social-links { flex-direction: column; }
  }
`;

const generateBrutalistCSS = (data: PortfolioData): string => `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --bg: #050a0a;
    --accent: #26d9d9;
    --text: #e5e5e5;
    --text-muted: #737373;
    --card-bg: #0a0f0f;
    --border: #26d9d9;
  }
  body {
    font-family: 'Public Sans', -apple-system, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    line-height: 1.6;
  }
  .container { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; }
  h1, h2, h3 { font-family: 'Be Vietnam Pro', sans-serif; text-transform: uppercase; }
  h1 {
    font-size: 4rem;
    font-weight: 900;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
    border-bottom: 4px solid var(--accent);
    padding-bottom: 1rem;
    display: inline-block;
  }
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    background: var(--accent);
    color: #000;
    padding: 0.5rem 1rem;
    display: inline-block;
  }
  .bio { color: var(--text-muted); max-width: 600px; margin-bottom: 3rem; font-size: 1.1rem; }
  .section { margin-bottom: 4rem; }
  .skills { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .skill {
    padding: 0.75rem 1.25rem;
    background: transparent;
    border: 2px solid var(--border);
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.15s;
  }
  .skill:hover {
    background: var(--accent);
    color: #000;
  }
  .skill-dot { width: 10px; height: 10px; border-radius: 0; }
  .projects { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; }
  .project {
    background: var(--card-bg);
    border: 2px solid var(--border);
    padding: 2rem;
    position: relative;
    transition: transform 0.15s;
  }
  .project:hover {
    transform: translate(-4px, -4px);
    box-shadow: 4px 4px 0 var(--accent);
  }
  .project h3 { font-size: 1.125rem; margin-bottom: 0.75rem; text-transform: none; }
  .project p { color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1rem; }
  .tech-stack { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
  .tech {
    font-size: 0.7rem;
    padding: 0.25rem 0.5rem;
    background: var(--border);
    color: #000;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .project-links { display: flex; gap: 1rem; }
  .project-links a {
    color: var(--accent);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .project-links a:hover { text-decoration: underline; }
  .social-links { display: flex; gap: 1rem; margin-top: 3rem; }
  .social-links a {
    color: var(--text);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--border);
    transition: all 0.15s;
  }
  .social-links a:hover {
    background: var(--accent);
    color: #000;
  }
  .avatar {
    width: 120px;
    height: 120px;
    object-fit: cover;
    margin-bottom: 1.5rem;
    border: 3px solid var(--border);
  }
  @media (max-width: 640px) {
    .container { padding: 2rem 1rem; }
    h1 { font-size: 2.5rem; }
    .projects { grid-template-columns: 1fr; }
  }
`;

const getSkillLevelDot = (level: string): string => {
  const colors: Record<string, string> = {
    beginner: '#fbbf24',
    intermediate: '#3b82f6',
    expert: '#26d9d9',
  };
  return colors[level] || '#26d9d9';
};

const generateHTML = (data: PortfolioData): string => {
  const themeCSS = {
    minimal: generateMinimalCSS(data),
    glassmorphism: generateGlassmorphismCSS(data),
    brutalist: generateBrutalistCSS(data),
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name || 'Developer'} - Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;900&family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>${themeCSS[data.theme]}</style>
</head>
<body>
  ${data.theme === 'glassmorphism' ? '<div class="bg-grid"></div>' : ''}
  <div class="container">
    ${data.avatar ? `<img src="${data.avatar}" alt="${data.name}" class="avatar">` : ''}
    <h1>${data.name || 'Developer'}</h1>
    <p class="bio">${data.bio || 'Passionate developer creating amazing things.'}</p>

    ${data.skills.length > 0 ? `
    <section class="section">
      <h2>Skills</h2>
      <div class="skills">
        ${data.skills.map(skill => `
          <span class="skill">
            <span class="skill-dot" style="background: ${getSkillLevelDot(skill.level)}"></span>
            ${skill.name}
          </span>
        `).join('')}
      </div>
    </section>
    ` : ''}

    ${data.projects.length > 0 ? `
    <section class="section">
      <h2>Projects</h2>
      <div class="projects">
        ${data.projects.map(project => `
          <div class="project">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="tech-stack">
              ${project.techStack.map(tech => `<span class="tech">${tech}</span>`).join('')}
            </div>
            <div class="project-links">
              ${project.liveLink ? `<a href="${project.liveLink}" target="_blank" rel="noopener">Live Demo →</a>` : ''}
              ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" rel="noopener">GitHub →</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    ${data.socialLinks.github || data.socialLinks.linkedin || data.socialLinks.twitter ? `
    <section class="section">
      <div class="social-links">
        ${data.socialLinks.github ? `<a href="${data.socialLinks.github}" target="_blank" rel="noopener">GitHub</a>` : ''}
        ${data.socialLinks.linkedin ? `<a href="${data.socialLinks.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
        ${data.socialLinks.twitter ? `<a href="${data.socialLinks.twitter}" target="_blank" rel="noopener">Twitter</a>` : ''}
      </div>
    </section>
    ` : ''}
  </div>
</body>
</html>`;
};

export const downloadPortfolio = (data: PortfolioData): void => {
  const html = generateHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.name?.toLowerCase().replace(/\s+/g, '-') || 'portfolio'}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};