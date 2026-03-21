'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';
import { PortfolioData, skillLevelColors } from '@/lib/portfolio-types';

interface Props {
  data: PortfolioData;
}

export function LivePreview({ data }: Props) {
  const { theme } = data;

  // Theme-specific styles
  const themeStyles = {
    minimal: {
      container: 'bg-[#0d1212]',
      card: 'bg-[#0f1818] border border-[#26d9d9]/10',
      heading: 'text-white',
      skill: 'bg-[#0a0f0f] border border-white/10',
    },
    glassmorphism: {
      container: 'bg-[#050a0a]',
      card: 'bg-gradient-to-br from-[rgba(10,18,18,0.95)] to-[rgba(15,28,28,0.95)] backdrop-blur-xl border border-white/[0.06]',
      heading: 'bg-gradient-to-r from-white to-[#26d9d9] bg-clip-text text-transparent',
      skill: 'bg-gradient-to-br from-[rgba(10,18,18,0.95)] to-[rgba(15,28,28,0.95)] backdrop-blur-xl border border-white/[0.06]',
    },
    brutalist: {
      container: 'bg-[#050a0a]',
      card: 'bg-[#0a0f0f] border-2 border-[#26d9d9]',
      heading: 'text-white border-b-2 border-[#26d9d9] pb-2 inline-block',
      skill: 'border-2 border-[#26d9d9]',
    },
  };

  const styles = themeStyles[theme];

  return (
    <div className={`p-8 ${styles.container}`}>
      {/* Background grid for glassmorphism */}
      {theme === 'glassmorphism' && (
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(38, 217, 217, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(38, 217, 217, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-lg mx-auto"
      >
        {/* Avatar */}
        {data.avatar && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mb-6"
          >
            <img
              src={data.avatar}
              alt={data.name}
              className={`w-24 h-24 object-cover ${
                theme === 'brutalist' ? 'border-2 border-[#26d9d9]' : 'rounded-full border-2 border-[#26d9d9]/30'
              }`}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </motion.div>
        )}

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-3xl font-bold mb-3 font-['Be_Vietnam_Pro'] ${styles.heading}`}
        >
          {data.name || 'Your Name'}
        </motion.h1>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/60 mb-8 leading-relaxed"
        >
          {data.bio || 'Add a bio to tell visitors about yourself...'}
        </motion.p>

        {/* Skills */}
        {data.skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3 font-['Be_Vietnam_Pro']">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.slice(0, 8).map((skill, index) => (
                <motion.span
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg ${
                    theme === 'brutalist' ? 'rounded-none' : ''
                  } ${styles.skill}`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: skillLevelColors[skill.level].text }}
                  />
                  {skill.name}
                </motion.span>
              ))}
              {data.skills.length > 8 && (
                <span className="px-3 py-1.5 text-sm text-white/40">
                  +{data.skills.length - 8} more
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3 font-['Be_Vietnam_Pro']">
              Projects
            </h2>
            <div className="space-y-3">
              {data.projects.slice(0, 3).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`p-4 rounded-xl ${theme === 'brutalist' ? 'rounded-none' : ''} ${styles.card}`}
                >
                  <h3 className="font-medium text-white mb-1">{project.title}</h3>
                  <p className="text-white/50 text-sm mb-2 line-clamp-2">
                    {project.description || 'No description'}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-xs bg-[#26d9d9]/10 text-[#26d9d9] rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {(project.liveLink || project.githubLink) && (
                    <div className="flex gap-3 text-xs">
                      {project.liveLink && (
                        <span className="text-[#26d9d9] flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" /> Live
                        </span>
                      )}
                      {project.githubLink && (
                        <span className="text-white/40 flex items-center gap-1">
                          <Github className="w-3 h-3" /> Code
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
              {data.projects.length > 3 && (
                <p className="text-xs text-white/30 text-center">
                  +{data.projects.length - 3} more projects
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Social Links */}
        {(data.socialLinks.github || data.socialLinks.linkedin || data.socialLinks.twitter) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2"
          >
            {data.socialLinks.github && (
              <a
                href={data.socialLinks.github}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors ${
                  theme === 'brutalist' ? 'border-2 border-[#26d9d9] px-4 py-2 hover:bg-[#26d9d9] hover:text-[#050a0a]' : ''
                } ${theme !== 'brutalist' ? 'bg-white/5 rounded-lg' : 'rounded-none'}`}
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
            )}
            {data.socialLinks.linkedin && (
              <a
                href={data.socialLinks.linkedin}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors ${
                  theme === 'brutalist' ? 'border-2 border-[#26d9d9] px-4 py-2 hover:bg-[#26d9d9] hover:text-[#050a0a]' : ''
                } ${theme !== 'brutalist' ? 'bg-white/5 rounded-lg' : 'rounded-none'}`}
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
            {data.socialLinks.twitter && (
              <a
                href={data.socialLinks.twitter}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors ${
                  theme === 'brutalist' ? 'border-2 border-[#26d9d9] px-4 py-2 hover:bg-[#26d9d9] hover:text-[#050a0a]' : ''
                } ${theme !== 'brutalist' ? 'bg-white/5 rounded-lg' : 'rounded-none'}`}
              >
                <Twitter className="w-4 h-4" /> Twitter
              </a>
            )}
          </motion.div>
        )}

        {/* Empty state */}
        {!data.name && data.skills.length === 0 && data.projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-white/30 text-sm">
              Start filling out the form to see your portfolio preview
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}