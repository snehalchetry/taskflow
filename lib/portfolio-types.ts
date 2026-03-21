export type SkillLevel = 'beginner' | 'intermediate' | 'expert';

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveLink: string;
  githubLink: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
}

export interface PortfolioData {
  name: string;
  bio: string;
  avatar: string;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLinks;
  theme: 'minimal' | 'glassmorphism' | 'brutalist';
}

export const skillLevelColors: Record<SkillLevel, { bg: string; text: string; border: string }> = {
  beginner: {
    bg: 'rgba(251, 191, 36, 0.15)',
    text: '#fbbf24',
    border: 'rgba(251, 191, 36, 0.3)',
  },
  intermediate: {
    bg: 'rgba(59, 130, 246, 0.15)',
    text: '#3b82f6',
    border: 'rgba(59, 130, 246, 0.3)',
  },
  expert: {
    bg: 'rgba(38, 217, 217, 0.15)',
    text: '#26d9d9',
    border: 'rgba(38, 217, 217, 0.3)',
  },
};

export const defaultPortfolioData: PortfolioData = {
  name: '',
  bio: '',
  avatar: '',
  skills: [],
  projects: [],
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: '',
  },
  theme: 'glassmorphism',
};